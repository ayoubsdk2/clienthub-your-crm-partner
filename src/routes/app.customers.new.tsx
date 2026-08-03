import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { CustomerForm, emptyCustomer } from "@/components/customer-form";
import { useCrm } from "@/lib/crm-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/customers/new")({
  head: () => ({
    meta: [
      { title: "Add customer — ClientHub CRM" },
      { name: "description", content: "Create a new customer account record in ClientHub." },
      { property: "og:title", content: "Add customer — ClientHub CRM" },
      { property: "og:description", content: "Create a new customer account record in ClientHub." },
      { property: "og:url", content: "/app/customers/new" },
    ],
    links: [{ rel: "canonical", href: "/app/customers/new" }],
  }),
  component: NewCustomerPage,
});

function NewCustomerPage() {
  const { addCustomer } = useCrm();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Add customer" description="Create a new account record for your workspace." />
      <CustomerForm
        initial={emptyCustomer}
        submitLabel="Create customer"
        onCancel={() => navigate({ to: "/app/customers" })}
        onSubmit={(draft) => {
          const created = addCustomer(draft);
          toast.success("Customer created", { description: `${draft.company} added to your workspace.` });
          navigate({ to: "/app/customers/$customerId", params: { customerId: created.id } });
        }}
      />
    </div>
  );
}
