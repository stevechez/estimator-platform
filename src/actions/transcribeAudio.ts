'use server';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(formData: FormData) {
	try {
		// Extract the audio file from the FormData object
		const file = formData.get('audio') as File | null;

		if (!file) {
			return { success: false, error: 'No audio file received.' };
		}

		// Hit OpenAI's Whisper API (whisper-1 is their flagship transcription model)
		const transcription = await openai.audio.transcriptions.create({
			file: file,
			model: 'whisper-1',
			// Prompting Whisper with construction terminology ensures it spells things like
			// "Schluter", "curbless", and "joist" correctly instead of hallucinating words.
			prompt:
				'Construction field notes, residential remodel, general contractor terminology. Schluter, PEX, Romex, subfloor, drywall, joist.',
		});

		return { success: true, text: transcription.text };
	} catch (error) {
		console.error('Whisper Transcription Failed:', error);
		return { success: false, error: 'Failed to transcribe audio.' };
	}
}
