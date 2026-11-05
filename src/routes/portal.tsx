import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, CalendarDays, History, Lock, NotebookPen, Receipt, Ticket, Trash2, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionView } from "@/components/exam/QuestionView";
import { LockOverlay } from "@/components/site/LockOverlay";
import { PayBadge } from "@/components/site/Brand";
import { BOOKS, EXAMS, SKILL_LABEL_BN, examQuestions, type Book, type Question, type Skill } from "@/lib/content";
import { PACKAGES, PASS_TOTAL, SECTION_LABEL_BN, canReadChapter, canTakeExam, hasMonthly, toBn, type SectionKey } from "@/lib/rules";
import { actions, useCurrentUser, useDB, useNow, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = ["exams", "analytics", "mistakes", "library", "history", "payments"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/portal")({
  validateSearch: z.object({ tab: z.enum(TABS).optional() }),
  head: () => ({
    meta: [
      { title: "স্টুডেন্ট পোর্টাল | NihonBD" },
      { name: "description", content: "আপনার মক টেস্ট, স্কোর অ্যানালিটিক্স, ভুলের খাতা, লাইব্রেরি ও পেমেন্ট রসিদ এক জায়গায়।" },
      { property: "og:title", content: "NihonBD স্টুডেন্ট পোর্টাল" },
      { property: "og:description", content: "মক টেস্ট, অ্যানালিটিক্স, ভুলের খাতা ও ডিজিটাল লাইব্রেরি।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortalPage,
});

const QMAP: Record<string, Question> = Object.fromEntries(EXAMS.flatMap((e) => examQuestions(e).map((q) => [q.id, q])));

function PortalPage() {
  const user = useCurrentUser();
  const db = useDB();
  const ui = useUI();
  const now = useNow(60000);
  const { tab = "exams" } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-5 py-32 text-center">
          <Lock className="mx-auto size-8" />
          <h1 className="mt-4 font-bn text-2xl font-bold">পোর্টাল দেখতে লগইন করুন</h1>
          <Button className="mt-6" onClick={() => ui.openAuth()}>Login / Register</Button>
        </div>
      </SiteLayout>
    );
  }

  const attempts = db.attempts.filter((a) => a.email === user.email);
  const vip = hasMonthly(user, now);
  const vipDays = vip ? Math.ceil((user.monthlyUntil - now) / 86400000) : 0;
  const passRate = attempts.length ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0;
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.total, 0) / attempts.length) : 0;

  return (
    <SiteLayout>
      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-deep font-jp text-2xl font-bold text-slate-deep-foreground">
              {user.name.slice(0, 1) || "日"}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-bn text-2xl font-bold">{user.name}</h1>
              <p className="truncate text-sm text-muted-foreground">{user.phone} · {user.email}</p>
            </div>
            <span className={cn("rounded-full px-3 py-1 font-bn text-xs font-bold", vip ? "bg-sun text-sun-foreground" : "bg-secondary")}>
              {vip ? "VIP মেম্বার" : "ফ্রি মেম্বার"}
            </span>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button size="sm" onClick={() => ui.openCheckout()}>রিচার্জ</Button>
              <Button size="sm" variant="outline" onClick={() => actions.demoBalance()}>
                <Zap /> ডেমো ব্যালেন্স (+১০ টিকিট)
              </Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Metric icon={Ticket} label="অবশিষ্ট টিকিট" value={toBn(user.tickets)} />
            <Metric icon={CalendarDays} label="মেম্বারশিপ মেয়াদ" value={`${toBn(vipDays)} দিন`} />
            <Metric icon={NotebookPen} label="ভুলের সংখ্যা" value={toBn(user.mistakes.length)} />
            <Metric icon={BarChart3} label="পাস রেট / গড়" value={`${toBn(passRate)}% · ${toBn(avg)}/১৮০`} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <Tabs value={tab} onValueChange={(v) => navigate({ search: { tab: v as Tab } })}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1">
            {[
              ["exams", "মক এক্সাম"],
              ["analytics", "অ্যানালিটিক্স"],
              ["mistakes", "ভুলের খাতা"],
              ["library", "লাইব্রেরি"],
              ["history", "ইতিহাস"],
              ["payments", "পেমেন্ট"],
            ].map(([v, l]) => (
              <TabsTrigger key={v} value={v} className="rounded-xl font-bn">{l}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="exams" className="mt-6"><ExamsTab unlocked={canTakeExam(user, now)} /></TabsContent>
          <TabsContent value="analytics" className="mt-6"><AnalyticsTab attempts={attempts} /></TabsContent>
          <TabsContent value="mistakes" className="mt-6"><MistakesTab mistakes={user.mistakes} /></TabsContent>
          <TabsContent value="library" className="mt-6"><LibraryTab /></TabsContent>
          <TabsContent value="history" className="mt-6"><HistoryTab attempts={attempts} /></TabsContent>
          <TabsContent value="payments" className="mt-6"><PaymentsTab payments={user.payments} /></TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Ticket; label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-card p-4 shadow-soft">
      <Icon className="size-5 text-sun" />
      <p className="mt-3 text-xl font-bold tracking-tight">{value}</p>
      <p className="font-bn text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-3xl border border-dashed p-10 text-center font-bn text-muted-foreground">{text}</p>;
}

function ExamsTab({ unlocked }: { unlocked: boolean }) {
  const [f, setF] = useState<"all" | "N5" | "N4" | "NAT">("all");
  const list = EXAMS.filter((e) => f === "all" || e.level === f);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(["all", "N5", "N4", "NAT"] as const).map((x) => (
          <Button key={x} size="sm" variant={f === x ? "default" : "outline"} onClick={() => setF(x)}>
            {x === "all" ? "সব" : x === "NAT" ? "NAT-TEST" : x}
          </Button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((e) => {
          const open = e.free || unlocked;
          return (
            <div key={e.id} className="rounded-3xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{e.level === "NAT" ? "NAT-TEST" : `JLPT ${e.level}`}</span>
                <span className={cn("rounded-full px-3 py-1 font-bn text-xs font-bold", open ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive")}>
                  {e.free ? "ফ্রি" : open ? "আনলকড" : "লকড"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{e.title}</h3>
              <p className="font-bn text-sm text-muted-foreground">{e.titleBn}</p>
              <Button asChild className="mt-5" variant={open ? "default" : "outline"}>
                <Link to="/exam/$examId" params={{ examId: e.id }}>{open ? "শুরু করুন" : "টিকিট দিয়ে খুলুন"}</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type AttemptList = ReturnType<typeof useDB>["attempts"];

function AnalyticsTab({ attempts }: { attempts: AttemptList }) {
  const series = [...attempts].reverse().slice(-10);
  const skills = useMemo(() => {
    const acc: Record<Skill, { c: number; t: number }> = {
      kanji: { c: 0, t: 0 }, vocab: { c: 0, t: 0 }, grammar: { c: 0, t: 0 }, reading: { c: 0, t: 0 }, listening: { c: 0, t: 0 },
    };
    for (const a of attempts) {
      for (const [qid, ch] of Object.entries(a.answers)) {
        const q = QMAP[qid];
        if (!q) continue;
        acc[q.skill].t++;
        if (ch === q.answer) acc[q.skill].c++;
      }
    }
    return acc;
  }, [attempts]);
  if (!attempts.length) return <Empty text="এখনো কোনো পরীক্ষা দেননি। একটি মক টেস্ট দিলে এখানে গ্রাফ দেখাবে।" />;
  const W = 600, H = 220;
  const x = (i: number) => (series.length === 1 ? W / 2 : 30 + (i * (W - 60)) / (series.length - 1));
  const y = (v: number) => H - 20 - (v / 180) * (H - 40);
  const keys = Object.keys(skills) as Skill[];
  const R = 90, cx = 120, cy = 115;
  const pt = (i: number, r: number) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / keys.length;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  };
  const poly = keys.map((k, i) => pt(i, R * (skills[k].t ? skills[k].c / skills[k].t : 0)).join(",")).join(" ");
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border bg-card p-6">
        <h3 className="font-bn font-semibold">স্কোর প্রগ্রেস (পাস লাইন {toBn(PASS_TOTAL)})</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
          <line x1="20" x2={W - 10} y1={y(PASS_TOTAL)} y2={y(PASS_TOTAL)} className="stroke-sun" strokeDasharray="6 6" />
          <polyline fill="none" className="stroke-foreground" strokeWidth="3" points={series.map((a, i) => `${x(i)},${y(a.total)}`).join(" ")} />
          {series.map((a, i) => (
            <circle key={a.id} cx={x(i)} cy={y(a.total)} r="5" className={a.passed ? "fill-success" : "fill-destructive"} />
          ))}
        </svg>
      </div>
      <div className="rounded-3xl border bg-card p-6">
        <h3 className="font-bn font-semibold">স্কিল ব্রেকডাউন</h3>
        <svg viewBox="0 0 240 240" className="mx-auto mt-2 w-full max-w-xs">
          {[0.33, 0.66, 1].map((s) => (
            <polygon key={s} points={keys.map((_, i) => pt(i, R * s).join(",")).join(" ")} className="fill-none stroke-border" />
          ))}
          <polygon points={poly} className="fill-sun/30 stroke-sun" strokeWidth="2" />
          {keys.map((k, i) => {
            const [lx, ly] = pt(i, R + 16);
            return <text key={k} x={lx} y={ly} textAnchor="middle" fontSize="11" className="fill-muted-foreground font-bn">{SKILL_LABEL_BN[k]}</text>;
          })}
        </svg>
      </div>
    </div>
  );
}

function MistakesTab({ mistakes }: { mistakes: { qid: string; chosen: number | null }[] }) {
  const list = mistakes.filter((m) => QMAP[m.qid]);
  if (!list.length) return <Empty text="ভুলের খাতা খালি। মক টেস্টে ভুল করা প্রশ্ন এখানে নিজে থেকে সেভ হবে।" />;
  return (
    <div className="space-y-4">
      {list.map((m, i) => (
        <div key={m.qid} className="relative">
          <QuestionView q={QMAP[m.qid]!} index={i + 1} chosen={m.chosen} mode="review" />
          <Button size="sm" variant="ghost" className="absolute bottom-4 right-4" onClick={() => actions.removeMistake(m.qid)}>
            <Trash2 /> রিভাইজ শেষ
          </Button>
        </div>
      ))}
    </div>
  );
}

function LibraryTab() {
  const user = useCurrentUser();
  const now = useNow(60000);
  const [bookId, setBookId] = useState(BOOKS[0]!.id);
  const book = BOOKS.find((b) => b.id === bookId) as Book;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {BOOKS.map((b) => (
          <Button key={b.id} size="sm" variant={b.id === bookId ? "default" : "outline"} onClick={() => setBookId(b.id)}>
            <BookOpen /> <span className="font-bn">{b.titleBn}</span>
          </Button>
        ))}
      </div>
      <div className="mt-6 space-y-6">
        {book.chapters.map((ch, ci) => {
          const ok = canReadChapter(user, ci + 1, now);
          return (
            <div key={ch.title} className="relative overflow-hidden rounded-3xl border bg-card p-6">
              <h3 className="font-bn text-lg font-semibold">অধ্যায় {toBn(ci + 1)} · {ch.titleBn}</h3>
              <div className={cn("mt-4 grid gap-2 sm:grid-cols-2", !ok && "pointer-events-none select-none blur-sm")}>
                {ch.entries.map((e, i) => (
                  <div key={i} className="rounded-2xl bg-secondary p-3">
                    {e.kind === "vocab" && (<><p className="font-jp text-lg">{e.jp} <span className="text-sm text-muted-foreground">{e.reading}</span></p><p className="text-xs text-muted-foreground">{e.romaji} · <span className="font-bn">{e.bn}</span></p></>)}
                    {e.kind === "kanji" && (<><p className="font-jp text-3xl">{e.kanji}</p><p className="font-jp text-xs">音 {e.on} · 訓 {e.kun}</p><p className="font-bn text-sm">{e.bn}</p><p className="font-jp text-xs text-muted-foreground">{e.example}</p></>)}
                    {e.kind === "grammar" && (<><p className="font-jp font-semibold">{e.pattern}</p><p className="font-bn text-sm">{e.bn}</p><p className="font-jp text-sm">{e.example}</p><p className="font-bn text-xs text-muted-foreground">{e.exampleBn}</p></>)}
                  </div>
                ))}
              </div>
              {!ok && <LockOverlay />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryTab({ attempts }: { attempts: AttemptList }) {
  if (!attempts.length) return <Empty text="এখনো কোনো পরীক্ষার ইতিহাস নেই।" />;
  return (
    <div className="space-y-3">
      {attempts.map((a) => {
        const exam = EXAMS.find((e) => e.id === a.examId);
        return (
          <div key={a.id} className="rounded-3xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <History className="size-4 text-muted-foreground" />
              <p className="flex-1 font-semibold">{exam?.title ?? a.examId}</p>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", a.passed ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive")}>
                {a.passed ? "PASS" : "FAIL"} · {toBn(a.total)}/১৮০
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(Object.keys(a.scores) as SectionKey[]).map((k) => (
                <div key={k} className={cn("rounded-2xl p-2 text-center", a.failedSections.includes(k) ? "bg-destructive/10" : "bg-secondary")}>
                  <p className="font-bold">{toBn(a.scores[k])}/৬০</p>
                  <p className="font-bn text-[11px] text-muted-foreground">{SECTION_LABEL_BN[k]}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-bn text-xs text-muted-foreground">{new Date(a.date).toLocaleString("bn-BD")}</p>
              <Button asChild size="sm" variant="outline">
                <Link to="/results/$attemptId" params={{ attemptId: a.id }}>রিভিউ দেখুন</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentsTab({ payments }: { payments: { id: string; pkg: string; method: "bkash" | "nagad"; sender: string; trxId: string; date: number }[] }) {
  if (!payments.length) return <Empty text="এখনো কোনো পেমেন্ট করেননি।" />;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {payments.map((p) => {
        const pkg = PACKAGES.find((x) => x.id === p.pkg);
        return (
          <div key={p.id} className="rounded-3xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <PayBadge method={p.method} />
              <span className="rounded-full bg-success/15 px-3 py-1 font-bn text-xs font-bold text-success">ভেরিফাইড</span>
            </div>
            <p className="mt-3 font-bn font-semibold"><Receipt className="mr-1 inline size-4" />{pkg?.titleBn} · ৳{pkg?.priceBn}</p>
            <p className="mt-1 text-xs text-muted-foreground">TrxID: {p.trxId} · {p.sender}</p>
            <p className="font-bn text-xs text-muted-foreground">{new Date(p.date).toLocaleString("bn-BD")}</p>
          </div>
        );
      })}
    </div>
  );
}
