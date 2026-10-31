import { Link } from "@tanstack/react-router";
import { BookOpen, Check, Clock, Eye, EyeOff, Headphones, Languages, NotebookPen, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JpText } from "@/components/jp/JpText";
import { BOOKS, EXAMS, HERO_SAMPLE, examDurationMin, examQuestions } from "@/lib/content";
import { PACKAGES, nextJlpt, nextNat, toBn } from "@/lib/rules";
import { useNow, useUI } from "@/lib/store";
import { PayBadge } from "./Brand";
import { cn } from "@/lib/utils";

// ---------------- Countdown ----------------

function Remaining({ label, target, now }: { label: string; target: Date | null; now: number }) {
  const ms = target && now ? Math.max(0, target.getTime() - now) : 0;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const cells = [
    [d, "দিন"],
    [h, "ঘণ্টা"],
    [m, "মিনিট"],
  ] as const;
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-bn text-xs text-muted-foreground">
          {target ? target.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "—"}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {cells.map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-secondary py-3 text-center">
            <div className="text-2xl font-bold tabular-nums tracking-tight">{now ? String(v).padStart(2, "0") : "--"}</div>
            <div className="font-bn text-[11px] text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamCountdown() {
  const now = useNow(30000);
  const date = now ? new Date(now) : null;
  return (
    <div className="glass rounded-3xl p-5 shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Remaining label="JLPT Bangladesh" target={date && nextJlpt(date)} now={now} />
        <Remaining label="NAT-TEST" target={date && nextNat(date)} now={now} />
      </div>
      <p className="mt-3 font-bn text-[11px] text-muted-foreground">
        JLPT: জুলাই ও ডিসেম্বরের প্রথম রবিবার। NAT-TEST তারিখ আনুমানিক — অফিসিয়াল ঘোষণা দেখে নিন।
      </p>
    </div>
  );
}

// ---------------- Interactive hero card ----------------

export function HeroQuestionCard() {
  const [showBn, setShowBn] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-[2rem] border bg-card p-6 shadow-float sm:p-8">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">JLPT N5 · 問題 1</span>
        <span className="font-bn text-xs text-muted-foreground">শব্দে ট্যাপ করুন</span>
      </div>
      <div className="mt-6 flex items-start gap-2">
        <JpText text={HERO_SAMPLE.sentence} className="flex-1 text-2xl sm:text-[1.7rem]" />
        <button
          type="button"
          onClick={() => setShowBn((s) => !s)}
          aria-label="বাংলা অনুবাদ"
          className="mt-3 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-colors hover:bg-accent"
        >
          {showBn ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <p className={cn("font-bn text-muted-foreground transition-all", showBn ? "mt-2 opacity-100" : "h-0 overflow-hidden opacity-0")}>
        {HERO_SAMPLE.bn}
      </p>
      <p className="mt-6 font-jp text-sm font-medium">{HERO_SAMPLE.question}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {HERO_SAMPLE.options.map((o, i) => {
          const state = picked === null ? "idle" : i === HERO_SAMPLE.answer ? "right" : picked === i ? "wrong" : "idle";
          return (
            <button
              key={o}
              type="button"
              onClick={() => setPicked(i)}
              className={cn(
                "cursor-pointer rounded-2xl border px-4 py-3 text-left font-jp transition-all",
                state === "right" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
                state === "idle" && "hover:bg-accent",
              )}
            >
              <span className="mr-2 text-xs text-muted-foreground">{i + 1}</span>
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-3 animate-fade-up font-bn text-sm">
          {picked === HERO_SAMPLE.answer ? "✓ সঠিক! " : "✗ ভুল। "}
          <span className="text-muted-foreground">{HERO_SAMPLE.explanationBn}</span>
        </p>
      )}
    </div>
  );
}

// ---------------- Hero ----------------

export function Hero() {
  return (
    <section className="bg-hero">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-sun" /> JLPT N5 · N4 · NAT-TEST
          </span>
          <h1 className="mt-6 font-bn text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            জাপানি ভাষা শিখুন ও পরীক্ষা দিন।{" "}
            <span className="text-muted-foreground">সম্পূর্ণ নির্ভুল বাংলা ব্যাখ্যা সহ।</span>
          </h1>
          <p className="mt-6 max-w-xl font-bn text-lg leading-relaxed text-muted-foreground">
            আসল পরীক্ষার মতো কম্পিউটার-ভিত্তিক ফুল মক টেস্ট — টাইমার, সেকশন লক আর একবার-বাজানো অডিও সহ। মাত্র ২০ টাকা থেকে, বিকাশ বা নগদে।
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/exam/$examId" params={{ examId: "n5-demo" }}>ফ্রি ডেমো টেস্ট দাও</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pricing">প্যাকেজসমূহ দেখুন</Link>
            </Button>
          </div>
          <div className="mt-10">
            <ExamCountdown />
          </div>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroQuestionCard />
        </div>
      </div>
    </section>
  );
}

// ---------------- Features ----------------

const FEATURES = [
  {
    icon: Timer,
    title: "অফিসিয়াল CBT পরীক্ষার অভিজ্ঞতা",
    body: "সেকশন-ভিত্তিক কাউন্টডাউন টাইমার, সময় শেষে অটো-লক, আর লিসেনিং অডিও বাজবে মাত্র একবার — ঠিক আসল পরীক্ষার মতো।",
  },
  {
    icon: Languages,
    title: "জাপানি → বাংলা ইন্টারঅ্যাক্টিভ অনুবাদ",
    body: "প্রতিটি কাঞ্জির উপরে ফুরিগানা উচ্চারণ। যেকোনো শব্দে ট্যাপ করলে রোমাজি ও বাংলা অর্থ, চোখের আইকনে পুরো বাক্যের অনুবাদ।",
  },
  {
    icon: BookOpen,
    title: "ডিজিটাল বই ও শব্দ ডেক",
    body: "মিন্না নো নিহোঙ্গো শব্দতালিকা, N5 কাঞ্জি কার্ড আর ব্যাকরণ শিট — সবকিছু বাংলা অর্থ সহ, মোবাইলে পড়ার উপযোগী।",
  },
  {
    icon: NotebookPen,
    title: "স্বয়ংক্রিয় ভুলের খাতা",
    body: "মক টেস্টে যে প্রশ্নগুলো ভুল করেছেন সেগুলো নিজে থেকেই সেভ হয় — বাংলা ব্যাখ্যা সহ, শুধু দুর্বল জায়গাগুলো রিভিশনের জন্য।",
  },
];

export function Features({ heading = true }: { heading?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      {heading && (
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-sun">Features</p>
          <h2 className="mt-3 font-bn text-3xl font-bold tracking-tight sm:text-4xl">
            পরীক্ষার হলে ঢোকার আগেই, পরীক্ষার হলের অভিজ্ঞতা।
          </h2>
        </div>
      )}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={cn(
              "rounded-[2rem] p-8 transition-transform hover:-translate-y-1",
              i === 0 ? "bg-slate-deep text-slate-deep-foreground" : "bg-secondary",
            )}
          >
            <f.icon className={cn("size-7", i === 0 ? "text-sun" : "text-foreground")} />
            <h3 className="mt-8 font-bn text-xl font-semibold">{f.title}</h3>
            <p className={cn("mt-3 font-bn leading-relaxed", i === 0 ? "text-slate-deep-muted" : "text-muted-foreground")}>
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- Mock tests showcase ----------------

export function MockTestsShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-4 md:grid-cols-2">
        {EXAMS.map((e) => (
          <div key={e.id} className="flex flex-col rounded-[2rem] border bg-card p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{e.level === "NAT" ? "NAT-TEST" : `JLPT ${e.level}`}</span>
              {e.free && <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">FREE</span>}
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{e.title}</h3>
            <p className="font-bn text-sm text-muted-foreground">{e.titleBn}</p>
            <div className="mt-5 flex gap-5 font-bn text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> {toBn(examDurationMin(e))} মিনিট</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-4" /> {toBn(examQuestions(e).length)} প্রশ্ন</span>
              <span className="flex items-center gap-1.5"><Headphones className="size-4" /> অডিও</span>
            </div>
            <div className="mt-auto pt-6">
              <Button asChild variant={e.free ? "default" : "outline"}>
                <Link to={e.free ? "/exam/$examId" : "/portal"} params={{ examId: e.id }}>
                  {e.free ? "এখনই ফ্রি টেস্ট দিন" : "পোর্টালে খুলুন"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- Books showcase ----------------

export function BookCover({ cover, title, className }: { cover: string; title: string; className?: string }) {
  return (
    <div className={cn("relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl bg-slate-deep p-5 text-slate-deep-foreground shadow-float", className)}>
      <span className="size-3 rounded-full bg-sun" />
      <span className="font-jp text-7xl font-bold leading-none">{cover}</span>
      <span className="text-xs font-semibold leading-snug text-slate-deep-muted">{title}</span>
      <span className="absolute inset-y-0 left-0 w-2 bg-slate-deep-foreground/10" />
    </div>
  );
}

export function BooksShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-8 sm:grid-cols-3">
        {BOOKS.map((b) => (
          <div key={b.id}>
            <BookCover cover={b.cover} title={b.title} />
            <h3 className="mt-5 font-bn text-lg font-semibold">{b.titleBn}</h3>
            <p className="font-bn text-sm text-muted-foreground">{b.subtitle}</p>
            <p className="mt-2 font-bn text-xs text-muted-foreground">অধ্যায় ১–২ ফ্রি প্রিভিউ</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link to="/portal" search={{ tab: "library" }}>লাইব্রেরি খুলুন</Link>
        </Button>
      </div>
    </section>
  );
}

// ---------------- Pricing ----------------

export function Pricing({ heading = true }: { heading?: boolean }) {
  const ui = useUI();
  return (
    <section className="bg-slate-deep text-slate-deep-foreground">
      <div className="mx-auto max-w-6xl px-5 py-24">
        {heading && (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-sun">Micro-Pricing</p>
            <h2 className="mt-3 font-bn text-3xl font-bold tracking-tight sm:text-4xl">এক কাপ চায়ের দামে একটি মক টেস্ট।</h2>
            <p className="mt-4 font-bn text-slate-deep-muted">কোনো সাবস্ক্রিপশন বাধ্যতামূলক নয়। যতটুকু দরকার, ততটুকুই কিনুন।</p>
          </div>
        )}
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-[2rem] p-7",
                p.highlight ? "bg-slate-deep-foreground text-slate-deep" : "border border-slate-deep-foreground/15",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-sun px-3 py-1 text-[11px] font-bold text-sun-foreground">সেরা মূল্য</span>
              )}
              <p className="font-bn text-sm font-medium opacity-70">{p.titleBn}</p>
              <p className="mt-3 text-5xl font-bold tracking-tight">
                ৳{p.priceBn}
              </p>
              <ul className="mt-6 space-y-3">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2 font-bn text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-sun" /> {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <div className="mb-4 flex gap-1.5">
                  <PayBadge method="bkash" />
                  <PayBadge method="nagad" />
                </div>
                <Button className="w-full" variant={p.highlight ? "default" : "inverse"} onClick={() => ui.openCheckout(p.id)}>
                  কিনুন
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- FAQ ----------------

const FAQS = [
  {
    q: "JLPT N5 পরীক্ষার প্যাটার্ন কেমন?",
    a: "তিনটি অংশ: ভাষা জ্ঞান (শব্দভান্ডার/ব্যাকরণ), পঠন ও শ্রবণ। মোট ১৮০ নম্বর — প্রতিটি সেকশন ৬০। পাস করতে মোট কমপক্ষে ৯০ এবং প্রতিটি সেকশনে কমপক্ষে ১৯ পেতে হবে।",
  },
  {
    q: "NAT-TEST আর JLPT এর পার্থক্য কী?",
    a: "NAT-TEST বছরে কয়েকবার হয় এবং ফল দ্রুত পাওয়া যায়; প্রশ্নের ধরন JLPT এর কাছাকাছি। জাপানের অনেক ভাষা স্কুল ও ভিসা আবেদনে দুটিই গ্রহণযোগ্য।",
  },
  {
    q: "কীভাবে বিকাশ/নগদে পেমেন্ট করব?",
    a: "প্যাকেজ বেছে নিন → বিকাশ বা নগদ নির্বাচন করুন → আমাদের নম্বরে Send Money করুন → যে নম্বর থেকে পাঠিয়েছেন ও TrxID দিন → ‘ভেরিফাই ও আনলক করুন’ চাপুন। সাথে সাথে টিকিট যোগ হয়ে যাবে।",
  },
  {
    q: "লিসেনিং অডিও কি আবার শোনা যাবে?",
    a: "না। আসল পরীক্ষার মতোই অডিও মাত্র একবার বাজে — পজ, টেনে আগানো বা আবার শোনা যায় না। তবে রেজাল্টের পর রিভিউ মোডে বাংলা সাবটাইটেল সহ পুরো স্ক্রিপ্ট দেখতে পারবেন।",
  },
  {
    q: "টিকিট কতদিন থাকবে?",
    a: "এক্সাম টিকিটের মেয়াদ শেষ হয় না — ব্যবহার না করা পর্যন্ত থাকবে। মাসিক পাস ৩০ দিন আনলিমিটেড পরীক্ষা ও সব বই খুলে দেয়।",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h2 className="text-center font-bn text-3xl font-bold tracking-tight">সাধারণ জিজ্ঞাসা</h2>
      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`f${i}`}>
            <AccordionTrigger className="py-5 text-left font-bn text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="font-bn text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="bg-hero">
      <div className="mx-auto max-w-3xl px-5 pb-4 pt-20 text-center">
        <p className="text-sm font-semibold text-sun">{eyebrow}</p>
        <h1 className="mt-3 font-bn text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 font-bn text-lg text-muted-foreground">{body}</p>
      </div>
    </section>
  );
}
