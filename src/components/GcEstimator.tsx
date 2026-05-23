'use client';

import React, { useState } from 'react';
import {
	Calculator,
	Hammer,
	Info,
	ShieldCheck,
	Printer,
	HelpCircle,
} from 'lucide-react';
import LeadCaptureSqueeze from '@/components/LeadCaptureSqueeze';

export default function GcEstimator() {
	const [loading, setLoading] = useState(false);
	const [showLeadForm, setShowLeadForm] = useState(false);
	const [hasUnlocked, setHasUnlocked] = useState(false);

	// Form Inputs
	const [projectType, setProjectType] = useState('Kitchen Remodel (Full)');
	const [squareFootage, setSquareFootage] = useState(1000);
	const [fixtures, setFixtures] = useState(2);
	const [materialLevel, setMaterialLevel] = useState('1.0'); // Standard
	const [difficultyLevel, setDifficultyLevel] = useState('1.0'); // Standard

	// Helper to format currency cleanly
	const formatVal = (num: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(num);
	};

	// --- THE LINE-ITEM MATHEMATICAL MATRIX ---
	const runCalculation = () => {
		const sqFt = Number(squareFootage) || 0;
		const fixCount = Number(fixtures) || 0;
		const matMult = parseFloat(materialLevel);
		const diffMult = parseFloat(difficultyLevel);

		// Base cost mapping based on selected project type
		let baseRatePerSqFt = 75;
		if (projectType.includes('Bathroom')) baseRatePerSqFt = 120;
		if (projectType.includes('Whole House')) baseRatePerSqFt = 150;

		// 1. Direct Costs
		const materialCost = sqFt * baseRatePerSqFt * matMult;
		const laborCost = fixCount * 1500 * diffMult + sqFt * 25 * diffMult;
		const permitFees = sqFt > 1500 ? 1200 : 800;

		// 2. Markups (Standard GC Accounting: 20% Overhead, 15% Profit)
		const subtotal = materialCost + laborCost + permitFees;
		const overhead = subtotal * 0.2;
		const profit = subtotal * 0.15;
		const finalTotal = subtotal + overhead + profit;

		// Variance Range (+/- 20%)
		const lowRange = finalTotal * 0.8;
		const highRange = finalTotal * 1.2;

		return {
			finalTotal,
			lowRange,
			highRange,
			materialCost,
			laborCost,
			permitFees,
			subtotal,
			overhead,
			profit,
		};
	};

	const calculatedValues = runCalculation();

	const handleCalculateClick = () => {
		setLoading(true);
		// Simulate a brief mechanical calculation delay for visual polish
		setTimeout(() => {
			setLoading(false);
			setShowLeadForm(true);
		}, 1200);
	};

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-8">
			{/* Top Banner */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-md text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
				<div>
					<h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
						<Hammer className="w-8 h-8 text-amber-400" />
						General Contractor Renovation Estimator
					</h1>
					<p className="text-blue-100 mt-1 font-medium">
						Professional Project Cost Calculator – Current Market Pricing
					</p>
				</div>
			</div>

			<div className="grid md:grid-cols-5 gap-8 items-start">
				{/* LEFT COLUMN: Input Variables Panel */}
				<div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
					<h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
						Project Details
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
								Project Type{' '}
								<HelpCircle className="w-3.5 h-3.5 text-slate-400" />
							</label>
							<select
								disabled={hasUnlocked && !showLeadForm}
								className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
								value={projectType}
								onChange={e => setProjectType(e.target.value)}
							>
								<option>Kitchen Remodel (Full)</option>
								<option>Bathroom Remodel (Primary)</option>
								<option>Basement Finishing</option>
								<option>Whole House Renovation</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-bold text-slate-700 mb-1">
								Square Footage
							</label>
							<div className="relative">
								<input
									disabled={hasUnlocked && !showLeadForm}
									type="number"
									className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
									value={squareFootage}
									onChange={e =>
										setSquareFootage(Math.max(0, parseInt(e.target.value) || 0))
									}
								/>
								<span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">
									sq ft
								</span>
							</div>
						</div>

						<div>
							<label className="block text-sm font-bold text-slate-700 mb-1">
								Number of Fixtures
							</label>
							<input
								disabled={hasUnlocked && !showLeadForm}
								type="number"
								className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
								value={fixtures}
								onChange={e =>
									setFixtures(Math.max(0, parseInt(e.target.value) || 0))
								}
							/>
						</div>

						<div className="pt-4 border-t border-slate-100 space-y-4">
							<h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
								Material & Quality Level
							</h3>

							<div>
								<label className="block text-xs font-bold text-slate-600 mb-1">
									Material Level
								</label>
								<select
									disabled={hasUnlocked && !showLeadForm}
									className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
									value={materialLevel}
									onChange={e => setMaterialLevel(e.target.value)}
								>
									<option value="0.75">Economy (0.75x cost)</option>
									<option value="1.0">Standard (1.0x cost)</option>
									<option value="1.5">Premium (1.5x cost)</option>
									<option value="2.2">Luxury Custom (2.2x cost)</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-600 mb-1">
									Difficulty Level
								</label>
								<select
									disabled={hasUnlocked && !showLeadForm}
									className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
									value={difficultyLevel}
									onChange={e => setDifficultyLevel(e.target.value)}
								>
									<option value="0.8">Simple Layout (0.8x labor)</option>
									<option value="1.0">Standard (1.0x labor)</option>
									<option value="1.3">Complex Structural (1.3x labor)</option>
								</select>
							</div>
						</div>

						{!hasUnlocked && !showLeadForm && (
							<button
								onClick={handleCalculateClick}
								disabled={loading}
								className="w-full mt-4 py-4 bg-blue-600 text-white font-black text-lg rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
							>
								{loading ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
								) : (
									'Calculate Project Cost'
								)}
							</button>
						)}
					</div>
				</div>

				{/* RIGHT COLUMN: Gated Squeeze Form or Live Cost Display Panel */}
				<div className="md:col-span-3 space-y-6">
					{/* STAGE 2: Lead Squeeze Modal Layout */}
					{showLeadForm && (
						<LeadCaptureSqueeze
							projectType="Bathroom"
							aiSpecs={{
								projectType,
								squareFootage,
								fixtures,
								materialLevel,
								difficultyLevel,
							}}
							onSuccess={() => {
								setShowLeadForm(false);
								setHasUnlocked(true);
							}}
						/>
					)}

					{/* STAGE 3: Unlocked Professional Breakdown View */}
					{hasUnlocked && !showLeadForm && (
						<div className="space-y-6 animate-in fade-in duration-500">
							{/* Total Estimated Cost Card */}
							<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
								<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
									Project Estimate
								</h3>
								<div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl py-6 text-white max-w-md mx-auto shadow-md">
									<p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
										Total Estimated Cost
									</p>
									<p className="text-5xl font-black">
										{formatVal(calculatedValues.finalTotal)}
									</p>
								</div>

								{/* Range Matrix (+/- 20%) */}
								<div className="pt-4 border-t border-slate-100 max-w-md mx-auto">
									<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
										Estimated Cost Range (±20%)
									</p>
									<div className="grid grid-cols-3 gap-2">
										<div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
											<p className="text-[10px] uppercase font-bold text-slate-400">
												Low
											</p>
											<p className="text-sm font-black text-slate-700">
												{formatVal(calculatedValues.lowRange)}
											</p>
										</div>
										<div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100">
											<p className="text-[10px] uppercase font-bold text-blue-500">
												Average
											</p>
											<p className="text-sm font-black text-blue-600">
												{formatVal(calculatedValues.finalTotal)}
											</p>
										</div>
										<div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
											<p className="text-[10px] uppercase font-bold text-slate-400">
												High
											</p>
											<p className="text-sm font-black text-slate-700">
												{formatVal(calculatedValues.highRange)}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Line-Item Transparent Cost Breakdown Panel */}
							<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
								<h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
									Cost Breakdown
								</h3>

								<div className="space-y-2 text-sm font-medium">
									<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
										<span className="text-slate-600">Material Cost</span>
										<span className="text-slate-900 font-bold">
											{formatVal(calculatedValues.materialCost)}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
										<span className="text-slate-600">Labor Cost</span>
										<span className="text-slate-900 font-bold">
											{formatVal(calculatedValues.laborCost)}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
										<span className="text-slate-600">Permit Fees</span>
										<span className="text-slate-900 font-bold">
											{formatVal(calculatedValues.permitFees)}
										</span>
									</div>

									<div className="pt-2 border-b border-slate-100 my-2"></div>

									<div className="flex justify-between items-center p-3 text-slate-500 text-xs uppercase tracking-wider">
										<span>Subtotal</span>
										<span className="font-bold">
											{formatVal(calculatedValues.subtotal)}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-500 italic">
										<span>Overhead (20%)</span>
										<span>{formatVal(calculatedValues.overhead)}</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-500 italic">
										<span>Profit (15%)</span>
										<span>{formatVal(calculatedValues.profit)}</span>
									</div>
								</div>

								{/* Actions Row */}
								<div className="pt-6 border-t border-slate-100 flex gap-4">
									<button
										onClick={() => window.print()}
										className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
									>
										<Printer className="w-4 h-4" /> Print Estimate
									</button>
									<button
										onClick={() => {
											setHasUnlocked(false);
											setShowLeadForm(false);
										}}
										className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
									>
										Edit Layout
									</button>
								</div>

								{/* Footnote Warning */}
								<div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-xs leading-relaxed font-medium">
									<ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
									<p>
										<strong>Note:</strong> This estimate is subject to on-site
										inspection and may vary based on actual structural
										configurations, local code compliance factors, and
										unforeseen site complications.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Placeholder display if they haven't calculated anything yet */}
					{!hasUnlocked && !showLeadForm && (
						<div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 bg-white shadow-inner flex flex-col items-center justify-center space-y-4">
							<Calculator className="w-12 h-12 text-slate-300 animate-pulse" />
							<div>
								<p className="font-bold text-slate-500">
									Awaiting Specifications
								</p>
								<p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
									Adjust the parameters on the left and hit calculate to
									generate your transparent cost breakdown sheet.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
