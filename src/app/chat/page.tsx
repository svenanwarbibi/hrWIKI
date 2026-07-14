import { redirect } from "next/navigation";

// Chat ist jetzt projektgescoped (siehe docs/data-contract.md, Abschnitt 1) und
// lebt auf der jeweiligen Projektseite (/projects/[slug]), nicht mehr generisch.
export default function ChatPage() {
  redirect("/projects");
}
