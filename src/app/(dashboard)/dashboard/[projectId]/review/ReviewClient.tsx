'use client';

import { useState } from 'react';
import { Printer, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SuggestedScopeBlocks from '@/components/scope/SuggestedScopeBlocks';
import type { ScopeBlockMatch } from '@/actions/searchScopeBlocks';
import { saveScopeBlock } from '@/actions/saveScopeBlock';

type ToastMessage = {
	type: 'success' | 'error';
	message: string;
};

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

export interface Photo {
	id: string;
	image_url: string;
	caption: string | null;
}

export default function ReviewClient({
	project,
	session,
	photos,
}: {
	project: Project;
	session: WalkthroughSession;
	photos: Photo[];
}) {
	const [summary, setSummary] = useState(session.proposal_summary || '');
	const [estimateDraft, setEstimateDraft] = useState<EstimateSection[]>(
		session.estimate_draft || [],
	);
	const [isSaving, setIsSaving] = useState(false);
	const [savingScopeBlockKey, setSavingScopeBlockKey] = useState<string | null>(
		null,
	);

	const scopeMemoryQuery = [
		project.project_type,
		project.customer_name,
		project.address,
		session.transcript,
		session.ai_summary,
		session.proposal_summary,
		'bathroom remodel shower valve relocation plumbing rough-in tile waterproofing hidden conditions scope exclusions allowances',
	]
		.filter(Boolean)
		.join('\n');

	const handleItemChange = (
		sectionIndex: number,
		itemIndex: number,
		field: keyof LineItem,
		value: string,
	) => {
		setEstimateDraft(current =>
			current.map((section, sIdx) => {
				if (sIdx !== sectionIndex) return section;

				return {
					...section,
					line_items: section.line_items.map((item, iIdx) => {
						if (iIdx !== itemIndex) return item;

						return {
							...item,
							[field]: value,
						};
					}),
				};
			}),
		);
	};

	const [toast, setToast] = useState<ToastMessage | null>(null);

	const showToast = (
		message: string,
		type: ToastMessage['type'] = 'success',
	) => {
		setToast({ message, type });

		window.setTimeout(() => {
			setToast(null);
		}, 2500);
	};

	const handleInsertScopeBlock = (block: ScopeBlockMatch) => {
		setEstimateDraft(current => {
			const newLineItem: LineItem = {
				name: block.title,
				notes: block.body,
				quantity: '1',
				price: '',
			};

			const suggestedSectionIndex = current.findIndex(
				section => section.section === 'Suggested Scope Additions',
			);

			if (suggestedSectionIndex >= 0) {
				return current.map((section, index) => {
					if (index !== suggestedSectionIndex) return section;

					return {
						...section,
						line_items: [...section.line_items, newLineItem],
					};
				});
			}

			return [
				...current,
				{
					section: 'Suggested Scope Additions',
					line_items: [newLineItem],
				},
			];
		});
	};

	const handleSaveLineItemAsScopeBlock = async (
		section: EstimateSection,
		item: LineItem,
		key: string,
	) => {
		const title = item.name.trim();
		const body = item.notes.trim();

		if (!title || !body) {
			showToast(
				'Add a title and notes before saving this as a scope block.',
				'error',
			);
			return;
		}

		setSavingScopeBlockKey(key);

		try {
			const result = await saveScopeBlock({
				userId: project.user_id,
				title,
				body,
				projectType: project.project_type,
				trade: section.section,
				room: project.project_type,
				tags: [project.project_type, section.section, title].filter(Boolean),
				sourceProjectId: project.id,
			});

			if (!result.success) {
				throw new Error(result.error || 'Failed to save scope block.');
			}

			showToast('Saved as reusable scope block.');
		} catch (error) {
			console.error('Failed to save scope block:', error);
			showToast('Failed to save reusable scope block.', 'error');
		} finally {
			setSavingScopeBlockKey(null);
		}
	};

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
					summary,
					estimateDraft,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save');
			}
		} catch (error) {
			console.error('Save error:', error);
			showToast('Failed to save your edits. Please try again.', 'error');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0A0A0A] pb-24 text-slate-100 antialiased">
			{toast && (
				<div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 print:hidden">
					<div
						className={[
							'rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md',
							toast.type === 'success'
								? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
								: 'border-red-400/30 bg-red-500/15 text-red-100',
						].join(' ')}
					>
						{toast.message}
					</div>
				</div>
			)}
			<header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 px-6 py-4 backdrop-blur-md print:hidden">
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard"
						className="text-slate-400 transition hover:text-white"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>

					<div>
						<h1 className="font-medium text-white">{project.customer_name}</h1>
						<p className="text-xs text-slate-500">Draft Estimate</p>
					</div>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleSaveDraft}
						disabled={isSaving}
						className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
					>
						<Save className="h-4 w-4" />
						{isSaving ? 'Saving...' : 'Save'}
					</button>

					<button
						type="button"
						onClick={handleExportPDF}
						className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
					>
						<Printer className="h-4 w-4" />
						Export PDF
					</button>
				</div>
			</header>

			<div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,1fr)_380px] print:block print:max-w-3xl print:px-0">
				<main className="mx-auto mt-8 w-full max-w-3xl print:mt-0">
					<div className="mb-12 border-b border-white/10 pb-8 print:border-black/10">
						<h2 className="mb-2 text-3xl font-semibold tracking-tight text-white print:text-black">
							Project Proposal
						</h2>

						<div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-400 print:text-slate-600">
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

					<div className="mb-12">
						<h3 className="mb-3 text-lg font-medium text-slate-200 print:text-black">
							Project Summary
						</h3>

						<textarea
							value={summary}
							onChange={e => setSummary(e.target.value)}
							className="min-h-[100px] w-full resize-y rounded-xl border border-white/5 bg-[#111] p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 print:border-none print:bg-transparent print:text-black"
						/>
					</div>

					<div className="space-y-8">
						<h3 className="border-b border-white/5 pb-2 text-lg font-medium text-slate-200 print:border-black/10 print:text-black">
							Scope & Estimate
						</h3>

						{estimateDraft.map((section, sIdx) => (
							<div
								key={`${section.section}-${sIdx}`}
								className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] print:border-black/10 print:bg-transparent"
							>
								<div className="border-b border-white/5 bg-white/[0.02] px-4 py-3 print:border-black/10 print:bg-slate-100">
									<h4 className="font-medium text-blue-400 print:text-black">
										{section.section}
									</h4>
								</div>

								<div className="divide-y divide-white/5 print:divide-black/10">
									{section.line_items.map((item, iIdx) => {
										const itemKey = `${sIdx}-${iIdx}`;

										return (
											<div
												key={itemKey}
												className="grid grid-cols-12 items-start gap-4 p-4"
											>
												<div className="col-span-12 space-y-2 sm:col-span-7">
													<input
														value={item.name}
														onChange={e =>
															handleItemChange(
																sIdx,
																iIdx,
																'name',
																e.target.value,
															)
														}
														className="w-full bg-transparent font-medium text-slate-200 focus:outline-none focus:border-b focus:border-blue-500/50 print:text-black"
														placeholder="Item name..."
													/>

													<textarea
														value={item.notes}
														onChange={e =>
															handleItemChange(
																sIdx,
																iIdx,
																'notes',
																e.target.value,
															)
														}
														className="min-h-[72px] w-full resize-y bg-transparent text-sm leading-6 text-slate-500 focus:outline-none focus:border-b focus:border-blue-500/50 print:text-slate-600"
														placeholder="Additional details..."
													/>

													<button
														type="button"
														onClick={() =>
															handleSaveLineItemAsScopeBlock(
																section,
																item,
																itemKey,
															)
														}
														disabled={savingScopeBlockKey === itemKey}
														className="mt-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.1] disabled:opacity-50 print:hidden"
													>
														{savingScopeBlockKey === itemKey
															? 'Saving...'
															: 'Save as Scope Block'}
													</button>
												</div>

												<div className="col-span-6 sm:col-span-2">
													<label className="mb-1 block text-xs text-slate-600 print:hidden">
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
														className="w-full bg-transparent text-slate-300 focus:outline-none focus:border-b focus:border-blue-500/50 print:text-black"
														placeholder="1"
													/>
												</div>

												<div className="col-span-6 sm:col-span-3">
													<label className="mb-1 block text-xs text-slate-600 print:hidden">
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
															className="w-full bg-transparent pl-4 text-slate-200 focus:outline-none focus:border-b focus:border-blue-500/50 print:text-black"
															placeholder="0.00"
														/>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>

					{photos.length > 0 && (
						<div className="mt-12 space-y-4 print:break-before-page">
							<h3 className="border-b border-white/5 pb-2 text-lg font-medium text-slate-200 print:border-black/10 print:text-black">
								Site Photos
							</h3>

							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{photos.map(photo => (
									<div key={photo.id} className="space-y-2">
										<img
											src={photo.image_url}
											alt="Site condition"
											className="aspect-square w-full rounded-xl border border-white/5 object-cover print:border-black/10"
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</main>

				<aside className="mt-8 print:hidden lg:sticky lg:top-24 lg:self-start">
					<SuggestedScopeBlocks
						userId={project.user_id}
						query={scopeMemoryQuery}
						onInsert={handleInsertScopeBlock}
					/>
				</aside>
			</div>
		</div>
	);
}
