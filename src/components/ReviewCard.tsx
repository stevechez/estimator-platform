'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// 1. Remove onProcessed from this interface
interface ReviewCardProps {
	reviewId: string;
	clientName: string;
	projectType: string;
	totalAmount: number;
	initialBody: string;
	aiReasoning: string;
}

// 2. Remove onProcessed from the destructured props here
export default function ReviewCard({
	reviewId,
	clientName,
	projectType,
	totalAmount,
	initialBody,
	aiReasoning,
}: ReviewCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [draftBody, setDraftBody] = useState(initialBody);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const supabase = createClient();

	const handleApprove = async () => {
		setIsSubmitting(true);

		try {
			// 1. Update the database to push it back into the active queue
			const { error } = await supabase
				.from('autopilot_campaigns')
				.update({
					status: 'active',
					draft_body: draftBody, // Save any manual edits they made
					next_run_at: new Date().toISOString(), // Tell the cron job to send it NOW
				})
				.eq('id', reviewId);

			if (error) throw error;

			// 2. Remove it from the UI instantly
			onProcessed(reviewId);
		} catch (error) {
			console.error('Failed to approve:', error);
			alert('Failed to send. Please try again.');
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm transition-all">
			{/* Header: Who is this for? */}
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="font-semibold text-zinc-900 text-lg">{clientName}</h3>
					<p className="text-sm text-zinc-500 font-medium">
						{projectType} • ${totalAmount.toLocaleString()}
					</p>
				</div>
				<span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
					Needs Approval
				</span>
			</div>

			{/* The Payload: What are we sending? */}
			<div className="relative mb-3">
				{isEditing ? (
					<textarea
						className="w-full bg-white border-2 border-orange-400 rounded-lg p-3 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-0 resize-none"
						rows={4}
						value={draftBody}
						onChange={e => setDraftBody(e.target.value)}
						autoFocus
					/>
				) : (
					<div
						className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-800 border border-zinc-100 font-medium leading-relaxed cursor-text"
						onClick={() => setIsEditing(true)}
					>
						&ldquo;{draftBody}&rdquo;
					</div>
				)}
			</div>

			{/* AI Context */}
			<p className="text-xs text-zinc-400 font-medium mb-5 flex items-center">
				<span className="mr-1.5">✨</span> {aiReasoning}
			</p>

			{/* Action Bar */}
			<div className="flex space-x-3">
				<button
					onClick={handleApprove}
					disabled={isSubmitting}
					className="flex-1 bg-zinc-900 text-white text-sm font-bold py-3 rounded-lg hover:bg-zinc-800 active:scale-[0.98] transition disabled:opacity-50"
				>
					{isSubmitting ? 'Sending...' : 'Approve & Send'}
				</button>

				<button
					onClick={() => setIsEditing(!isEditing)}
					disabled={isSubmitting}
					className="flex-1 bg-white border-2 border-zinc-200 text-zinc-700 text-sm font-bold py-3 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] transition"
				>
					{isEditing ? 'Done Editing' : 'Edit Text'}
				</button>
			</div>
		</div>
	);
}
function onProcessed(reviewId: string) {
	throw new Error('Function not implemented.');
}
