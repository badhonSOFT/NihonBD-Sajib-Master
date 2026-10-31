import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

export const LOCK_MESSAGE =
  "আপনার কোনো টিকিট বা সাবস্ক্রিপশন নেই। মাত্র ২০ বা ১০০ টাকায় বিকাশ/নগদে রিনিউ করুন।";

export function LockOverlay({ compact, className }: { compact?: boolean; className?: string }) {
  const ui = useUI();
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[inherit] p-5 text-center frost-lock",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float">
        <Lock className="size-5" />
      </span>
      {!compact && <p className="mt-4 max-w-sm font-bn text-sm font-medium leading-relaxed">{LOCK_MESSAGE}</p>}
      <Button size="sm" className="mt-4" onClick={() => ui.openCheckout()}>
        রিনিউ করুন
      </Button>
    </div>
  );
}
