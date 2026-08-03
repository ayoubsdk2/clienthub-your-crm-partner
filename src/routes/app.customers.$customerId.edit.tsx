import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/customer-form";
import { useCrm } from "@/lib/crm-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/customers/$customerId/edit")({
  head: () => ({
    meta: [
      { title: "Edit customer — ClientHub CRM" },
      { name: "description", content: "Update account details, ownership and commercials for this customer." },
      { property: "og:title", content: "Edit customer — ClientHub CRM" },
      { property: "og:description", content: "Update account details, ownership and commercials." },
    ],
  }),
  component: EditCustomerPage,
});

function EditCustomerPage() {
  const { customerId } = Route.useParams();
  const { customers, updateCustomer } = useCrm();
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

  const { id: _id, ...draft } = customer;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title={`Edit ${customer.company}`} description="Changes apply instantly in this demo session." />
      <CustomerForm
        initial={draft}
        submitLabel="Save changes"
        onCancel={() => navigate({ to: "/app/customers/$customerId", params: { customerId } })}
        onSubmit={(next) => {
          updateCustomer(customerId, next);
          toast.success("Customer updated");
          navigate({ to: "/app/customers/$customerId", params: { customerId } });
        }}
      />
    </div>
  );
}
