import { getProjects } from "@/lib/data/projects";
import type { ProjectListResponse } from "@/types";

// force-dynamic statt revalidate: verhindert, dass Next.js diese Route beim
// Build statisch prerendert (relevant, sobald getProjects() n8n statt
// Mockdaten aufruft — siehe Kommentar in api/executive-summary/route.ts).
export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await getProjects();
  const body: ProjectListResponse = { updatedAt: new Date().toISOString(), projects };
  return Response.json(body);
}
