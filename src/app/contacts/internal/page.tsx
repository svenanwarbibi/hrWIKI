import type { ContactsResponse, InternalContact } from "@/types";
import { ContactCard } from "@/components/contacts/ContactCard";

async function getInternalContacts(): Promise<ContactsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/contacts?type=internal`,
    { next: { revalidate: 900 } },
  );
  return res.json();
}

export default async function InternalContactsPage() {
  const { contacts } = await getInternalContacts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-xl font-semibold">Interne Ansprechpartner</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(contacts as InternalContact[]).map((c) => (
          <ContactCard key={c.id} contact={c} />
        ))}
      </div>
    </main>
  );
}
