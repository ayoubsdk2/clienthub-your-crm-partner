import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — ClientHub CRM" },
      { name: "description", content: "Request a demo password reset link for your ClientHub workspace." },
      { property: "og:title", content: "Reset your password — ClientHub CRM" },
      { property: "og:description", content: "Request a demo password reset link for your ClientHub workspace." },
      { property: "og:url", content: "/forgot-password" },
    ],
    links: [{ rel: "canonical", href: "/forgot-password" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a recovery link to your email address."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
          <CheckCircle2 className="mx-auto h-9 w-9 text-success" />
          <p className="mt-3 text-sm font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">
            If {email || "that address"} matches an account, a reset link is on its way. (Demo — no email is sent.)
          </p>
          <Button variant="outline" className="mt-5 w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
