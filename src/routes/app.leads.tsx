import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Plus, Search, StickyNote, UserPlus } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrm } from "@/lib/crm-store";
import { formatCurrency, formatDate, leadStatusLabel, reps, type Lead, type LeadStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/leads")({
  head: () => ({
    meta: [
      { title: "Leads — ClientHub CRM" },
      { name: "description", content: "Qualify leads, assign sales reps, track status and capture notes in ClientHub." },
      { property: "og:title", content: "Leads — ClientHub CRM" },
      { property: "og:description", content: "Qualify leads, assign reps, track status and capture notes." },
      { property: "og:url", content: "/app/leads" },
    ],
    links: [{ rel: "canonical", href: "/app/leads" }],
  }),
  component: LeadsPage,
});

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-info/12 text-info",
  contacted: "bg-primary/12 text-primary",
  qualified: "bg-accent/20 text-accent-foreground",
  proposal: "bg-warning/15 text-warning",
  won: "bg-success/12 text-success",
  lost: "bg-destructive/12 text-destructive",
};

function LeadsPage() {
  const { leads, updateLead } = useCrm();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [owner, setOwner] = useState("all");
  const [source, setSource] = useState("all");
  const [noteLead, setNoteLead] = useState<Lead | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))), [leads]);

  const filtered = leads.filter((l) => {
    const q = query.toLowerCase();
    const matches = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    return matches && (status === "all" || l.status === status) && (owner === "all" || l.ownerId === owner) && (source === "all" || l.source === source);
  });

  const pipelineValue = filtered.reduce((s, l) => s + l.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={`${filtered.length} leads · ${formatCurrency(pipelineValue, true)} potential value`}
        actions={
          <Button size="sm" onClick={() => toast.info("Lead capture form", { description: "Demo only — use the pipeline to work existing leads." })}>
            <Plus className="mr-1.5 h-4 w-4" /> New lead
          </Button>
        }
      />

      <div className="card-surface p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,auto)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search leads by name, company or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.keys(leadStatusLabel) as LeadStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{leadStatusLabel[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger className="lg:w-44"><SelectValue placeholder="Owner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reps</SelectItem>
              {reps.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="lg:w-40"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-5 w-5" />}
          title="No leads match those filters"
          description="Adjust the search or filters to widen your results."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatus("all");
                setOwner("all");
                setSource("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lead) => (
            <article key={lead.id} className="card-surface flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {lead.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{lead.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-semibold ${statusStyles[lead.status]}`}>
                  {leadStatusLabel[lead.status]}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Potential value</dt>
                  <dd className="num mt-0.5 text-sm font-bold">{formatCurrency(lead.value)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Lead score</dt>
                  <dd className="num mt-0.5 text-sm font-bold">{lead.score}/100</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Source</dt>
                  <dd className="mt-0.5"><Badge variant="outline">{lead.source}</Badge></dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="mt-0.5">{formatDate(lead.createdAt)}</dd>
                </div>
              </dl>

              <p className="mt-4 line-clamp-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">{lead.notes}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Select value={lead.status} onValueChange={(v) => { updateLead(lead.id, { status: v as LeadStatus }); toast.success("Status updated"); }}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(leadStatusLabel) as LeadStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>{leadStatusLabel[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={lead.ownerId} onValueChange={(v) => { updateLead(lead.id, { ownerId: v }); toast.success("Sales rep assigned"); }}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {reps.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setNoteLead(lead);
                  setNoteDraft(lead.notes);
                }}
              >
                <StickyNote className="mr-1.5 h-4 w-4" /> Notes
              </Button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={!!noteLead} onOpenChange={(o) => !o && setNoteLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Notes — {noteLead?.name}
            </DialogTitle>
            <DialogDescription>Context saved on this lead for the rest of the team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea id="lead-notes" rows={6} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteLead(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (noteLead) updateLead(noteLead.id, { notes: noteDraft });
                toast.success("Note saved");
                setNoteLead(null);
              }}
            >
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
