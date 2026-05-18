'use client';

import { useState } from 'react';
import { Printer, Save, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

// 1. Define the exact shape of your Supabase data and JSON structures
export interface Project {
	id: string;
	user_id: string;
	customer_name: string;
	address: string | null;
	project_type: string;
	status: string;
	created_at: string;
}

export interface LineItem {
	name: string;
	notes: string;
	quantity: string;
	price?: string;
}

export interface EstimateSection {
	section: string;
	line_items: LineItem[];
}

export interface WalkthroughSession {
	id: string;
	project_id: string;
	transcript: string | null;
	ai_summary: string | null;
	estimate_draft: EstimateSection[];
	proposal_summary: string | null;
	created_at: string;
}

// NEW: Define the Photo interface
export interface Photo {
	id: string;
	image_url: string;
	caption: string | null;
}

// 2. Apply the interfaces to your props (Notice `photos` is added here!)
export default function ReviewClient({
	project,
	session,
	photos,
}: {
	project: Project;
	session: WalkthroughSession;
	photos: Photo[];
}) {
	// Load AI data into editable state. Fallback to empty structures if AI failed.
	const [summary, setSummary] = useState(session.proposal_summary || '');
	const [estimateDraft, setEstimateDraft] = useState<EstimateSection[]>(
		session.estimate_draft || [],
	);
	const [isSaving, setIsSaving] = useState(false);

	// Helper to handle typing in the nested estimate fields
	const handleItemChange = (
		sectionIndex: number,
		itemIndex: number,
		field: keyof LineItem,
		value: string,
	) => {
		const updatedDraft = [...estimateDraft];
		updatedDraft[sectionIndex].line_items[itemIndex][field] = value;
		setEstimateDraft(updatedDraft);
	};

	// Trigger browser's native PDF generation
	const handleExportPDF = () => {
		window.print();
	};

	const handleSaveDraft = async () => {
		setIsSaving(true);

		try {
			const response = await fetch('/api/update-estimate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					projectId: project.id,
					summary: summary,
					estimateDraft: estimateDraft,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save');
			}
		} catch (error) {
			console.error('Save error:', error);
			alert('Failed to save your edits. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0A0A0A] text-slate-100 antialiased pb-24">
			{/* NO-PRINT HEADER: Hidden when exporting PDF */}
			<header className="print:hidden sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard"
						className="text-slate-400 hover:text-white transition"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="font-medium text-white">{project.customer_name}</h1>
						<p className="text-xs text-slate-500">Draft Estimate</p>
					</div>
				</div>
				<div className="flex gap-2">
					<button
						onClick={handleSaveDraft}
						className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition"
					>
						<Save className="w-4 h-4" />
						{isSaving ? 'Saving...' : 'Save'}
					</button>
					<button
						onClick={handleExportPDF}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20"
					>
						<Printer className="w-4 h-4" />
						Export PDF
					</button>
				</div>
			</header>

			{/* PRINTABLE DOCUMENT AREA */}
			<main className="max-w-3xl mx-auto mt-8 px-6 print:mt-0 print:px-0">
				{/* Document Header */}
				<div className="mb-12 border-b border-white/10 print:border-black/10 pb-8">
					<h2 className="text-3xl font-semibold text-white print:text-black tracking-tight mb-2">
						Project Proposal
					</h2>
					<div className="grid grid-cols-2 gap-4 text-sm text-slate-400 print:text-slate-600 mt-6">
						<div>
							<p className="font-medium text-slate-300 print:text-black">
								Prepared For:
							</p>
							<p>{project.customer_name}</p>
							<p>{project.address || 'Address TBD'}</p>
						</div>
						<div className="text-right">
							<p className="font-medium text-slate-300 print:text-black">
								Project Type:
							</p>
							<p>{project.project_type}</p>
							<p>Date: {new Date().toLocaleDateString()}</p>
						</div>
					</div>
				</div>

				{/* Executive Summary */}
				<div className="mb-12">
					<h3 className="text-lg font-medium text-slate-200 print:text-black mb-3">
						Project Summary
					</h3>
					<textarea
						value={summary}
						onChange={e => setSummary(e.target.value)}
						className="w-full min-h-[100px] p-4 bg-[#111] print:bg-transparent border border-white/5 print:border-none rounded-xl text-slate-300 print:text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
					/>
				</div>

				{/* Estimate Breakdown */}
				<div className="space-y-8">
					<h3 className="text-lg font-medium text-slate-200 print:text-black border-b border-white/5 print:border-black/10 pb-2">
						Scope & Estimate
					</h3>

					{estimateDraft.map((section, sIdx) => (
						<div
							key={sIdx}
							className="bg-white/[0.02] print:bg-transparent border border-white/5 print:border-black/10 rounded-xl overflow-hidden"
						>
							<div className="bg-white/[0.02] print:bg-slate-100 px-4 py-3 border-b border-white/5 print:border-black/10">
								<h4 className="font-medium text-blue-400 print:text-black">
									{section.section}
								</h4>
							</div>

							<div className="divide-y divide-white/5 print:divide-black/10">
								{section.line_items.map((item: LineItem, iIdx: number) => (
									<div
										key={iIdx}
										className="p-4 grid grid-cols-12 gap-4 items-start"
									>
										{/* Item Name & Notes */}
										<div className="col-span-12 sm:col-span-7 space-y-2">
											<input
												value={item.name}
												onChange={e =>
													handleItemChange(sIdx, iIdx, 'name', e.target.value)
												}
												className="w-full bg-transparent text-slate-200 print:text-black font-medium focus:outline-none focus:border-b focus:border-blue-500/50"
												placeholder="Item name..."
											/>
											<input
												value={item.notes}
												onChange={e =>
													handleItemChange(sIdx, iIdx, 'notes', e.target.value)
												}
												className="w-full bg-transparent text-sm text-slate-500 print:text-slate-600 focus:outline-none focus:border-b focus:border-blue-500/50"
												placeholder="Additional details..."
											/>
										</div>

										{/* Quantity */}
										<div className="col-span-6 sm:col-span-2">
											<label className="text-xs text-slate-600 print:hidden block mb-1">
												Qty / Unit
											</label>
											<input
												value={item.quantity}
												onChange={e =>
													handleItemChange(
														sIdx,
														iIdx,
														'quantity',
														e.target.value,
													)
												}
												className="w-full bg-transparent text-slate-300 print:text-black focus:outline-none focus:border-b focus:border-blue-500/50"
												placeholder="1"
											/>
										</div>

										{/* Price Input (Manual for MVP) */}
										<div className="col-span-6 sm:col-span-3">
											<label className="text-xs text-slate-600 print:hidden block mb-1">
												Estimated Cost
											</label>
											<div className="relative">
												<span className="absolute left-0 top-0 text-slate-500">
													$
												</span>
												<input
													value={item.price || ''}
													onChange={e =>
														handleItemChange(
															sIdx,
															iIdx,
															'price',
															e.target.value,
														)
													}
													className="w-full bg-transparent text-slate-200 print:text-black pl-4 focus:outline-none focus:border-b focus:border-blue-500/50"
													placeholder="0.00"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* NEW: Photos Section */}
				{photos.length > 0 && (
					<div className="mt-12 space-y-4 print:break-before-page">
						<h3 className="text-lg font-medium text-slate-200 print:text-black border-b border-white/5 print:border-black/10 pb-2">
							Site Photos
						</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{photos.map(photo => (
								<div key={photo.id} className="space-y-2">
									<img
										src={photo.image_url}
										alt="Site condition"
										className="w-full aspect-square object-cover rounded-xl border border-white/5 print:border-black/10"
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
