import { redirect } from "next/navigation";

// HRWIKI ist projektbasiert (siehe docs/data-contract.md) — die Projektübersicht
// unter /projects ist der Einstiegspunkt, keine separate generische Startseite.
export default function RootPage() {
  redirect("/projects");
}
