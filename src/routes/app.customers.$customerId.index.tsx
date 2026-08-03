import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Globe, Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrm } from "@/lib/crm-store";
import { activity, contacts, formatCurrency, formatDate, repById } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/customers/$customerId/")({
  head: () => ({
    meta: [
      { title: "Customer profile — ClientHub CRM" },
      { name: "description", content: "Full customer profile with contacts, health, revenue and activity history." },
      { property: "og:title", content: "Customer profile — ClientHub CRM" },
      { property: "og:description", content: "Full customer profile with contacts, health, revenue and activity." },
    ],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customerId } = Route.useParams();
  const { customers, deleteCustomer } = useCrm();
  const navigate = useNavigate();
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <EmptyState
        icon={<Building2 className="h-5 w-5" />}
        title="Customer not found"
        description="This account may have been deleted in this demo session."
        action={
          <Button asChild variant="outline">
            <Link to="/app/customers">Back to customers</Link>
          </Button>
        }
      />
    );
  }

  const owner = repById(customer.ownerId);
  const related = contacts.filter((c) => c.company === customer.company);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/customers">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> All customers
        </Link>
      </Button>

      <PageHeader
        title={customer.company}
        description={`${customer.industry} · Customer since ${formatDate(customer.since)}`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/customers/$customerId/edit" params={{ customerId: customer.id }}>
                <Pencil className="mr-1.5 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                deleteCustomer(customer.id);
                toast.success("Customer deleted");
                navigate({ to: "/app/customers" });
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4 text-destructive" /> Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="card-surface p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {customer.company.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{customer.contactName}</p>
                <p className="truncate text-xs text-muted-foreground">Primary contact</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{customer.email}</span>
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" /> <span className="truncate">{customer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" /> <span className="truncate">{customer.website || "—"}</span>
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" /> <span className="truncate">{customer.location || "—"}</span>
              </li>
            </ul>
          </section>

          <section className="card-surface p-5">
            <h2 className="text-sm font-semibold">Account health</h2>
            <p className="num mt-2 text-3xl font-bold">{customer.health}</p>
            <Progress value={customer.health} className="mt-3 h-2" />
            <dl className="mt-5 space-y-3 text-sm">
              <Row k="Plan" v={<Badge variant="outline">{customer.plan}</Badge>} />
              <Row k="ARR" v={<span className="num font-semibold">{formatCurrency(customer.arr)}</span>} />
              <Row k="Owner" v={owner?.name ?? "—"} />
              <Row
                k="Status"
                v={
                  <Badge variant={customer.status === "churn_risk" ? "destructive" : "secondary"}>
                    {customer.status === "churn_risk" ? "Churn risk" : customer.status === "active" ? "Active" : "Prospect"}
                  </Badge>
                }
              />
            </dl>
          </section>
        </aside>

        <div className="min-w-0">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5 space-y-5">
              <section className="card-surface p-5">
                <h2 className="text-base font-semibold">Account notes</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {customer.notes || "No notes recorded for this account yet."}
                </p>
              </section>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { k: "Lifetime value", v: formatCurrency(customer.arr * 2.6, true) },
                  { k: "Open tickets", v: "2" },
                  { k: "Renewal", v: formatDate("2026-11-30") },
                ].map((s) => (
                  <div key={s.k} className="card-surface p-5">
                    <p className="text-xs text-muted-foreground">{s.k}</p>
                    <p className="num mt-1.5 text-xl font-bold">{s.v}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="mt-5">
              <section className="card-surface p-5">
                <h2 className="text-base font-semibold">People at {customer.company}</h2>
                {related.length ? (
                  <ul className="mt-4 divide-y divide-border">
                    {related.map((c) => (
                      <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-[0.65rem] font-bold">
                          {c.name.split(" ").map((p) => p[0]).join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.title}</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="ml-auto">
                          <Link to="/app/contacts">View</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No additional contacts linked. {customer.contactName} is the primary point of contact.
                  </p>
                )}
              </section>
            </TabsContent>

            <TabsContent value="activity" className="mt-5">
              <section className="card-surface p-5">
                <h2 className="text-base font-semibold">Recent activity</h2>
                <ol className="mt-4 space-y-4">
                  {activity.slice(0, 5).map((a) => (
                    <li key={a.id} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{a.who}</span>{" "}
                          <span className="text-muted-foreground">{a.action}</span> <span className="font-medium">{a.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.detail} · {a.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate">{v}</dd>
    </div>
  );
}
