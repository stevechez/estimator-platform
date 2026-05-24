'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistForm() {
	const [status, setStatus] = useState<FormStatus>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	const [form, setForm] = useState({
		name: '',
		email: '',
		company: '',
		trade: '',
		biggestFollowupProblem: '',
	});

	const updateField = (field: keyof typeof form, value: string) => {
		setForm(current => ({
			...current,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('loading');
		setErrorMessage('');

		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
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
			<div className="rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.12] via-emerald-300/[0.06] to-amber-300/[0.06] p-5 text-left shadow-2xl shadow-emerald-950/20 sm:p-6">
				<div className="flex items-start gap-3">
					<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25">
						<CheckCircle2 className="h-5 w-5" />
					</div>

					<div className="min-w-0">
						<p className="text-lg font-black leading-6 text-emerald-100">
							Trial request received.
						</p>

						<p className="mt-2 text-sm leading-6 text-emerald-100/75 sm:text-base sm:leading-7">
							Thanks — we’ll review your request and activate field trial
							workspaces manually while BUILDRAIL is in private beta.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<input
				type="text"
				value={form.name}
				onChange={e => updateField('name', e.target.value)}
				placeholder="Your name"
				required
				disabled={status === 'loading'}
				className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
			/>

			<input
				type="email"
				value={form.email}
				onChange={e => updateField('email', e.target.value)}
				placeholder="Email address"
				required
				disabled={status === 'loading'}
				className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
			/>

			<input
				type="text"
				value={form.company}
				onChange={e => updateField('company', e.target.value)}
				placeholder="Company name"
				disabled={status === 'loading'}
				className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
			/>

			<input
				type="text"
				value={form.trade}
				onChange={e => updateField('trade', e.target.value)}
				placeholder="Primary work: remodels, kitchen/bath, GC, roofing..."
				disabled={status === 'loading'}
				className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
			/>

			<textarea
				value={form.biggestFollowupProblem}
				onChange={e => updateField('biggestFollowupProblem', e.target.value)}
				placeholder="What usually breaks down after a walkthrough?"
				rows={4}
				disabled={status === 'loading'}
				className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
			/>

			<button
				type="submit"
				disabled={status === 'loading'}
				className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black transition-all duration-200 hover:bg-slate-200 disabled:opacity-70"
			>
				{status === 'loading' ? 'Submitting...' : 'Request My Field Trial'}
				{status !== 'loading' && (
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				)}
			</button>

			{status === 'error' && (
				<p className="text-center text-sm text-red-400">{errorMessage}</p>
			)}
		</form>
	);
}
