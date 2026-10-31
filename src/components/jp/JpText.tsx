import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Token =
  | { type: "text"; text: string }
  | { type: "word"; surface: string; reading: string; romaji: string; bn: string }
  | { type: "target"; text: string };

const RE = /\{([^}]*)\}|\[\[([^\]]*)\]\]/g;

export function parseJp(markup: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of markup.matchAll(RE)) {
    if (m.index! > last) out.push({ type: "text", text: markup.slice(last, m.index) });
    if (m[1] !== undefined) {
      const [surface = "", reading = "", romaji = "", bn = ""] = m[1].split("|");
      out.push({ type: "word", surface, reading, romaji, bn });
    } else {
      out.push({ type: "target", text: m[2] ?? "" });
    }
    last = m.index! + m[0].length;
  }
  if (last < markup.length) out.push({ type: "text", text: markup.slice(last) });
  return out;
}

/** Plain Japanese text (for speech synthesis). */
export const plainJp = (markup: string) =>
  parseJp(markup)
    .map((t) => (t.type === "word" ? t.surface : t.text))
    .join("");

interface JpTextProps {
  text: string;
  /** Tap-for-meaning popovers (off inside the live exam). */
  interactive?: boolean;
  furigana?: boolean;
  className?: string;
}

export function JpText({ text, interactive = true, furigana = true, className }: JpTextProps) {
  const tokens = parseJp(text);
  return (
    <span className={cn("font-jp leading-[2.1]", className)}>
      {tokens.map((t, i) => {
        if (t.type === "text") return <span key={i}>{t.text}</span>;
        if (t.type === "target")
          return (
            <span key={i} className="underline decoration-2 underline-offset-[6px] decoration-sun">
              {t.text}
            </span>
          );
        const hasKanji = /[\u4e00-\u9faf]/.test(t.surface);
        const word =
          furigana && hasKanji && t.reading ? (
            <ruby>
              {t.surface}
              <rt>{t.reading}</rt>
            </ruby>
          ) : (
            <>{t.surface}</>
          );
        if (!interactive || !t.bn) return <span key={i}>{word}</span>;
        return (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="cursor-pointer rounded-md px-0.5 transition-colors hover:bg-accent data-[state=open]:bg-secondary"
              >
                {word}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 rounded-2xl p-4 shadow-float" sideOffset={6}>
              <div className="font-jp text-2xl font-semibold">{t.surface}</div>
              {t.reading && <div className="font-jp text-sm text-muted-foreground">{t.reading}</div>}
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {t.romaji}
              </div>
              <div className="mt-3 border-t pt-3 font-bn text-base">{t.bn}</div>
            </PopoverContent>
          </Popover>
        );
      })}
    </span>
  );
}

interface SentenceProps {
  jp: string;
  bn: string;
  /** Show the eye toggle for Bengali translation (practice & review). */
  translatable?: boolean;
  interactive?: boolean;
  className?: string;
  defaultOpen?: boolean;
}

export function Sentence({
  jp,
  bn,
  translatable = true,
  interactive = true,
  className,
  defaultOpen = false,
}: SentenceProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("group", className)}>
      <div className="flex items-start gap-2">
        <JpText text={jp} interactive={interactive} className="flex-1" />
        {translatable && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "বাংলা অনুবাদ লুকান" : "বাংলা অনুবাদ দেখুন"}
            className="mt-2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {open ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {translatable && open && (
        <p className="animate-fade-up font-bn text-sm text-muted-foreground">{bn}</p>
      )}
    </div>
  );
}
