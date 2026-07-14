import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col px-6 py-8">
      <h1 className="mb-4 text-xl font-semibold">HRWIKI Chat</h1>
      <ChatWindow />
    </main>
  );
}
