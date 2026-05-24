// app/embed/[tenant_id]/[trade]/page.tsx
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import { createClient } from '@supabase/supabase-js';
import KitchenEstimator from '@/components/KitchenEstimator';
import BathroomEstimator from '@/components/BathroomEstimator';
import GcEstimator from '@/components/GcEstimator';
import HvacEstimator from '@/components/HvacEstimator';
import ElectricalEstimator from '@/components/ElectricalEstimator';

// Matching our component interfaces by making these parameters optional (?)
interface EstimatorProps {
	tenantId?: string;
	multiplier?: number;
}

// Creating the typed assertions
const KitchenEstimatorTyped = KitchenEstimator as ComponentType<EstimatorProps>;
const BathroomEstimatorTyped =
	BathroomEstimator as ComponentType<EstimatorProps>;
const GcEstimatorTyped = GcEstimator as ComponentType<EstimatorProps>;
const HvacEstimatorTyped = HvacEstimator as ComponentType<EstimatorProps>;
const ElectricalEstimatorTyped =
	ElectricalEstimator as ComponentType<EstimatorProps>;

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface EmbedPageProps {
	params: {
		tenant_id: string;
		trade: string;
	};
}

export default async function EmbedPage({ params }: EmbedPageProps) {
	const { tenant_id, trade } = params;

	// 1. Fetch Tenant's specific white-label branding & configurations
	const { data: tenant, error } = await supabase
		.from('tenants')
		.select('id, company_name, primary_color, pricing_multiplier')
		.eq('id', tenant_id)
		.single();

	if (error || !tenant) {
		return notFound(); // Standard safety falloff if tenant ID is invalid
	}

	// 2. Select and mount the requested trade interface dynamically
	const renderEstimator = () => {
		switch (trade.toLowerCase()) {
			case 'kitchen':
				return (
					<KitchenEstimatorTyped
						tenantId={tenant.id}
						multiplier={tenant.pricing_multiplier}
					/>
				);
			case 'bathroom':
				return (
					<BathroomEstimatorTyped
						tenantId={tenant.id}
						multiplier={tenant.pricing_multiplier}
					/>
				);
			case 'general-contractor':
				return (
					<GcEstimatorTyped
						tenantId={tenant.id}
						multiplier={tenant.pricing_multiplier}
					/>
				);
			case 'hvac':
				return (
					<HvacEstimatorTyped
						tenantId={tenant.id}
						multiplier={tenant.pricing_multiplier}
					/>
				);
			case 'electrical':
				return (
					<ElectricalEstimatorTyped
						tenantId={tenant.id}
						multiplier={tenant.pricing_multiplier}
					/>
				);
			default:
				return notFound();
		}
	};

	return (
		<div
			className="min-h-screen bg-transparent p-4"
			style={{ '--brand-primary': tenant.primary_color } as React.CSSProperties}
		>
			{renderEstimator()}
		</div>
	);
}
