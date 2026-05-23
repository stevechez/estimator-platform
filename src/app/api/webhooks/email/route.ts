// src/app/api/webhooks/email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { saveProjectMemory } from '@/actions/saveMemory';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	},
);

const PROJECT_UUID_REGEX =
	/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function normalizeEmail(value: string | null | undefined): string {
	if (!value) return '';

	// Handles: Steve <steve@example.com>
	const match = value.match(/<([^>]+)>/);
	return (match?.[1] ?? value).trim().toLowerCase();
}

function stripEmailTrail(body: string): string {
	return body
		.split(/\nOn .+ wrote:/i)[0]
		.split(/\nFrom:/i)[0]
		.trim();
}

function getWebhookSecret(req: NextRequest): string {
	return (
		req.headers.get('x-buildrail-webhook-secret') ||
		req.headers.get('x-webhook-secret') ||
		''
	);
}

function isAuthorizedSecret(req: NextRequest): boolean {
	const expected = process.env.INBOUND_EMAIL_WEBHOOK_SECRET;

	if (!expected) {
		console.error('Missing INBOUND_EMAIL_WEBHOOK_SECRET');
		return false;
	}

	const received = getWebhookSecret(req);
	return received === expected;
}

export async function POST(req: NextRequest) {
	try {
		if (!isAuthorizedSecret(req)) {
			return NextResponse.json(
				{ error: 'Unauthorized webhook request' },
				{ status: 401 },
			);
		}

		const payload = await req.json();

		// Postmark commonly uses From, Subject, TextBody.
		// SendGrid inbound parse commonly uses from, subject, text.
		const rawFrom = payload.From ?? payload.from ?? '';
		const subject = payload.Subject ?? payload.subject ?? '';
		const rawBody =
			payload.TextBody ??
			payload.text ??
			payload.HtmlBody ??
			payload.html ??
			'';

		const senderEmail = normalizeEmail(rawFrom);
		const projectId = subject.match(PROJECT_UUID_REGEX)?.[0];

		if (!senderEmail) {
			return NextResponse.json(
				{ error: 'Missing sender email' },
				{ status: 400 },
			);
		}

		if (!projectId) {
			return NextResponse.json(
				{ error: 'Missing project UUID in subject' },
				{ status: 400 },
			);
		}

		const cleanBody = stripEmailTrail(String(rawBody));

		if (!cleanBody) {
			return NextResponse.json(
				{ error: 'Missing email body' },
				{ status: 400 },
			);
		}

		const { data: project, error: projectError } = await supabaseAdmin
			.from('projects')
			.select('id, user_id')
			.eq('id', projectId)
			.single();

		if (projectError || !project) {
			console.error('Project lookup failed:', projectError);

			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		const { data: contractor, error: contractorError } = await supabaseAdmin
			.from('contractors')
			.select('id, tenant_id')
			.eq('tenant_id', project.user_id)
			.single();

		if (contractorError || !contractor) {
			console.error('Contractor lookup failed:', contractorError);

			return NextResponse.json(
				{ error: 'Contractor not found for project owner' },
				{ status: 404 },
			);
		}

		const { data: authorizedSender, error: senderError } = await supabaseAdmin
			.from('contractor_inbound_senders')
			.select('id')
			.eq('contractor_id', contractor.id)
			.eq('email', senderEmail)
			.maybeSingle();

		if (senderError) {
			console.error('Authorized sender lookup failed:', senderError);

			return NextResponse.json(
				{ error: 'Failed to verify sender' },
				{ status: 500 },
			);
		}

		if (!authorizedSender) {
			console.warn('Rejected inbound email authorization', {
				projectId,
				projectUserId: project.user_id,
				contractorId: contractor.id,
				senderEmail,
			});

			return NextResponse.json(
				{ error: 'Sender is not authorized for this project' },
				{ status: 403 },
			);
		}

		const saveResult = await saveProjectMemory({
			projectId,
			content: cleanBody,
			sourceType: 'email_forward',
			metadata: {
				from: senderEmail,
				subject,
				received_via: 'email_webhook',
			},
		});

		if (!saveResult.success) {
			console.error('Failed to save project memory:', saveResult.error);

			return NextResponse.json(
				{ error: 'Failed to save memory' },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			ok: true,
			project_id: projectId,
			source_type: 'email_forward',
			memory_id: saveResult.memoryId,
		});
	} catch (error) {
		console.error('Inbound email webhook error:', error);

		return NextResponse.json(
			{ error: 'Invalid webhook request' },
			{ status: 400 },
		);
	}
}
