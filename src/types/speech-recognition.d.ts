export {};

declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}

	type SpeechRecognitionConstructor = {
		new (): SpeechRecognition;
	};

	interface SpeechRecognition extends EventTarget {
		continuous: boolean;
		interimResults: boolean;
		lang: string;

		start(): void;
		stop(): void;
		abort(): void;

		onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
		onend: ((this: SpeechRecognition, ev: Event) => void) | null;
		onerror:
			| ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
			| null;
		onresult:
			| ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
			| null;
	}

	interface SpeechRecognitionEvent extends Event {
		resultIndex: number;
		results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionErrorEvent extends Event {
		error: string;
		message: string;
	}

	interface SpeechRecognitionResultList {
		[index: number]: SpeechRecognitionResult;
		length: number;
	}

	interface SpeechRecognitionResult {
		[index: number]: SpeechRecognitionAlternative;
		isFinal: boolean;
		length: number;
	}

	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}
}
