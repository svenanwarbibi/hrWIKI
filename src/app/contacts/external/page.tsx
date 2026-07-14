import type { ContactsResponse, ExternalContact } from "@/types";
import { ContactCard } from "@/components/contacts/ContactCard";
import { callN8nWebhook } from "@/lib/n8n";

// force-dynamic: Server Components dürfen nicht ihre eigene Route per
// relativer URL fetchen (bricht beim Build, siehe api/executive-summary/route.ts)
// — daher direkter n8n-Aufruf statt Round-Trip über /api/contacts.
export const dynamic = "force-dynamic";

async function getExternalContacts(): Promise<ContactsResponse> {
  const res = await callN8nWebhook("/webhook/contacts?type=external");
  return res.json();
}

export default async function ExternalContactsPage() {
  const { contacts } = await getExternalContacts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-xl font-semibold">Externe Ansprechpartner</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(contacts as ExternalContact[]).map((c) => (
          <ContactCard key={c.id} contact={c} />
        ))}
      </div>
    </main>
  );
}
