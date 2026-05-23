import twilio from 'twilio';
import { Resend } from 'resend';

// Initialize Clients
const twilioClient = twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN,
);

const resend = new Resend(process.env.RESEND_API_KEY);
const BUILDRAIL_SYSTEM_PHONE = process.env.TWILIO_PHONE_NUMBER!;

// ------------------------------------------------------------------
// SMS Dispatcher
// ------------------------------------------------------------------
export async function sendSMS({ to, body }: { to: string; body: string }) {
	try {
		const message = await twilioClient.messages.create({
			body: body,
			from: BUILDRAIL_SYSTEM_PHONE,
			to: to, // Must be E.164 format (e.g., +1234567890)
		});

		console.log(`SMS dispatched successfully. SID: ${message.sid}`);
		return { success: true, id: message.sid };
	} catch (error) {
		console.error('Twilio SMS Dispatch Failed:', error);
		throw error; // Let the handler catch this so it can mark the step as 'failed'
	}
}

// ------------------------------------------------------------------
// Email Dispatcher
// ------------------------------------------------------------------
export async function sendEmail({
	to,
	subject,
	body,
}: {
	to: string;
	subject: string;
	body: string;
}) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'Buildrail Autopilot <estimates@buildrail.com>', // Update with your verified domain
			to: [to],
			subject: subject,
			// For MVP, simple text with paragraph breaks.
			// Later, you can inject this into a clean React Email template.
			html: `<p style="white-space: pre-wrap; font-family: sans-serif;">${body}</p>`,
		});

		if (error) {
			throw new Error(`Resend Error: ${error.message}`);
		}

		console.log(`Email dispatched successfully. ID: ${data?.id}`);
		return { success: true, id: data?.id };
	} catch (error) {
		console.error('Resend Email Dispatch Failed:', error);
		throw error;
	}
}
