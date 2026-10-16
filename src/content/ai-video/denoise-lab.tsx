"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A cartoon of diffusion, not a real model: each example scene is drawn once in brand colors, then shown blended with
 * one fixed patch of static. Early steps show only coarse blocks of the scene (layout and movement come first); later
 * steps sharpen to full detail. Both prompts start from the same static, so the reader sees the prompt decide what the
 * noise becomes. Nothing here calls a model.
 */

const W = 320;
const H = 180;
const STEPS = 30;

type Palette = Record<"page" | "surface" | "ink" | "muted" | "fill" | "accent" | "accentTint", string>;

type Shot = {
  id: string;
  tab: string;
  prompt: string;
  draw: (g: CanvasRenderingContext2D, c: Palette) => void;
};

const SHOTS: Shot[] = [
  {
    id: "lighthouse",
    tab: "Lighthouse at dusk",
    prompt:
      "Wide establishing shot, static tripod. A white lighthouse on a grassy hill at dusk, its lamp just switched on. A pale moon low in the sky. Soft evening light, cool blue tones.",
    draw(g, c) {
      g.fillStyle = c.accentTint;
      g.fillRect(0, 0, W, H);
      g.fillStyle = c.muted;
      g.beginPath();
      g.arc(W * 0.74, H * 0.36, 22, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = c.fill;
      g.beginPath();
      g.moveTo(0, H * 0.78);
      g.quadraticCurveTo(W * 0.3, H * 0.52, W * 0.55, H * 0.74);
      g.quadraticCurveTo(W * 0.8, H * 0.9, W, H * 0.68);
      g.lineTo(W, H);
      g.lineTo(0, H);
      g.fill();
      g.fillStyle = c.ink;
      g.beginPath();
      g.moveTo(W * 0.26, H * 0.68);
      g.lineTo(W * 0.3, H * 0.28);
      g.lineTo(W * 0.35, H * 0.28);
      g.lineTo(W * 0.39, H * 0.68);
      g.fill();
      g.fillStyle = c.page;
      g.fillRect(W * 0.285, H * 0.44, W * 0.08, 5);
      g.fillStyle = c.accent;
      g.fillRect(W * 0.29, H * 0.18, W * 0.07, H * 0.1);
    },
  },
  {
    id: "cup",
    tab: "Coffee cup close-up",
    prompt:
      "Close-up, static tripod. A blue coffee cup on a wooden counter, steam rising. Morning window light from the left, shallow depth of field.",
    draw(g, c) {
      g.fillStyle = c.surface;
      g.fillRect(0, 0, W, H);
      g.fillStyle = c.accentTint;
      g.fillRect(W * 0.05, H * 0.08, W * 0.3, H * 0.5);
      g.fillStyle = c.fill;
      g.fillRect(0, H * 0.7, W, H * 0.3);
      g.fillStyle = c.accent;
      g.beginPath();
      g.moveTo(W * 0.4, H * 0.36);
      g.lineTo(W * 0.62, H * 0.36);
      g.lineTo(W * 0.6, H * 0.76);
      g.lineTo(W * 0.42, H * 0.76);
      g.fill();
      g.lineWidth = 7;
      g.strokeStyle = c.accent;
      g.beginPath();
      g.arc(W * 0.64, H * 0.54, 15, -Math.PI / 2, Math.PI / 2);
      g.stroke();
      g.fillStyle = c.ink;
      g.fillRect(W * 0.36, H * 0.76, W * 0.3, 6);
      g.lineWidth = 3;
      g.strokeStyle = c.muted;
      g.lineCap = "round";
      for (const dx of [0.46, 0.52, 0.57]) {
        g.beginPath();
        g.moveTo(W * dx, H * 0.3);
        g.bezierCurveTo(W * (dx - 0.03), H * 0.22, W * (dx + 0.03), H * 0.16, W * dx, H * 0.06);
        g.stroke();
      }
    },
  },
];

const PHASES: { upTo: number; label: string; note: string }[] = [
  { upTo: 3, label: "Pure static", note: "Nothing yet. Every clip, for every prompt, starts here." },
  { upTo: 12, label: "Layout and movement", note: "Big shapes appear: where the horizon is, where the subject sits. Your camera and shot words matter most here." },
  { upTo: 24, label: "Shapes settle", note: "Objects take their outline and colors. Changing the subject now would mean starting over." },
  { upTo: STEPS, label: "Fine detail", note: "Edges, texture and small details sharpen. Style words like a film look mostly act here." },
];

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(`--color-${name}`).trim() || "#888";
  return {
    page: v("page"),
    surface: v("surface"),
    ink: v("ink"),
    muted: v("muted"),
    fill: v("fill"),
    accent: v("accent"),
    accentTint: v("accent-tint"),
  };
}

/** The same static for every prompt: a seeded grey value per pixel between page and ink. */
function makeNoise() {
  let s = 2026;
  const out = new Float32Array(W * H);
  for (let i = 0; i < out.length; i++) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    out[i] = s / 4294967296;
  }
  return out;
}

