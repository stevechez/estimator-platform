// src/components/PriceTier.tsx
import React from 'react';

interface PriceTierProps {
	title: string;
	price: string;
	desc: string;
	color: string;
	featured?: boolean;
}

export default function PriceTier({
	title,
	price,
	desc,
	color,
	featured = false,
}: PriceTierProps) {
	return (
		<div
			className={`p-6 bg-white border rounded-2xl flex justify-between items-center transition-all hover:shadow-md ${color}`}
		>
			<div>
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-xl text-slate-900">{title}</h3>
					{featured && (
						<span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
							MOST POPULAR
						</span>
					)}
				</div>
				<p className="text-sm text-slate-500 mt-1">{desc}</p>
			</div>
			<div className="text-right">
				<p className="text-3xl font-black text-slate-900">{price}</p>
				<p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
					Full Install
				</p>
			</div>
		</div>
	);
}
