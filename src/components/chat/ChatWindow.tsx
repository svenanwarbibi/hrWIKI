"use client";

import { useChat } from "@ai-sdk/react";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {status === "streaming" && (
          <p className="text-sm text-neutral-400">HRWIKI denkt nach …</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 border-t pt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Frage zu HR-Themen stellen …"
          className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <button
          type="submit"
          disabled={status === "streaming"}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Senden
        </button>
      </form>
    </div>
  );
}
