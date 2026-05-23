import { createClient } from './client'; // Use your standard browser/auth client here!

const supabase = createClient();

export async function getLiveFeedData(contractorId: string) {
	// 1. Fetch campaigns that need manual review right now
	const { data: pendingReviews, error: pendingError } = await supabase
		.from('autopilot_campaigns')
		.select(
			`
            id, draft_subject, draft_body, ai_reasoning,
            estimates (client_name, project_type, total_amount)
        `,
		)
		.eq('contractor_id', contractorId)
		.eq('status', 'pending_review');

	// 2. Fetch the recent activity log (last 50 events)
	const { data: recentLogs, error: logsError } = await supabase
		.from('autopilot_logs')
		.select(
			`
            id, channel, step_number, sent_content, status, created_at,
            autopilot_campaigns (
                estimates (client_name, project_type)
            )
        `,
		)
		// In a real app, join via contractor_id to ensure security
		.order('created_at', { ascending: false })
		.limit(50);

	if (pendingError || logsError) {
		console.error('Feed Fetch Error:', pendingError || logsError);
		return { pendingReviews: [], recentLogs: [] };
	}

	return { pendingReviews, recentLogs };
}
