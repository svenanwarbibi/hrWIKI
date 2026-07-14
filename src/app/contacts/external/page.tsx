import type { ContactsResponse, ExternalContact } from "@/types";
import { ContactCard } from "@/components/contacts/ContactCard";

async function getExternalContacts(): Promise<ContactsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/contacts?type=external`,
    { next: { revalidate: 900 } },
  );
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
