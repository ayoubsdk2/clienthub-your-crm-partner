import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Download, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCrm } from "@/lib/crm-store";
import { formatCurrency, repById } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/customers/")({
  head: () => ({
    meta: [
      { title: "Customers — ClientHub CRM" },
      { name: "description", content: "Browse, search and manage every customer account in your ClientHub workspace." },
      { property: "og:title", content: "Customers — ClientHub CRM" },
      { property: "og:description", content: "Browse, search and manage every customer account." },
      { property: "og:url", content: "/app/customers" },
    ],
    links: [{ rel: "canonical", href: "/app/customers" }],
  }),
  component: CustomersPage,
});

const statusStyles: Record<string, string> = {
  active: "bg-success/12 text-success",
  churn_risk: "bg-destructive/12 text-destructive",
  prospect: "bg-info/12 text-info",
};
const statusLabels: Record<string, string> = { active: "Active", churn_risk: "Churn risk", prospect: "Prospect" };

function CustomersPage() {
  const { customers, deleteCustomer } = useCrm();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        const q = query.toLowerCase();
        const matches =
          !q ||
          c.company.toLowerCase().includes(q) ||
          c.contactName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q);
        return matches && (status === "all" || c.status === status) && (plan === "all" || c.plan === plan);
      }),
    [customers, query, status, plan],
  );

  const target = customers.find((c) => c.id === pendingDelete);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} accounts · ${formatCurrency(customers.reduce((s, c) => s + c.arr, 0), true)} combined ARR`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Export queued", { description: "Demo only — no file is generated." })}>
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => navigate({ to: "/app/customers/new" })}>
              <Plus className="mr-1.5 h-4 w-4" /> Add customer
            </Button>
          </>
        }
      />

      <div className="card-surface p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search company, contact, industry…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="churn_risk">Churn risk</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger className="sm:w-40"><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No customers match those filters"
          description="Try a different search term, or clear the filters to see every account."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatus("all");
                setPlan("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="card-surface overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">ARR</th>
                  <th className="px-5 py-3 text-right font-medium">Health</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <Link to="/app/customers/$customerId" params={{ customerId: c.id }} className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-[0.7rem] font-bold text-primary">
                          {c.company.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{c.company}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.contactName} · {c.location}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{repById(c.ownerId)?.name}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline">{c.plan}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[c.status]}`}>
                        {statusLabels[c.status]}
                      </span>
                    </td>
                    <td className="num px-5 py-3.5 text-right font-semibold">{formatCurrency(c.arr)}</td>
                    <td className="num px-5 py-3.5 text-right">{c.health}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={`Edit ${c.company}`}>
                          <Link to="/app/customers/$customerId/edit" params={{ customerId: c.id }}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${c.company}`} onClick={() => setPendingDelete(c.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {customers.length} accounts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Demo dataset
            </span>
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {target?.company}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the account and its demo records from this session. Refresh the page to restore the seeded
              dataset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteCustomer(pendingDelete);
                  toast.success("Customer deleted");
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
