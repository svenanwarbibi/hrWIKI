import type { Kpi } from "@/types";
import { KpiCard } from "./KpiCard";

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  if (kpis.length === 0) {
    return <p className="mt-4 text-sm text-neutral-500">Keine KPIs für diesen Zeitraum.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
