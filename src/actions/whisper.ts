// src/actions/whisper.ts
'use server';

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(base64Audio: string) {
	try {
		// 1. Convert the incoming base64 string from the browser back into a buffer
		const audioBuffer = Buffer.from(base64Audio, 'base64');

		// 2. Convert buffer to a File object that the OpenAI SDK expects
		const file = await OpenAI.toFile(audioBuffer, 'input.webm', {
			type: 'audio/webm',
		});

		// 3. Send to Whisper API
		const response = await openai.audio.transcriptions.create({
			file: file,
			model: 'whisper-1',
			language: 'en', // Locks it to English to reduce translation/hallucination errors
			prompt:
				'Terms like: drywall, layout, MEP, HVAC, framing, flashing, rough-in, change order, sub, framing, material delta, squares, pitch.', // Teaches Whisper industry jargon
		});

		return { success: true, text: response.text };
	} catch (error) {
		console.error('Whisper Transcription Failed:', error);
		return { success: false, error: 'Failed to process audio statement.' };
	}
}
