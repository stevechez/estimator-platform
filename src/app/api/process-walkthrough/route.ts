import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { saveProjectMemory } from '@/actions/saveMemory';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert construction estimator assistant.
Your job is to take a raw, messy, spoken transcript from a contractor walking a job site and organize it into a structured JSON object.

DO NOT invent pricing. DO NOT invent measurements that were not spoken.
Group items logically by Room or Phase (e.g., Demolition, Kitchen, Master Bath).

You MUST return a JSON object with EXACTLY this structure:
{
  "ai_summary": [
    {
      "category": "String (e.g., Demolition, Kitchen, Plumbing)",
      "items": ["String", "String"]
    }
  ],
  "estimate_draft": [
    {
      "section": "String (e.g., Rough-in, Finishes)",
      "line_items": [
        { "name": "String", "quantity": "String (if spoken, else 'TBD')", "notes": "String", "price": "" }
      ]
    }
  ],
  "proposal_summary": "A 2-3 sentence professional summary written to the homeowner explaining the overall scope of work discussed."
}
`;

type StructuredWalkthrough = {
	ai_summary: Array<{
		category: string;
		items: string[];
	}>;
	estimate_draft: Array<{
		section: string;
		line_items: Array<{
			name: string;
			quantity: string;
			notes: string;
			price?: string;
		}>;
	}>;
	proposal_summary: string;
};

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : 'Unknown error';
}

function normalizeStructuredData(data: Partial<StructuredWalkthrough>) {
	return {
		ai_summary: Array.isArray(data.ai_summary) ? data.ai_summary : [],
		estimate_draft: Array.isArray(data.estimate_draft)
			? data.estimate_draft.map(section => ({
					section: section.section || 'Scope',
					line_items: Array.isArray(section.line_items)
						? section.line_items.map(item => ({
								name: item.name || 'Untitled item',
								quantity: item.quantity || 'TBD',
								notes: item.notes || '',
								price: item.price || '',
							}))
						: [],
				}))
			: [],
		proposal_summary:
			typeof data.proposal_summary === 'string' ? data.proposal_summary : '',
	};
}

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const audioBlob = formData.get('audio') as Blob | null;
		const projectId = String(formData.get('projectId') ?? '');

		if (!audioBlob || !projectId) {
			return NextResponse.json(
				{ error: 'Missing audio or project ID' },
				{ status: 400 },
			);
		}

		const cookieStore = await cookies();

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return cookieStore.get(name)?.value;
					},
				},
			},
		);

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { data: project, error: projectError } = await supabase
			.from('projects')
			.select('id, user_id, customer_name, project_type')
			.eq('id', projectId)
			.eq('user_id', user.id)
			.single();

		if (projectError || !project) {
			return NextResponse.json(
				{ error: 'Project not found or access denied' },
				{ status: 404 },
			);
		}

		const { data: existingSession, error: sessionLookupError } = await supabase
			.from('walkthrough_sessions')
			.select('id')
			.eq('project_id', projectId)
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (sessionLookupError) {
			throw new Error(sessionLookupError.message);
		}

		let sessionId = existingSession?.id;

		if (!sessionId) {
			const { data: createdSession, error: createSessionError } = await supabase
				.from('walkthrough_sessions')
				.insert({
					project_id: projectId,
				})
				.select('id')
				.single();

			if (createSessionError || !createdSession) {
				throw new Error(
					createSessionError?.message || 'Failed to create walkthrough session',
				);
			}

			sessionId = createdSession.id;
		}

		const file = new File([audioBlob], 'walkthrough.webm', {
			type: 'audio/webm',
		});

		const transcription = await openai.audio.transcriptions.create({
			file,
			model: 'whisper-1',
		});

		const transcriptText = transcription.text?.trim() || '';

		if (!transcriptText) {
			return NextResponse.json(
				{ error: 'No speech detected in recording' },
				{ status: 400 },
			);
		}

		const completion = await openai.chat.completions.create({
			model: 'gpt-4o',
			response_format: { type: 'json_object' },
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: transcriptText },
			],
		});

		const rawContent = completion.choices[0]?.message?.content || '{}';
		const structuredData = normalizeStructuredData(JSON.parse(rawContent));

		const { error: dbError } = await supabase
			.from('walkthrough_sessions')
			.update({
				transcript: transcriptText,
				ai_summary: structuredData.ai_summary,
				estimate_draft: structuredData.estimate_draft,
				proposal_summary: structuredData.proposal_summary,
			})
			.eq('id', sessionId)
			.eq('project_id', projectId);

		if (dbError) {
			throw new Error(dbError.message);
		}

		const memoryResult = await saveProjectMemory({
			projectId,
			content: `[Walkthrough Transcript]
Project: ${project.customer_name}
Type: ${project.project_type}

${transcriptText}`,
			sourceType: 'voice_note',
			metadata: {
				source: 'walkthrough_capture',
				walkthrough_session_id: sessionId,
			},
		});

		if (!memoryResult.success) {
			console.warn('Walkthrough transcript saved without memory embedding', {
				projectId,
				sessionId,
				error: memoryResult.error,
			});
		}

		return NextResponse.json({
			success: true,
			sessionId,
		});
	} catch (error: unknown) {
		console.error('Processing error:', error);

		return NextResponse.json(
			{ error: getErrorMessage(error) || 'Failed to process walkthrough' },
			{ status: 500 },
		);
	}
}
