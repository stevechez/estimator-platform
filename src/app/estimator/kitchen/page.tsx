'use client';

import React, { useState, useEffect } from 'react';
import {
	MapPin,
	ChefHat,
	Calculator,
	DownloadCloud,
	X,
	FileText,
	CalendarCheck,
	CheckCircle2,
	Loader2,
	Ruler,
	Hammer,
} from 'lucide-react';
import Autocomplete from 'react-google-autocomplete';
import { submitQualifiedLead } from '@/lib/supabase/leads';
import { getTenantPricing, PricingMatrix } from '@/lib/supabase/pricing';
import { sendEstimateEmail } from '@/src/app/actions/send-estimate';

interface KitchenSpecs {
	address: string;
	size: string;
	scope: string;
}

interface EstimatorProps {
	tenantId?: string;
}

export default function KitchenEstimator({
	tenantId = 'demo_contractor_001', // Using our demo tenant
}: EstimatorProps) {
	const [tenantConfig, setTenantConfig] = useState<PricingMatrix | null>(null);
	const [configLoading, setConfigLoading] = useState(true);

	// Form State
	const [address, setAddress] = useState('');
	const [size, setSize] = useState('');
	const [scope, setScope] = useState('');

	const [isCalculating, setIsCalculating] = useState(false);
	const [specs, setSpecs] = useState<KitchenSpecs | null>(null);

	// Conversion State
	const [showPdfModal, setShowPdfModal] = useState(false);
	const [pdfUnlocked, setPdfUnlocked] = useState(false);
	const [inspectionRequested, setInspectionRequested] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [contactInfo, setContactInfo] = useState({
		name: '',
		email: '',
		phone: '',
	});

	useEffect(() => {
		async function loadTenantConfig() {
			if (tenantId) {
				const data = await getTenantPricing(tenantId);
				if (data) setTenantConfig(data);
			}
			setConfigLoading(false);
		}
		loadTenantConfig();
	}, [tenantId]);

	const formatPrice = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// --- DYNAMIC KITCHEN MATH ENGINE ---
	const calculateKitchenPriceTiers = (specs: KitchenSpecs) => {
		const baseRate = tenantConfig?.kitchen_base_rate || 45000;
		const activeMultiplier = tenantConfig?.pricing_multiplier || 1.0;

		const sizeFactor =
			specs.size === 'Large (200+ sqft)'
				? 1.4
				: specs.size === 'Medium (100-200 sqft)'
					? 1.0
					: 0.8;
		const scopeFactor =
			specs.scope === 'Full Gut & Reconfigure'
				? 1.3
				: specs.scope === 'Pull & Replace'
					? 1.0
					: 0.75;

		const adjustedBase = baseRate * sizeFactor * scopeFactor * activeMultiplier;

		return {
			good: adjustedBase * 0.75, // Stock cabinets, standard appliances
			better: adjustedBase * 1.0, // Semi-custom cabinets, quartz, premium appliances
			best: adjustedBase * 1.6, // Fully custom layout, luxury tier
		};
	};

	const handleGenerateEstimate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!address.trim() || !size || !scope) return;
		setIsCalculating(true);

		// Simulate algorithmic processing delay
		setTimeout(() => {
			setSpecs({ address, size, scope });
			setIsCalculating(false);
		}, 1500);
	};

	const handlePdfUnlock = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const estimatedValue = calculateKitchenPriceTiers(specs!).better;

			await submitQualifiedLead({
				tenant_id: tenantId,
				consumer_name: contactInfo.name,
				consumer_email: contactInfo.email,
				property_address: specs!.address,
				trade_classification: 'Kitchen Remodel - PDF Request',
				estimated_value: estimatedValue,
				selected_tier: 'Research Phase',
				ai_specs: specs as any,
			});

			const emailResponse = await sendEstimateEmail(
				contactInfo.email,
				contactInfo.name,
				estimatedValue,
				'Kitchen Remodel',
				{
					'Property Address': specs!.address,
					'Project Size': specs!.size,
					'Project Scope': specs!.scope,
				},
			);

			if (!emailResponse.success)
				console.error('Email failed:', emailResponse.error);
			setPdfUnlocked(true);
		} catch (error) {
			console.error('PDF Error:', error);
			alert('Failed to unlock document.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInspectionRequest = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await submitQualifiedLead({
				tenant_id: tenantId,
				consumer_name: contactInfo.name,
				consumer_email: contactInfo.email,
				consumer_phone: contactInfo.phone,
				property_address: specs!.address,
				trade_classification: 'Kitchen Remodel - Consult Req',
				estimated_value: calculateKitchenPriceTiers(specs!).better,
				selected_tier: 'Ready to Buy',
				ai_specs: specs as any,
			});
			setInspectionRequested(true);
		} catch (error) {
			alert('Failed to request consultation.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (configLoading) {
		return (
			<div className="max-w-2xl mx-auto p-12 flex flex-col items-center justify-center space-y-4">
				<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
				<p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
					Loading Kitchen Engine...
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-8 relative">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-extrabold text-slate-900">
					Kitchen Estimator
				</h1>
				<p className="text-slate-600">
					Get an instant, algorithmic price for your dream kitchen.
				</p>
			</div>

			{/* STAGE 1: Scope Definition Input */}
			{!specs && !isCalculating && (
				<form
					onSubmit={handleGenerateEstimate}
					className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
				>
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Property Address
						</label>
						<div className="relative">
							<MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
							<Autocomplete
								apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
								onPlaceSelected={place => {
									if (place?.formatted_address)
										setAddress(place.formatted_address);
								}}
								options={{
									types: ['address'],
									componentRestrictions: { country: 'us' },
								}}
								defaultValue={address}
								onChange={(e: any) => setAddress(e.target.value)}
								placeholder="Where is the project located?"
								className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Kitchen Size
						</label>
						<div className="grid grid-cols-3 gap-3">
							{[
								'Small (< 100 sqft)',
								'Medium (100-200 sqft)',
								'Large (200+ sqft)',
							].map(opt => (
								<button
									key={opt}
									type="button"
									onClick={() => setSize(opt)}
									className={`p-3 rounded-xl border text-sm font-bold transition-all ${size === opt ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
								>
									{opt.split(' ')[0]}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Project Scope
						</label>
						<div className="grid gap-3">
							{[
								{
									title: 'Cosmetic Refresh',
									desc: 'Keep layout. Paint cabinets, new counters & backsplash.',
								},
								{
									title: 'Pull & Replace',
									desc: 'Keep layout. All new cabinets, counters, and appliances.',
								},
								{
									title: 'Full Gut & Reconfigure',
									desc: 'Change layout. Move plumbing/electrical, custom cabinets.',
								},
							].map(opt => (
								<button
									key={opt.title}
									type="button"
									onClick={() => setScope(opt.title)}
									className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1 ${scope === opt.title ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-200 hover:border-blue-300'}`}
								>
									<span
										className={`font-bold ${scope === opt.title ? 'text-blue-900' : 'text-slate-900'}`}
									>
										{opt.title}
									</span>
									<span
										className={`text-xs ${scope === opt.title ? 'text-blue-700' : 'text-slate-500'}`}
									>
										{opt.desc}
									</span>
								</button>
							))}
						</div>
					</div>

					<button
						type="submit"
						disabled={!address || !size || !scope}
						className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Calculator className="w-5 h-5" /> Calculate Estimate
					</button>
				</form>
			)}

			{/* STAGE 1.5: Calculating State */}
			{isCalculating && (
				<div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
					<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
					<p className="text-sm font-bold text-slate-900">
						Applying local market rates...
					</p>
				</div>
			)}

			{/* STAGE 2: Immediate Transparent Results */}
			{specs && !isCalculating && (
				<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
							<div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
								<ChefHat className="w-5 h-5" />
							</div>
							<div>
								<h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
									Project Parameters
								</h2>
								<p className="text-sm font-medium text-slate-900 truncate max-w-[280px]">
									{specs.address}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
								<Ruler className="w-5 h-5 text-slate-400" />
								<div>
									<p className="text-slate-400 text-[10px] uppercase font-bold">
										Size
									</p>
									<p className="text-slate-900 font-black text-sm">
										{specs.size.split(' ')[0]}
									</p>
								</div>
							</div>
							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
								<Hammer className="w-5 h-5 text-slate-400" />
								<div>
									<p className="text-slate-400 text-[10px] uppercase font-bold">
										Scope
									</p>
									<p className="text-slate-900 font-black text-sm truncate max-w-[100px]">
										{specs.scope}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
								<Calculator className="w-5 h-5 text-blue-600" /> Estimated
								Investment
							</h3>
							<button
								onClick={() => setShowPdfModal(true)}
								className="text-sm font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
							>
								<FileText className="w-4 h-4" /> Save as PDF
							</button>
						</div>

						<div className="grid gap-3">
							<PriceTier
								title="Standard Finish"
								desc="Stock cabinetry, standard granite/quartz, basic appliances."
								price={formatPrice(calculateKitchenPriceTiers(specs).good)}
							/>
							<PriceTier
								title="Premium Finish"
								desc="Semi-custom cabinets, high-end quartz, upgraded appliances."
								price={formatPrice(calculateKitchenPriceTiers(specs).better)}
								featured
							/>
							<PriceTier
								title="Luxury Custom"
								desc="Fully custom inset cabinetry, luxury appliances (SubZero/Wolf)."
								price={formatPrice(calculateKitchenPriceTiers(specs).best)}
							/>
						</div>
					</div>

					{/* INTENT 2: Site Inspection Form */}
					<div className="mt-8 bg-slate-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
						{inspectionRequested ? (
							<div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
								<div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
									<CheckCircle2 className="w-8 h-8" />
								</div>
								<h3 className="text-2xl font-black">Consultation Requested</h3>
								<p className="text-slate-400 text-sm">
									Our design team will contact you shortly to schedule an
									in-home measurement and consultation.
								</p>
							</div>
						) : (
							<>
								<div className="mb-6 relative z-10">
									<h3 className="text-2xl font-black flex items-center gap-2">
										<CalendarCheck className="w-6 h-6 text-blue-400" /> Start
										Designing
									</h3>
									<p className="text-sm text-slate-400 mt-2">
										Ready to bring this to life? Request a free in-home design
										consultation to refine this estimate.
									</p>
								</div>
								<form
									onSubmit={handleInspectionRequest}
									className="space-y-4 relative z-10"
								>
									<input
										required
										type="text"
										placeholder="Full Name"
										value={contactInfo.name}
										onChange={e =>
											setContactInfo({ ...contactInfo, name: e.target.value })
										}
										className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
									/>
									<div className="grid grid-cols-2 gap-4">
										<input
											required
											type="email"
											placeholder="Email Address"
											value={contactInfo.email}
											onChange={e =>
												setContactInfo({
													...contactInfo,
													email: e.target.value,
												})
											}
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
										/>
										<input
											required
											type="tel"
											placeholder="Phone Number"
											value={contactInfo.phone}
											onChange={e =>
												setContactInfo({
													...contactInfo,
													phone: e.target.value,
												})
											}
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
										/>
									</div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors mt-2"
									>
										{isSubmitting ? 'Submitting...' : 'Request Design Consult'}
									</button>
								</form>
							</>
						)}
					</div>
					<button
						onClick={() => setSpecs(null)}
						className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
					>
						Start a new estimate
					</button>
				</div>
			)}

			{/* INTENT 1: PDF Modal */}
			{showPdfModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
						<button
							onClick={() => setShowPdfModal(false)}
							className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
						{!pdfUnlocked ? (
							<>
								<div className="text-center mb-6 pt-4">
									<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
										<FileText className="w-6 h-6" />
									</div>
									<h3 className="text-xl font-black text-slate-900">
										Save Your Estimate
									</h3>
									<p className="text-sm text-slate-500 mt-2">
										Where should we send your detailed kitchen breakdown for
										your records?
									</p>
								</div>
								<form onSubmit={handlePdfUnlock} className="space-y-4">
									<input
										required
										type="text"
										placeholder="Full Name"
										value={contactInfo.name}
										onChange={e =>
											setContactInfo({ ...contactInfo, name: e.target.value })
										}
										className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<input
										required
										type="email"
										placeholder="Email Address"
										value={contactInfo.email}
										onChange={e =>
											setContactInfo({ ...contactInfo, email: e.target.value })
										}
										className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
									>
										{isSubmitting ? 'Generating...' : 'Generate PDF'}
									</button>
								</form>
							</>
						) : (
							<div className="text-center py-8 space-y-6">
								<CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
								<div>
									<h3 className="text-2xl font-black text-slate-900">
										Blueprint Sent!
									</h3>
									<p className="text-sm text-slate-500 mt-2">
										Check your inbox for the attached PDF ledger.
									</p>
								</div>
								{/* Note: In production, you might still provide a direct download link here, but the email delivery is the primary mechanism now */}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

function PriceTier({ title, price, desc, featured = false }: any) {
	return (
		<div
			className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all hover:shadow-md ${featured ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'}`}
		>
			<div>
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-lg text-slate-900">{title}</h3>
					{featured && (
						<span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
							MOST COMMON
						</span>
					)}
				</div>
				<p className="text-xs text-slate-500 mt-1">{desc}</p>
			</div>
			<div className="text-right">
				<p className="text-2xl font-black text-slate-900">{price}</p>
				<p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
					Turnkey Install
				</p>
			</div>
		</div>
	);
}
