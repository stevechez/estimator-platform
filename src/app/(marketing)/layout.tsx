// app/(marketing)/layout.tsx
import Navbar from '@/components/Navbar';

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<div className="pt-16 flex-1 flex flex-col">{children}</div>
		</>
	);
}
