import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Check, Lock, Search, Volume2, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageIntro } from "@/components/site/sections";
import { LockOverlay } from "@/components/site/LockOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sentence } from "@/components/jp/JpText";
import { WritingPad } from "@/components/theory/WritingPad";
import { LESSONS, speakJa, type Kanji, type Lesson } from "@/lib/kanji";
import { hasPremium, toBn } from "@/lib/rules";
import { actions, useCurrentUser, useNow } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/theory")({
  head: () => ({
    meta: [
      { title: "Kanji ও থিওরি — N5 কাঞ্জি লেসন | NihonBD" },
      { name: "description", content: "অন/কুন রিডিং, বাংলা অর্থ, কুইজ, উচ্চারণ ও লেখার বোর্ড সহ N5 কাঞ্জি লেসন। লেসন ১ ফ্রি।" },
      { property: "og:title", content: "NihonBD কাঞ্জি ও থিওরি" },
      { property: "og:description", content: "কাঞ্জি শিখুন: সংজ্ঞা, কুইজ, উচ্চারণ ও লেখা — বাংলায়।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TheoryPage,
});

type Mode = "def" | "quiz" | "speak" | "write";
const MODES: [Mode, string][] = [["def", "সংজ্ঞা"], ["quiz", "কুইজ"], ["speak", "উচ্চারণ"], ["write", "লেখা"]];

function TheoryPage() {
  return (
    <SiteLayout>
      <PageIntro eyebrow="Theory · 漢字" title="প্রতিটি কাঞ্জি, বাংলায়।" body="লেসন ১ সবার জন্য ফ্রি। কার্ডে চাপ দিলে রিডিং, উদাহরণ ও শব্দতালিকা দেখবেন।" />
      <TheoryEngine />
    </SiteLayout>
  );
}

export function TheoryEngine() {
  const user = useCurrentUser();
  const now = useNow(60_000);
  const premium = hasPremium(user, now);
  const [level, setLevel] = useState<"N5" | "N4">("N5");
  const [cat, setCat] = useState<"kanji" | "vocab">("kanji");
  const [q, setQ] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [lessonNo, setLessonNo] = useState(1);
  const [mode, setMode] = useState<Mode>("def");
  const [detail, setDetail] = useState<Kanji | null>(null);
  const saved = user?.saved ?? [];

  const lessons = LESSONS.filter((l) => l.level === level);
  const lesson = lessons.find((l) => l.no === lessonNo) ?? lessons[0];
  const locked = !!lesson && lesson.no > 1 && !premium;

  const filtered = useMemo(() => {
    if (!lesson) return [];
    const s = q.trim().toLowerCase();
    return lesson.kanji.filter(
      (k) =>
        (!savedOnly || saved.includes(`k:${k.k}`)) &&
        (!s || k.k.includes(s) || k.romaji.toLowerCase().includes(s) || k.bn.includes(s) || k.words.some((w) => w.w.includes(s) || w.bn.includes(s))),
    );
  }, [lesson, q, savedOnly, saved]);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="flex flex-wrap items-center gap-2 rounded-3xl border bg-card p-3">
        <Seg value={level} onChange={(v) => setLevel(v as "N5" | "N4")} items={[["N5", "N5"], ["N4", "N4"]]} />
        <Seg value={cat} onChange={(v) => setCat(v as "kanji" | "vocab")} items={[["kanji", "কাঞ্জি"], ["vocab", "শব্দভান্ডার"]]} />
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="কাঞ্জি, রোমাজি বা বাংলা দিয়ে খুঁজুন" className="rounded-full pl-9" />
        </div>
        <Button variant={savedOnly ? "default" : "outline"} size="sm" onClick={() => setSavedOnly((s) => !s)}>
          <Bookmark /> সংরক্ষিত
        </Button>
      </div>

      {lessons.length === 0 ? (
        <p className="mt-10 text-center font-bn text-muted-foreground">N4 লেসন শীঘ্রই আসছে।</p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lessons.map((l) => (
              <LessonCard key={l.no} l={l} active={l.no === lesson?.no} locked={l.no > 1 && !premium} onClick={() => setLessonNo(l.no)} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {MODES.map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn("cursor-pointer rounded-full px-4 py-2 font-bn text-sm font-semibold transition-colors", mode === m ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent")}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative mt-6 min-h-80 rounded-[2rem]">
            {locked && <LockOverlay />}
            <div className={cn(locked && "pointer-events-none select-none blur-sm")}>
              {cat === "vocab" ? (
                <VocabList kanji={filtered} />
              ) : mode === "def" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {filtered.map((k) => (
                    <button
                      key={k.k}
                      type="button"
                      onClick={() => setDetail(k)}
                      className="group cursor-pointer rounded-3xl border bg-card p-5 text-left shadow-soft transition-transform hover:-translate-y-0.5"
                    >
                      <span className="font-jp text-6xl font-bold">{k.k}</span>
                      <p className="mt-3 font-bn text-sm font-semibold">{k.bn}</p>
                      <p className="text-xs text-muted-foreground">{k.romaji} · {toBn(k.strokes)} স্ট্রোক</p>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="col-span-full py-10 text-center font-bn text-muted-foreground">কিছু পাওয়া যায়নি।</p>}
                </div>
              ) : mode === "quiz" && lesson ? (
                <KanjiQuiz key={lesson.no} lesson={lesson} />
              ) : mode === "speak" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filtered.map((k) => (
                    <div key={k.k} className="flex items-center gap-4 rounded-3xl border bg-card p-4">
                      <span className="font-jp text-4xl font-bold">{k.k}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-jp text-sm">{k.kun} · {k.on}</p>
                        <p className="font-bn text-xs text-muted-foreground">{k.bn}</p>
                      </div>
                      <Button size="icon" variant="outline" aria-label={`${k.k} শুনুন`} onClick={() => speakJa(k.words[0]?.r ?? k.k)}>
                        <Volume2 />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <WriteMode kanji={filtered} />
              )}
            </div>
          </div>
        </>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-jp text-5xl">{detail.k}</span>
                  <span className="font-bn text-lg">{detail.bn}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                    aria-label="সংরক্ষণ"
                    disabled={!user}
                    onClick={() => actions.toggleSaved(`k:${detail.k}`)}
                  >
                    {saved.includes(`k:${detail.k}`) ? <BookmarkCheck /> : <Bookmark />}
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <Info label="অন-ইয়োমি" value={detail.on} />
                <Info label="কুন-ইয়োমি" value={detail.kun} />
                <Info label="স্ট্রোক" value={toBn(detail.strokes)} />
              </div>
              <WritingPad kanji={detail.k} />
              <div className="rounded-2xl bg-secondary p-4">
                <p className="mb-1 font-bn text-xs font-semibold text-muted-foreground">উদাহরণ</p>
                <Sentence jp={detail.example.jp} bn={detail.example.bn} defaultOpen />
              </div>
              <div>
                <p className="mb-2 font-bn text-xs font-semibold text-muted-foreground">যৌগিক শব্দ</p>
                <ul className="space-y-1.5">
                  {detail.words.map((w) => (
                    <li key={w.w} className="flex items-center gap-3 rounded-xl border px-3 py-2">
                      <span className="font-jp text-lg font-semibold">{w.w}</span>
                      <span className="font-jp text-sm text-muted-foreground">{w.r}</span>
                      <span className="ml-auto font-bn text-sm">{w.bn}</span>
                      <button type="button" aria-label="শুনুন" className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => speakJa(w.r)}>
                        <Volume2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Seg({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: [string, string][] }) {
  return (
    <div className="flex rounded-full bg-secondary p-1">
      {items.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={cn("cursor-pointer rounded-full px-3.5 py-1.5 font-bn text-sm font-semibold", value === v ? "bg-card shadow-soft" : "text-muted-foreground")}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="font-bn text-[11px] text-muted-foreground">{label}</p>
      <p className="font-jp font-semibold">{value}</p>
    </div>
  );
}

function LessonCard({ l, active, locked, onClick }: { l: Lesson; active: boolean; locked: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex cursor-pointer items-center gap-4 rounded-3xl border bg-card p-5 text-left transition-shadow", active && "ring-2 ring-primary")}>
      <span className="font-jp text-3xl tracking-widest">{l.kanji.slice(0, 3).map((k) => k.k).join("")}</span>
      <div className="flex-1">
        <p className="font-bn font-semibold">{l.title}</p>
        <p className="font-bn text-xs text-muted-foreground">{toBn(l.kanji.length)}টি কাঞ্জি</p>
      </div>
      {locked ? <Lock className="size-4 text-muted-foreground" /> : l.no === 1 && <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">FREE</span>}
    </button>
  );
}

function VocabList({ kanji }: { kanji: Kanji[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      {kanji.flatMap((k) => k.words.map((w) => (
        <div key={k.k + w.w} className="flex items-center gap-4 border-b px-5 py-3 last:border-0">
          <span className="w-24 font-jp text-lg font-semibold">{w.w}</span>
          <span className="w-32 font-jp text-sm text-muted-foreground">{w.r}</span>
          <span className="flex-1 font-bn text-sm">{w.bn}</span>
          <button type="button" aria-label="শুনুন" className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => speakJa(w.r)}>
            <Volume2 className="size-4" />
          </button>
        </div>
      )))}
    </div>
  );
}

function KanjiQuiz({ lesson }: { lesson: Lesson }) {
  const [seed, setSeed] = useState(0);
  const qs = useMemo(() => {
    const pool = [...lesson.kanji].sort(() => Math.random() - 0.5).slice(0, 5);
    return pool.map((k) => {
      const wrong = lesson.kanji.filter((x) => x.k !== k.k).sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.bn);
      const options = [...wrong, k.bn].sort(() => Math.random() - 0.5);
      return { k, options, answer: options.indexOf(k.bn) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const cur = qs[i];

  if (!cur)
    return (
      <div className="rounded-3xl border bg-card p-10 text-center">
        <p className="font-bn text-lg">স্কোর</p>
        <p className="mt-2 text-5xl font-bold">{toBn(score)} / {toBn(qs.length)}</p>
        <Button className="mt-6" onClick={() => { setSeed((s) => s + 1); setI(0); setScore(0); setPicked(null); }}>আবার চেষ্টা করুন</Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center">
      <p className="font-bn text-xs text-muted-foreground">প্রশ্ন {toBn(i + 1)} / {toBn(qs.length)} · এই কাঞ্জির অর্থ কী?</p>
      <p className="my-6 font-jp text-8xl font-bold">{cur.k.k}</p>
      <div className="grid grid-cols-2 gap-2">
        {cur.options.map((o, oi) => {
          const show = picked != null;
          return (
            <button
              key={o}
              type="button"
              disabled={show}
              onClick={() => { setPicked(oi); if (oi === cur.answer) setScore((s) => s + 1); }}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-2xl border p-4 font-bn font-semibold transition-colors",
                show && oi === cur.answer && "border-success bg-success/15 text-success",
                show && oi === picked && oi !== cur.answer && "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {show && oi === cur.answer && <Check className="size-4" />}
              {show && oi === picked && oi !== cur.answer && <X className="size-4" />}
              {o}
            </button>
          );
        })}
      </div>
      {picked != null && (
        <Button className="mt-6" onClick={() => { setI((x) => x + 1); setPicked(null); }}>পরের প্রশ্ন</Button>
      )}
    </div>
  );
}

function WriteMode({ kanji }: { kanji: Kanji[] }) {
  const [sel, setSel] = useState(0);
  const k = kanji[Math.min(sel, kanji.length - 1)];
  if (!k) return null;
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div className="grid grid-cols-4 content-start gap-2">
        {kanji.map((x, i) => (
          <button key={x.k} type="button" onClick={() => setSel(i)} className={cn("cursor-pointer rounded-xl border bg-card py-2 font-jp text-2xl", x.k === k.k && "ring-2 ring-primary")}>
            {x.k}
          </button>
        ))}
      </div>
      <div>
        <p className="mb-3 text-center font-bn text-sm text-muted-foreground">{k.k} · {k.bn} · {toBn(k.strokes)} স্ট্রোক — আঙুল বা মাউস দিয়ে লিখুন</p>
        <WritingPad kanji={k.k} />
      </div>
    </div>
  );
}
