"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * KPI-Karte mit Anzahl (z. B. "4 externe Dienstleister"), die auf Klick/Tap
 * die konkrete Liste einblendet. Auf hover-fähigen Geräten öffnet sie
 * zusätzlich bei Mouseover — erkannt über `(hover: hover)`, siehe
 * DESIGN.md §10 (derselbe Media-Feature-Ansatz wie der Nav-Breakpoint der
 * Quellseite). Auf Touch bleibt reines Tap-to-expand (Klick), siehe
 * Abstimmung zur Mobile-Darstellung.
 */
export function PeopleCountCard({
  label,
  count,
  unitLabel,
  children,
  className,
}: {
  label: string;
  count: number;
  unitLabel: string;
  children: ReactNode;
  className?: string;
}) {
  // Zwei getrennte Zustände statt einem: Hover und Klick/Tap dürfen sich nicht
  // gegenseitig überschreiben. Ohne die Trennung öffnet Hover die Karte, und
  // der Klick, den z. B. Playwright/eine Maus beim "Klicken" technisch immer
  // zuerst als Hover ausführt, schaltet sie im selben Zug wieder zu.
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const open = hoverOpen || pinnedOpen;
  const [canHover, setCanHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinnedOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className={cn("relative border border-plan-black/15 p-4", className)}
      onMouseEnter={canHover ? () => setHoverOpen(true) : undefined}
      onMouseLeave={canHover ? () => setHoverOpen(false) : undefined}
    >
      <button
        type="button"
        onClick={() => setPinnedOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left"
      >
        <p className="text-sm text-slate-gray">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-plan-black">
          {count} <span className="font-sans text-sm font-normal text-slate-gray">{unitLabel}</span>
        </p>
        <p className="mt-1 text-xs nav-lowercase text-ci">{open ? "schließen" : "details anzeigen"}</p>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 border border-plan-black bg-sheet-white p-3 text-xs">
          {children}
        </div>
      )}
    </div>
  );
}
