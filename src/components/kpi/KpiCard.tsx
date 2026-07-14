import type { Kpi } from "@/types";
import { cn } from "@/lib/utils";

const trendColor: Record<Kpi["trend"], string> = {
  up: "text-emerald-600",
  down: "text-red-600",
  flat: "text-neutral-500",
};

const trendSymbol: Record<Kpi["trend"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-neutral-500">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold">
        {kpi.value.toLocaleString("de-DE")} <span className="text-sm font-normal">{kpi.unit}</span>
      </p>
      <p className={cn("mt-1 text-sm", trendColor[kpi.trend])}>
        {trendSymbol[kpi.trend]} {kpi.changePct}% · {kpi.period}
      </p>
    </div>
  );
}
