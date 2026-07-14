import { getProjectBySlug } from "@/lib/data/projects";

// force-dynamic statt revalidate, siehe Kommentar in api/executive-summary/route.ts
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: `Projekt "${slug}" nicht gefunden.` } },
      { status: 404 },
    );
  }

  return Response.json(project);
}
