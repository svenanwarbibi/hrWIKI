import type { Project, ProjectSummary } from "@/types";

/**
 * KPIs und Projektanten/Mitarbeitende hier sind aus dem echten n8n-Chat-
 * Workflow extrahiert (echte Projektdokumente von hirner & riehl, Gebäude
 * "FLG Planegg – Erweiterungsbau") — nicht erfunden. Felder, die in den
 * Dokumenten nicht explizit belegt sind (Auftraggeber, Zeitraum, Budget),
 * sind bewusst `null` statt geraten. Ersetzt durch einen echten
 * `GET /webhook/project`-Aufruf, sobald der stünde (siehe
 * src/lib/data/projects.ts). Die Executive Summary unten ist weiterhin
 * Platzhaltertext, noch nicht aus den Dokumenten extrahiert.
 */

export const MOCK_PROJECT: Project = {
  id: "flg-planegg",
  slug: "flg-planegg",
  title: "FLG Planegg – Erweiterungsbau",
  updatedAt: "2026-07-01T09:00:00Z",
  executiveSummary: {
    aufgabe:
      "Erweiterung und energetische Sanierung des Gymnasiums Planegg um zusätzliche Klassen- und Fachräume sowie eine neue Mensa, bei laufendem Schulbetrieb.",
    herausforderungen:
      "Bauen im laufenden Betrieb, denkmalrechtliche Auflagen am Bestandsbau der 1970er Jahre, verdichteter Baustellenzugang durch angrenzende Wohnbebauung.",
    ergebnis:
      "Fertigstellung von 12 neuen Klassenräumen, einer Mensa für 300 Personen und einer auf Passivhaus-Niveau sanierten Fassade; Übergabe drei Monate vor Fertigstellungstermin des Fachplaners.",
  },
  kpis: {
    // Kein Auftraggeber namentlich in den Dokumenten genannt — nur ein
    // Verteiler-Kontakt (muhr@planegg.de) als Hinweis, siehe Chat-Beleg.
    client: null,
    startDate: null,
    endDate: null,
    budget: null,
    externalProviders: [
      {
        id: "ep-001",
        name: "Zimmerei - Holzbau Schiller GmbH & Co.KG",
        category: "Zimmerei / Holzbau",
        address: "Oberfeld 2, 94259 Kirchberg i. W.",
      },
    ],
    internalStaff: [
      { id: "is-001", name: "Herr Marschner", role: "Bauleitung" },
      { id: "is-002", name: "Frau Bawej", role: "Bauleitung" },
      { id: "is-003", name: "Herr Brodbeck", role: null },
    ],
  },
};

// Bewusst weiterhin fiktive Platzhalter für die Übersichtsliste (siehe
// Abstimmung) — nur MOCK_PROJECT oben ist aus echten Dokumenten belegt.
export const MOCK_PROJECT_LIST: ProjectSummary[] = [
  {
    id: "flg-planegg",
    slug: "flg-planegg",
    title: "FLG Planegg – Erweiterungsbau",
    client: null,
    category: "bildung",
    status: "in_progress",
  },
  {
    id: "erweiterungsbau-fos-bos-rosenheim",
    slug: "erweiterungsbau-fos-bos-rosenheim",
    title: "Erweiterungsbau FOS BOS Rosenheim",
    client: "Freistaat Bayern",
    category: "bildung",
    status: "completed",
  },
  {
    id: "wohnanlage-nymphenburger-hoefe",
    slug: "wohnanlage-nymphenburger-hoefe",
    title: "Wohnanlage Nymphenburger Höfe",
    client: "Städtische Wohnungsbaugesellschaft München",
    category: "wohnen",
    status: "planned",
  },
  {
    id: "rathaus-sanierung-graefelfing",
    slug: "rathaus-sanierung-graefelfing",
    title: "Rathaus-Sanierung Gräfelfing",
    client: "Gemeinde Gräfelfing",
    category: "verwaltung",
    status: "in_progress",
  },
];
