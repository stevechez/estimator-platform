import GcEstimator from '@/components/GcEstimator';

export const metadata = {
	title: 'General Contractor Estimator | BUILDRAIL',
	description:
		'Generate transparent project line-item cost breakdowns instantly.',
};

export default function GcPage() {
	return (
		<main className="min-h-screen bg-slate-50 py-12">
			<GcEstimator />
		</main>
	);
}
