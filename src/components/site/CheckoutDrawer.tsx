import { useEffect, useState } from "react";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions, useUI } from "@/lib/store";
import { PACKAGES, type PackageId } from "@/lib/rules";
import { PayBadge } from "./Brand";
import { cn } from "@/lib/utils";

export const MERCHANT_NUMBER = "017XXXXXXXX";

export function CheckoutDrawer() {
  const ui = useUI();
  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState<PackageId>("p20");
  const [method, setMethod] = useState<"bkash" | "nagad">("bkash");
  const [sender, setSender] = useState("");
  const [trx, setTrx] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ui.checkoutOpen) {
      setStep(ui.checkoutPkg ? 2 : 1);
      setPkg(ui.checkoutPkg ?? "p20");
      setSender("");
      setTrx("");
      setError(null);
      setDone(false);
    }
  }, [ui.checkoutOpen, ui.checkoutPkg]);

  const selected = PACKAGES.find((p) => p.id === pkg)!;
  const methodName = method === "bkash" ? "bKash" : "Nagad";

  const verify = () => {
    setError(null);
    if (!/^01\d{9}$/.test(sender.trim())) return setError("সঠিক ১১ সংখ্যার নম্বর দিন (01XXXXXXXXX)।");
    if (!/^[A-Za-z0-9]{8,12}$/.test(trx.trim())) return setError("TrxID ৮–১২ অক্ষরের ইংরেজি অক্ষর/সংখ্যা হতে হবে।");
    setVerifying(true);
    setTimeout(() => {
      try {
        actions.purchase(pkg, method, sender.trim(), trx.trim().toUpperCase());
        setDone(true);
        toast.success("পেমেন্ট ভেরিফাই হয়েছে — সব কিছু আনলক!");
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setVerifying(false);
      }
    }, 1400);
  };

  return (
    <Drawer open={ui.checkoutOpen} onOpenChange={(o) => !o && ui.closeCheckout()}>
      <DrawerContent className="rounded-t-[2rem] border-0">
        <div className="mx-auto w-full max-w-lg px-6 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-2xl font-bold tracking-tight">
              {done ? "আনলক সম্পন্ন" : "টিকিট কিনুন"}
            </DrawerTitle>
            <DrawerDescription className="font-bn">
              {done ? "আপনার অ্যাকাউন্টে নতুন সুবিধা যোগ হয়েছে।" : `ধাপ ${["১", "২", "৩"][step - 1]} / ৩`}
            </DrawerDescription>
          </DrawerHeader>

          {!done && (
            <div className="mb-6 flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <span key={s} className={cn("h-1 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-secondary")} />
              ))}
            </div>
          )}

          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check className="size-8" />
              </span>
              <p className="mt-4 font-bn text-lg font-semibold">{selected.titleBn} সক্রিয় হয়েছে</p>
              <p className="mt-1 font-bn text-sm text-muted-foreground">সব মক টেস্ট ও বইয়ের লক খুলে গেছে।</p>
              <Button size="lg" className="mt-6 w-full" onClick={ui.closeCheckout}>
                পরীক্ষা শুরু করুন
              </Button>
            </div>
          ) : step === 1 ? (
            <div className="grid grid-cols-2 gap-3">
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPkg(p.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-4 text-left transition-all",
                    pkg === p.id ? "border-primary bg-secondary ring-1 ring-primary" : "hover:bg-accent",
                  )}
                >
                  <div className="text-2xl font-bold">৳{p.priceBn}</div>
                  <div className="mt-1 font-bn text-sm font-medium">{p.titleBn}</div>
                  <div className="mt-1 font-bn text-xs text-muted-foreground">{p.perks[0]}</div>
                </button>
              ))}
              <Button size="lg" className="col-span-2 mt-3" onClick={() => setStep(2)}>
                পরবর্তী
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-3">
              <p className="font-bn text-sm text-muted-foreground">
                প্যাকেজ: <b className="text-foreground">{selected.titleBn} · ৳{selected.priceBn}</b>
              </p>
              {(["bkash", "nagad"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all",
                    method === m ? "border-primary ring-1 ring-primary" : "hover:bg-accent",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <PayBadge method={m} className="px-3 py-1.5 text-xs" />
                    <span className="font-bn text-sm">{m === "bkash" ? "বিকাশ" : "নগদ"} Send Money</span>
                  </span>
                  <span className={cn("size-5 rounded-full border-2", method === m ? "border-[6px] border-primary" : "")} />
                </button>
              ))}
              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  পেছনে
                </Button>
                <Button size="lg" className="flex-1" onClick={() => setStep(3)}>
                  পরবর্তী
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-sm">
                  Send Money to our personal number{" "}
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 font-bold"
                    onClick={() => {
                      navigator.clipboard?.writeText(MERCHANT_NUMBER);
                      toast("নম্বর কপি হয়েছে");
                    }}
                  >
                    {MERCHANT_NUMBER} <Copy className="size-3.5" />
                  </button>{" "}
                  via {methodName} app.
                </p>
                <p className="mt-2 font-bn text-sm text-muted-foreground">
                  পরিমাণ: <b className="text-foreground">৳{selected.priceBn}</b> · তারপর নিচে তথ্য দিন।
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sender" className="font-bn">যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number)</Label>
                <Input id="sender" inputMode="numeric" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="01XXXXXXXXX" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="trx" className="font-bn">TrxID (ট্রানজেকশন আইডি)</Label>
                <Input id="trx" value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="যেমন: 9C7A2B1XQ" className="h-12 rounded-xl uppercase" />
              </div>
              {error && <p className="font-bn text-sm text-destructive">{error}</p>}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="lg" onClick={() => setStep(2)} disabled={verifying}>
                  পেছনে
                </Button>
                <Button size="lg" variant={method} className="flex-1" onClick={verify} disabled={verifying}>
                  {verifying ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                  {verifying ? "যাচাই হচ্ছে…" : "ভেরিফাই ও আনলক করুন"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
