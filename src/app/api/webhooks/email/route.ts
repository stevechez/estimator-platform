import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { saveProjectMemory } from '@/actions/saveMemory';

// Initialize Supabase with the Service Role key to bypass RLS securely on the backend
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		const senderEmail = payload.From;
		const subject = payload.Subject || 'No Subject';
		const textBody = payload.TextBody || '';

		if (!senderEmail || !textBody) {
			return NextResponse.json(
				{ error: 'Missing required email fields.' },
				{ status: 400 },
			);
		}

		// --- SECURITY CHECK COMPLETELY DELETED FOR TESTING ---

		// 3. Routing: Find the correct Project ID
		let targetProjectId = '82702f3e-7fe4-471d-894f-ebb2b97a92c1';

		// Simple Regex to extract a UUID from the subject line
		const uuidRegex =
			/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
		const match = subject.match(uuidRegex);

		if (match) {
			targetProjectId = match[0];
		}

		if (!targetProjectId || targetProjectId === 'PASTE-YOUR-COPIED-UUID-HERE') {
			return NextResponse.json(
				{ error: 'Please update the targetProjectId with a valid UUID.' },
				{ status: 400 },
			);
		}

		// 4. Clean the data
		const cleanedBody = textBody.split('On ')[0].trim();

		// 5. Pipe it into the AI Vector Database using your existing action
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

		// 6. Return a 200 OK
		return NextResponse.json(
			{ success: true, memoryId: saveResult.memoryId },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error('Email Webhook Processing Error:', error);
		return NextResponse.json(
			{ error: error.message || 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