function parseRgb(color: string, g: CanvasRenderingContext2D) {
  g.fillStyle = color;
  g.fillRect(0, 0, 1, 1);
  const d = g.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

export function DenoiseLab() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [shotId, setShotId] = useState(SHOTS[0].id);
  const [step, setStep] = useState(6);
  const [playing, setPlaying] = useState(false);
  const [scheme, setScheme] = useState(0);
  const noise = useRef<Float32Array | null>(null);
  const shot = SHOTS.find((s) => s.id === shotId) ?? SHOTS[0];
  const phase = PHASES.find((p) => step <= p.upTo) ?? PHASES[PHASES.length - 1];

  // Redraw when the system switches between light and dark, so the scene keeps using the current tokens.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setScheme((n) => n + 1);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d", { willReadFrequently: true });
    if (!el || !ctx) return;
    noise.current ??= makeNoise();
    const palette = readPalette();

    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const g = off.getContext("2d", { willReadFrequently: true })!;
    const lo = parseRgb(palette.page, g);
    const hi = parseRgb(palette.ink, g);
    shot.draw(g, palette);
    const clean = g.getImageData(0, 0, W, H).data;

    const t = step / STEPS;
    // Coarse-to-fine: block size shrinks from 32px to 1px as the steps go on.
    const block = Math.max(1, Math.round(32 * Math.pow(1 - t, 1.6)));
    const img = ctx.createImageData(W, H);
    const d = img.data;
    const n = noise.current;
    for (let by = 0; by < H; by += block) {
      for (let bx = 0; bx < W; bx += block) {
        let r = 0, gr = 0, b = 0, count = 0;
        for (let y = by; y < Math.min(by + block, H); y++) {
          for (let x = bx; x < Math.min(bx + block, W); x++) {
            const i = (y * W + x) * 4;
            r += clean[i];
            gr += clean[i + 1];
            b += clean[i + 2];
            count++;
          }
        }
        r /= count;
        gr /= count;
        b /= count;
        for (let y = by; y < Math.min(by + block, H); y++) {
          for (let x = bx; x < Math.min(bx + block, W); x++) {
            const p = y * W + x;
            const i = p * 4;
            const k = n[p];
            d[i] = r * t + (lo[0] + (hi[0] - lo[0]) * k) * (1 - t);
            d[i + 1] = gr * t + (lo[1] + (hi[1] - lo[1]) * k) * (1 - t);
            d[i + 2] = b * t + (lo[2] + (hi[2] - lo[2]) * k) * (1 - t);
            d[i + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [shot, step, scheme]);

  // "Play" walks the steps from 0 to 30, one timer tick per step, and stops itself at the end.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setStep((s) => Math.min(STEPS, s + 1));
      if (step + 1 >= STEPS) setPlaying(false);
    }, 90);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  function togglePlay() {
    if (playing) return setPlaying(false);
    // With reduced motion, skip the animation and show the finished shot.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setStep(STEPS);
    if (step >= STEPS) setStep(0);
    setPlaying(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Example prompts" className="flex flex-wrap gap-2">
        {SHOTS.map((s) => {
          const active = s.id === shot.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setShotId(s.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                active ? "bg-accent text-page" : "bg-surface text-ink"
              }`}
            >
              {s.tab}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-3 md:p-5">
          <canvas
            ref={canvas}
            width={W}
            height={H}
            role="img"
            aria-label={`Example frame at step ${step} of ${STEPS}: ${phase.label.toLowerCase()}.`}
            className="aspect-video w-full rounded-2xl [image-rendering:pixelated]"
          />
          <div className="flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={togglePlay}
              className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-page transition-transform duration-100 active:scale-[0.98]"
            >
              {playing ? "Pause" : step >= STEPS ? "Replay" : "Play"}
            </button>
            <label className="flex w-full items-center gap-3">
              <span className="sr-only">Denoising step</span>
              <input
                type="range"
                min={0}
                max={STEPS}
                value={step}
                onChange={(event) => {
                  setPlaying(false);
                  setStep(Number(event.target.value));
                }}
                className="w-full accent-[var(--color-accent)]"
              />
            </label>
            <span className="shrink-0 text-sm tabular-nums text-muted">
              <span className="font-semibold text-ink">{step}</span> / {STEPS}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-4 md:p-5">
          <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">The shot list (prompt)</p>
            <p className="text-[0.9375rem] leading-snug">{shot.prompt}</p>
          </div>
          <div aria-live="polite" className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">What&apos;s happening now</p>
            <p className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-accent">{phase.label}</p>
            <p className="text-[0.9375rem] leading-snug text-muted">{phase.note}</p>
          </div>
        </div>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        An example drawn on this page to show the idea, not a real model. A real one does this on a whole clip at once,
        and its static is much finer, but the order is the same: rough layout first, detail last. Switch prompts at step 0
        and you&apos;ll see the same static; the prompt decides what it turns into.
      </p>
    </div>
  );
}
