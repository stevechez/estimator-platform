import clsx from 'clsx';

type BuildrailLogoProps = {
	size?: number;
	showWordmark?: boolean;
	className?: string;
};

export function BuildrailLogo({
	size = 40,
	showWordmark = true,
	className,
}: BuildrailLogoProps) {
	return (
		<div className={clsx('inline-flex items-center gap-3 sm:gap-4', className)}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="shrink-0"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="buildrail-gold" x1="8" y1="8" x2="56" y2="56">
						<stop offset="0%" stopColor="#FCD34D" />
						<stop offset="55%" stopColor="#F59E0B" />
						<stop offset="100%" stopColor="#EA580C" />
					</linearGradient>
				</defs>

				{/* rails / connections */}
				<path
					d="M18 18L31 12L45 20L50 35L40 49L24 47L14 33L18 18Z"
					stroke="url(#buildrail-gold)"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity="0.95"
				/>
				<path
					d="M31 12L24 47"
					stroke="url(#buildrail-gold)"
					strokeWidth="3"
					strokeLinecap="round"
				/>
				<path
					d="M18 18L40 49"
					stroke="url(#buildrail-gold)"
					strokeWidth="3"
					strokeLinecap="round"
					opacity="0.9"
				/>
				<path
					d="M14 33L50 35"
					stroke="url(#buildrail-gold)"
					strokeWidth="3"
					strokeLinecap="round"
					opacity="0.9"
				/>

				{/* nodes */}
				<circle cx="18" cy="18" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="31" cy="12" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="45" cy="20" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="50" cy="35" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="40" cy="49" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="24" cy="47" r="5.5" fill="url(#buildrail-gold)" />
				<circle cx="14" cy="33" r="5.5" fill="url(#buildrail-gold)" />

				{/* subtle center node for “memory core” */}
				<circle
					cx="31"
					cy="31"
					r="4.5"
					fill="#0A0A0A"
					stroke="url(#buildrail-gold)"
					strokeWidth="2.5"
				/>
			</svg>

			{showWordmark && (
				<span className="text-[1.55rem] font-black tracking-[-0.04em] text-white sm:text-[1.75rem]">
					BUILDRAIL
				</span>
			)}
		</div>
	);
}
