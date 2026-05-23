import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize clients
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// 1. Insert into Supabase Waitlist Table
		const { error: dbError } = await supabase
			.from('waitlist')
			.insert([{ email }]);

		if (dbError) {
			// Handle duplicate email signups gracefully
			if (dbError.code === '23505') {
				return NextResponse.json(
					{ error: 'Email already registered' },
					{ status: 400 },
				);
			}
			throw dbError;
		}

		// 2. Send the Plain-Text Welcome Email via Resend
		const { error: emailError } = await resend.emails.send({
			from: 'BUILDRAIL <founders@yourdomain.com>', // Update with your verified Resend domain
			to: email,
			subject: 'Quick question about your walkthroughs',
			text: `Hey,\n\nThanks for joining the BUILDRAIL early access list. I'm building this to help contractors stop rewriting notes at night.\n\nOut of curiosity, what type of projects are you mostly walking right now? Kitchens, baths, or full guts?\n\nReply and let me know—I'm letting people off the waitlist based on project fit.\n\nCheers,\nYour Name`,
		});

		if (emailError) {
			console.error('Resend Error:', emailError);
			// We still return success to the user since they were added to the DB
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Waitlist error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
