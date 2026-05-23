'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
	MapPin,
	Satellite,
	Calculator,
	DownloadCloud,
	Home,
	X,
	FileText,
	CalendarCheck,
	CheckCircle2,
	Loader2,
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EstimateDocument from '@/src/components/pdf/EstimateDocument';
import Autocomplete from 'react-google-autocomplete';
import { submitQualifiedLead } from '@/lib/supabase/leads';
import { getTenantPricing, PricingMatrix } from '@/lib/supabase/pricing';
import { sendEstimateEmail } from '@/src/app/actions/send-estimate';
import { useSearchParams } from 'next/navigation';
import { lookupMockProperty } from '@/lib/mocks/properties';

interface RoofSpecs {
	squareFootage: number;
	pitch: string;
	complexity: string;
	existingLayers: number;
}

// 1. Rename the main component and remove the "export default"
function RoofEstimatorContent() {
	const searchParams = useSearchParams();
	const tenantId = searchParams.get('tenant');

	// --- DYNAMIC TENANT CONFIGURATION STATE ---
	const [tenantConfig, setTenantConfig] = useState<PricingMatrix | null>(null);
	const [configLoading, setConfigLoading] = useState(true);

	const [address, setAddress] = useState('');
	const [isScanning, setIsScanning] = useState(false);
	const [specs, setSpecs] = useState<RoofSpecs | null>(null);

	const [showPdfModal, setShowPdfModal] = useState(false);
	const [pdfUnlocked, setPdfUnlocked] = useState(false);
	const [inspectionRequested, setInspectionRequested] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [contactInfo, setContactInfo] = useState({
		name: '',
		email: '',
		phone: '',
	});

	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// FETCH LIVE DATA FROM SUPABASE ON WIDGET MOUNT
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

	// --- DYNAMIC MATH ENGINE ---
	const calculateRoofPriceTiers = (specs: RoofSpecs) => {
		const squares = specs.squareFootage / 100;

		// 1. Grab Live Variables from DB (with premium California safety fallbacks)
		const activeMultiplier = tenantConfig?.pricing_multiplier || 1.1;

		// CHANGED: Fallback base rate from 8500 to 18000 (roughly $900/sq base)
		const baseRatePerSquare = (tenantConfig?.roofing_base_rate || 18000) / 20;

		// 2. Define Material Escalation Scales
		const rates = {
			threeTab: baseRatePerSquare,
			architectural: baseRatePerSquare * 1.35,
			metal: baseRatePerSquare * 2.5,
		};

		const complexityFactor =
			specs.complexity === 'High'
				? 1.25
				: specs.complexity === 'Medium'
					? 1.1
					: 1.0;
		const tearOffCost = specs.existingLayers > 1 ? squares * 150 : 0;

		const calculateForTier = (rate: number) => {
			const total = squares * rate * complexityFactor + tearOffCost;
			return total * activeMultiplier;
		};

		return {
			good: calculateForTier(rates.threeTab),
			better: calculateForTier(rates.architectural),
			best: calculateForTier(rates.metal),
		};
	};

	const handleSimulatedScan = (e: React.FormEvent) => {
		e.preventDefault();
		if (!address.trim()) return;
		setIsScanning(true);

		// Pull the realistic architectural mock specifications for this address
		const propertyData = lookupMockProperty(address);

		setTimeout(() => {
			setSpecs({
				squareFootage: propertyData.squareFootage,
				pitch: propertyData.pitch,
				complexity: propertyData.complexity,
				existingLayers: propertyData.existingLayers,
			});
			setIsScanning(false);
		}, 2000);
	};
	const handlePdfUnlock = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const estimatedValue = calculateRoofPriceTiers(specs!).better;

			// 1. Save Lead to Supabase Database
			await submitQualifiedLead({
				tenant_id: tenantId || '',
				consumer_name: contactInfo.name,
				consumer_email: contactInfo.email,
				property_address: address,
				trade_classification: 'Roof Replacement - PDF Request',
				estimated_value: estimatedValue,
				selected_tier: 'Research Phase',
				ai_specs: specs as any,
			});

			// 2. Fire the Resend Email Pipeline (NOW INCLUDES SPECS FOR THE SERVER-SIDE PDF)
			const emailResponse = await sendEstimateEmail(
				contactInfo.email,
				contactInfo.name,
				estimatedValue,
				'Roof Replacement',
				{
					'Property Address': address,
					'Total Area': `${specs!.squareFootage} sqft`,
					'Roof Pitch': specs!.pitch,
				},
			);

			if (!emailResponse.success) {
				console.error('Email delivery failed:', emailResponse.error);
				// We log the error but still unlock the UI so the user gets their PDF
			}

			// 3. Unlock the PDF Download Screen
			setPdfUnlocked(true);
		} catch (error) {
			console.error('DEBUG -> PDF Unlock Error Details:', error); // <-- Add this line
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
				tenant_id: tenantId || '',
				consumer_name: contactInfo.name,
				consumer_email: contactInfo.email,
				consumer_phone: contactInfo.phone,
				property_address: address,
				trade_classification: 'Roof Replacement - Inspection Req',
				estimated_value: calculateRoofPriceTiers(specs!).better,
				selected_tier: 'Ready to Buy',
				ai_specs: specs as any,
			});
			setInspectionRequested(true);
		} catch (error) {
			alert('Failed to request inspection.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// BLOCK UI UNTIL CONTRACTOR CONFIG LOADS
	if (configLoading) {
		return (
			<div className="max-w-2xl mx-auto p-12 flex flex-col items-center justify-center space-y-4">
				<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
				<p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
					Loading Contractor Settings...
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-8 relative">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-extrabold text-slate-900">
					AI Roof Estimator
				</h1>
				<p className="text-slate-600">
					Transparent satellite analysis. No phone calls, no spam.
				</p>
			</div>

			{/* STAGE 1: Address Input */}
			{!specs && !isScanning && (
				<form
					onSubmit={handleSimulatedScan}
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
								placeholder="Enter your home address..."
								className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow relative"
							/>
						</div>
					</div>
					<button
						type="submit"
						className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
					>
						<Satellite className="w-5 h-5" /> Initiate Satellite Scan
					</button>
				</form>
			)}

			{/* STAGE 1.5: Scanning Pulse */}
			{isScanning && (
				<div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 bg-slate-900 flex flex-col items-center justify-center space-y-4">
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
					<Satellite className="w-12 h-12 text-blue-500 animate-pulse relative z-10" />
					<div className="relative z-10 text-center space-y-1">
						<p className="font-bold text-white tracking-wide">
							Acquiring 3D Geometry...
						</p>
						<p className="text-xs text-slate-400 font-mono">{address}</p>
					</div>
					<div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 mt-4">
						<div className="h-full bg-blue-500 w-full origin-left animate-[scale-x_2.8s_ease-in-out]" />
					</div>
				</div>
			)}

			{/* STAGE 2: Immediate Transparent Results */}
			{specs && !isScanning && (
				<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
							<div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
								<Home className="w-5 h-5" />
							</div>
							<div>
								<h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
									Extracted Measurements
								</h2>
								<p className="text-sm font-medium text-slate-900 truncate max-w-[280px]">
									{address}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
								<p className="text-slate-400 text-[10px] uppercase mb-1 font-bold">
									Square Footage
								</p>
								<p className="text-slate-900 font-black text-lg">
									{specs.squareFootage.toLocaleString()} sqft
								</p>
							</div>
							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
								<p className="text-slate-400 text-[10px] uppercase mb-1 font-bold">
									Calculated Pitch
								</p>
								<p className="text-slate-900 font-black text-lg">
									{specs.pitch}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
								<Calculator className="w-5 h-5 text-blue-600" /> Estimated Costs
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
								title="3-Tab Shingle"
								desc="Standard 25-year lifespan."
								price={formatPrice(calculateRoofPriceTiers(specs).good)}
							/>
							<PriceTier
								title="Architectural Shingle"
								desc="Premium 50-year warranty. High wind resistance."
								price={formatPrice(calculateRoofPriceTiers(specs).better)}
								featured
							/>
							<PriceTier
								title="Standing Seam Metal"
								desc="Lifetime durability. Maximum energy efficiency."
								price={formatPrice(calculateRoofPriceTiers(specs).best)}
							/>
						</div>
					</div>

					{/* INTENT 2: The Permanent "Next Step" High-Intent Form */}
					<div className="mt-8 bg-slate-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

						{inspectionRequested ? (
							<div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
								<div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
									<CheckCircle2 className="w-8 h-8" />
								</div>
								<h3 className="text-2xl font-black">Request Received</h3>
								<p className="text-slate-400 text-sm">
									A local estimator will contact you shortly to schedule a
									physical inspection and lock in your price.
								</p>
							</div>
						) : (
							<>
								<div className="mb-6 relative z-10">
									<h3 className="text-2xl font-black flex items-center gap-2">
										<CalendarCheck className="w-6 h-6 text-blue-400" /> Lock In
										Your Price
									</h3>
									<p className="text-sm text-slate-400 mt-2">
										Ready to move forward? Request a formal site inspection to
										verify these satellite measurements and secure your
										installation date.
									</p>
								</div>
								<form
									onSubmit={handleInspectionRequest}
									className="space-y-4 relative z-10"
								>
									<div>
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
									</div>
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
										{isSubmitting ? 'Submitting...' : 'Request Site Inspection'}
									</button>
								</form>
							</>
						)}
					</div>

					<button
						onClick={() => {
							setSpecs(null);
							setAddress('');
							setInspectionRequested(false);
						}}
						className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
					>
						Scan a different address
					</button>
				</div>
			)}

			{/* INTENT 1: The Low-Friction PDF Modal (FIXED TEXT COLOR BUG) */}
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
										Where should we send your itemized estimate blueprint for
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
										className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<input
										required
										type="email"
										placeholder="Email Address"
										value={contactInfo.email}
										onChange={e =>
											setContactInfo({ ...contactInfo, email: e.target.value })
										}
										className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
										Blueprint Ready!
									</h3>
									<p className="text-sm text-slate-500 mt-2">
										Your data is secured. Click below to download your file.
									</p>
								</div>
								{isClient && specs && (
									<PDFDownloadLink
										document={
											<EstimateDocument
												consumerName={contactInfo.name || 'Homeowner'}
												projectType="Roof Replacement"
												date={new Date().toLocaleDateString()}
												aiSpecs={{
													'Property Address': address,
													'Total Area': `${specs.squareFootage} sqft`,
													'Roof Pitch': specs.pitch,
												}}
												estimatedValue={calculateRoofPriceTiers(specs).better}
											/>
										}
										fileName={`Roof-Estimate-${contactInfo.name || 'Doc'}.pdf`}
										className="inline-flex items-center justify-center w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg"
									>
										{({ loading }) =>
											loading ? (
												'Compiling...'
											) : (
												<>
													<DownloadCloud className="w-5 h-5 mr-2" /> Download
													File Now
												</>
											)
										}
									</PDFDownloadLink>
								)}
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
export default function RoofEstimator() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center space-y-4">
					<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
				</div>
			}
		>
			<RoofEstimatorContent />
		</Suspense>
	);
}
