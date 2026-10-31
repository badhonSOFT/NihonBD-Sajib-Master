import { Check, X } from "lucide-react";
import { JpText, Sentence } from "@/components/jp/JpText";
import { SKILL_LABEL_BN, type Question } from "@/lib/content";
import { toBn } from "@/lib/rules";
import { cn } from "@/lib/utils";

interface Props {
  q: Question;
  index: number;
  chosen: number | null | undefined;
  onChoose?: (i: number) => void;
  mode: "exam" | "review";
  className?: string;
}

export function QuestionView({ q, index, chosen, onChoose, mode, className }: Props) {
  const review = mode === "review";
  const correct = chosen === q.answer;
  return (
    <div className={cn("rounded-3xl border bg-card p-6", className)}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index}
        </span>
        <span className="font-bn text-xs text-muted-foreground">{SKILL_LABEL_BN[q.skill]}</span>
        {review && (
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bn text-xs font-semibold",
              correct ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            {correct ? "সঠিক" : chosen == null ? "উত্তর দেননি" : "ভুল"}
          </span>
        )}
      </div>
      <Sentence
        jp={q.prompt}
        bn={q.promptBn}
        translatable={review}
        interactive={review}
        className="text-xl"
      />
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const isChosen = chosen === i;
          const isAnswer = i === q.answer;
          return (
            <button
              key={i}
              type="button"
              disabled={review}
              onClick={() => onChoose?.(i)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-lg transition-all",
                !review && "cursor-pointer hover:bg-accent",
                !review && isChosen && "border-primary bg-secondary ring-1 ring-primary",
                review && isAnswer && "border-success bg-success/10",
                review && isChosen && !isAnswer && "border-destructive bg-destructive/10",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  !review && isChosen && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {toBn(i + 1)}
              </span>
              <JpText text={o} interactive={review} className="leading-[1.9]" />
            </button>
          );
        })}
      </div>
      {review && (
        <div className="mt-5 rounded-2xl bg-secondary p-4">
          <p className="font-bn text-xs font-semibold uppercase tracking-wider text-muted-foreground">বাংলা ব্যাখ্যা</p>
          <p className="mt-1.5 font-bn leading-relaxed">{q.explanationBn}</p>
        </div>
      )}
    </div>
  );
}
