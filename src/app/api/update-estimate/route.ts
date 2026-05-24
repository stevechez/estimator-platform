import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type LineItem = {
	name: string;
	notes: string;
	quantity: string;
	price?: string;
};

type EstimateSection = {
	section: string;
	line_items: LineItem[];
};

type UpdateEstimatePayload = {
	projectId?: string;
	summary?: string;
	estimateDraft?: EstimateSection[];
};

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : 'Unknown error';
}

function normalizeEstimateDraft(value: unknown): EstimateSection[] {
	if (!Array.isArray(value)) return [];

	return value.map(section => ({
		section:
			typeof section?.section === 'string' && section.section.trim()
				? section.section.trim()
				: 'Scope',
		line_items: Array.isArray(section?.line_items)
			? section.line_items.map((item: Partial<LineItem>) => ({
					name: typeof item.name === 'string' ? item.name : '',
					notes: typeof item.notes === 'string' ? item.notes : '',
					quantity:
						typeof item.quantity === 'string' && item.quantity.trim()
							? item.quantity
							: '1',
					price: typeof item.price === 'string' ? item.price : '',
				}))
			: [],
	}));
}

export async function POST(req: Request) {
	try {
		const payload = (await req.json()) as UpdateEstimatePayload;

		const projectId = payload.projectId;
		const summary = typeof payload.summary === 'string' ? payload.summary : '';
		const estimateDraft = normalizeEstimateDraft(payload.estimateDraft);

		if (!projectId) {
			return NextResponse.json(
				{ error: 'Missing project ID' },
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
			.select('id')
			.eq('id', projectId)
			.eq('user_id', user.id)
			.single();

		if (projectError || !project) {
			return NextResponse.json(
				{ error: 'Project not found or access denied' },
				{ status: 404 },
			);
		}

		const { data: session, error: sessionError } = await supabase
			.from('walkthrough_sessions')
			.select('id')
			.eq('project_id', projectId)
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (sessionError) {
			throw new Error(sessionError.message);
		}

		if (!session) {
			return NextResponse.json(
				{ error: 'No walkthrough session found for this project' },
				{ status: 404 },
			);
		}

		const { error: dbError } = await supabase
			.from('walkthrough_sessions')
			.update({
				proposal_summary: summary,
				estimate_draft: estimateDraft,
			})
			.eq('id', session.id)
			.eq('project_id', projectId);

		if (dbError) {
			throw new Error(dbError.message);
		}

		return NextResponse.json({
			success: true,
			sessionId: session.id,
		});
	} catch (error: unknown) {
		console.error('Save error:', error);

		return NextResponse.json(
			{ error: getErrorMessage(error) || 'Failed to save draft' },
			{ status: 500 },
		);
	}
}
