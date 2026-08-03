import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleUser,
  Contact2,
  KanbanSquare,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  PieChart,
  Search,
  Settings,
  Users,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAuth } from "@/lib/auth-provider";
import { useCrm } from "@/lib/crm-store";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/customers", label: "Customers", icon: Users },
  { to: "/app/leads", label: "Leads", icon: UserPlus },
  { to: "/app/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/app/contacts", label: "Contacts", icon: Contact2 },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/email", label: "Email", icon: Mail },
  { to: "/app/reports", label: "Reports", icon: PieChart },
] as const;

const secondary = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/help", label: "Help Center", icon: LifeBuoy },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      <p className="px-3 pb-1 pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Workspace
      </p>
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: "exact" in item ? item.exact : false }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary/12 data-[status=active]:text-sidebar-primary"
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
      <p className="px-3 pb-1 pt-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Account
      </p>
      {secondary.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary/12 data-[status=active]:text-sidebar-primary"
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-4">
        <p className="text-xs font-semibold">Demo workspace</p>
        <p className="mt-1 text-xs text-muted-foreground">
          All data is mock data. Nothing leaves your browser.
        </p>
      </div>
    </div>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { customers, leads, tasks } = useCrm();

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search customers, leads, tasks or pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {[...nav, ...secondary].map((item) => (
            <CommandItem key={item.to} value={`page ${item.label}`} onSelect={() => go(item.to)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Customers">
          {customers.slice(0, 6).map((c) => (
            <CommandItem key={c.id} value={`customer ${c.company} ${c.contactName}`} onSelect={() => go(`/app/customers/${c.id}`)}>
              <Users className="mr-2 h-4 w-4" />
              <span className="truncate">{c.company}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.plan}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Leads">
          {leads.slice(0, 6).map((l) => (
            <CommandItem key={l.id} value={`lead ${l.name} ${l.company}`} onSelect={() => go("/app/leads")}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="truncate">{l.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{l.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Tasks">
          {tasks.slice(0, 5).map((t) => (
            <CommandItem key={t.id} value={`task ${t.title}`} onSelect={() => go("/app/tasks")}>
              <ListChecks className="mr-2 h-4 w-4" />
              <span className="truncate">{t.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const crumb =
    [...nav, ...secondary].find((n) => (n.to === "/app" ? pathname === "/app" : pathname.startsWith(n.to)))?.label ?? "Dashboard";

  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-[262px] shrink-0 border-r border-sidebar-border lg:block">
        <SidebarInner />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground md:flex">
            <span>ClientHub</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-foreground">{crumb}</span>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:w-64 lg:w-80"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden truncate sm:inline">Search everything…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[0.65rem] font-medium sm:inline">
              ⌘K
            </kbd>
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-4.5 w-4.5" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[0.6rem] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <Badge variant="secondary">{unread} new</Badge>
              </div>
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className={cn("px-4 py-3", n.unread && "bg-primary/5")}>
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full outline-none ring-ring focus-visible:ring-2" aria-label="Account menu">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-primary/12 text-xs font-bold text-primary">
                    {user?.initials ?? "AR"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{user?.name ?? "Demo User"}</p>
                <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate({ to: "/app/profile" })}>
                <CircleUser className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate({ to: "/app/settings" })}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  signOut();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] animate-rise">{children}</div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
