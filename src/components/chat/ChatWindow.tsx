"use client";

import { useState, type FormEvent } from "react";
import { MessageBubble, type ChatMessage } from "./MessageBubble";

export function ChatWindow({ projectId }: { projectId: string }) {
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "loading" | "error">("ready");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("loading");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, sessionId, message: text }),
      });

      if (!res.ok) throw new Error("upstream error");

      const data = (await res.json()) as { message: string };
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: data.message }]);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  const isBusy = status === "loading";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-slate-gray">
            Stell eine Frage zu diesem Projekt — die Antwort stützt sich ausschließlich auf hinterlegte
            Projektdokumente und zeigt ihre Quellen.
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isBusy && <p className="text-sm text-slate-gray">wird beantwortet …</p>}
        {status === "error" && (
          <p className="text-sm text-slate-gray">
            Der Chat ist gerade nicht erreichbar. Bitte später erneut versuchen.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 border-t border-plan-black/15 pt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Frage zum Projekt stellen …"
          className="flex-1 border border-plan-black/20 bg-transparent px-3 py-2 text-sm text-plan-black outline-none focus:border-ci"
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="border border-plan-black px-4 py-2 text-sm nav-lowercase text-plan-black transition-colors hover:bg-plan-black hover:text-sheet-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-plan-black"
        >
          senden
        </button>
      </form>
    </div>
  );
}
