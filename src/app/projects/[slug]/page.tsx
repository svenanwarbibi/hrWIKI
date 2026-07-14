import { notFound } from "next/navigation";
import { ExecutiveSummarySection } from "@/components/project/ExecutiveSummarySection";
import { ProjectMetaKpis } from "@/components/project/ProjectMetaKpis";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getProjectBySlug } from "@/lib/data/projects";

export const revalidate = 300;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <h1 className="font-display text-3xl font-bold text-plan-black">{project.title}</h1>

      <section className="mt-10">
        <h2 className="text-sm nav-lowercase text-slate-gray">Executive Summary</h2>
        <ExecutiveSummarySection summary={project.executiveSummary} />
      </section>

      <section className="mt-12">
        <h2 className="text-sm nav-lowercase text-slate-gray">Kennzahlen</h2>
        <ProjectMetaKpis kpis={project.kpis} />
      </section>

      <section className="mt-12 flex h-[32rem] flex-col">
        <h2 className="text-sm nav-lowercase text-slate-gray">Chat</h2>
        <div className="mt-4 flex flex-1 flex-col overflow-hidden">
          <ChatWindow projectId={project.id} />
        </div>
      </section>
    </main>
  );
}
