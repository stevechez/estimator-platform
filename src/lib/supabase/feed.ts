import { createClient } from './client';

export async function fetchFeed() {
	const supabase = createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.warn('Feed skipped: no authenticated user');
		return [];
	}

	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Feed Fetch Error:', error);
		return [];
	}

	return data ?? [];
}
