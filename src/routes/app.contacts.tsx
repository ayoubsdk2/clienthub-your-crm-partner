import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Mail, MessageSquare, Phone, Search } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contacts, formatDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — ClientHub CRM" },
      { name: "description", content: "Every person you work with, plus their full communication history." },
      { property: "og:title", content: "Contacts — ClientHub CRM" },
      { property: "og:description", content: "Every person you work with, plus their full communication history." },
      { property: "og:url", content: "/app/contacts" },
    ],
    links: [{ rel: "canonical", href: "/app/contacts" }],
  }),
  component: ContactsPage,
});

const typeIcon = { Email: Mail, Call: Phone, Meeting: Calendar, Note: MessageSquare };

function ContactsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(contacts[0]!.id);

  const filtered = contacts.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = contacts.find((c) => c.id === selectedId) ?? filtered[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description={`${contacts.length} people across ${new Set(contacts.map((c) => c.company)).size} accounts`} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <section className="card-surface flex flex-col overflow-hidden p-0">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search contacts…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <ul className="max-h-[560px] divide-y divide-border overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/40",
                    selected?.id === c.id && "bg-primary/8",
                  )}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary">
                    {c.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{c.company}</span>
                  </span>
                  <span className="shrink-0 text-[0.65rem] text-muted-foreground">{formatDate(c.lastTouch)}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted-foreground">No contacts found.</li>}
          </ul>
        </section>

        {selected && (
          <section className="space-y-5">
            <div className="card-surface p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {selected.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold">{selected.name}</h2>
                    <p className="truncate text-sm text-muted-foreground">
                      {selected.title} · {selected.company}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  Last touch {formatDate(selected.lastTouch)}
                </Badge>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent/40">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{selected.email}</span>
                </a>
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent/40">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{selected.phone}</span>
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm">Log activity</Button>
                <Button size="sm" variant="outline">Schedule meeting</Button>
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="text-base font-semibold">Communication history</h3>
              <ol className="mt-5 space-y-5">
                {selected.history.map((h) => {
                  const Icon = typeIcon[h.type];
                  return (
                    <li key={h.id} className="relative flex gap-4 pb-5 last:pb-0">
                      <span className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-border last:hidden" />
                      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">{h.type}</p>
                          <span className="text-xs text-muted-foreground">{formatDate(h.date)}</span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.summary}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
