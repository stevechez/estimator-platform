import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	},
);

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

type TrialRequestPayload = {
	name?: string;
	email?: string;
	company?: string;
	trade?: string;
	biggestFollowupProblem?: string;
};

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

export async function POST(req: Request) {
	try {
		const payload = (await req.json()) as TrialRequestPayload;

		const name = payload.name?.trim() ?? '';
		const email = payload.email ? normalizeEmail(payload.email) : '';
		const company = payload.company?.trim() ?? '';
		const trade = payload.trade?.trim() ?? '';
		const biggestFollowupProblem = payload.biggestFollowupProblem?.trim() ?? '';

		if (!name) {
			return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
		}

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required.' },
				{ status: 400 },
			);
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailPattern.test(email)) {
			return NextResponse.json(
				{ error: 'Enter a valid email address.' },
				{ status: 400 },
			);
		}

		const { error: dbError } = await supabase.from('waitlist').insert([
			{
				name,
				email,
				company,
				trade,
				biggest_followup_problem: biggestFollowupProblem,
				source: '7_day_field_trial',
				status: 'new',
			},
		]);

		if (dbError) {
			if (dbError.code === '23505') {
				return NextResponse.json(
					{
						error:
							'This email is already registered for the BUILDRAIL field trial.',
					},
					{ status: 409 },
				);
			}

			throw dbError;
		}

		if (resend) {
			const fromEmail =
				process.env.RESEND_FROM_EMAIL || 'BUILDRAIL <founders@buildrail.app>';

			void Promise.race([
				resend.emails.send({
					from: fromEmail,
					to: email,
					subject: 'BUILDRAIL field trial request received',
					text: `Hey ${name},

Thanks for requesting a BUILDRAIL 7-Day Field Trial.

We are currently activating trial workspaces manually while we finish the final reliability pass.

No spam. No sold lists. No surprise calls. We do not sell your contact information. Ever.

— BUILDRAIL`,
				}),
				new Promise(resolve => setTimeout(resolve, 1500)),
			]).catch(emailError => {
				console.error('Resend error:', emailError);
			});
		}

		return NextResponse.json({ success: true, email });
	} catch (error) {
		console.error('Field trial request error:', error);

		return NextResponse.json(
			{ error: 'Could not submit trial request. Please try again.' },
			{ status: 500 },
		);
	}
}
