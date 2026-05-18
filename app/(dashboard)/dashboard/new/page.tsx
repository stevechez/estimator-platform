import { createProject } from './actions';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
	return (
		<div className="min-h-screen bg-[#0A0A0A] text-slate-100 p-6 md:p-12 antialiased">
			<div className="max-w-xl mx-auto space-y-8 mt-8">
				<Link
					href="/dashboard"
					className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Dashboard
				</Link>

				<div className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-white">
						New Walkthrough
					</h1>
					<p className="text-slate-400">
						Set up the client details before you start recording.
					</p>
				</div>

				<form action={createProject} className="space-y-6">
					<div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
						<div className="space-y-2">
							<label
								htmlFor="customer_name"
								className="text-sm font-medium text-slate-300"
							>
								Homeowner / Client Name
							</label>
							<input
								id="customer_name"
								name="customer_name"
								required
								placeholder="e.g. The Smith Residence"
								className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="project_type"
								className="text-sm font-medium text-slate-300"
							>
								Project Type
							</label>
							<select
								id="project_type"
								name="project_type"
								required
								defaultValue=""
								className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
							>
								<option value="" disabled className="text-slate-600">
									Select scope...
								</option>
								<option value="Kitchen Remodel">Kitchen Remodel</option>
								<option value="Bathroom Remodel">Bathroom Remodel</option>
								<option value="Full Gut / Renovation">
									Full Gut / Renovation
								</option>
								<option value="Addition">Addition</option>
								<option value="Exterior / Deck">Exterior / Deck</option>
							</select>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="address"
								className="text-sm font-medium text-slate-300"
							>
								Property Address (Optional)
							</label>
							<input
								id="address"
								name="address"
								placeholder="123 Main St..."
								className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-medium transition-all"
					>
						Create & Start Recording
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</form>
			</div>
		</div>
	);
}
