import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox, Mail, MousePointerClick, Send, Sparkles, Star } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emails } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/email")({
  head: () => ({
    meta: [
      { title: "Email & campaigns — ClientHub CRM" },
      { name: "description", content: "Inbox preview, sent mail, reusable templates and campaign performance." },
      { property: "og:title", content: "Email & campaigns — ClientHub CRM" },
      { property: "og:description", content: "Inbox preview, sent mail, templates and campaign performance." },
      { property: "og:url", content: "/app/email" },
    ],
    links: [{ rel: "canonical", href: "/app/email" }],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [openId, setOpenId] = useState(emails.inbox[0]!.id);
  const open = emails.inbox.find((m) => m.id === openId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email"
        description="Inbox, templates and campaign performance — all mock data"
        actions={
          <Button size="sm">
            <Mail className="mr-1.5 h-4 w-4" /> Compose
          </Button>
        }
      />

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
            <ul className="card-surface divide-y divide-border overflow-hidden p-0">
              {emails.inbox.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setOpenId(m.id)}
                    className={cn("w-full px-4 py-3.5 text-left transition-colors hover:bg-accent/40", openId === m.id && "bg-primary/8")}
                  >
                    <div className="flex items-center gap-2">
                      {m.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      <p className={cn("min-w-0 flex-1 truncate text-sm", m.unread ? "font-bold" : "font-medium")}>{m.from}</p>
                      {m.starred && <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
                      <span className="shrink-0 text-[0.7rem] text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="mt-1 truncate text-sm">{m.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.preview}</p>
                  </button>
                </li>
              ))}
            </ul>

            {open && (
              <article className="card-surface p-6">
                <h2 className="text-lg font-bold">{open.subject}</h2>
                <div className="mt-3 flex items-center gap-3 border-b border-border pb-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {open.from.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{open.from}</p>
                    <p className="truncate text-xs text-muted-foreground">{open.company}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">{open.time}</span>
                </div>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>Hi Alex,</p>
                  <p>{open.preview}</p>
                  <p>
                    Let me know a couple of times that work this week and I'll get the right people on the call. Happy to
                    keep everything in one thread so the wider team stays in the loop.
                  </p>
                  <p>
                    Best,
                    <br />
                    {open.from}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button size="sm">Reply</Button>
                  <Button size="sm" variant="outline">Forward</Button>
                  <Button size="sm" variant="outline">Log to CRM</Button>
                </div>
              </article>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent" className="mt-5">
          <ul className="card-surface divide-y divide-border p-0">
            {emails.sent.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <Send className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    To {m.to} · {m.company} — {m.preview}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{m.time}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="templates" className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {emails.templates.map((t) => (
              <article key={t.id} className="card-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{t.name}</h3>
                    <Badge variant="outline" className="mt-1.5">{t.category}</Badge>
                  </div>
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                </div>
                <dl className="mt-4 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Open rate</dt>
                      <dd className="num font-semibold">{t.opens}%</dd>
                    </div>
                    <Progress value={t.opens} className="mt-1.5 h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Reply rate</dt>
                      <dd className="num font-semibold">{t.replies}%</dd>
                    </div>
                    <Progress value={t.replies} className="mt-1.5 h-1.5" />
                  </div>
                </dl>
                <p className="num mt-4 text-xs text-muted-foreground">{t.uses} sends all-time</p>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { k: "Emails sent", v: "41,900", i: Send },
              { k: "Avg. open rate", v: "41.1%", i: Inbox },
              { k: "Avg. click rate", v: "11.5%", i: MousePointerClick },
              { k: "Replies", v: "1,017", i: Mail },
            ].map((s) => (
              <div key={s.k} className="card-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{s.k}</p>
                  <s.i className="h-4 w-4 text-primary" />
                </div>
                <p className="num mt-2 text-2xl font-bold">{s.v}</p>
              </div>
            ))}
          </div>
          <div className="card-surface overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Campaign</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Sent</th>
                    <th className="px-5 py-3 text-right font-medium">Open rate</th>
                    <th className="px-5 py-3 text-right font-medium">Click rate</th>
                    <th className="px-5 py-3 text-right font-medium">Replies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {emails.campaigns.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3.5 font-medium">{c.name}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                      </td>
                      <td className="num px-5 py-3.5 text-right">{c.sent.toLocaleString()}</td>
                      <td className="num px-5 py-3.5 text-right">{c.openRate}%</td>
                      <td className="num px-5 py-3.5 text-right">{c.clickRate}%</td>
                      <td className="num px-5 py-3.5 text-right">{c.replies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
