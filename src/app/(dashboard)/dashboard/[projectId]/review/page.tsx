import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';

export default async function ReviewPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	const { projectId } = await params;
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
					} catch {
						// Safe to ignore in Server Components if middleware handles refresh.
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect('/login');

	const { data: project } = await supabase
		.from('projects')
		.select('*')
		.eq('id', projectId)
		.single();

	if (!project) {
		return (
			<div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
				Project not found.
			</div>
		);
	}

	const { data: session } = await supabase
		.from('walkthrough_sessions')
		.select('*')
		.eq('project_id', projectId)
		.single();

	if (!session) {
		return (
			<div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
				Walkthrough session not found.
			</div>
		);
	}

	const { data: photos } = await supabase
		.from('photos')
		.select('*')
		.eq('walkthrough_id', session.id);

	return (
		<ReviewClient project={project} session={session} photos={photos || []} />
	);
}
