import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface DemoUser {
  name: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  initials: string;
}

const DEFAULT_USER: DemoUser = {
  name: "Alex Rivera",
  email: "alex.rivera@clienthub.io",
  role: "Head of Revenue",
  company: "ClientHub Inc.",
  phone: "+1 (415) 555-0182",
  initials: "AR",
};

interface AuthContextValue {
  user: DemoUser | null;
  ready: boolean;
  signIn: (email?: string, name?: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<DemoUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "clienthub-demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as DemoUser);
      } catch {
        setUser(null);
      }
    }
    setReady(true);
  }, []);

  const persist = (next: DemoUser | null) => {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const signIn = useCallback((email?: string, name?: string) => {
    const initials = (name ?? DEFAULT_USER.name)
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const next: DemoUser = {
      ...DEFAULT_USER,
      name: name ?? DEFAULT_USER.name,
      email: email ?? DEFAULT_USER.email,
      initials,
    };
    setUser(next);
    persist(next);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const updateUser = useCallback((patch: Partial<DemoUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ user, ready, signIn, signOut, updateUser }), [user, ready, signIn, signOut, updateUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
