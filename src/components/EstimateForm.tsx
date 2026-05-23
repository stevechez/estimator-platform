// src/actions/estimate.ts
'use server'; // This tells Next.js this code only runs on the server

import { createClient } from '@supabase/supabase-js'; // Use admin client to bypass RLS if needed, or SSR client

type EstimateData = {
	contractorId: string;
	clientName: string;
	// add other estimate fields as needed
	[key: string]: unknown;
};

export async function submitEstimate(
	estimateData: EstimateData,
	autopilotEnabled: boolean,
) {
	// 1. Initialize Admin Client (Recommended for background inserts)
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);

	// 1. Save the core estimate (Your existing Buildrail logic)
	const { data: newEstimate, error: estimateError } = await supabase
		.from('estimates')
		.insert([
			{
				contractor_id: estimateData.contractorId,
				client_name: estimateData.clientName,
				// ... rest of your estimate data
			},
		])
		.select('id')
		.single();

	if (estimateError) throw new Error('Failed to save estimate');

	// 2. THE NEW AUTOPILOT HOOK
	if (autopilotEnabled) {
		const nextRun = new Date();
		nextRun.setHours(nextRun.getHours() + 24);

		const { error: campaignError } = await supabase
			.from('autopilot_campaigns')
			.insert([
				{
					estimate_id: newEstimate.id,
					contractor_id: estimateData.contractorId,
					status: 'active',
					current_step: 1,
					next_run_at: nextRun.toISOString(),
				},
			]);

		if (campaignError) {
			console.error('Failed to start Autopilot:', campaignError);
		}
	}

	return { success: true, estimateId: newEstimate.id };
}
