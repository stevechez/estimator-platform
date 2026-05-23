// src/app/api/webhooks/twilio/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client to bypass RLS
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
	try {
		// Parse Twilio's form-encoded payload
		const body = await request.text();
		const params = new URLSearchParams(body);

		const fromNumber = params.get('From');
		const messageBody = params.get('Body');

		if (!fromNumber) {
			return new NextResponse('Missing From Number', { status: 400 });
		}

		console.log(`Inbound SMS received from ${fromNumber}: "${messageBody}"`);

		// Find and pause the active campaigns for this number
		const { data: activeCampaigns } = await supabase
			.from('autopilot_campaigns')
			.select('id, estimates!inner(client_phone)')
			.in('status', ['active', 'pending_review'])
			.eq('estimates.client_phone', fromNumber);

		if (activeCampaigns && activeCampaigns.length > 0) {
			const campaignIds = activeCampaigns.map(c => c.id);

			await supabase
				.from('autopilot_campaigns')
				.update({ status: 'cancelled_by_reply' })
				.in('id', campaignIds);

			console.log(
				`Safety Valve Triggered: Paused campaigns ${campaignIds.join(', ')}`,
			);
		}

		// Respond to Twilio with empty TwiML so it doesn't auto-reply
		return new NextResponse('<Response></Response>', {
			status: 200,
			headers: { 'Content-Type': 'text/xml' },
		});
	} catch (error) {
		console.error('Twilio Webhook Error:', error);
		return new NextResponse('<Response></Response>', {
			status: 200,
			headers: { 'Content-Type': 'text/xml' },
		});
	}
}
