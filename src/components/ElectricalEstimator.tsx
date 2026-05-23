'use client';

import React, { useState } from 'react';
import {
	Calculator,
	Zap,
	ShieldCheck,
	AlertTriangle,
	CheckCircle,
	Printer,
	HelpCircle,
} from 'lucide-react';
import LeadCaptureSqueeze from '@/components/LeadCaptureSqueeze';

export default function ElectricalEstimator() {
	const [loading, setLoading] = useState(false);
	const [showLeadForm, setShowLeadForm] = useState(false);
	const [hasUnlocked, setHasUnlocked] = useState(false);

	// // Form Inputs
	// const [panelAmperage, setPanelAmperage] = useState('100');
	// const [requestedService, setRequestedService] = useState(
	// 	'Level 2 EV Charger (40A-50A Circuit)',
	// );
	// const [hasElectricHeat, setHasElectricHeat] = useState(false);
	// const [hasElectricRange, setHasElectricRange] = useState(true);
	// const [hasHotTub, setHasHotTub] = useState(false);
	// const [runDistance, setRunDistance] = useState(25); // in feet from panel to charger/appliance

	// // Helper to format currency cleanly
	// const formatVal = (num: number) => {
	// 	return new Intl.NumberFormat('en-US', {
	// 		style: 'currency',
	// 		currency: 'USD',
	// 		maximumFractionDigits: 0,
	// 	}).format(num);
	// };

	// // --- ELECTRICAL LOAD CALCULATION MATRIX ---
	// const runCalculation = () => {
	// 	const currentAmps = Number(panelAmperage);
	// 	const distance = Number(runDistance) || 0;

	// 	// 1. Calculate Existing Estimated Load (NEC Standard Demand Method Approximation)
	// 	let calculatedLoadAmps = 30; // Baseline general lighting and convenience branch circuits
	// 	if (hasElectricHeat) calculatedLoadAmps += 40;
	// 	if (hasElectricRange) calculatedLoadAmps += 30;
	// 	if (hasHotTub) calculatedLoadAmps += 40;

	// 	// 2. Add Requested New Load Amperage
	// 	let newLoadAmps = 40; // Default for normal Level 2 EV Charger
	// 	if (requestedService.includes('Dual')) newLoadAmps = 80;
	// 	if (requestedService.includes('Panel Upgrade Only')) newLoadAmps = 0;

	// 	const totalEstimatedLoad = calculatedLoadAmps + newLoadAmps;

	// 	// NEC 80% Continuous Load Rule Capacity Threshold
	// 	const safeCapacityThreshold = currentAmps * 0.8;
	// 	const requiresUpgrade =
	// 		totalEstimatedLoad > safeCapacityThreshold || currentAmps < 150;

	// 	// 3. Pricing Matrix Logic
	// 	let baseEquipmentCost = 0;
	// 	let baseLaborCost = 0;
	// 	let materialConduitCost = distance * 12; // Premium heavy gauge copper wire + conduit run costs per foot

	// 	if (requestedService.includes('EV Charger')) {
	// 		baseEquipmentCost = 650; // Premium commercial grade breaker & receptacle/unit charging hardware
	// 		baseLaborCost = 750;
	// 	} else {
	// 		// Just panel upgrade logic
	// 		baseEquipmentCost = 1500;
	// 		baseLaborCost = 2000;
	// 	}

	// 	// Force Panel Upgrade Surcharge if current panel is overloaded or outdated
	// 	let upgradeSurcharge = 0;
	// 	if (requiresUpgrade && !requestedService.includes('Panel Upgrade Only')) {
	// 		upgradeSurcharge = 3200; // Adds localized standard panel swap cost (parts + structural labor + permit)
	// 	}

	// 	const subtotal =
	// 		baseEquipmentCost +
	// 		baseLaborCost +
	// 		materialConduitCost +
	// 		upgradeSurcharge;
	// 	const permitAndInspectionFees = 450;
	// 	const finalTotal = subtotal + permitAndInspectionFees;

	// 	return {
	// 		calculatedLoadAmps,
	// 		newLoadAmps,
	// 		totalEstimatedLoad,
	// 		safeCapacityThreshold,
	// 		requiresUpgrade,
	// 		equipmentCost: baseEquipmentCost,
	// 		laborCost: baseLaborCost,
	// 		materialConduitCost,
	// 		upgradeSurcharge,
	// 		fees: permitAndInspectionFees,
	// 		finalTotal,
	// 	};
	// };

	// const calculatedValues = runCalculation();

	// const handleCalculateClick = () => {
	// 	setLoading(true);
	// 	setTimeout(() => {
	// 		setLoading(false);
	// 		setShowLeadForm(true);
	// 	}, 1200);
	// };

	// return (
	// 	<div className="max-w-6xl mx-auto p-6 space-y-8">
	// 		{/* Top Banner */}
	// 		<div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-3xl p-8 text-white shadow-md text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
	// 			<div>
	// 				<h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
	// 					<Zap className="w-8 h-8 text-yellow-300 animate-bounce" />
	// 					Electrical Panel & EV Load Estimator
	// 				</h1>
	// 				<p className="text-amber-100 mt-1 font-medium">
	// 					NEC-Aligned Load Calculation Sheet & Level 2 Charger Infrastructure
	// 					Quoting
	// 				</p>
	// 			</div>
	// 		</div>

	// 		<div className="grid md:grid-cols-5 gap-8 items-start">
	// 			{/* LEFT COLUMN: Input Configuration Panel */}
	// 			<div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
	// 				<h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
	// 					Service Specs
	// 				</h2>

	// 				<div className="space-y-4">
	// 					<div>
	// 						<label className="block text-sm font-bold text-slate-700 mb-1">
	// 							Current Panel Size
	// 						</label>
	// 						<select
	// 							disabled={hasUnlocked && !showLeadForm}
	// 							className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
	// 							value={panelAmperage}
	// 							onChange={e => setPanelAmperage(e.target.value)}
	// 						>
	// 							<option value="100">100 Amp (Standard Legacy)</option>
	// 							<option value="125">125 Amp</option>
	// 							<option value="150">150 Amp</option>
	// 							<option value="200">200 Amp (Modern Standard)</option>
	// 							<option value="400">400 Amp (Heavy Service)</option>
	// 						</select>
	// 					</div>

	// 					<div>
	// 						<label className="block text-sm font-bold text-slate-700 mb-1">
	// 							Requested Installation
	// 						</label>
	// 						<select
	// 							disabled={hasUnlocked && !showLeadForm}
	// 							className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
	// 							value={requestedService}
	// 							onChange={e => setRequestedService(e.target.value)}
	// 						>
	// 							<option>Level 2 EV Charger (40A-50A Circuit)</option>
	// 							<option>Dual EV Charger Setup (80A Dedicated)</option>
	// 							<option>Panel Upgrade Only (No EV Charger)</option>
	// 						</select>
	// 					</div>

	// 					<div>
	// 						<label className="block text-sm font-bold text-slate-700 mb-1">
	// 							Estimated Run Wire Length
	// 						</label>
	// 						<div className="relative">
	// 							<input
	// 								disabled={hasUnlocked && !showLeadForm}
	// 								type="number"
	// 								className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
	// 								value={runDistance}
	// 								onChange={e =>
	// 									setRunDistance(Math.max(0, parseInt(e.target.value) || 0))
	// 								}
	// 							/>
	// 							<span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">
	// 								linear feet
	// 							</span>
	// 						</div>
	// 						<p className="text-[10px] text-slate-400 font-medium mt-1">
	// 							Distance from breaker panel to your device location.
	// 						</p>
	// 					</div>

	// 					{/* Heavy Load Appliance Matrix Toggles */}
	// 					<div className="pt-4 border-t border-slate-100 space-y-3">
	// 						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
	// 							Existing Heavy Loads
	// 						</h3>

	// 						<label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
	// 							<input
	// 								disabled={hasUnlocked && !showLeadForm}
	// 								type="checkbox"
	// 								className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
	// 								checked={hasElectricHeat}
	// 								onChange={e => setHasElectricHeat(e.target.checked)}
	// 							/>
	// 							<span className="text-sm font-semibold text-slate-700">
	// 								Electric Furnace / Heat Pump
	// 							</span>
	// 						</label>

	// 						<label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
	// 							<input
	// 								disabled={hasUnlocked && !showLeadForm}
	// 								type="checkbox"
	// 								className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
	// 								checked={hasElectricRange}
	// 								onChange={e => setHasElectricRange(e.target.checked)}
	// 							/>
	// 							<span className="text-sm font-semibold text-slate-700">
	// 								Electric Oven / Range Cooktop
	// 							</span>
	// 						</label>

	// 						<label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
	// 							<input
	// 								disabled={hasUnlocked && !showLeadForm}
	// 								type="checkbox"
	// 								className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
	// 								checked={hasHotTub}
	// 								onChange={e => setHasHotTub(e.target.checked)}
	// 							/>
	// 							<span className="text-sm font-semibold text-slate-700">
	// 								Hot Tub / Jacuzzi Suite
	// 							</span>
	// 						</label>
	// 					</div>

	// 					{!hasUnlocked && !showLeadForm && (
	// 						<button
	// 							onClick={handleCalculateClick}
	// 							disabled={loading}
	// 							className="w-full mt-2 py-4 bg-amber-600 text-white font-black text-lg rounded-xl shadow-md hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
	// 						>
	// 							{loading ? (
	// 								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
	// 							) : (
	// 								'Analyze Electrical Capacity'
	// 							)}
	// 						</button>
	// 					)}
	// 				</div>
	// 			</div>

	// 			{/* RIGHT COLUMN: Lead Capture Squeeze or Unlocked Breakdown Results */}
	// 			<div className="md:col-span-3 space-y-6">
	// 				{showLeadForm && (
	// 					<LeadCaptureSqueeze
	// 						projectType="Electrical"
	// 						aiSpecs={{
	// 							panelAmperage,
	// 							requestedService,
	// 							hasElectricHeat,
	// 							hasElectricRange,
	// 							hasHotTub,
	// 							runDistance,
	// 							calculatedValues,
	// 						}}
	// 						onSuccess={() => {
	// 							setShowLeadForm(false);
	// 							setHasUnlocked(true);
	// 						}}
	// 					/>
	// 				)}

	// 				{hasUnlocked && !showLeadForm && (
	// 					<div className="space-y-6 animate-in fade-in duration-500">
	// 						{/* Capacity Flag Status Card */}
	// 						<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
	// 							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
	// 								Load Status Analysis
	// 							</h3>

	// 							{calculatedValues.requiresUpgrade ? (
	// 								<div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex gap-4 items-start max-w-xl mx-auto">
	// 									<AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
	// 									<div>
	// 										<h4 className="font-bold text-red-900 text-md">
	// 											Service Panel Upgrade Required
	// 										</h4>
	// 										<p className="text-xs text-red-700 mt-1 leading-relaxed">
	// 											Your calculated continuous electrical demand (
	// 											{calculatedValues.totalEstimatedLoad}A) crosses safe
	// 											standard limits for your current {panelAmperage}A panel
	// 											configuration. Infrastructure modernization to a 200A
	// 											panel framework is integrated into the quote below.
	// 										</p>
	// 									</div>
	// 								</div>
	// 							) : (
	// 								<div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex gap-4 items-start max-w-xl mx-auto">
	// 									<CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
	// 									<div>
	// 										<h4 className="font-bold text-emerald-900 text-md">
	// 											Amperage Capacity Verified Safe
	// 										</h4>
	// 										<p className="text-xs text-emerald-700 mt-1 leading-relaxed">
	// 											Excellent. Your existing {panelAmperage}A infrastructure
	// 											panel has enough localized electrical headroom to safely
	// 											manage the continuous load requirement without
	// 											structural stress.
	// 										</p>
	// 									</div>
	// 								</div>
	// 							)}

	// 							{/* Final Infrastructure Pricing */}
	// 							<div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl py-6 text-white max-w-md mx-auto shadow-md text-center">
	// 								<p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
	// 									Total Estimated Project Cost
	// 								</p>
	// 								<p className="text-5xl font-black text-amber-400">
	// 									{formatVal(calculatedValues.finalTotal)}
	// 								</p>
	// 								<p className="text-[10px] text-slate-300 font-medium uppercase mt-2 tracking-wider">
	// 									Includes Permits & Safety Verification
	// 								</p>
	// 							</div>
	// 						</div>

	// 						{/* Line-Item Technical Cost Matrix */}
	// 						<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
	// 							<h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
	// 								Cost Breakdown
	// 							</h3>

	// 							<div className="space-y-2 text-sm font-medium">
	// 								<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
	// 									<span className="text-slate-600">
	// 										Equipment, Hardware & Heavy Breaker Pack
	// 									</span>
	// 									<span className="text-slate-900 font-bold">
	// 										{formatVal(calculatedValues.equipmentCost)}
	// 									</span>
	// 								</div>
	// 								<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
	// 									<span className="text-slate-600">
	// 										Electrical Contractor Layout Labor
	// 									</span>
	// 									<span className="text-slate-900 font-bold">
	// 										{formatVal(calculatedValues.laborCost)}
	// 									</span>
	// 								</div>
	// 								<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
	// 									<span className="text-slate-600">
	// 										THHN Copper Wire & Shielded Conduit Run ({runDistance}ft)
	// 									</span>
	// 									<span className="text-slate-900 font-bold">
	// 										{formatVal(calculatedValues.materialConduitCost)}
	// 									</span>
	// 								</div>
	// 								{calculatedValues.upgradeSurcharge > 0 && (
	// 									<div className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100 text-red-900">
	// 										<span className="font-semibold flex items-center gap-1">
	// 											200A Panel Modernization Upgrade Swap
	// 										</span>
	// 										<span className="font-bold">
	// 											{formatVal(calculatedValues.upgradeSurcharge)}
	// 										</span>
	// 									</div>
	// 								)}
	// 								<div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
	// 									<span className="text-slate-600">
	// 										Municipal Electrical Permit & Inspections
	// 									</span>
	// 									<span className="text-slate-900 font-bold">
	// 										{formatVal(calculatedValues.fees)}
	// 									</span>
	// 								</div>
	// 							</div>

	// 							{/* System Controls */}
	// 							<div className="pt-4 border-t border-slate-100 flex gap-4">
	// 								<button
	// 									onClick={() => window.print()}
	// 									className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
	// 								>
	// 									<Printer className="w-4 h-4" /> Print Scope Summary
	// 								</button>
	// 								<button
	// 									onClick={() => {
	// 										setHasUnlocked(false);
	// 										setShowLeadForm(false);
	// 									}}
	// 									className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center border border-slate-200"
	// 								>
	// 									Reconfigure Specs
	// 								</button>
	// 							</div>

	// 							{/* Legal Footnote Warning */}
	// 							<div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-slate-400 text-[10px] leading-relaxed font-medium">
	// 								<ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
	// 								<p>
	// 									Load sizing metrics are mathematical projections based on
	// 									code defaults. Final installation authorization requires
	// 									dynamic physical main breaker verification, actual panel
	// 									configuration balance mapping, and utility transformer drop
	// 									assessment.
	// 								</p>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				)}

	// 				{/* Empty Awaiting Inputs Display State */}
	// 				{!hasUnlocked && !showLeadForm && (
	// 					<div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 bg-white shadow-inner flex flex-col items-center justify-center space-y-4">
	// 						<Zap className="w-12 h-12 text-slate-300 animate-pulse" />
	// 						<div>
	// 							<p className="font-bold text-slate-500">
	// 								Awaiting Load Metrics
	// 							</p>
	// 							<p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
	// 								Select your current panel sizing arrays on the left to review
	// 								calculations against National Electrical Code continuous
	// 								burden guidelines.
	// 							</p>
	// 						</div>
	// 					</div>
	// 				)}
	// 			</div>
	// 		</div>
	// 	</div>
	// );
}
