import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, LifeBuoy, MessageCircle, Rocket, Search, Video } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/app/help")({
  head: () => ({
    meta: [
      { title: "Help Center — ClientHub CRM" },
      { name: "description", content: "Guides, FAQs and support resources for getting the most out of ClientHub." },
      { property: "og:title", content: "Help Center — ClientHub CRM" },
      { property: "og:description", content: "Guides, FAQs and support resources for ClientHub." },
      { property: "og:url", content: "/app/help" },
    ],
    links: [{ rel: "canonical", href: "/app/help" }],
  }),
  component: HelpPage,
});

const topics = [
  { icon: Rocket, title: "Getting started", body: "Set up your workspace, import accounts and invite your first teammates." },
  { icon: BookOpen, title: "Pipeline playbooks", body: "Design stages, probabilities and exit criteria that match your sales motion." },
  { icon: Video, title: "Video walkthroughs", body: "Ten short videos covering every module from leads to forecasting." },
  { icon: MessageCircle, title: "Talk to support", body: "Reach a human in under an hour on Growth and Enterprise plans." },
];

const faqs = [
  { q: "How do I move a deal between pipeline stages?", a: "Open the Pipeline page and drag the opportunity card into the target column. The weighted forecast recalculates instantly." },
  { q: "Can I reassign a lead to another rep?", a: "Yes — on the Leads page, use the owner dropdown on any lead card to reassign it. The new owner is notified." },
  { q: "Where do I change light or dark mode?", a: "Settings → Appearance, or use the sun/moon button in the top bar. Your choice is remembered on this device." },
  { q: "Does the demo data reset?", a: "Yes. Records you add or edit live in memory for the session; refreshing restores the seeded dataset." },
  { q: "How is search shortcut triggered?", a: "Press ⌘K (Ctrl+K on Windows) anywhere in the app to open global search across customers, leads, tasks and pages." },
];

function HelpPage() {
  const [query, setQuery] = useState("");
  const filtered = faqs.filter((f) => !query || (f.q + f.a).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Help Center" description="Guides, answers and support for your team" />

      <section className="card-surface relative overflow-hidden p-8 text-center">
        <div className="absolute inset-0 hero-glow opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-xl">
          <LifeBuoy className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 text-xl font-bold">How can we help?</h2>
          <div className="relative mt-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-11 pl-9" placeholder="Search the knowledge base…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topics.map((t) => (
          <article key={t.title} className="card-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-3.5 text-sm font-semibold">{t.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
          </article>
        ))}
      </div>

      <section className="card-surface p-6">
        <h2 className="text-base font-semibold">Frequently asked questions</h2>
        {filtered.length ? (
          <Accordion type="single" collapsible className="mt-3">
            {filtered.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="No articles matched"
              description="Try a different phrase, or browse the topics above."
              action={<Button variant="outline" onClick={() => setQuery("")}>Clear search</Button>}
            />
          </div>
        )}
      </section>

      <section className="card-surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Still stuck?</h2>
          <p className="text-sm text-muted-foreground">Our team replies within one business day.</p>
        </div>
        <Button asChild>
          <Link to="/" hash="contact">Contact support</Link>
        </Button>
      </section>
    </div>
  );
}
