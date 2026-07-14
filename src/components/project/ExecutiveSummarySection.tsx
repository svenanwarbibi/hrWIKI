import type { ProjectExecutiveSummary } from "@/types";

export function ExecutiveSummarySection({ summary }: { summary: ProjectExecutiveSummary }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-3">
      <div>
        <h3 className="text-sm nav-lowercase text-slate-gray">Aufgabe</h3>
        <p className="mt-2 text-base leading-relaxed text-plan-black">{summary.aufgabe}</p>
      </div>
      <div>
        <h3 className="text-sm nav-lowercase text-slate-gray">Herausforderungen</h3>
        <p className="mt-2 text-base leading-relaxed text-plan-black">{summary.herausforderungen}</p>
      </div>
      <div>
        <h3 className="text-sm nav-lowercase text-slate-gray">Ergebnis</h3>
        <p className="mt-2 text-base leading-relaxed text-plan-black">{summary.ergebnis}</p>
      </div>
    </div>
  );
}
