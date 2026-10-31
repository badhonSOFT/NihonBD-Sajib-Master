import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Ticket, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Brand";
import { actions, useCurrentUser, useUI } from "@/lib/store";
import { toBn } from "@/lib/rules";

const LINKS = [
  { to: "/features", label: "Features" },
  { to: "/mock-tests", label: "Mock Tests" },
  { to: "/books", label: "Study Books" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function Navbar() {
  const user = useCurrentUser();
  const ui = useUI();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
                <Ticket className="size-3.5" /> {toBn(user.tickets)} টিকিট
              </span>
              <Button asChild size="sm">
                <Link to="/portal">পোর্টাল</Link>
              </Button>
              <Button size="icon" variant="ghost" aria-label="Log out" onClick={() => actions.logout()}>
                <LogOut />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => ui.openAuth()}>
              Login / Register
            </Button>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t border-border/60 px-5 pb-5 md:hidden">
          <nav className="flex flex-col py-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/portal" onClick={() => setOpen(false)}>
                  পোর্টাল
                </Link>
              </Button>
              <Button variant="outline" onClick={() => actions.logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                ui.openAuth();
              }}
            >
              Login / Register
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
