import { useEffect, useRef, useState } from "react";
import { Headphones, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AudioLine {
  text: string;
  speaker?: string;
}

type Status = "idle" | "playing" | "done" | "unsupported";

/**
 * Single-play listening track. One Play button; once started it cannot be paused,
 * seeked or replayed — mirroring the official CBT rule.
 */
export function OnceAudioPlayer({ lines }: { lines: AudioLine[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const uttRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) setStatus("unsupported");
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const play = () => {
    if (status !== "idle") return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const voices = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("ja"));
    const total = lines.length;
    uttRef.current = lines.map((l, i) => {
      const u = new SpeechSynthesisUtterance(l.text);
      u.lang = "ja-JP";
      if (voices.length) u.voice = voices[l.speaker === "男" && voices[1] ? 1 : 0];
      u.rate = 0.88;
      u.pitch = l.speaker === "女" ? 1.25 : l.speaker === "男" ? 0.75 : 1;
      u.onstart = () => setProgress(i / total);
      const end = () => {
        setProgress((i + 1) / total);
        if (i === total - 1) setStatus("done");
      };
      u.onend = end;
      u.onerror = end;
      return u;
    });
    setStatus("playing");
    uttRef.current.forEach((u) => synth.speak(u));
  };

  return (
    <div className="rounded-3xl bg-slate-deep p-5 text-slate-deep-foreground">
      <div className="flex items-center gap-4">
        {status === "idle" ? (
          <Button size="icon" variant="inverse" className="size-14" onClick={play} aria-label="Play">
            <Play className="size-6 fill-current" />
          </Button>
        ) : (
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-slate-deep-foreground/10",
              status === "playing" && "animate-pulse",
            )}
          >
            <Headphones className="size-6" />
          </span>
        )}
        <div className="flex-1">
          <p className="font-bn text-sm font-semibold">
            {status === "idle" && "অডিও মাত্র একবার বাজবে — প্রস্তুত হলে Play চাপুন"}
            {status === "playing" && "অডিও চলছে… মনোযোগ দিয়ে শুনুন"}
            {status === "done" && "অডিও শেষ — আর শোনা যাবে না"}
            {status === "unsupported" && "এই ব্রাউজারে অডিও চালানো যাচ্ছে না। Chrome ব্যবহার করুন।"}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-deep-foreground/15">
            <div
              className="h-full rounded-full bg-sun transition-all duration-700"
              style={{ width: `${(status === "done" ? 1 : progress) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-deep-muted">Pause · Seek · Replay disabled</p>
        </div>
      </div>
    </div>
  );
}
