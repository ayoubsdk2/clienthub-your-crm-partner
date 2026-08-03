import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Award, LogOut, Mail, Phone, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-provider";
import { activity, formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — ClientHub CRM" },
      { name: "description", content: "Your ClientHub profile, quota attainment and recent activity." },
      { property: "og:title", content: "Your profile — ClientHub CRM" },
      { property: "og:description", content: "Your ClientHub profile, quota attainment and recent activity." },
      { property: "og:url", content: "/app/profile" },
    ],
    links: [{ rel: "canonical", href: "/app/profile" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const attained = 412600;
  const quota = 500000;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your demo account details and performance"
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/settings">Edit profile</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </>
        }
      />

      <section className="card-surface overflow-hidden p-0">
        <div className="hero-glow h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-card bg-primary text-xl font-bold text-primary-foreground">
              {user?.initials ?? "AR"}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold">{user?.name ?? "Alex Rivera"}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {user?.role ?? "Head of Revenue"} · {user?.company ?? "ClientHub Inc."}
              </p>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Award className="h-3.5 w-3.5" /> Top performer Q2
            </Badge>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{user?.email ?? "alex.rivera@clienthub.io"}</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{user?.phone ?? "+1 (415) 555-0182"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card-surface p-5 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Quota attainment</h2>
          </div>
          <p className="num mt-4 text-3xl font-bold">{Math.round((attained / quota) * 100)}%</p>
          <Progress value={(attained / quota) * 100} className="mt-3 h-2.5" />
          <p className="num mt-3 text-xs text-muted-foreground">
            {formatCurrency(attained)} of {formatCurrency(quota)} this quarter
          </p>
        </section>

        <section className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Recent activity</h2>
          </div>
          <ol className="mt-4 space-y-4">
            {activity.slice(0, 5).map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm">
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
      </div>
    </div>
  );
}
