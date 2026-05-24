// app/(marketing)/layout.tsx

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="pt-16 flex-1 flex flex-col">{children}</div>
		</>
	);
}
