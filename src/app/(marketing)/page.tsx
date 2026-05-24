import dynamic from 'next/dynamic';
import HeroSection from '@/components/marketing/HeroSection';
import { Inter_Tight } from 'next/font/google';

const displayFont = Inter_Tight({
	subsets: ['latin'],
	weight: ['700', '800', '900'],
	variable: '--font-display',
});

export const metadata = {
	title: 'BUILDRAIL | The Project Brain for Residential Contractors',
	description:
		'BUILDRAIL turns walkthroughs, voice notes, photos, emails, and field details into project memory, proposal drafts, reusable scope language, crew briefings, and homeowner updates.',
};

const MemorySection = dynamic(
	() => import('@/components/marketing/MemorySection'),
);

const WorkflowSection = dynamic(
	() => import('@/components/marketing/WorkflowSection'),
);

const ScopeMemorySection = dynamic(
	() => import('@/components/marketing/ScopeMemorySection'),
);

const WhyItWinsSection = dynamic(
	() => import('@/components/marketing/WhyItWinsSection'),
);

const TrialSection = dynamic(
	() => import('@/components/marketing/TrialSection'),
);

const FooterSection = dynamic(
	() => import('@/components/marketing/FooterSection'),
);

export default function GlobalLandingPage() {
	return (
		<div
			id="top"
			className={`${displayFont.variable} min-h-screen overflow-hidden bg-[#050505] text-slate-100`}
		>
			<HeroSection />
			<MemorySection />
			<WorkflowSection />
			<ScopeMemorySection />
			<WhyItWinsSection />
			<TrialSection />
			<FooterSection />
		</div>
	);
}
