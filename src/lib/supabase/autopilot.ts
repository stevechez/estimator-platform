import { createAdminClient } from './client';

const supabase = createAdminClient();
// Types matching your database schema
export interface AutopilotCampaign {
	id: string;
	estimate_id: string;
	status:
		| 'active'
		| 'paused'
		| 'completed'
		| 'cancelled_by_reply'
		| 'failed'
		| 'pending_review';
	current_step: number;
	next_run_at: string;
	draft_subject?: string;
	draft_body?: string;
	ai_reasoning?: string;
}

/**
 * Fetches an active campaign along with the estimate and contractor profile details
 */
export async function getActiveCampaignWithContext(campaignId: string) {
	const { data, error } = await supabase
		.from('autopilot_campaigns')
		.select(
			`
      *,
      estimates (
        id, client_name, client_phone, client_email, project_type, total_amount, tags
      ),
      contractor_profiles (
        id, first_name, company_name, requires_review
      )
    `,
		)
		.eq('id', campaignId)
		.eq('status', 'active')
		.single();

	if (error) {
		console.error('Error fetching campaign context:', error);
		return null;
	}
	return data;
}

/**
 * Grabs the specific rule configurations for a step (delay, channel, etc)
 */
export async function getAutopilotStepTemplate(stepNumber: number) {
	const { data, error } = await supabase
		.from('autopilot_step_templates')
		.select('*')
		.eq('step_number', stepNumber)
		.single();

	if (error) return null;
	return data;
}

/**
 * Updates the state of the campaign (e.g., advancing steps, pausing, or updating drafts)
 */
export async function updateCampaignState(
	campaignId: string,
	updates: Partial<AutopilotCampaign>,
) {
	const { data, error } = await supabase
		.from('autopilot_campaigns')
		.update(updates)
		.eq('id', campaignId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Logs a copy of the sent message to the database for the UI's Live Feed
 */
export async function createAutopilotLog(log: {
	campaign_id: string;
	channel: 'sms' | 'email';
	step_number: number;
	sent_content: string;
	status: 'sent' | 'failed';
}) {
	const { error } = await supabase.from('autopilot_logs').insert([log]);

	if (error) console.error('Failed to create autopilot log entry:', error);
}
