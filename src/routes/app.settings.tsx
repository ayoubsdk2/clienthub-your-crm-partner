import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Building, Monitor, Moon, Shield, Sun, User } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-provider";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ClientHub CRM" },
      { name: "description", content: "Manage your profile, company, notifications, appearance and security settings." },
      { property: "og:title", content: "Settings — ClientHub CRM" },
      { property: "og:description", content: "Manage profile, company, notifications, appearance and security." },
      { property: "og:url", content: "/app/settings" },
    ],
    links: [{ rel: "canonical", href: "/app/settings" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({
    name: user?.name ?? "Alex Rivera",
    email: user?.email ?? "alex.rivera@clienthub.io",
    role: user?.role ?? "Head of Revenue",
    phone: user?.phone ?? "+1 (415) 555-0182",
  });
  const [notify, setNotify] = useState({ deals: true, leads: true, digest: false, mentions: true, product: false });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Workspace preferences for this demo account" />

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="company"><Building className="mr-1.5 h-4 w-4" />Company</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Monitor className="mr-1.5 h-4 w-4" />Appearance</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-1.5 h-4 w-4" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <section className="card-surface max-w-2xl p-6">
            <h2 className="text-base font-semibold">Personal details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-name">Full name</Label>
                <Input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-role">Job title</Label>
                <Input id="s-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-phone">Phone</Label>
                <Input id="s-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <Button
              className="mt-6"
              onClick={() => {
                updateUser(form);
                toast.success("Profile saved");
              }}
            >
              Save changes
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="company" className="mt-5">
          <section className="card-surface max-w-2xl p-6">
            <h2 className="text-base font-semibold">Company settings</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Company name</Label>
                <Input id="c-name" defaultValue="ClientHub Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-domain">Domain</Label>
                <Input id="c-domain" defaultValue="clienthub.io" />
              </div>
              <div className="space-y-2">
                <Label>Default currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "GBP", "CAD"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fiscal year starts</Label>
                <Select defaultValue="January">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["January", "April", "July", "October"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-6" onClick={() => toast.success("Company settings saved")}>
              Save changes
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <section className="card-surface max-w-2xl p-6">
            <h2 className="text-base font-semibold">Notification preferences</h2>
            <ul className="mt-5 divide-y divide-border">
              {[
                { k: "deals", t: "Deal stage changes", d: "When an opportunity moves stage in your pipeline." },
                { k: "leads", t: "New lead assigned", d: "When a lead is routed to you or your team." },
                { k: "mentions", t: "Mentions and comments", d: "When someone @mentions you on a record." },
                { k: "digest", t: "Weekly digest", d: "A Monday summary of pipeline and attainment." },
                { k: "product", t: "Product updates", d: "Occasional emails about new ClientHub features." },
              ].map((row) => (
                <li key={row.k} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.t}</p>
                    <p className="text-xs text-muted-foreground">{row.d}</p>
                  </div>
                  <Switch
                    checked={notify[row.k as keyof typeof notify]}
                    onCheckedChange={(v) => setNotify({ ...notify, [row.k]: v })}
                  />
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="appearance" className="mt-5">
          <section className="card-surface max-w-2xl p-6">
            <h2 className="text-base font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose how ClientHub looks on this device.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { id: "light" as const, label: "Light", icon: Sun },
                { id: "dark" as const, label: "Dark", icon: Moon },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/50",
                    theme === opt.id && "border-primary ring-1 ring-primary/30",
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                    <opt.icon className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.id === "dark" ? "Dimmed for low light" : "Bright and high contrast"}</span>
                  </span>
                  {theme === opt.id && <Badge className="ml-auto">Active</Badge>}
                </button>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Compact density</p>
                <p className="text-xs text-muted-foreground">Reduce padding across tables and lists.</p>
              </div>
              <Switch />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <section className="card-surface max-w-2xl space-y-6 p-6">
            <div>
              <h2 className="text-base font-semibold">Password</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pw-current">Current password</Label>
                  <Input id="pw-current" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw-new">New password</Label>
                  <Input id="pw-new" type="password" placeholder="••••••••" />
                </div>
              </div>
              <Button className="mt-4" onClick={() => toast.success("Password updated", { description: "Demo only — nothing was changed." })}>
                Update password
              </Button>
            </div>
            <Separator />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Require a one-time code at sign-in.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  ["MacBook Pro · San Francisco", "Current session"],
                  ["iPhone 16 · San Francisco", "2 hours ago"],
                  ["Chrome · Austin, TX", "3 days ago"],
                ].map(([d, t]) => (
                  <li key={d} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                    <span className="min-w-0 truncate">{d}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
