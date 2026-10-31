import { createFileRoute, Link } from "@tanstack/react-router";
import { useHydrated } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { QuestionView } from "@/components/exam/QuestionView";
import { Sentence } from "@/components/jp/JpText";
import { getExam } from "@/lib/content";
import { SECTION_CUTOFF, SECTION_LABEL_BN, toBn, type SectionKey } from "@/lib/rules";
import { useDB } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results/$attemptId")({
  head: () => ({
    meta: [
      { title: "পরীক্ষার ফলাফল ও রিভিউ | NihonBD" },
      { name: "description", content: "সেকশন-ভিত্তিক স্কোর, পাস/ফেল বিশ্লেষণ ও বাংলা ব্যাখ্যা সহ প্রশ্ন রিভিউ।" },
      { property: "og:title", content: "NihonBD মক টেস্ট ফলাফল" },
      { property: "og:description", content: "১৮০ নম্বরে স্কোর ও বিস্তারিত রিভিউ।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

const KEYS: SectionKey[] = ["vocab", "reading", "listening"];

function ResultsPage() {
  const { attemptId } = Route.useParams();
  const hydrated = useHydrated();
  const db = useDB();
  const attempt = db.attempts.find((a) => a.id === attemptId);
  const exam = attempt && getExam(attempt.examId);

  if (!hydrated) return <SiteLayout><div className="h-[60vh]" /></SiteLayout>;
  if (!attempt || !exam)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md py-32 text-center font-bn">
          <p className="text-lg font-semibold">ফলাফল খুঁজে পাওয়া যায়নি</p>
          <Button asChild className="mt-6"><Link to="/portal">পোর্টালে ফিরুন</Link></Button>
        </div>
      </SiteLayout>
    );

  let n = 0;
  return (
    <SiteLayout>
      <section className="bg-hero">
        <div className="mx-auto max-w-4xl px-5 pb-12 pt-16">
          <p className="text-sm font-semibold text-muted-foreground">{exam.title}</p>
          <div className="mt-6 flex flex-col gap-8 rounded-[2rem] border bg-card p-8 shadow-float md:flex-row md:items-center">
            <div className="text-center md:w-56">
              <div className="text-7xl font-bold tracking-tight tabular-nums">{attempt.total}</div>
              <div className="text-sm text-muted-foreground">/ 180</div>
              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-bn text-sm font-bold",
                  attempt.passed ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground",
                )}
              >
                {attempt.passed ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                {attempt.passed ? "পাস (合格)" : "ফেল (不合格)"}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {KEYS.map((k) => {
                const s = attempt.scores[k];
                const low = s < SECTION_CUTOFF;
                return (
                  <div key={k}>
                    <div className="flex justify-between font-bn text-sm">
                      <span>{SECTION_LABEL_BN[k]}</span>
                      <span className={cn("font-bold tabular-nums", low && "text-destructive")}>{s}/60</span>
                    </div>
                    <div className="relative mt-1.5 h-2 rounded-full bg-secondary">
                      <div className={cn("h-full rounded-full", low ? "bg-destructive" : "bg-primary")} style={{ width: `${(s / 60) * 100}%` }} />
                      <span className="absolute -top-1 h-4 w-0.5 bg-sun" style={{ left: `${(SECTION_CUTOFF / 60) * 100}%` }} title="কাট-অফ ১৯" />
                    </div>
                  </div>
                );
              })}
              <p className="text-[11px] text-muted-foreground">
                <span className="mr-1 inline-block h-2.5 w-0.5 bg-sun align-middle" /> সেকশন কাট-অফ ১৯ · মোট পাস ৯০
              </p>
            </div>
          </div>
          <p className={cn("mt-5 rounded-2xl p-5 font-bn leading-relaxed", attempt.passed ? "bg-success/10" : "bg-destructive/10")}>
            {attempt.reasonBn}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><Link to="/portal" search={{ tab: "mistakes" }}>ভুলের খাতা দেখুন</Link></Button>
            <Button asChild variant="outline"><Link to="/portal">পোর্টালে ফিরুন</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-12 px-5 py-16">
        <h2 className="text-2xl font-bold tracking-tight font-bn">রিভিউ মোড</h2>

        <div className="space-y-4">
          <h3 className="font-bn text-lg font-semibold">{SECTION_LABEL_BN.vocab}</h3>
          {exam.vocab.questions.map((q) => (
            <QuestionView key={q.id} q={q} index={++n} chosen={attempt.answers[q.id]} mode="review" />
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-bn text-lg font-semibold">{SECTION_LABEL_BN.reading}</h3>
          <div className="rounded-3xl bg-secondary p-6 text-lg">
            {exam.reading.passage.map((l, i) => (
              <Sentence key={i} jp={l.jp} bn={l.bn} />
            ))}
          </div>
          {exam.reading.questions.map((q) => (
            <QuestionView key={q.id} q={q} index={++n} chosen={attempt.answers[q.id]} mode="review" />
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-bn text-lg font-semibold">{SECTION_LABEL_BN.listening}</h3>
          <div className="rounded-3xl bg-slate-deep p-6 text-slate-deep-foreground">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-deep-muted">スクリプト · বাংলা সাবটাইটেল সহ</p>
            <div className="mt-3 space-y-3">
              {exam.listening.script.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-2 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-deep-foreground/10 font-jp text-xs">
                    {l.speaker}
                  </span>
                  <div>
                    <Sentence jp={l.jp} bn={l.bn} translatable={false} className="text-lg [&_rt]:text-slate-deep-muted" />
                    <p className="font-bn text-sm text-slate-deep-muted">{l.bn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {exam.listening.questions.map((q) => (
            <QuestionView key={q.id} q={q} index={++n} chosen={attempt.answers[q.id]} mode="review" />
          ))}
        </div>
        <p className="text-center font-bn text-sm text-muted-foreground">মোট {toBn(n)}টি প্রশ্ন</p>
      </section>
    </SiteLayout>
  );
}
