import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function KanjiMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-xl bg-primary font-jp text-lg font-bold text-primary-foreground",
        className,
      )}
    >
      日
      <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-sun ring-2 ring-background" />
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <KanjiMark />
      <span className="text-lg font-bold tracking-tight">NihonBD</span>
    </Link>
  );
}

export function PayBadge({ method, className }: { method: "bkash" | "nagad"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
        method === "bkash" ? "bg-bkash text-bkash-foreground" : "bg-nagad text-nagad-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {method === "bkash" ? "bKash" : "Nagad"}
    </span>
  );
}
