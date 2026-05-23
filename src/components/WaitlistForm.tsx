'use client'; // Add this to the top of your file if you extract the form to a component

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function WaitlistForm() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('loading');
		setErrorMessage('');

		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Something went wrong');
			}

			setStatus('success');
		} catch (error: unknown) {
			setStatus('error');
			setErrorMessage(
				error instanceof Error ? error.message : 'Something went wrong',
			);
		}
	};

	if (status === 'success') {
		return (
			<div className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
				<CheckCircle2 className="w-5 h-5" />
				<span className="font-medium">
					You&rsquo;re on the list. Check your email!
				</span>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto">
			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Enter your email address"
					required
					disabled={status === 'loading'}
					className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={status === 'loading'}
					className="group inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-70"
				>
					{status === 'loading' ? 'Joining...' : 'Join Waitlist'}
					{status !== 'loading' && (
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
					)}
				</button>
			</form>
			{status === 'error' && (
				<p className="text-red-400 text-sm mt-3 text-center">{errorMessage}</p>
			)}
			<p className="text-xs text-slate-500 mt-3 text-center">
				Limited early access opening soon for residential contractors.
			</p>
		</div>
	);
}
