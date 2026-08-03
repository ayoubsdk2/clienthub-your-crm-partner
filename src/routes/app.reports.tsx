import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { conversionFunnel, formatCurrency, reps, revenueSeries, sourceSplit } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports & analytics — ClientHub CRM" },
      { name: "description", content: "Sales charts, revenue analytics, conversion rates and monthly performance." },
      { property: "og:title", content: "Reports & analytics — ClientHub CRM" },
      { property: "og:description", content: "Sales charts, revenue analytics, conversion and monthly performance." },
      { property: "og:url", content: "/app/reports" },
    ],
    links: [{ rel: "canonical", href: "/app/reports" }],
  }),
  component: ReportsPage,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="num mt-0.5 text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{typeof p.value === "number" && p.value > 1000 ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
}

function ReportsPage() {
  const total = revenueSeries.reduce((s, r) => s + r.revenue, 0);
  const dealsTotal = revenueSeries.reduce((s, r) => s + r.deals, 0);
  const conversion = ((conversionFunnel[4]!.value / conversionFunnel[1]!.value) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue analytics and conversion performance for the trailing year"
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info("Report export", { description: "Demo only — no file generated." })}>
            <Download className="mr-1.5 h-4 w-4" /> Export PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { k: "Revenue (12m)", v: formatCurrency(total, true) },
          { k: "Deals closed", v: `${dealsTotal}` },
          { k: "Avg. deal size", v: formatCurrency(Math.round(total / dealsTotal)) },
          { k: "Lead → customer", v: `${conversion}%` },
        ].map((s) => (
          <div key={s.k} className="card-surface p-5">
            <p className="text-sm text-muted-foreground">{s.k}</p>
            <p className="num mt-2 text-2xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <section className="card-surface p-5">
        <h2 className="text-base font-semibold">Monthly performance</h2>
        <p className="text-xs text-muted-foreground">Revenue against target, last 12 months</p>
        <div className="mt-5 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries} margin={{ left: -16, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--chart-1)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="var(--chart-2)" radius={[5, 5, 0, 0]} opacity={0.55} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Conversion funnel</h2>
          <p className="text-xs text-muted-foreground">Visitors through to closed customers</p>
          <ul className="mt-5 space-y-4">
            {conversionFunnel.map((f, i) => (
              <li key={f.stage}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{f.stage}</span>
                  <span className="num text-muted-foreground">
                    {f.value.toLocaleString()}
                    {i > 0 && ` · ${((f.value / conversionFunnel[i - 1]!.value) * 100).toFixed(1)}%`}
                  </span>
                </div>
                <Progress value={(f.value / conversionFunnel[0]!.value) * 100} className="mt-2 h-2.5" />
              </li>
            ))}
          </ul>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Deals closed per month</h2>
          <p className="text-xs text-muted-foreground">Volume trend</p>
          <div className="mt-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: -24, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="deals" name="Deals" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Pipeline by source</h2>
          <div className="mt-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceSplit} dataKey="value" nameKey="name" outerRadius={92} strokeWidth={0} label={(e: any) => `${e.name} ${e.value}%`} labelLine={false} fontSize={11}>
                  {sourceSplit.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Rep leaderboard</h2>
          <p className="text-xs text-muted-foreground">Attainment against quota</p>
          <ul className="mt-5 space-y-4">
            {[...reps]
              .sort((a, b) => b.attained / b.quota - a.attained / a.quota)
              .map((r, i) => {
                const pct = Math.round((r.attained / r.quota) * 100);
                return (
                  <li key={r.id}>
                    <div className="flex items-center gap-3">
                      <span className="num w-4 shrink-0 text-xs font-bold text-muted-foreground">{i + 1}</span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[0.65rem] font-bold">
                        {r.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{r.name}</p>
                        <p className="num text-xs text-muted-foreground">
                          {formatCurrency(r.attained, true)} of {formatCurrency(r.quota, true)} · {r.deals} deals
                        </p>
                      </div>
                      <span className={`num shrink-0 text-sm font-semibold ${pct >= 100 ? "text-success" : ""}`}>{pct}%</span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="mt-2 h-1.5" />
                  </li>
                );
              })}
          </ul>
        </section>
      </div>
    </div>
  );
}
