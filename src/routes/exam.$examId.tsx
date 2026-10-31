import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Headphones, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuestionView } from "@/components/exam/QuestionView";
import { OnceAudioPlayer } from "@/components/exam/OnceAudioPlayer";
import { JpText, plainJp } from "@/components/jp/JpText";
import { KanjiMark } from "@/components/site/Brand";
import { getExam, examDurationMin, examQuestions, type Exam, type Question } from "@/lib/content";
import { judge, scaleSection, toBn, SECTION_LABEL_BN, type SectionKey } from "@/lib/rules";
import { actions, useCurrentUser, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exam/$examId")({
  loader: ({ params }) => {
    const exam = getExam(params.examId);
    if (!exam) throw notFound();
    return { examId: exam.id, title: exam.title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Exam Room | NihonBD` : "Exam Room | NihonBD" },
      { name: "description", content: "JLPT/NAT-TEST কম্পিউটার-ভিত্তিক মক পরীক্ষা কক্ষ।" },
      { property: "og:title", content: loaderData ? `${loaderData.title} — NihonBD` : "NihonBD Exam Room" },
      { property: "og:description", content: "সেকশন টাইমার, অটো-লক ও একবার-বাজানো অডিও সহ মক টেস্ট।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExamPage,
});

const ORDER: SectionKey[] = ["vocab", "reading", "listening"];
type Phase = "intro" | SectionKey;

function sectionQuestions(exam: Exam, k: SectionKey): Question[] {
  return exam[k].questions;
}

function ExamPage() {
  const { examId } = Route.useLoaderData();
  const exam = getExam(examId)!;
  const navigate = useNavigate();
  const ui = useUI();
  const user = useCurrentUser();

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const busy = useRef(false);

  const enterSection = (k: SectionKey) => {
    const n = Date.now();
    setPhase(k);
    setQIndex(0);
    setNow(n);
    setDeadline(n + exam[k].durationMin * 60_000);
    busy.current = false;
    window.scrollTo({ top: 0 });
  };

  const start = () => {
    if (!exam.free && !actions.enterExam()) {
      ui.openCheckout();
      return;
    }
    if (!exam.free) toast("১টি টিকিট ব্যবহার হয়েছে (মাসিক পাস থাকলে নয়)");
    enterSection("vocab");
  };

  const finish = useCallback(() => {
    const a = answersRef.current;
    const correctCount = (qs: Question[]) => qs.filter((q) => a[q.id] === q.answer).length;
    const scores = {
      vocab: scaleSection(correctCount(exam.vocab.questions), exam.vocab.questions.length),
      reading: scaleSection(correctCount(exam.reading.questions), exam.reading.questions.length),
      listening: scaleSection(correctCount(exam.listening.questions), exam.listening.questions.length),
    };
    const v = judge(scores);
    const mistakes = examQuestions(exam)
      .filter((q) => a[q.id] !== q.answer)
      .map((q) => ({ qid: q.id, examId: exam.id, chosen: a[q.id] ?? null }));
    const id = actions.saveAttempt(
      { examId: exam.id, answers: a, scores, total: v.total, passed: v.passed, failedSections: v.failedSections, reasonBn: v.reasonBn },
      mistakes,
    );
    navigate({ to: "/results/$attemptId", params: { attemptId: id } });
  }, [exam, navigate]);

  const submitSection = useCallback(
    (auto: boolean) => {
      if (phase === "intro" || busy.current) return;
      busy.current = true;
      setConfirm(false);
      const i = ORDER.indexOf(phase);
      if (auto) toast.warning(`সময় শেষ — ${SECTION_LABEL_BN[phase]} সেকশন অটো-সাবমিট ও লক হয়েছে`);
      if (i === ORDER.length - 1) finish();
      else enterSection(ORDER[i + 1]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, finish],
  );

  useEffect(() => {
    if (phase === "intro") return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro" && deadline && now >= deadline) submitSection(true);
  }, [now, deadline, phase, submitSection]);

  useEffect(() => {
    if (phase === "intro") return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  const choose = (qid: string, i: number) => setAnswers((a) => ({ ...a, [qid]: i }));

  if (phase === "intro") return <Intro exam={exam} onStart={start} locked={!exam.free && !user} />;

  const qs = sectionQuestions(exam, phase);
  const remaining = Math.max(0, deadline - now);
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  const danger = remaining <= 5 * 60_000;
  const offset = ORDER.slice(0, ORDER.indexOf(phase)).reduce((n, k) => n + exam[k].questions.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <KanjiMark className="size-8 text-base" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Section {ORDER.indexOf(phase) + 1}/3
            </p>
            <p className="truncate font-bn text-sm font-semibold">{SECTION_LABEL_BN[phase]}</p>
          </div>
          <div className="mx-auto hidden items-center gap-1.5 md:flex">
            {qs.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setQIndex(i);
                  document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                aria-label={`প্রশ্ন ${i + 1}`}
                className={cn(
                  "size-3 cursor-pointer rounded-full transition-all",
                  answers[q.id] != null ? "bg-primary" : "bg-border",
                  phase === "vocab" && i === qIndex && "ring-2 ring-primary ring-offset-2",
                )}
              />
            ))}
          </div>
          <div
            className={cn(
              "ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 font-mono text-lg font-bold tabular-nums md:ml-0",
              danger && "timer-danger bg-destructive/10",
            )}
          >
            <Clock className="size-4" /> {mm}:{ss}
          </div>
          <Button size="sm" onClick={() => setConfirm(true)}>
            সেকশন সাবমিট
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {phase === "vocab" && (
          <div className="mx-auto max-w-3xl">
            <QuestionView
              q={qs[qIndex]}
              index={offset + qIndex + 1}
              chosen={answers[qs[qIndex].id]}
              onChoose={(i) => choose(qs[qIndex].id, i)}
              mode="exam"
              className="shadow-soft"
            />
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" disabled={qIndex === 0} onClick={() => setQIndex((i) => i - 1)}>
                <ArrowLeft /> আগের
              </Button>
              <span className="font-bn text-sm text-muted-foreground">
                {toBn(qIndex + 1)} / {toBn(qs.length)}
              </span>
              {qIndex < qs.length - 1 ? (
                <Button onClick={() => setQIndex((i) => i + 1)}>
                  পরের <ArrowRight />
                </Button>
              ) : (
                <Button onClick={() => setConfirm(true)}>সেকশন সাবমিট</Button>
              )}
            </div>
          </div>
        )}

        {phase === "reading" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border bg-card p-7 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">読解 · Passage</p>
              <h2 className="mt-2 text-2xl font-semibold">
                <JpText text={exam.reading.title} interactive={false} />
              </h2>
              <div className="mt-4 space-y-1 text-xl">
                {exam.reading.passage.map((l, i) => (
                  <p key={i}>
                    <JpText text={l.jp} interactive={false} />
                  </p>
                ))}
              </div>
            </article>
            <div className="space-y-4">
              {qs.map((q, i) => (
                <div id={`q-${q.id}`} key={q.id}>
                  <QuestionView q={q} index={offset + i + 1} chosen={answers[q.id]} onChoose={(c) => choose(q.id, c)} mode="exam" />
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "listening" && (
          <div className="mx-auto max-w-3xl space-y-4">
            <ListeningPlayer exam={exam} />
            <div className="rounded-3xl border bg-card p-6">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Headphones className="size-3.5" /> 状況
              </p>
              <p className="mt-2 text-lg">
                <JpText text={exam.listening.situation.jp} interactive={false} />
              </p>
            </div>
            {qs.map((q, i) => (
              <div id={`q-${q.id}`} key={q.id}>
                <QuestionView q={q} index={offset + i + 1} chosen={answers[q.id]} onChoose={(c) => choose(q.id, c)} mode="exam" />
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bn">সেকশন সাবমিট করবেন?</AlertDialogTitle>
            <AlertDialogDescription className="font-bn">
              সাবমিট করার পর এই সেকশন লক হয়ে যাবে — আর ফিরে আসা যাবে না।{" "}
              {qs.filter((q) => answers[q.id] == null).length > 0 &&
                `এখনও ${toBn(qs.filter((q) => answers[q.id] == null).length)}টি প্রশ্নের উত্তর দেননি।`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">ফিরে যান</AlertDialogCancel>
            <AlertDialogAction className="rounded-full" onClick={() => submitSection(false)}>
              সাবমিট ও লক
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ListeningPlayer({ exam }: { exam: Exam }) {
  const lines = useMemo(
    () => [
      { text: plainJp(exam.listening.situation.jp) },
      ...exam.listening.questions.map((q) => ({ text: plainJp(q.prompt) })),
      ...exam.listening.script.map((l) => ({ text: plainJp(l.jp), speaker: l.speaker })),
      ...exam.listening.questions.map((q) => ({ text: plainJp(q.prompt) })),
    ],
    [exam],
  );
  return <OnceAudioPlayer lines={lines} />;
}

function Intro({ exam, onStart, locked }: { exam: Exam; onStart: () => void; locked: boolean }) {
  const rules = [
    "প্রতিটি সেকশনের আলাদা টাইমার — সময় শেষ হলে অটো-সাবমিট ও লক।",
    "একবার সেকশন সাবমিট করলে আর পেছনে ফেরা যাবে না।",
    "লিসেনিং অডিও মাত্র একবার বাজবে — পজ/রিপ্লে নেই।",
    "পাস: মোট ১৮০ এর মধ্যে ৯০+, এবং প্রতিটি সেকশনে কমপক্ষে ১৯/৬০।",
    "শেষ ৫ মিনিটে টাইমার লাল হয়ে জ্বলবে।",
  ];
  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <X className="size-4" /> বের হন
        </Link>
        <div className="mt-8 rounded-[2rem] border bg-card p-8 shadow-float sm:p-10">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">
            {exam.level === "NAT" ? "NAT-TEST" : `JLPT ${exam.level}`} {exam.free && "· FREE"}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">{exam.title}</h1>
          <p className="font-bn text-muted-foreground">{exam.titleBn}</p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {ORDER.map((k) => (
              <div key={k} className="rounded-2xl bg-secondary p-4">
                <p className="font-bn text-xs text-muted-foreground">{SECTION_LABEL_BN[k]}</p>
                <p className="mt-1 text-lg font-bold">{toBn(exam[k].durationMin)} মি.</p>
                <p className="font-bn text-xs text-muted-foreground">{toBn(exam[k].questions.length)} প্রশ্ন</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2.5">
            {rules.map((r) => (
              <li key={r} className="flex gap-2.5 font-bn text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sun" /> {r}
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 w-full" onClick={onStart}>
            {locked ? <Lock /> : null}
            পরীক্ষা শুরু করুন · মোট {toBn(examDurationMin(exam))} মিনিট
          </Button>
          {!exam.free && (
            <p className="mt-3 text-center font-bn text-xs text-muted-foreground">
              শুরু করলে ১টি টিকিট ব্যবহার হবে (মাসিক পাস থাকলে ফ্রি)।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
