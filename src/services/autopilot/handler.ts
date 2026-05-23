import { createClient } from '@supabase/supabase-js';
import { generateAutopilotMessage } from './generator';
import { sendSMS, sendEmail } from './dispatchers';

interface ProcessStepPayload {
	campaignId: string;
}

// 1. Initialize Admin Client
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function processCampaignStep({ campaignId }: ProcessStepPayload) {
	// 2. Fetch campaign and related data
	const { data: campaign, error: fetchError } = await supabase
		.from('autopilot_campaigns')
		.select(
			`
            *,
            estimates (client_name, client_phone, client_email, project_type, total_amount, tags),
            contractor_profiles (first_name, company_name, requires_review)
        `,
		)
		.eq('id', campaignId)
		.single();

	if (fetchError || !campaign || campaign.status !== 'active') {
		console.log(`Campaign ${campaignId} is not active or not found. Skipping.`);
		return;
	}

	// 3. Fetch template for current step
	const { data: stepConfig } = await supabase
		.from('autopilot_step_templates')
		.select('*')
		.eq('step_number', campaign.current_step)
		.single();

	if (!stepConfig) {
		await supabase
			.from('autopilot_campaigns')
			.update({ status: 'completed' })
			.eq('id', campaignId);
		return;
	}

	// 4. Generate AI Message
	const estimateContext = {
		clientName: campaign.estimates.client_name,
		contractorName: campaign.contractor_profiles.first_name,
		companyName: campaign.contractor_profiles.company_name,
		projectType: campaign.estimates.project_type,
		totalAmount: campaign.estimates.total_amount,
		keyHighlights: campaign.estimates.tags || ['renovation'],
		stepNumber: campaign.current_step,
		channel: stepConfig.channel as 'sms' | 'email',
	};

	const aiGeneratedMessage = await generateAutopilotMessage(estimateContext);

	// 5. Review Mode Safety Valve
	if (campaign.contractor_profiles.requires_review) {
		await supabase
			.from('autopilot_campaigns')
			.update({
				status: 'pending_review',
				draft_subject: aiGeneratedMessage.subjectLine,
				draft_body: aiGeneratedMessage.messageBody,
				ai_reasoning: aiGeneratedMessage.aiReasoning,
			})
			.eq('id', campaignId);
		return;
	}

	// 6. Direct Dispatch
	try {
		if (stepConfig.channel === 'sms') {
			await sendSMS({
				to: campaign.estimates.client_phone,
				body: aiGeneratedMessage.messageBody,
			});
		} else if (stepConfig.channel === 'email') {
			await sendEmail({
				to: campaign.estimates.client_email,
				subject: aiGeneratedMessage.subjectLine,
				body: aiGeneratedMessage.messageBody,
			});
		}

		// Log the event
		await supabase.from('autopilot_logs').insert([
			{
				campaign_id: campaignId,
				channel: stepConfig.channel,
				step_number: campaign.current_step,
				sent_content: aiGeneratedMessage.messageBody,
				status: 'sent',
			},
		]);

		// 7. Calculate next run time
		const { data: nextStepConfig } = await supabase
			.from('autopilot_step_templates')
			.select('*')
			.eq('step_number', campaign.current_step + 1)
			.single();

		if (nextStepConfig) {
			const nextRunAt = new Date();
			nextRunAt.setHours(nextRunAt.getHours() + nextStepConfig.delay_hours);

			await supabase
				.from('autopilot_campaigns')
				.update({
					current_step: campaign.current_step + 1,
					next_run_at: nextRunAt.toISOString(),
				})
				.eq('id', campaignId);
		} else {
			await supabase
				.from('autopilot_campaigns')
				.update({ status: 'completed' })
				.eq('id', campaignId);
		}
	} catch (error) {
		console.error(
			`Failed to dispatch Autopilot step for ${campaignId}:`,
			error,
		);
		await supabase
			.from('autopilot_campaigns')
			.update({ status: 'failed' })
			.eq('id', campaignId);
	}
}
