import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  KanbanSquare,
  Mail,
  Quote,
  Shield,
  Sparkles,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { formatCurrency, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClientHub — The CRM revenue teams actually enjoy" },
      {
        name: "description",
        content:
          "ClientHub unifies pipeline, customers, tasks and revenue analytics in one fast workspace. Explore the live demo with realistic data.",
      },
      { property: "og:title", content: "ClientHub — The CRM revenue teams actually enjoy" },
      {
        property: "og:description",
        content: "ClientHub unifies pipeline, customers, tasks and revenue analytics in one fast workspace. Explore the live demo with realistic data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const features = [
  { icon: KanbanSquare, title: "Visual pipeline", body: "Drag deals across stages, see weighted forecast update instantly, and never lose a follow-up." },
  { icon: Users, title: "360° customer view", body: "Every contact, email, call and renewal date on a single record your whole team can trust." },
  { icon: BarChart3, title: "Revenue analytics", body: "Conversion funnels, monthly attainment and rep leaderboards without exporting a single CSV." },
  { icon: Mail, title: "Email & campaigns", body: "Templates, sequences and campaign performance built into the same workspace as your deals." },
  { icon: Workflow, title: "Task automation", body: "Assign owners, set due dates and let ClientHub nudge the right rep at the right moment." },
  { icon: Shield, title: "Enterprise ready", body: "SSO, granular roles, audit trails and regional data residency for regulated teams." },
];

const plans = [
  {
    name: "Starter",
    price: 19,
    tagline: "For small teams getting organised.",
    features: ["Up to 3 seats", "Contact & lead management", "Visual pipeline", "Email templates", "Community support"],
  },
  {
    name: "Growth",
    price: 49,
    tagline: "For scaling sales organisations.",
    featured: true,
    features: ["Unlimited seats", "Revenue analytics & forecasting", "Campaign dashboard", "Task automation", "Priority support"],
  },
  {
    name: "Enterprise",
    price: 89,
    tagline: "For complex, regulated revenue teams.",
    features: ["Everything in Growth", "SSO & SCIM provisioning", "Custom objects & fields", "Dedicated success manager", "99.9% uptime SLA"],
  },
];

const testimonials = [
  {
    quote: "We replaced three tools with ClientHub. Forecast accuracy went from guesswork to within 4% two quarters running.",
    name: "Elena Marsh",
    role: "VP Operations, Northwind Logistics",
    initials: "EM",
  },
  {
    quote: "Onboarding took an afternoon. Our reps actually log calls now because the interface stays out of the way.",
    name: "Peter Kwon",
    role: "Head of RevOps, Lumen Financial",
    initials: "PK",
  },
  {
    quote: "The pipeline view is the first thing every AE opens. Deal slippage dropped by a third in the first quarter.",
    name: "Marcus Lee",
    role: "CIO, Beacon Health Group",
    initials: "ML",
  },
];

const faqs = [
  { q: "Is this a real product?", a: "ClientHub is a portfolio showcase built to production standards. Every screen runs on realistic mock data held in the browser — there is no backend, no API keys and nothing is sent anywhere." },
  { q: "Can I try the full app?", a: "Yes. Use the demo sign-in on the login page, or create any account — authentication is simulated locally and drops you straight into the dashboard." },
  { q: "Does my data persist?", a: "Changes you make to customers, leads, tasks and the pipeline live in memory for the session. Refreshing restores the seeded demo dataset." },
  { q: "What is it built with?", a: "React 19, TanStack Start and Router, Tailwind CSS v4, Recharts and a fully tokenised design system with light and dark themes." },
  { q: "Can I reuse the code?", a: "Absolutely — the repository is MIT licensed. Clone it, restyle it and wire it to your own backend." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <LogoRow />
        <Features />
        <ProductPreview />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 hero-glow" aria-hidden="true" />
      <div className="absolute inset-0 surface-grid opacity-[0.35]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-rise">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> Q3 release · Forecast intelligence
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              The CRM your revenue team <span className="gradient-text">actually enjoys</span> using.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              ClientHub brings pipeline, customers, activity and forecasting into one fast workspace — so reps
              sell instead of updating records.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group">
                <Link to="/app">
                  Explore live demo
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#product">See the product</a>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7">
              {[
                { k: "Pipeline tracked", v: "$4.8B" },
                { k: "Revenue teams", v: "12,400+" },
                { k: "Avg. forecast accuracy", v: "96%" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xs text-muted-foreground">{s.k}</dt>
                  <dd className="num mt-1 text-xl font-bold sm:text-2xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}

function HeroPanel() {
  const max = Math.max(...revenueSeries.map((r) => r.revenue));
  return (
    <div className="card-surface animate-rise overflow-hidden p-0 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <p className="ml-2 text-xs font-medium text-muted-foreground">ClientHub · Revenue overview</p>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Closed this quarter", value: formatCurrency(1661000, true), delta: "+18.4%" },
            { label: "Open pipeline", value: formatCurrency(615500, true), delta: "+6.1%" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border border-border bg-background/60 p-3.5">
              <p className="text-[0.7rem] text-muted-foreground">{c.label}</p>
              <p className="num mt-1 text-lg font-bold">{c.value}</p>
              <p className="mt-0.5 text-[0.7rem] font-semibold text-success">{c.delta}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-end justify-between">
            <p className="text-xs font-semibold">Monthly revenue</p>
            <p className="text-[0.7rem] text-muted-foreground">Last 12 months</p>
          </div>
          <div className="mt-3 flex h-28 items-end gap-1.5">
            {revenueSeries.map((r) => (
              <div key={r.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-[3px] bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${(r.revenue / max) * 100}%` }}
                />
                <span className="text-[0.55rem] text-muted-foreground">{r.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { n: "Orbital Systems", s: "Negotiation", v: "$128,000" },
            { n: "Delta Grid Energy", s: "Discovery", v: "$88,000" },
            { n: "Brightpath Clinics", s: "Proposal", v: "$61,000" },
          ].map((d) => (
            <div key={d.n} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent/20 text-[0.65rem] font-bold text-accent-foreground">
                {d.n.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{d.n}</p>
                <p className="text-[0.68rem] text-muted-foreground">{d.s}</p>
              </div>
              <p className="num ml-auto text-xs font-semibold">{d.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoRow() {
  const names = ["Northwind", "Lumen Financial", "Beacon Health", "Kestrel Robotics", "Terra Renewables", "Sable & Co"];
  return (
    <section className="border-b border-border bg-muted/25 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
        {names.map((n) => (
          <span key={n} className="text-sm font-semibold tracking-tight text-muted-foreground/70">
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{body}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything a revenue team runs on"
          body="Purpose-built modules that replace the spreadsheet sprawl between marketing, sales and success."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="card-surface group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section id="product" className="scroll-mt-20 border-b border-border bg-muted/25 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Product tour"
          title="A workspace built for momentum"
          body="Fast keyboard-first navigation, dense but calm layouts, and every record one click away."
        />
        <div className="card-surface mt-14 overflow-hidden p-0 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </div>
            <span className="mx-auto rounded-md border border-border px-3 py-1 text-[0.7rem] text-muted-foreground">
              app.clienthub.io/pipeline
            </span>
          </div>
          <div className="grid gap-4 bg-background p-4 sm:p-6 lg:grid-cols-5">
            {[
              { stage: "Lead In", deals: [["Nova Biotech", "$54,000"], ["Cobalt Interiors", "$26,000"]] },
              { stage: "Discovery", deals: [["Delta Grid", "$88,000"], ["Meridian Foods", "$42,000"]] },
              { stage: "Proposal", deals: [["Brightpath", "$61,000"], ["Summit Outdoor", "$33,500"]] },
              { stage: "Negotiation", deals: [["Orbital Systems", "$128,000"], ["Kestrel API", "$36,000"]] },
              { stage: "Closed Won", deals: [["Vertex Freight", "$74,000"], ["Pinnacle Legal", "$24,000"]] },
            ].map((col) => (
              <div key={col.stage} className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">{col.stage}</p>
                <div className="space-y-2">
                  {col.deals.map(([n, v]) => (
                    <div key={n} className="rounded-lg border border-border bg-card p-3">
                      <p className="truncate text-xs font-semibold">{n}</p>
                      <p className="num mt-1 text-sm font-bold text-primary">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/app/pipeline">
              Open the pipeline <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/app/reports">View reports</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="scroll-mt-20 border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward per-seat pricing"
          body="Every plan includes the full pipeline, unlimited contacts and both light and dark themes."
        />
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Annual · save 20%
          </button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`card-surface relative flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1 ${p.featured ? "border-primary/60 ring-1 ring-primary/30 lg:scale-[1.03]" : ""}`}
            >
              {p.featured && (
                <Badge className="absolute -top-3 left-7 gap-1">
                  <Zap className="h-3 w-3" /> Most popular
                </Badge>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="num mt-6 text-4xl font-extrabold">
                ${annual ? Math.round(p.price * 0.8) : p.price}
                <span className="text-sm font-medium text-muted-foreground"> /seat/mo</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7" variant={p.featured ? "default" : "outline"}>
                <Link to="/register">Start with {p.name}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 border-b border-border bg-muted/25 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Customers"
          title="Trusted by teams closing real revenue"
          body="From 5-person startups to regulated enterprises running thousands of accounts."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card-surface flex flex-col p-7">
              <Quote className="h-6 w-6 text-primary/50" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">“{t.quote}”</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary">
                  {t.initials}
                </span>
                <figcaption className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
                <span className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </span>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" body="Everything you might wonder about this demo." />
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Contact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Talk to the team</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Want a walkthrough of how ClientHub would fit your process? Send a note and we'll respond within one
            business day.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              ["Sales", "sales@clienthub.io"],
              ["Support", "support@clienthub.io"],
              ["Office", "555 Market Street, San Francisco, CA"],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="w-20 shrink-0 font-semibold">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <form
          className="card-surface space-y-4 p-7"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent", { description: "This is a demo form — nothing was transmitted." });
            (e.target as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jordan Blake" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="jordan@company.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea id="message" rows={5} placeholder="Tell us about your team and current stack…" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send message
          </Button>
          <p className="text-center text-xs text-muted-foreground">Demo form — no data is stored or sent.</p>
        </form>
      </div>
    </section>
  );
}
