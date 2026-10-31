import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyPackage,
  consumeExamEntry,
  canTakeExam,
  type Entitlements,
  type PackageId,
  type SectionKey,
} from "./rules";
import { BOOKS, EXAMS } from "./content";

// Everything persists in the browser's LocalStorage — no server needed.

export interface Mistake {
  qid: string;
  examId: string;
  chosen: number | null;
  date: number;
}

export interface Payment {
  id: string;
  pkg: PackageId;
  method: "bkash" | "nagad";
  sender: string;
  trxId: string;
  date: number;
}

export interface User extends Entitlements {
  name: string;
  email: string;
  phone: string;
  pwHash: string;
  createdAt: number;
  mistakes: Mistake[];
  payments: Payment[];
}

export interface Attempt {
  id: string;
  examId: string;
  email: string | null;
  date: number;
  answers: Record<string, number | null>;
  scores: Record<SectionKey, number>;
  total: number;
  passed: boolean;
  failedSections: SectionKey[];
  reasonBn: string;
}

export interface DB {
  users: Record<string, User>;
  session: string | null;
  attempts: Attempt[];
}

const DB_KEY = "nihonbd:db:v1";
const CONTENT_KEY = "nihonbd:content:v1";
const EMPTY: DB = { users: {}, session: null, attempts: [] };

let state: DB | null = null;
const listeners = new Set<() => void>();

function load(): DB {
  if (state) return state;
  try {
    const raw = localStorage.getItem(DB_KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as DB) } : EMPTY;
    if (!localStorage.getItem(CONTENT_KEY)) {
      localStorage.setItem(
        CONTENT_KEY,
        JSON.stringify({ version: 1, exams: EXAMS, books: BOOKS, seededAt: Date.now() }),
      );
    }
  } catch {
    state = EMPTY;
  }
  return state;
}

function setDB(updater: (db: DB) => DB) {
  state = updater(load());
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch {
    /* storage full or disabled */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === DB_KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};

export function useDB(): DB {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

export function useCurrentUser(): User | null {
  const db = useDB();
  return db.session ? (db.users[db.session] ?? null) : null;
}

/** Current time, ticking. Returns 0 during SSR/hydration so markup stays stable. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function updateUser(email: string, fn: (u: User) => User) {
  setDB((db) => {
    const u = db.users[email];
    if (!u) return db;
    return { ...db, users: { ...db.users, [email]: fn(u) } };
  });
}

export const actions = {
  register(input: { name: string; email: string; phone: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const db = load();
    if (db.users[email]) throw new Error("এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।");
    const user: User = {
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      pwHash: hash(input.password),
      createdAt: Date.now(),
      tickets: 0,
      monthlyUntil: 0,
      weeklyUntil: 0,
      bookUntil: 0,
      mistakes: [],
      payments: [],
    };
    setDB((d) => ({ ...d, users: { ...d.users, [email]: user }, session: email }));
  },
  login(emailRaw: string, password: string) {
    const email = emailRaw.trim().toLowerCase();
    const u = load().users[email];
    if (!u || u.pwHash !== hash(password)) throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    setDB((d) => ({ ...d, session: email }));
  },
  logout() {
    setDB((d) => ({ ...d, session: null }));
  },
  purchase(pkg: PackageId, method: "bkash" | "nagad", sender: string, trxId: string) {
    const email = load().session;
    if (!email) throw new Error("আগে লগইন করুন।");
    const now = Date.now();
    updateUser(email, (u) => ({
      ...applyPackage(u, pkg, now),
      payments: [{ id: uid(), pkg, method, sender, trxId, date: now }, ...u.payments],
    }));
  },
  /** Spend a ticket (unless monthly) to enter a paid exam. Returns false when locked. */
  enterExam(): boolean {
    const db = load();
    const u = db.session ? db.users[db.session] : null;
    const now = Date.now();
    if (!u || !canTakeExam(u, now)) return false;
    updateUser(u.email, (x) => consumeExamEntry(x, now));
    return true;
  },
  saveAttempt(a: Omit<Attempt, "id" | "date" | "email">, mistakes: Omit<Mistake, "date">[]) {
    const db = load();
    const attempt: Attempt = { ...a, id: uid(), date: Date.now(), email: db.session };
    setDB((d) => {
      let users = d.users;
      if (d.session && d.users[d.session]) {
        const u = d.users[d.session];
        const fresh = mistakes.map((m) => ({ ...m, date: attempt.date }));
        const ids = new Set(fresh.map((m) => m.qid));
        users = {
          ...users,
          [u.email]: { ...u, mistakes: [...fresh, ...u.mistakes.filter((m) => !ids.has(m.qid))] },
        };
      }
      return { ...d, users, attempts: [attempt, ...d.attempts] };
    });
    return attempt.id;
  },
  removeMistake(qid: string) {
    const email = load().session;
    if (email) updateUser(email, (u) => ({ ...u, mistakes: u.mistakes.filter((m) => m.qid !== qid) }));
  },
};

// ---------- UI state (modals/drawers) ----------

interface UIState {
  authOpen: boolean;
  checkoutOpen: boolean;
  checkoutPkg: PackageId | null;
  openAuth: (thenCheckout?: boolean) => void;
  closeAuth: () => void;
  openCheckout: (pkg?: PackageId) => void;
  closeCheckout: () => void;
  onAuthed: () => void;
}

const UICtx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPkg, setCheckoutPkg] = useState<PackageId | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const openCheckout = useCallback((pkg?: PackageId) => {
    setCheckoutPkg(pkg ?? null);
    if (!load().session) {
      setPendingCheckout(true);
      setAuthOpen(true);
      return;
    }
    setCheckoutOpen(true);
  }, []);

  const value = useMemo<UIState>(
    () => ({
      authOpen,
      checkoutOpen,
      checkoutPkg,
      openAuth: (then) => {
        setPendingCheckout(!!then);
        setAuthOpen(true);
      },
      closeAuth: () => setAuthOpen(false),
      openCheckout,
      closeCheckout: () => setCheckoutOpen(false),
      onAuthed: () => {
        setAuthOpen(false);
        if (pendingCheckout) {
          setPendingCheckout(false);
          setTimeout(() => setCheckoutOpen(true), 200);
        }
      },
    }),
    [authOpen, checkoutOpen, checkoutPkg, openCheckout, pendingCheckout],
  );
  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI() {
  const v = useContext(UICtx);
  if (!v) throw new Error("useUI outside UIProvider");
  return v;
}
