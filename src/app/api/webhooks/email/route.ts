import { NextResponse } from 'next/server';
import { saveProjectMemory } from '@/actions/saveMemory';
import { createAdminClient } from '@/lib/supabase/admin';

const supabase = createAdminClient();

const PROJECT_UUID_REGEX =
	/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;

function errorResponse(message: string, status: number) {
	return NextResponse.json({ success: false, error: message }, { status });
}

function normalizeEmail(value: unknown) {
	if (typeof value !== 'string') return null;

	const match = value.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>/);
	const email = (match?.[1] || value).trim().toLowerCase();

	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null;
}

function getProjectIdFromSubject(subject: string) {
	const match = subject.match(PROJECT_UUID_REGEX);
	return match?.[0].toLowerCase() || null;
}

function isDevWebhookAuthBypassEnabled() {
	return (
		process.env.NODE_ENV !== 'production' &&
		process.env.BUILDRAIL_DEV_BYPASS_EMAIL_WEBHOOK_AUTH === 'true'
	);
}

async function isSenderAuthorizedForProject(
	senderEmail: string,
	projectUserId: string,
) {
	const { data, error } = await supabase.auth.admin.getUserById(projectUserId);

	if (error) {
		console.error('Email webhook owner lookup failed:', {
			projectUserId,
			error: error.message,
		});
		return false;
	}

	const ownerEmail = normalizeEmail(data.user?.email);
	return ownerEmail === senderEmail;
}

export async function POST(request: Request) {
	try {
		let payload: Record<string, unknown>;

		try {
			payload = await request.json();
		} catch {
			return errorResponse('Request body must be valid JSON.', 400);
		}

		const senderEmail = normalizeEmail(payload.From);
		const subject =
			typeof payload.Subject === 'string' ? payload.Subject : 'No Subject';
		const textBody = typeof payload.TextBody === 'string' ? payload.TextBody : '';

		if (!senderEmail || !textBody) {
			return errorResponse('Missing required email fields.', 400);
		}

		const targetProjectId = getProjectIdFromSubject(subject);

		if (!targetProjectId) {
			return errorResponse('Subject must include a valid project UUID.', 400);
		}

		const { data: project, error: projectError } = await supabase
			.from('projects')
			.select('id, user_id')
			.eq('id', targetProjectId)
			.single();

		if (projectError || !project) {
			console.warn('Email webhook rejected unknown project:', {
				projectId: targetProjectId,
				error: projectError?.message,
			});
			return errorResponse('Project not found.', 404);
		}

		const bypassAuth = isDevWebhookAuthBypassEnabled();
		const isAuthorized =
			bypassAuth ||
			(await isSenderAuthorizedForProject(senderEmail, project.user_id));

		if (!isAuthorized) {
			console.warn('Email webhook rejected unauthorized sender:', {
				projectId: targetProjectId,
				senderEmail,
			});
			return errorResponse('Sender is not authorized for this project.', 403);
		}

		if (bypassAuth) {
			console.warn('Email webhook dev auth bypass accepted request:', {
				projectId: targetProjectId,
				senderEmail,
			});
		}

		const cleanedBody = textBody.split('On ')[0].trim();

		if (!cleanedBody) {
			return errorResponse('Email body is empty after cleanup.', 400);
		}

		const saveResult = await saveProjectMemory({
			projectId: targetProjectId,
			content: `[Subject: ${subject}]\n\n${cleanedBody}`,
			sourceType: 'email_forward',
			metadata: {
				original_sender: senderEmail,
				is_forwarded: subject.toLowerCase().includes('fwd:'),
			},
		});

		if (!saveResult.success) {
			throw new Error('Failed to vectorize and store email memory.');
		}

		return NextResponse.json(
			{ success: true, memoryId: saveResult.memoryId },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Email Webhook Processing Error:', error);
		return errorResponse('Internal Server Error', 500);
	}
}
