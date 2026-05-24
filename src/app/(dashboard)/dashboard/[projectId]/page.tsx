import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
	ArrowLeft,
	Camera,
	FileText,
	Home,
	MessageSquare,
	Users,
} from 'lucide-react';
import CopilotHUD from '@/components/walkthrough/CopilotHUD';
import HomeownerUpdateUI from '@/components/communication/HomeownerUpdateUI';
import CrewBriefingUI from '@/components/operational/CrewBriefingUI';

type PageProps = {
	params: Promise<{
		projectId: string;
	}>;
};

export default async function ProjectDashboardPage({ params }: PageProps) {
	const { projectId } = await params;
	const cookieStore = await cookies();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
			},
		},
	);

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect('/login');
	}

	const { data: project, error: projectError } = await supabase
		.from('projects')
		.select(
			'id, user_id, customer_name, address, project_type, status, created_at',
		)
		.eq('id', projectId)
		.eq('user_id', user.id)
		.single();

	if (projectError || !project) {
		redirect('/dashboard');
	}

	return (
		<div className="min-h-screen bg-[#0A0A0A] p-6 text-slate-100 antialiased md:p-10">
			<div className="mx-auto max-w-7xl space-y-8">
				<header className="flex flex-col gap-6 border-b border-white/5 pb-8 lg:flex-row lg:items-start lg:justify-between">
					<div className="space-y-4">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to projects
						</Link>

						<div>
							<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
								<Home className="h-3.5 w-3.5" />
								Project Workspace
							</div>

							<h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
								{project.customer_name}
							</h1>

							<div className="mt-3 space-y-1 text-sm text-slate-400">
								<p>{project.project_type}</p>
								<p>{project.address || 'Address TBD'}</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row">
						<Link
							href={`/dashboard/${project.id}/capture`}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
						>
							<Camera className="h-4 w-4" />
							Capture Walkthrough
						</Link>

						<Link
							href={`/dashboard/${project.id}/review`}
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
						>
							<FileText className="h-4 w-4" />
							Review Proposal
						</Link>
					</div>
				</header>

				<CopilotHUD projectId={project.id} />

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
					<section className="space-y-6">
						<div className="rounded-3xl border border-white/5 bg-white/[0.025] p-5">
							<div className="mb-5 flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
									<MessageSquare className="h-5 w-5" />
								</div>

								<div>
									<h2 className="text-lg font-semibold text-white">
										Homeowner Update
									</h2>
									<p className="text-sm text-slate-500">
										Generate a homeowner-ready message from project memory.
									</p>
								</div>
							</div>

							<HomeownerUpdateUI projectId={project.id} />
						</div>
					</section>

					<section className="space-y-6">
						<div className="rounded-3xl border border-white/5 bg-white/[0.025] p-5">
							<div className="mb-5 flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
									<Users className="h-5 w-5" />
								</div>

								<div>
									<h2 className="text-lg font-semibold text-white">
										Crew Briefing
									</h2>
									<p className="text-sm text-slate-500">
										Create a field-ready handoff from saved project context.
									</p>
								</div>
							</div>

							<CrewBriefingUI projectId={project.id} />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
