'use client';

import { useState } from 'react';

interface AutopilotToggleProps {
	enabled: boolean;
	onChange: (enabled: boolean) => void;
}

export default function AutopilotToggle({
	enabled,
	onChange,
}: AutopilotToggleProps) {
	return (
		<div
			className={`mt-8 p-5 rounded-xl border transition-all duration-200 ${
				enabled
					? 'bg-orange-50/50 border-orange-200'
					: 'bg-white border-zinc-200'
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1 pr-4">
					<h3
						className={`font-semibold text-sm ${enabled ? 'text-orange-900' : 'text-zinc-900'}`}
					>
						Autopilot Follow-up
					</h3>
					<p className="text-zinc-500 text-xs mt-1 leading-relaxed">
						Let AI automatically follow up with this lead via SMS and Email if
						they don&apos;t reply. Messages are paused instantly if the client
						responds.
					</p>
				</div>

				{/* Custom Tailwind Switch */}
				<button
					type="button"
					onClick={() => onChange(!enabled)}
					className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
						enabled ? 'bg-orange-500' : 'bg-zinc-200'
					}`}
					role="switch"
					aria-checked={enabled}
				>
					<span
						aria-hidden="true"
						className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
							enabled ? 'translate-x-5' : 'translate-x-0'
						}`}
					/>
				</button>
			</div>

			{/* Expanded Trust Indicators - Only visible when ON */}
			{enabled && (
				<div className="mt-4 pt-4 border-t border-orange-100 animate-in fade-in slide-in-from-top-2 duration-200">
					<div className="flex items-center space-x-4 text-xs font-medium text-orange-800/80">
						<div className="flex items-center">
							<span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
							24h: SMS Nudge
						</div>
						<div className="flex items-center">
							<span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
							3d: SMS Check-in
						</div>
						<div className="flex items-center">
							<span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
							7d: Email Follow-up
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
