import type { UIMessage } from "ai";
import type { ChatSource } from "@/types";

/**
 * Liest sources aus dem 'data' Teil der Message, den n8n am Ende des
 * Streams sendet (siehe docs/data-contract.md, Abschnitt 1).
 */
export function SourceCitation({ message }: { message: UIMessage }) {
  const sourcesPart = message.parts.find(
    (p): p is { type: "data-sources"; data: { sources: ChatSource[] } } =>
      p.type === "data-sources",
  );

  if (!sourcesPart || sourcesPart.data.sources.length === 0) return null;

  return (
    <ul className="mt-2 space-y-1 border-t border-plan-black/10 pt-2 text-xs text-slate-gray">
      {sourcesPart.data.sources.map((s) => (
        <li key={s.documentId}>
          <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-ci">
            {s.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
