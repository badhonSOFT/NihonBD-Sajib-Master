import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions, useUI } from "@/lib/store";
import { KanjiMark } from "./Brand";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const ui = useUI();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "register") {
        if (form.name.trim().length < 2) throw new Error("আপনার নাম লিখুন।");
        if (!/^\S+@\S+\.\S+$/.test(form.email)) throw new Error("সঠিক ইমেইল দিন।");
        if (!/^01\d{9}$/.test(form.phone.trim())) throw new Error("১১ সংখ্যার মোবাইল নম্বর দিন (01XXXXXXXXX)।");
        if (form.password.length < 6) throw new Error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        actions.register(form);
        toast.success(`স্বাগতম, ${form.name.trim()}!`);
      } else {
        actions.login(form.email, form.password);
        toast.success("লগইন সফল হয়েছে");
      }
      setForm({ name: "", email: "", phone: "", password: "" });
      ui.onAuthed();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Dialog open={ui.authOpen} onOpenChange={(o) => !o && ui.closeAuth()}>
      <DialogContent className="max-w-md rounded-3xl border-0 p-8 shadow-float">
        <DialogHeader className="items-center text-center">
          <KanjiMark className="size-12 text-2xl" />
          <DialogTitle className="mt-3 text-2xl font-bold tracking-tight">
            {mode === "register" ? "নতুন অ্যাকাউন্ট খুলুন" : "আবার স্বাগতম"}
          </DialogTitle>
          <DialogDescription className="font-bn">
            JLPT ও NAT-TEST প্রস্তুতি শুরু করুন — মাত্র ১ মিনিটে।
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-2 rounded-full bg-secondary p-1">
          {(["register", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={cn(
                "cursor-pointer rounded-full py-2 text-sm font-semibold transition-all",
                mode === m ? "bg-background shadow-soft" : "text-muted-foreground",
              )}
            >
              {m === "register" ? "Register" : "Login"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-2 space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">নাম</Label>
              <Input id="name" value={form.name} onChange={set("name")} placeholder="আপনার নাম" className="h-11 rounded-xl" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="h-11 rounded-xl" />
          </div>
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="phone">মোবাইল নম্বর</Label>
              <Input id="phone" inputMode="numeric" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className="h-11 rounded-xl" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" type="password" value={form.password} onChange={set("password")} placeholder="••••••" className="h-11 rounded-xl" />
          </div>
          {error && <p className="font-bn text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full">
            {mode === "register" ? "অ্যাকাউন্ট খুলুন" : "লগইন করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
