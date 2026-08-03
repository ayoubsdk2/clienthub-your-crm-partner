import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-muted/30 p-12 lg:flex">
        <div className="absolute inset-0 hero-glow" aria-hidden="true" />
        <div className="absolute inset-0 surface-grid opacity-30" aria-hidden="true" />
        <Link to="/" className="relative">
          <Logo />
        </Link>
        <div className="relative max-w-md">
          <p className="text-2xl font-bold leading-snug tracking-tight">
            “ClientHub gave us one place to see every deal, every conversation and every renewal.”
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary">
              PK
            </span>
            <div>
              <p className="text-sm font-semibold">Peter Kwon</p>
              <p className="text-xs text-muted-foreground">Head of RevOps, Lumen Financial</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Demo environment · realistic mock data · no backend
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <Link to="/" className="lg:hidden">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-sm animate-rise">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
