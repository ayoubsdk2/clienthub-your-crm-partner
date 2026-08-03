import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarPlus,
  CircleDollarSign,
  Mail,
  Phone,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCrm } from "@/lib/crm-store";
import {
  activity,
  formatCurrency,
  repById,
  reps,
  revenueSeries,
  sourceSplit,
  stageMeta,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ClientHub CRM" },
      { name: "description", content: "Revenue, pipeline, leads and team performance at a glance in ClientHub." },
      { property: "og:title", content: "Dashboard — ClientHub CRM" },
      { property: "og:description", content: "Revenue, pipeline, leads and team performance at a glance." },
      { property: "og:url", content: "/app" },
    ],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: Dashboard,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function StatCard({
  label,
  value,
  delta,
  up,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: typeof Users;
  hint: string;
}) {
  return (
    <article className="card-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="num mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-semibold ${up ? "text-success" : "text-destructive"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {delta}
        </span>
        <span className="truncate text-muted-foreground">{hint}</span>
      </div>
    </article>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="num mt-0.5 text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{typeof p.value === "number" && p.value > 1000 ? formatCurrency(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

function Dashboard() {
  const { customers, leads, opportunities, tasks } = useCrm();

  const openPipeline = opportunities.filter((o) => o.stage !== "closed_won").reduce((s, o) => s + o.value, 0);
  const won = opportunities.filter((o) => o.stage === "closed_won").reduce((s, o) => s + o.value, 0);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const newLeads = leads.filter((l) => l.status === "new" || l.status === "contacted").length;
  const arr = customers.reduce((s, c) => s + c.arr, 0);

  const stageTotals = stageMeta.map((s) => ({
    ...s,
    total: opportunities.filter((o) => o.stage === s.id).reduce((sum, o) => sum + o.value, 0),
    count: opportunities.filter((o) => o.stage === s.id).length,
  }));
  const maxStage = Math.max(...stageTotals.map((s) => s.total), 1);

  const openTasks = tasks.filter((t) => t.status !== "done").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Alex"
        description="Here's how revenue is tracking across the team today."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/reports">
                <TrendingUp className="mr-1.5 h-4 w-4" /> Reports
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app/customers/new">
                <UserPlus className="mr-1.5 h-4 w-4" /> Add customer
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Annual recurring revenue" value={formatCurrency(arr, true)} delta="12.4%" up icon={CircleDollarSign} hint="vs last quarter" />
        <StatCard label="Open pipeline" value={formatCurrency(openPipeline, true)} delta="6.1%" up icon={Target} hint={`${opportunities.length} opportunities`} />
        <StatCard label="Closed won (Q3)" value={formatCurrency(won, true)} delta="18.4%" up icon={Zap} hint="2 deals this month" />
        <StatCard label="Active customers" value={`${activeCustomers}`} delta="2.3%" up={false} icon={Users} hint={`${customers.length} total accounts`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">Revenue vs target</h2>
              <p className="text-xs text-muted-foreground">Trailing 12 months</p>
            </div>
            <Badge variant="secondary" className="gap-1 text-success">
              <ArrowUpRight className="h-3 w-3" /> 96% attainment
            </Badge>
          </div>
          <div className="mt-5 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -18, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="target" name="Target" stroke="var(--chart-2)" strokeWidth={1.5} strokeDasharray="5 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Leads overview</h2>
          <p className="text-xs text-muted-foreground">{newLeads} leads need attention</p>
          <div className="mt-5 h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceSplit} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                  {sourceSplit.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2">
            {sourceSplit.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColors[i % chartColors.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="num ml-auto font-semibold">{s.value}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Sales pipeline</h2>
          <p className="text-xs text-muted-foreground">Value by stage</p>
          <ul className="mt-5 space-y-4">
            {stageTotals.map((s) => (
              <li key={s.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.label}</span>
                  <span className="num text-muted-foreground">
                    {formatCurrency(s.total, true)} · {s.count}
                  </span>
                </div>
                <Progress value={(s.total / maxStage) * 100} className="mt-2 h-2" />
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-5 w-full">
            <Link to="/app/pipeline">Open kanban board</Link>
          </Button>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Customers overview</h2>
          <p className="text-xs text-muted-foreground">Accounts by health</p>
          <div className="mt-5 space-y-3">
            {customers.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/app/customers/$customerId"
                params={{ customerId: c.id }}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/40"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-[0.65rem] font-bold text-primary">
                  {c.company.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.company}</p>
                  <p className="num text-xs text-muted-foreground">{formatCurrency(c.arr, true)} ARR</p>
                </div>
                <span
                  className={`num shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                    c.health >= 80 ? "bg-success/12 text-success" : c.health >= 60 ? "bg-warning/15 text-warning" : "bg-destructive/12 text-destructive"
                  }`}
                >
                  {c.health}
                </span>
              </Link>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/app/customers">View all customers</Link>
          </Button>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <p className="text-xs text-muted-foreground">{openTasks} open tasks assigned to your team</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { to: "/app/customers/new", icon: UserPlus, label: "Add customer" },
              { to: "/app/tasks", icon: Activity, label: "Create task" },
              { to: "/app/calendar", icon: CalendarPlus, label: "Schedule meeting" },
              { to: "/app/email", icon: Mail, label: "Send campaign" },
              { to: "/app/leads", icon: Phone, label: "Log a call" },
              { to: "/app/reports", icon: TrendingUp, label: "Build report" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex flex-col items-start gap-2 rounded-lg border border-border p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent/30"
              >
                <a.icon className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-medium leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Activity timeline</h2>
          <p className="text-xs text-muted-foreground">Latest across the workspace</p>
          <ol className="mt-5 space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="relative flex gap-3 pl-1">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.detail} · {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-base font-semibold">Team performance</h2>
          <p className="text-xs text-muted-foreground">Quota attainment this quarter</p>
          <div className="mt-5 h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reps.map((r) => ({ name: r.initials, attained: r.attained, quota: r.quota }))} margin={{ left: -20, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="attained" name="Attained" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2.5">
            {reps.map((r) => {
              const pct = Math.round((r.attained / r.quota) * 100);
              return (
                <li key={r.id} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[0.65rem] font-bold">
                    {r.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                  <span className={`num text-sm font-semibold ${pct >= 100 ? "text-success" : "text-muted-foreground"}`}>{pct}%</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="card-surface p-5">
        <h2 className="text-base font-semibold">Top open opportunities</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-medium">Opportunity</th>
                <th className="pb-2 font-medium">Owner</th>
                <th className="pb-2 font-medium">Stage</th>
                <th className="pb-2 text-right font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {opportunities
                .filter((o) => o.stage !== "closed_won")
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-muted/40">
                    <td className="py-3 pr-4 font-medium">{o.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{repById(o.ownerId)?.name}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="secondary">{stageMeta.find((s) => s.id === o.stage)?.label}</Badge>
                    </td>
                    <td className="num py-3 text-right font-semibold">{formatCurrency(o.value)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
