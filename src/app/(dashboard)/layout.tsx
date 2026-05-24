'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
	FolderGit2,
	LogOut,
	ShieldCheck,
	User,
	LayoutDashboard,
	PlusCircle,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push('/login');
		router.refresh();
	};

	const navigationItems = [
		{
			name: 'Projects',
			href: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			name: 'New Project',
			href: '/dashboard/new',
			icon: PlusCircle,
		},
	];

	return (
		<div className="flex min-h-screen bg-slate-950">
			<aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-900 bg-[#070a13] lg:flex">
				<div className="space-y-8 p-6">
					<Link href="/dashboard" className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
							<FolderGit2 className="h-4 w-4" />
						</div>

						<div>
							<span className="block text-sm font-black tracking-wider text-white">
								BUILDRAIL
							</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
								Field Trial
							</span>
						</div>
					</Link>

					<nav className="space-y-1.5 pt-4">
						{navigationItems.map(item => {
							const Icon = item.icon;
							const isActive =
								item.href === '/dashboard'
									? pathname === '/dashboard'
									: pathname.startsWith(item.href);

							return (
								<Link
									key={item.name}
									href={item.href}
									className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
										isActive
											? 'border-slate-800 bg-slate-900 text-white shadow-inner'
											: 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
									}`}
								>
									<Icon
										className={`h-4 w-4 ${
											isActive ? 'text-blue-400' : 'text-slate-500'
										}`}
									/>
									{item.name}
								</Link>
							);
						})}
					</nav>

					<div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
						<p className="text-xs font-bold uppercase tracking-widest text-amber-300">
							Trial focus
						</p>
						<p className="mt-2 text-xs leading-5 text-slate-500">
							Walkthrough capture, project memory, proposal review, scope
							memory, crew briefing, and homeowner updates.
						</p>
					</div>
				</div>

				<div className="space-y-2 border-t border-slate-900 bg-[#05070d] p-4">
					<div className="flex items-center gap-3 px-2 py-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300">
							<User className="h-4 w-4" />
						</div>

						<div className="max-w-[140px] truncate">
							<p className="truncate text-xs font-bold text-slate-300">
								Contractor Admin
							</p>
							<span className="flex items-center gap-0.5 truncate font-mono text-[9px] font-bold uppercase tracking-tight text-slate-600">
								<ShieldCheck className="h-3 w-3 text-emerald-500" />
								Active Session
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={handleSignOut}
						className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-xs font-bold text-slate-500 transition-all hover:bg-red-950/20 hover:text-red-400"
					>
						<LogOut className="h-3.5 w-3.5" />
						<span>Sign Out</span>
					</button>
				</div>
			</aside>

			<main className="min-h-screen flex-1 bg-slate-950 lg:pl-64">
				<div className="h-full w-full">{children}</div>
			</main>
		</div>
	);
}
