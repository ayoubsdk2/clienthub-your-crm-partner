import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Phone, Repeat, Users } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events, formatDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — ClientHub CRM" },
      { name: "description", content: "Meetings, calls and follow-ups scheduled across your revenue team." },
      { property: "og:title", content: "Calendar — ClientHub CRM" },
      { property: "og:description", content: "Meetings, calls and follow-ups scheduled across your revenue team." },
      { property: "og:url", content: "/app/calendar" },
    ],
    links: [{ rel: "canonical", href: "/app/calendar" }],
  }),
  component: CalendarPage,
});

const typeStyles = {
  Meeting: { icon: Users, cls: "bg-primary/12 text-primary" },
  Call: { icon: Phone, cls: "bg-accent/20 text-accent-foreground" },
  "Follow-up": { icon: Repeat, cls: "bg-warning/15 text-warning" },
} as const;

const MONTH = 7; // August (0-indexed)
const YEAR = 2026;
const TODAY = "2026-08-03";

function CalendarPage() {
  const [selected, setSelected] = useState(TODAY);

  const grid = useMemo(() => {
    const first = new Date(Date.UTC(YEAR, MONTH, 1));
    const startPad = (first.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(YEAR, MONTH + 1, 0)).getUTCDate();
    const cells: (string | null)[] = Array.from({ length: startPad }, () => null);
    for (let d = 1; d <= days; d++) {
      cells.push(`${YEAR}-${String(MONTH + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return cells;
  }, []);

  const dayEvents = events.filter((e) => e.date === selected);
  const upcoming = events.filter((e) => e.date >= TODAY).slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Meetings, calls and follow-ups across the team"
        actions={
          <Button size="sm">
            <CalendarDays className="mr-1.5 h-4 w-4" /> New event
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">August 2026</h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" aria-label="Previous month" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next month" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="py-1">{d.slice(0, 1)}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {grid.map((date, i) => {
              if (!date) return <span key={`pad-${i}`} />;
              const count = events.filter((e) => e.date === date).length;
              const isToday = date === TODAY;
              return (
                <button
                  key={date}
                  onClick={() => setSelected(date)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-transparent text-sm transition-colors hover:bg-accent/50",
                    selected === date && "border-primary bg-primary/10 font-semibold text-primary",
                    isToday && selected !== date && "border-border font-semibold",
                  )}
                >
                  <span className="num">{Number(date.slice(-2))}</span>
                  {count > 0 && (
                    <span className="flex gap-0.5">
                      {Array.from({ length: Math.min(count, 3) }).map((_, k) => (
                        <span key={k} className="h-1 w-1 rounded-full bg-primary" />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-sm font-semibold">{formatDate(selected)}</h3>
            {dayEvents.length ? (
              <ul className="mt-3 space-y-2.5">
                {dayEvents.map((e) => {
                  const meta = typeStyles[e.type];
                  return (
                    <li key={e.id} className="flex items-center gap-3 rounded-lg border border-border p-3.5">
                      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", meta.cls)}>
                        <meta.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{e.title}</p>
                        <p className="truncate text-xs text-muted-foreground">with {e.withWhom}</p>
                      </div>
                      <span className="num shrink-0 text-xs text-muted-foreground">
                        {e.time} · {e.duration}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled for this day.
              </p>
            )}
          </div>
        </section>

        <aside className="card-surface h-fit p-5">
          <h2 className="text-base font-semibold">Upcoming</h2>
          <p className="text-xs text-muted-foreground">Next {upcoming.length} events</p>
          <ol className="mt-5 space-y-4">
            {upcoming.map((e) => {
              const meta = typeStyles[e.type];
              return (
                <li key={e.id} className="flex gap-3">
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", meta.cls)}>
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(e.date)} · {e.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto shrink-0 text-[0.65rem]">
                    {e.type}
                  </Badge>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
