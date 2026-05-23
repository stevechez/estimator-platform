// src/app/autopilot/page.tsx
import { getLiveFeedData } from '@/lib/supabase/feed';
import { formatDistanceToNow } from 'date-fns';
import ReviewCard from '@/components/ReviewCard'; // <-- Import the new client component

interface PendingReview {
	id: string;
	draft_subject: string | null;
	draft_body: string;
	ai_reasoning: string;
	estimates: {
		client_name: string;
		project_type: string;
		total_amount: number;
	};
}

interface RecentLog {
	id: string;
	channel: string;
	step_number: number;
	sent_content: string;
	status: string;
	created_at: string;
	autopilot_campaigns: {
		estimates: {
			client_name: string;
			project_type: string;
		};
	};
}

export default async function AutopilotLiveFeed() {
	const contractorId = 'current-user-uuid';
	const rawData = await getLiveFeedData(contractorId);

	const pendingReviews = (rawData.pendingReviews ||
		[]) as unknown as PendingReview[];
	const recentLogs = (rawData.recentLogs || []) as unknown as RecentLog[];

	return (
		<div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 bg-zinc-50 min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center border-b border-zinc-200 pb-4">
				<h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
					Autopilot Feed
				</h1>
				<div className="flex items-center space-x-2">
					<span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
					<span className="text-sm font-medium text-zinc-500">
						System Active
					</span>
				</div>
			</div>

			{/* ACTION QUEUE: Pending Reviews */}
			{pendingReviews.length > 0 && (
				<section className="space-y-3">
					<h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
						Needs Approval ({pendingReviews.length})
					</h2>
					<div className="space-y-4">
						{pendingReviews.map(review => (
							<ReviewCard
								key={review.id}
								reviewId={review.id}
								clientName={review.estimates?.client_name || 'Unknown Client'}
								projectType={review.estimates?.project_type || 'Project'}
								totalAmount={review.estimates?.total_amount || 0}
								initialBody={review.draft_body}
								aiReasoning={review.ai_reasoning}
							/>
						))}
					</div>
				</section>
			)}

			{/* THE LEDGER: Recent Logs */}
			<section className="space-y-4">
				<h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
					Recent Activity
				</h2>
				<div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
					{recentLogs.map((log, index) => (
						<div
							key={log.id}
							className={`p-4 flex items-start space-x-4 hover:bg-zinc-50 transition ${
								index !== recentLogs.length - 1
									? 'border-b border-zinc-100'
									: ''
							}`}
						>
							<div className="mt-1">
								{log.status === 'sent' ? (
									<div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">
										{log.channel === 'sms' ? '💬' : '✉️'}
									</div>
								) : (
									<div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xs font-bold">
										🛑
									</div>
								)}
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-baseline mb-1">
									<p className="text-sm font-medium text-zinc-900 truncate">
										{log.autopilot_campaigns?.estimates?.client_name ||
											'Unknown Client'}
										<span className="text-zinc-400 font-normal ml-1">
											({log.autopilot_campaigns?.estimates?.project_type})
										</span>
									</p>
									<p className="text-xs text-zinc-400 whitespace-nowrap ml-2">
										{formatDistanceToNow(new Date(log.created_at))} ago
									</p>
								</div>
								<p className="text-sm text-zinc-600 truncate">
									{log.status === 'sent'
										? `Sent: "${log.sent_content}"`
										: 'Campaign Paused / Failed'}
								</p>
							</div>
						</div>
					))}

					{recentLogs.length === 0 && (
						<div className="p-8 text-center text-zinc-500 text-sm">
							No recent activity yet. Send an estimate to get started!
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
