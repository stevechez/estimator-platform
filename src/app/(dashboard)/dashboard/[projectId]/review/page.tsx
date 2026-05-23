import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';

export default async function ReviewPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	// Next.js 15 requires awaiting both params and cookies
	const resolvedParams = await params;
	const projectId = resolvedParams.projectId;
	const cookieStore = await cookies();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						// The setAll method was called from a Server Component.
						// This can be ignored if you have middleware refreshing sessions.
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect('/login');

	// 1. Fetch the Project (This was missing!)
	const { data: project } = await supabase
		.from('projects')
		.select('*')
		.eq('id', projectId)
		.single();

	// 2. Fetch the Walkthrough Session
	const { data: session } = await supabase
		.from('walkthrough_sessions')
		.select('*')
		.eq('project_id', projectId)
		.single();

	// 3. Fetch photos linked to this session
	const { data: photos } = await supabase
		.from('photos')
		.select('*')
		.eq('walkthrough_id', session?.id || '');

	if (!project || !session) {
		return (
			<div className="p-6 text-white bg-[#0A0A0A] min-h-screen">
				Project or session not found.
			</div>
		);
	}

	// Pass project, session, and photos to the client
	return (
		<ReviewClient project={project} session={session} photos={photos || []} />
	);
}
