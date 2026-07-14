import type { Contact } from "@/types";

export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">{contact.name}</p>
      <p className="text-sm text-neutral-500">{contact.role}</p>
      <p className="text-sm text-neutral-500">
        {contact.type === "internal" ? contact.department : `${contact.company} · ${contact.category}`}
      </p>
      <div className="mt-2 text-sm">
        <a href={`mailto:${contact.email}`} className="underline">
          {contact.email}
        </a>
        <p>{contact.phone}</p>
      </div>
    </div>
  );
}
