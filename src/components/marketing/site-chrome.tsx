import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Customers" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Start free</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" className="rounded-md px-2 py-2.5 text-sm font-medium">
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            The CRM revenue teams actually enjoy using. Pipeline, customers and forecasting in one calm workspace.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Portfolio demo project — realistic mock data, no backend.
          </p>
        </div>
        <FooterCol
          title="Product"
          items={[
            { label: "Features", href: "#features" },
            { label: "Product tour", href: "#product" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            { label: "Customers", href: "#testimonials" },
            { label: "Contact", href: "#contact" },
          ]}
        />
        <div>
          <p className="text-sm font-semibold">App</p>
          <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/app" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition-colors hover:text-foreground">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-foreground">
                Create account
              </Link>
            </li>
            <li>
              <Link to="/app/help" className="transition-colors hover:text-foreground">
                Help Center
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} ClientHub. MIT licensed demo.</p>
          <p>Built with React, TanStack Start and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.label}>
            <a href={i.href} className="transition-colors hover:text-foreground">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
