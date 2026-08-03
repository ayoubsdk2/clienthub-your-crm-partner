import type { Customer } from "@/lib/mock-data";
import { reps } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, type FormEvent } from "react";

export type CustomerDraft = Omit<Customer, "id">;

export const emptyCustomer: CustomerDraft = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  industry: "Technology",
  location: "",
  status: "prospect",
  plan: "Starter",
  arr: 0,
  health: 70,
  ownerId: "r1",
  since: new Date().toISOString().slice(0, 10),
  website: "",
  notes: "",
};

export function CustomerForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: CustomerDraft;
  submitLabel: string;
  onSubmit: (draft: CustomerDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<CustomerDraft>(initial);
  const set = <K extends keyof CustomerDraft>(key: K, value: CustomerDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="card-surface p-6">
        <h2 className="text-base font-semibold">Company</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Company name" required>
            <Input value={draft.company} onChange={(e) => set("company", e.target.value)} placeholder="Northwind Logistics" required />
          </Field>
          <Field label="Website">
            <Input value={draft.website} onChange={(e) => set("website", e.target.value)} placeholder="northwind.co" />
          </Field>
          <Field label="Industry">
            <Select value={draft.industry} onValueChange={(v) => set("industry", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Technology", "Healthcare", "Financial Services", "Manufacturing", "Retail", "Logistics", "Energy", "Education", "Legal", "Real Estate"].map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location">
            <Input value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
          </Field>
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-base font-semibold">Primary contact</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Contact name" required>
            <Input value={draft.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Elena Marsh" required />
          </Field>
          <Field label="Email" required>
            <Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} placeholder="elena@northwind.co" required />
          </Field>
          <Field label="Phone">
            <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (415) 220-8841" />
          </Field>
          <Field label="Account owner">
            <Select value={draft.ownerId} onValueChange={(v) => set("ownerId", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {reps.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-base font-semibold">Commercials</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Plan">
            <Select value={draft.plan} onValueChange={(v) => set("plan", v as Customer["plan"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={draft.status} onValueChange={(v) => set("status", v as Customer["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="churn_risk">Churn risk</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="ARR (USD)">
            <Input type="number" min={0} step={500} value={draft.arr} onChange={(e) => set("arr", Number(e.target.value))} />
          </Field>
          <Field label="Health score">
            <Input type="number" min={0} max={100} value={draft.health} onChange={(e) => set("health", Number(e.target.value))} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Notes">
            <Textarea rows={4} value={draft.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Context the rest of the team should know…" />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
