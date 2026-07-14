import Link from "next/link";
import type { ProjectStatus } from "@/types";
import { getProjects } from "@/lib/data/projects";

export const revalidate = 900;

const statusLabel: Record<ProjectStatus, string> = {
  in_progress: "in Bearbeitung",
  completed: "abgeschlossen",
  planned: "in Planung",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <h1 className="font-display text-3xl font-bold text-plan-black">Projekte</h1>

      {projects.length === 0 ? (
        <p className="mt-6 text-sm text-slate-gray">Keine Projekte gefunden.</p>
      ) : (
        <ul className="mt-8 divide-y divide-plan-black/10 border-t border-plan-black/10">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="flex items-center justify-between gap-4 py-5 hover:text-ci"
              >
                <span>
                  <span className="block text-lg font-medium text-plan-black">{p.title}</span>
                  <span className="mt-1 block text-sm text-slate-gray">{p.client}</span>
                </span>
                <span className="shrink-0 text-right text-sm text-slate-gray">
                  <span className="nav-lowercase block">{p.category}</span>
                  <span className="block">{statusLabel[p.status]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
