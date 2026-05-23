'use client';

import { useState } from 'react';
import { getRoofData } from '@/src/app/actions/roofing';
import { Calculator, Info } from 'lucide-react';
import AddressSearch from '@/src/components/AddressSearch';
import LeadCaptureSqueeze from '@/src/components/LeadCaptureSqueeze';
import PriceTier from '@/src/components/PriceTier'; // Successfully imported

// Types
type EstimateResult = {
	totalSquares: string;
	avgPitch: string;
	totalAreaM2: number;
};

type PricingTemplate = {
	standard_asphalt_rate: number;
	architectural_rate: number;
	metal_rate: number;
	steep_surcharge_percent: number;
	extreme_surcharge_percent: number;
};

interface EstimatorClientProps {
	contractorName: string;
	pricing: PricingTemplate;
}

export default function EstimatorClient({
	contractorName,
	pricing,
}: EstimatorClientProps) {
	const [loading, setLoading] = useState(false);
	const [estimate, setEstimate] = useState<EstimateResult | null>(null);
	const [showLeadForm, setShowLeadForm] = useState(false);

	// Dynamic Pricing Logic using Supabase Data
	const calculatePrice = (
		squares: string,
		materialKey: keyof PricingTemplate,
	) => {
		const sq = parseFloat(squares);
		const pitch = parseFloat(estimate?.avgPitch || '0');

		const baseMultiplier = pricing[materialKey] || 0;

		let steepnessMultiplier = 1.0;
		if (pitch > 45) {
			steepnessMultiplier = pricing.extreme_surcharge_percent || 1.5;
		} else if (pitch > 30) {
			steepnessMultiplier = pricing.steep_surcharge_percent || 1.25;
		}

		const finalPrice = sq * baseMultiplier * steepnessMultiplier;

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(finalPrice);
	};

	const handleAddressSelect = async (
		lat: number,
		lng: number,
		address: string,
	) => {
		setLoading(true);
		const result = await getRoofData(lat, lng);

		if (result.success && parseFloat(result.totalSquares || '0') > 0) {
			setEstimate(result as EstimateResult);
			setShowLeadForm(true);
		} else {
			alert('No 3D satellite data found for this specific address.');
			setEstimate(null);
			setShowLeadForm(false);
		}
		setLoading(false);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			{/* Dynamic Header Section */}
			<div className="text-center space-y-2">
				<h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
					{contractorName} Roof Estimator
				</h1>
				<p className="text-lg text-slate-600">
					Transparent satellite analysis. No phone calls, no spam.
				</p>
			</div>

			<div className="max-w-2xl mx-auto">
				<AddressSearch onAddressSelect={handleAddressSelect} />
			</div>

			{loading && (
				<div className="text-center p-20 animate-pulse">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-slate-500 font-medium">
						Analyzing 3D roof geometry...
					</p>
				</div>
			)}

			{/* STAGE 2: Show the Squeeze form if analysis is done but lead isn't captured */}
			{estimate && showLeadForm && (
				<div className="max-w-2xl mx-auto">
					<LeadCaptureSqueeze
						projectType="Roof"
						aiSpecs={estimate}
						onSuccess={() => setShowLeadForm(false)}
					/>
				</div>
			)}

			{/* STAGE 3: Show the results only if lead form is cleared */}
			{estimate && !showLeadForm && !loading && (
				<div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="md:col-span-1 space-y-4">
						<div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
							<h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
								Roof Geometry
							</h2>
							<div className="space-y-6">
								<div>
									<p className="text-4xl font-black text-slate-900">
										{estimate.totalSquares}
									</p>
									<p className="text-sm font-medium text-slate-500">
										Total Squares (100 sq ft)
									</p>
								</div>
								<div className="pt-6 border-t border-slate-100">
									<p className="text-2xl font-bold text-slate-800">
										{estimate.avgPitch}°
									</p>
									<p className="text-sm font-medium text-slate-500">
										Average Pitch (Slope)
									</p>
								</div>
							</div>
						</div>

						<div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
							<Info className="w-5 h-5 text-blue-600 shrink-0" />
							<p className="text-xs leading-relaxed text-blue-800">
								Our AI uses 3D surface modeling to account for roof steepness,
								ensuring more accuracy than a flat square-foot measurement.
							</p>
						</div>
					</div>

					<div className="md:col-span-2 space-y-4">
						<h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
							<Calculator className="w-5 h-5 text-blue-600" />
							Estimated Install Cost
						</h2>

						<div className="grid gap-4">
							<PriceTier
								title="Standard Asphalt"
								desc="Reliable, industry-standard shingles"
								price={calculatePrice(
									estimate.totalSquares,
									'standard_asphalt_rate',
								)}
								color="border-slate-200"
							/>
							<PriceTier
								title="Architectural Shingles"
								desc="High-wind resistance & 30-year life"
								price={calculatePrice(
									estimate.totalSquares,
									'architectural_rate',
								)}
								color="border-blue-500 ring-2 ring-blue-500/10"
								featured
							/>
							<PriceTier
								title="Standing Seam Metal"
								desc="Premium lifetime durability"
								price={calculatePrice(estimate.totalSquares, 'metal_rate')}
								color="border-slate-200"
							/>
						</div>

						<button
							onClick={() => setEstimate(null)}
							className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
						>
							Calculate another address
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
