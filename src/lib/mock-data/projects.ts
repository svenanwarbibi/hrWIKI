import type { Project, ProjectSummary } from "@/types";

/**
 * Platzhalterdaten für den Prototypen. Fiktive Namen/Adressen — ersetzt
 * durch echte Daten aus Supabase, sobald die n8n-Webhooks aus
 * docs/data-contract.md (0a/0b) stehen. Siehe src/lib/data/projects.ts.
 */

export const MOCK_PROJECT: Project = {
  id: "gymnasium-planegg",
  slug: "gymnasium-planegg",
  title: "Gymnasium Planegg",
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
    client: "Gemeinde Planegg",
    startDate: "2023-03-01",
    endDate: "2026-09-30",
    budget: {
      currency: "EUR",
      plan: 18_500_000,
      actual: 19_150_000,
    },
    externalProviders: [
      {
        id: "ep-001",
        name: "Müller Tragwerksplanung GmbH",
        category: "Statik",
        address: "Rosenheimer Str. 12, 81669 München",
      },
      {
        id: "ep-002",
        name: "Ingenieurbüro Fischer",
        category: "TGA",
        address: "Landsberger Str. 88, 80339 München",
      },
      {
        id: "ep-003",
        name: "Freiraum Landschaftsarchitekten PartG",
        category: "Freianlagen",
        address: "Kaiserstraße 5, 80801 München",
      },
      {
        id: "ep-004",
        name: "Dr. Wagner Bauphysik",
        category: "Bauphysik",
        address: "Agnesstraße 20, 80798 München",
      },
    ],
    internalStaff: [
      { id: "is-001", name: "Anna Keller", role: "Projektleitung" },
      { id: "is-002", name: "Tobias Reuter", role: "Bauleitung" },
      { id: "is-003", name: "Lena Vogt", role: "Entwurf" },
    ],
  },
};

export const MOCK_PROJECT_LIST: ProjectSummary[] = [
  {
    id: "gymnasium-planegg",
    slug: "gymnasium-planegg",
    title: "Gymnasium Planegg",
    client: "Gemeinde Planegg",
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
