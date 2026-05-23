import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Calendar, ArrowRight } from 'lucide-react';
import CopilotHUD from '@/components/walkthrough/CopilotHUD';

type PageProps = {
	params: {
		projectId: string;
	};
};

export default async function DashboardPage({ params }: PageProps) {
	const cookieStore = await cookies();
	const projectId = params.projectId;

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
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

	// Fetch all projects for this user, newest first
	const { data: projects, error } = await supabase
		.from('projects')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching projects:', error);
	}

	return (
		<div className="min-h-screen bg-[#0A0A0A] text-slate-100 antialiased p-6 md:p-12">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Header */}
				<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight text-white">
							Walkthroughs
						</h1>
						<p className="text-slate-400 text-sm mt-1">
							Manage your site visits and estimate drafts.
						</p>
					</div>

					<Link
						href="/dashboard/new"
						className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
					>
						<Plus className="w-4 h-4" />
						New Walkthrough
					</Link>
				</header>
				<CopilotHUD projectId={projectId} />

				{/* Projects Grid */}
				{projects && projects.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{projects.map(project => (
							<Link
								key={project.id}
								href={`/dashboard/${project.id}/review`}
								className="block bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all rounded-2xl p-6 group"
							>
								<div className="flex justify-between items-start mb-4">
									<div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
										<FileText className="w-5 h-5" />
									</div>
									<span className="text-xs font-medium px-2.5 py-1 bg-white/5 text-slate-300 rounded-full">
										{project.status === 'draft' ? 'Draft' : project.status}
									</span>
								</div>

								<h3 className="text-lg font-medium text-white truncate mb-1">
									{project.customer_name}
								</h3>
								<p className="text-sm text-slate-400 mb-6">
									{project.project_type}
								</p>

								<div className="flex items-center justify-between text-xs text-slate-500 mt-auto border-t border-white/5 pt-4">
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5" />
										{new Date(project.created_at).toLocaleDateString()}
									</div>
									<ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
								</div>
							</Link>
						))}
					</div>
				) : (
					/* Empty State */
					<div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center space-y-4">
						<div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
							<FileText className="w-8 h-8" />
						</div>
						<h3 className="text-xl font-medium text-white">
							No walkthroughs yet
						</h3>
						<p className="text-slate-400 max-w-sm mx-auto">
							Create your first project and record a walkthrough to see the AI
							structuring in action.
						</p>
						<div className="pt-4">
							<Link
								href="/dashboard/new"
								className="inline-flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-medium transition-all"
							>
								Start First Walkthrough
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
