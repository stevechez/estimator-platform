'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Calculator, DownloadCloud } from 'lucide-react';
import { analyzeBathroom } from '@/actions/bathroom';
import LeadCaptureSqueeze from '@/components/LeadCaptureSqueeze';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EstimateDocument from '@/components/pdf/EstimateDocument';

interface EstimatorProps {
	tenantId?: string;
	multiplier?: number;
}

export default function BathroomEstimator({
	tenantId = 'REPLACE_WITH_DYNAMIC_TENANT_ID',
	multiplier = 1.0,
}: EstimatorProps) {
	// 	const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
	// 	const [loading, setLoading] = useState(false);
	// 	const [specs, setSpecs] = useState<any>(null);
	// 	const [showLeadForm, setShowLeadForm] = useState(false);
	// 	// FIXED 1: Added missing client-side hydration check for the PDF renderer
	// 	const [isClient, setIsClient] = useState(false);
	// 	useEffect(() => {
	// 		setIsClient(true);
	// 	}, []);
	// 	// --- PRICING LOGIC ---
	// 	const calculateBathroomPriceTiers = (specs: any) => {
	// 		const baseLabor = {
	// 			Powder: { good: 4000, better: 8000, best: 15000 },
	// 			Full: { good: 6000, better: 15000, best: 25000 },
	// 			Primary: { good: 8500, better: 22000, best: 35000 },
	// 		};
	// 		const fixtureRates = {
	// 			vanity: { good: 800, better: 1800, best: 4500 },
	// 			shower: { good: 0, better: 6500, best: 12000 },
	// 			toilet: { good: 500, better: 900, best: 2200 },
	// 		};
	// 		const room = (specs.roomType as keyof typeof baseLabor) || 'Full';
	// 		const calculateTotal = (tier: 'good' | 'better' | 'best') => {
	// 			let total = baseLabor[room]?.[tier] || baseLabor['Full'][tier];
	// 			total += fixtureRates.vanity[tier];
	// 			if (room !== 'Powder') total += fixtureRates.shower[tier];
	// 			total += fixtureRates.toilet[tier];
	// 			if (specs.layoutChangeLikely && tier !== 'good') total += 5500;
	// 			// Apply dynamic multi-tenant pricing configuration markup scale factor
	// 			return total * multiplier;
	// 		};
	// 		return {
	// 			good: calculateTotal('good'),
	// 			better: calculateTotal('better'),
	// 			best: calculateTotal('best'),
	// 		};
	// 	};
	// 	const formatPrice = (amount: number) => {
	// 		return new Intl.NumberFormat('en-US', {
	// 			style: 'currency',
	// 			currency: 'USD',
	// 			maximumFractionDigits: 0,
	// 		}).format(amount);
	// 	};
	// 	const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 		const files = Array.from(e.target.files || []);
	// 		const newImages = files.map(file => ({
	// 			file,
	// 			preview: URL.createObjectURL(file),
	// 		}));
	// 		setImages(prev => [...prev, ...newImages]);
	// 	};
	// 	const runAnalysis = async () => {
	// 		setLoading(true);
	// 		const base64Promises = images.map(img => {
	// 			return new Promise<string>(resolve => {
	// 				const reader = new FileReader();
	// 				reader.readAsDataURL(img.file);
	// 				reader.onloadend = () =>
	// 					resolve((reader.result as string).split(',')[1]);
	// 			});
	// 		});
	// 		const base64Images = await Promise.all(base64Promises);
	// 		const result = await analyzeBathroom(base64Images);
	// 		if (result.success) {
	// 			setSpecs(result.data);
	// 			setShowLeadForm(true); // INTERCEPT: Enforce the data registration wall
	// 		} else {
	// 			alert('Error: ' + result.error);
	// 		}
	// 		setLoading(false);
	// 	};
	// 	const resetEstimator = () => {
	// 		images.forEach(img => URL.revokeObjectURL(img.preview));
	// 		setImages([]);
	// 		setSpecs(null);
	// 		setShowLeadForm(false);
	// 	};
	// 	return (
	// 		<div className="max-w-2xl mx-auto p-6 space-y-8">
	// 			<div className="text-center">
	// 				<h1 className="text-3xl font-black text-slate-900">
	// 					Bathroom AI Estimator
	// 				</h1>
	// 				<p className="text-slate-500">Capture the vanity, shower, and floor.</p>
	// 			</div>
	// 			{/* STAGE 1: UPLOAD LAYER */}
	// 			{!specs && (
	// 				<div className="space-y-6">
	// 					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
	// 						{images.map((img, i) => (
	// 							<div
	// 								key={i}
	// 								className="relative aspect-square rounded-xl overflow-hidden border border-slate-200"
	// 							>
	// 								<img
	// 									src={img.preview}
	// 									className="object-cover w-full h-full"
	// 									alt="Preview"
	// 								/>
	// 								<button
	// 									onClick={() =>
	// 										setImages(images.filter((_, idx) => idx !== i))
	// 									}
	// 									className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
	// 								>
	// 									<X className="w-4 h-4" />
	// 								</button>
	// 							</div>
	// 						))}
	// 						<label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
	// 							<Plus className="w-8 h-8 text-slate-400 mb-2" />
	// 							<span className="text-[10px] font-bold text-slate-400 uppercase">
	// 								Add Photo
	// 							</span>
	// 							<input
	// 								type="file"
	// 								multiple
	// 								className="hidden"
	// 								onChange={handleAddImage}
	// 								accept="image/jpeg, image/png, image/webp"
	// 							/>
	// 						</label>
	// 					</div>
	// 					{images.length > 0 && (
	// 						<button
	// 							onClick={runAnalysis}
	// 							disabled={loading}
	// 							className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
	// 						>
	// 							{loading ? (
	// 								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
	// 							) : (
	// 								<>
	// 									<Sparkles className="w-5 h-5" />
	// 									Analyze {images.length} Photos
	// 								</>
	// 							)}
	// 						</button>
	// 					)}
	// 				</div>
	// 			)}
	// 			{/* STAGE 2: THE LEAD CAPTURE GATING WALL */}
	// 			{specs && showLeadForm && (
	// 				<LeadCaptureSqueeze
	// 					projectType="Bathroom"
	// 					tenantId={tenantId}
	// 					aiSpecs={specs}
	// 					onSuccess={() => setShowLeadForm(false)}
	// 				/>
	// 			)}
	// 			{/* STAGE 3: UNLOCKED SCOPE AND PRICING METRICS */}
	// 			{specs && !showLeadForm && !loading && (
	// 				<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
	// 					{/* Extracted Data Card */}
	// 					<div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
	// 						<h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
	// 							Detected Scope
	// 						</h2>
	// 						<div className="grid grid-cols-2 gap-4 text-sm font-medium">
	// 							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
	// 								<p className="text-slate-400 text-[10px] uppercase mb-1">
	// 									Room Class
	// 								</p>
	// 								<p className="text-slate-900 font-bold">{specs.roomType}</p>
	// 							</div>
	// 							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
	// 								<p className="text-slate-400 text-[10px] uppercase mb-1">
	// 									Vanity
	// 								</p>
	// 								<p className="text-slate-900 font-bold">{specs.vanityType}</p>
	// 							</div>
	// 							<div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
	// 								<p className="text-slate-400 text-[10px] uppercase mb-1">
	// 									Wet Area
	// 								</p>
	// 								<p className="text-slate-900 font-bold">{specs.showerType}</p>
	// 							</div>
	// 						</div>
	// 						{specs.layoutChangeLikely && (
	// 							<div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium flex items-center gap-2">
	// 								<Sparkles className="w-4 h-4" />
	// 								Plumbing relocation or major layout change detected.
	// 							</div>
	// 						)}
	// 					</div>
	// 					{/* Pricing Tiers Section */}
	// 					<div className="space-y-4 pt-4">
	// 						<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
	// 							<Calculator className="w-5 h-5 text-blue-600" />
	// 							Estimated Remodel Tiers
	// 						</h3>
	// 						<div className="grid gap-3">
	// 							<PriceTier
	// 								title="Surface Refresh"
	// 								desc="New vanity, paint, and fixtures. Keep existing tile."
	// 								price={formatPrice(calculateBathroomPriceTiers(specs).good)}
	// 							/>
	// 							<PriceTier
	// 								title="Standard Remodel"
	// 								desc="Full gut to studs, new tile, standard layout."
	// 								price={formatPrice(calculateBathroomPriceTiers(specs).better)}
	// 								featured
	// 							/>
	// 							<PriceTier
	// 								title="Luxury Suite"
	// 								desc="Premium materials, smart fixtures, custom glass."
	// 								price={formatPrice(calculateBathroomPriceTiers(specs).best)}
	// 							/>
	// 						</div>
	// 					</div>
	// 					{/* PDF DOWNLOAD BUTTON (Conditionally rendered on client to avoid Next.js hydration mismatch) */}
	// 					{isClient && (
	// 						<div className="mt-8 pt-8 border-t border-slate-200 text-center">
	// 							<PDFDownloadLink
	// 								document={
	// 									<EstimateDocument
	// 										consumerName="Homeowner" // FIXED 3: Hardcoded safely since form state lives in the child component
	// 										projectType="Garage Door Installation" // FIXED 2: Correct project naming
	// 										date={new Date().toLocaleDateString()}
	// 										aiSpecs={{
	// 											'Door Count': specs.doorCount.toString(),
	// 											'Size Requirements': specs.sizeType.join(' & '),
	// 											'Material Match': specs.materialStyle,
	// 											Windows: specs.hasWindows ? 'Included' : 'None',
	// 										}}
	// 										estimatedValue={calculateBathroomPriceTiers(specs).better} // FIXED 2: Correct function execution
	// 									/>
	// 								}
	// 								fileName={`Bathroom-Estimate.pdf`}
	// 								className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md"
	// 							>
	// 								{({ loading }) =>
	// 									loading ? (
	// 										'Compiling PDF...'
	// 									) : (
	// 										<>
	// 											<DownloadCloud className="w-4 h-4" />
	// 											Download Official PDF Quote
	// 										</>
	// 									)
	// 								}
	// 							</PDFDownloadLink>
	// 						</div>
	// 					)}
	// 					<button
	// 						onClick={resetEstimator}
	// 						className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
	// 					>
	// 						Scan another bathroom
	// 					</button>
	// 				</div>
	// 			)}
	// 		</div>
	// 	);
	// }
	// function PriceTier({ title, price, desc, featured = false }: any) {
	// 	return (
	// 		<div
	// 			className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all ${
	// 				featured
	// 					? 'border-blue-500 ring-2 ring-blue-500/10 shadow-md'
	// 					: 'border-slate-200'
	// 			}`}
	// 		>
	// 			<div>
	// 				<div className="flex items-center gap-2">
	// 					<h3 className="font-bold text-lg text-slate-900">{title}</h3>
	// 					{featured && (
	// 						<span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
	// 							RECOMMENDED
	// 						</span>
	// 					)}
	// 				</div>
	// 				<p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
	// 					{desc}
	// 				</p>
	// 			</div>
	// 			<div className="text-right">
	// 				<p className="text-2xl font-black text-slate-900">{price}</p>
	// 			</div>
	// 		</div>
	// );
}
