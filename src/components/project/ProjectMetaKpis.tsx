import type { ProjectKpis } from "@/types";
import { PeopleCountCard } from "./PeopleCountCard";

const dateFormatter = new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "long", day: "numeric" });

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function BudgetCard({ budget }: { budget: ProjectKpis["budget"] }) {
  const delta =
    budget.actual !== null ? ((budget.actual - budget.plan) / budget.plan) * 100 : null;

  return (
    <div className="border border-plan-black/15 p-4">
      <p className="text-sm text-slate-gray">Budget</p>
      <dl className="mt-1 space-y-1">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-slate-gray">Plan</dt>
          <dd className="font-display text-lg font-bold text-plan-black">
            {formatCurrency(budget.plan, budget.currency)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-slate-gray">Ist</dt>
          <dd className="font-display text-lg font-bold text-plan-black">
            {budget.actual !== null ? formatCurrency(budget.actual, budget.currency) : "noch offen"}
          </dd>
        </div>
      </dl>
      {delta !== null && (
        <p className="mt-2 text-sm text-slate-gray">
          Abweichung: {delta > 0 ? "+" : ""}
          {delta.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export function ProjectMetaKpis({ kpis }: { kpis: ProjectKpis }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="border border-plan-black/15 p-4">
        <p className="text-sm text-slate-gray">Auftraggeber / Bauherr</p>
        <p className="mt-1 font-display text-lg font-bold text-plan-black">{kpis.client}</p>
      </div>

      <div className="border border-plan-black/15 p-4">
        <p className="text-sm text-slate-gray">Zeitraum</p>
        <p className="mt-1 text-sm text-plan-black">
          {formatDate(kpis.startDate)}
          <br />
          bis {formatDate(kpis.endDate)}
        </p>
      </div>

      <BudgetCard budget={kpis.budget} />

      <PeopleCountCard label="Externe Dienstleister" count={kpis.externalProviders.length} unitLabel="beteiligt">
        <ul className="space-y-2">
          {kpis.externalProviders.map((p) => (
            <li key={p.id}>
              <p className="font-medium text-plan-black">{p.name}</p>
              <p className="text-slate-gray">{p.category}</p>
              <p className="text-slate-gray">{p.address}</p>
            </li>
          ))}
        </ul>
      </PeopleCountCard>

      <PeopleCountCard label="Interne Mitarbeitende" count={kpis.internalStaff.length} unitLabel="beteiligt">
        <ul className="space-y-2">
          {kpis.internalStaff.map((s) => (
            <li key={s.id}>
              <p className="font-medium text-plan-black">{s.name}</p>
              <p className="text-slate-gray">{s.role}</p>
            </li>
          ))}
        </ul>
      </PeopleCountCard>
    </div>
  );
}
