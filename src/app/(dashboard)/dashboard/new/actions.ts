'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
	const customer_name = formData.get('customer_name') as string;
	const project_type = formData.get('project_type') as string;
	const address = formData.get('address') as string;

	const cookieStore = await cookies();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error('Unauthorized');

	// 1. Create the project
	const { data: project, error: projectError } = await supabase
		.from('projects')
		.insert([
			{
				user_id: user.id,
				customer_name,
				project_type,
				address,
			},
		])
		.select()
		.single();

	if (projectError) throw new Error(projectError.message);

	// 2. Automatically instantiate the connected walkthrough session
	const { error: sessionError } = await supabase
		.from('walkthrough_sessions')
		.insert([{ project_id: project.id }]);

	if (sessionError) throw new Error(sessionError.message);

	// 3. Drop the user straight into the capture screen
	redirect(`/dashboard/${project.id}/capture`);
}
