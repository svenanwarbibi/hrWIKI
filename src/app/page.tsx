import type { ExecutiveSummary, KpiResponse } from "@/types";
import { KpiGrid } from "@/components/kpi/KpiGrid";

async function getExecutiveSummary(): Promise<ExecutiveSummary> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/executive-summary`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

async function getKpis(): Promise<KpiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/kpis`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function HomePage() {
  const [summary, kpis] = await Promise.all([getExecutiveSummary(), getKpis()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section>
        <h1 className="text-2xl font-semibold">{summary.headline}</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">{summary.body}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {summary.highlights.map((h) => (
            <li key={h} className="rounded-full border px-3 py-1 text-sm">
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-medium">KPIs</h2>
        <KpiGrid kpis={kpis.kpis} />
      </section>
    </main>
  );
}
