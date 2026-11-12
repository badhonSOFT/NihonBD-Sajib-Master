import { useEffect, useRef, useState } from "react";
import { Eraser, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Touch & mouse writing canvas with a faint guide kanji and a ReDraw reveal animation. */
export function WritingPad({ kanji }: { kanji: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [replay, setReplay] = useState(0);

  const clear = () => {
    const c = ref.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  };
  useEffect(clear, [kanji]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 600, ((e.clientY - r.top) / r.height) * 600] as const;
  };

  return (
    <div className="space-y-3">
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border-2 border-dashed bg-card">
        <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-b border-r border-dashed border-border" />
          <div className="border-b border-dashed border-border" />
          <div className="border-r border-dashed border-border" />
        </div>
        <span
          key={replay}
          className="kanji-reveal pointer-events-none absolute inset-0 flex items-center justify-center font-jp text-[14rem] leading-none text-foreground/10"
        >
          {kanji}
        </span>
        <canvas
          ref={ref}
          width={600}
          height={600}
          aria-label="লেখার বোর্ড"
          className="absolute inset-0 size-full touch-none cursor-crosshair"
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            const ctx = e.currentTarget.getContext("2d")!;
            const [x, y] = pos(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = e.currentTarget.getContext("2d")!;
            const [x, y] = pos(e);
            ctx.lineWidth = 22;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = getComputedStyle(e.currentTarget).color;
            ctx.lineTo(x, y);
            ctx.stroke();
          }}
          onPointerUp={() => (drawing.current = false)}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setReplay((r) => r + 1)}>
          <Play /> ReDraw
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          <Eraser /> মুছুন
        </Button>
      </div>
    </div>
  );
}
