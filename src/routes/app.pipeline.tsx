import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GripVertical, Info } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { useCrm } from "@/lib/crm-store";
import { formatCurrency, formatDate, repById, stageMeta, type PipelineStage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({
    meta: [
      { title: "Sales pipeline — ClientHub CRM" },
      { name: "description", content: "Drag-and-drop kanban sales pipeline with weighted forecast by stage." },
      { property: "og:title", content: "Sales pipeline — ClientHub CRM" },
      { property: "og:description", content: "Drag-and-drop kanban sales pipeline with weighted forecast by stage." },
      { property: "og:url", content: "/app/pipeline" },
    ],
    links: [{ rel: "canonical", href: "/app/pipeline" }],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const { opportunities, moveOpportunity } = useCrm();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);

  const total = opportunities.filter((o) => o.stage !== "closed_won").reduce((s, o) => s + o.value, 0);
  const weighted = opportunities.reduce((s, o) => s + (o.value * o.probability) / 100, 0);

  const drop = (stage: PipelineStage) => {
    if (dragId) {
      const opp = opportunities.find((o) => o.id === dragId);
      if (opp && opp.stage !== stage) {
        moveOpportunity(dragId, stage);
        toast.success("Deal moved", { description: `${opp.title} → ${stageMeta.find((s) => s.id === stage)?.label}` });
      }
    }
    setDragId(null);
    setOverStage(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales pipeline"
        description={`${formatCurrency(total, true)} open · ${formatCurrency(weighted, true)} weighted forecast`}
        actions={
          <Badge variant="secondary" className="gap-1.5">
            <Info className="h-3.5 w-3.5" /> Drag cards between stages
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {stageMeta.map((stage) => {
          const deals = opportunities.filter((o) => o.stage === stage.id);
          const stageValue = deals.reduce((s, o) => s + o.value, 0);
          return (
            <section
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage.id);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage.id ? null : s))}
              onDrop={() => drop(stage.id)}
              className={cn(
                "flex min-h-[220px] flex-col rounded-xl border border-border bg-muted/35 p-3 transition-colors",
                overStage === stage.id && "border-primary bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-2 px-1 pb-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{stage.label}</p>
                  <p className="num text-xs text-muted-foreground">{formatCurrency(stageValue, true)}</p>
                </div>
                <span className="num grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-background px-1.5 text-xs font-semibold">
                  {deals.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5">
                {deals.map((o) => (
                  <article
                    key={o.id}
                    draggable
                    onDragStart={() => setDragId(o.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverStage(null);
                    }}
                    className={cn(
                      "group cursor-grab rounded-lg border border-border bg-card p-3.5 shadow-[var(--shadow-card)] transition-all active:cursor-grabbing",
                      dragId === o.id ? "opacity-40" : "hover:-translate-y-0.5 hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">{o.title}</p>
                    </div>
                    <p className="num mt-2 text-base font-bold text-primary">{formatCurrency(o.value)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-[0.6rem] font-bold">
                        {repById(o.ownerId)?.initials}
                      </span>
                      <span className="truncate text-[0.7rem] text-muted-foreground">{formatDate(o.closeDate)}</span>
                      <span className="num ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-[0.65rem] font-semibold">
                        {o.probability}%
                      </span>
                    </div>
                  </article>
                ))}
                {deals.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    Drop a deal here
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 px-1">
                {stageMeta
                  .filter((s) => s.id !== stage.id)
                  .slice(0, 0)
                  .map((s) => (
                    <span key={s.id} />
                  ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground lg:hidden">
        Tip: drag-and-drop works best on a larger screen.
      </p>
    </div>
  );
}
