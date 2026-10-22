"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A tiny 8-second example video, built the way HyperFrames and Claude Motion build theirs: every element's position is
 * a function of the time `t`, so scrubbing to any moment shows exactly the frame a render would show there. The feel
 * switch swaps one word in the example prompt, which swaps the easing curve every entrance uses. Example values only;
 * nothing here calls a model or a renderer.
 */

const LENGTH = 8;

type Feel = { id: string; word: string; gets: string; ease: (x: number) => number };

const C1 = 1.70158;
const FEELS: Feel[] = [
  { id: "smooth", word: "smooth", gets: "natural slow-down", ease: (x) => 1 - (1 - x) ** 3 },
  { id: "snappy", word: "snappy", gets: "quick, decisive", ease: (x) => 1 - (1 - x) ** 5 },
  { id: "bouncy", word: "bouncy", gets: "overshoots, then settles", ease: (x) => 1 + (C1 + 1) * (x - 1) ** 3 + C1 * (x - 1) ** 2 },
  { id: "dreamy", word: "dreamy", gets: "slow and even", ease: (x) => -(Math.cos(Math.PI * x) - 1) / 2 },
];

const BEATS = [
  { from: 0, to: 2.5, text: "Title slides up: “Ship faster.”" },
  { from: 2.5, to: 5.5, text: "A number counts up to 4.2M" },
  { from: 5.5, to: 8, text: "Tagline and logo land, then a gentle idle" },
];

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/** Progress of a tween that starts at `start` and lasts `dur` seconds, through the chosen ease. */
function tween(t: number, start: number, dur: number, ease: (x: number) => number) {
  return ease(clamp((t - start) / dur));
}

/** Linear fade between two times, for exits (exits stay plain so the feel word only changes entrances). */
function fade(t: number, start: number, end: number) {
  return 1 - clamp((t - start) / (end - start));
}

function Stage({ t, ease }: { t: number; ease: (x: number) => number }) {
  // Beat 1: title rises in, underline grows, both gone by 2.5s.
  const title = tween(t, 0.2, 0.8, ease);
  const underline = tween(t, 0.6, 0.7, ease);
  const beat1Out = fade(t, 2.2, 2.5);
  // Beat 2: number rises in and counts up to 4.2, caption follows, gone by 5.5s.
  const num = tween(t, 2.6, 0.7, ease);
  const count = tween(t, 2.7, 1.6, ease);
  const caption = tween(t, 3.2, 0.6, ease);
  const beat2Out = fade(t, 5.2, 5.5);
  // Beat 3: logo scales in, tagline rises, then a slow breathing idle instead of a frozen hold.
  const logo = tween(t, 5.6, 0.7, ease);
  const tag = tween(t, 5.9, 0.7, ease);
  const breathe = t > 6.6 ? 1 + 0.03 * Math.sin((t - 6.6) * 2.4) : 1;

  const value = (4.2 * Math.max(0, count)).toFixed(1);

  return (
    <svg
      viewBox="0 0 640 360"
      className="aspect-video w-full rounded-2xl"
      role="img"
      aria-label={`Example video at ${t.toFixed(1)} seconds.`}
    >
      <rect width={640} height={360} fill="var(--color-ink)" />
      <g opacity={title * beat1Out} transform={`translate(0 ${(1 - title) * 40})`}>
        <text x={320} y={190} textAnchor="middle" fontSize={56} fontWeight={700} letterSpacing="-0.03em" fill="var(--color-page)">
          Ship faster.
        </text>
      </g>
      <rect
        x={320 - 110 * underline}
        y={214}
        width={220 * underline}
        height={6}
        rx={3}
        fill="var(--color-accent)"
        opacity={beat1Out}
      />
      <g opacity={num * beat2Out} transform={`translate(0 ${(1 - num) * 40})`}>
        <text x={320} y={190} textAnchor="middle" fontSize={84} fontWeight={700} letterSpacing="-0.03em" fill="var(--color-accent)" style={{ fontVariantNumeric: "tabular-nums" }}>
          {value}M
        </text>
      </g>
      <g opacity={caption * beat2Out} transform={`translate(0 ${(1 - caption) * 20})`}>
        <text x={320} y={236} textAnchor="middle" fontSize={22} fontWeight={500} fill="var(--color-fill)">
          example number
        </text>
      </g>
      <g transform={`translate(320 150) scale(${Math.max(0, logo) * breathe})`}>
        <rect x={-34} y={-34} width={68} height={68} rx={18} fill="var(--color-accent)" />
        <path d="M-10 -14L14 0L-10 14Z" fill="var(--color-page)" />
      </g>
      <g opacity={clamp(tag)} transform={`translate(0 ${(1 - tag) * 30})`}>
        <text x={320} y={246} textAnchor="middle" fontSize={30} fontWeight={600} letterSpacing="-0.02em" fill="var(--color-page)">
          Your launch, in 8 seconds.
        </text>
      </g>
    </svg>
  );
}

/** The chosen ease drawn as a small curve, so the reader sees what the word means. */
function Curve({ ease }: { ease: (x: number) => number }) {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    return `${10 + x * 140},${70 - ease(x) * 50}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 160 80" className="h-auto w-36" aria-hidden="true">
      <path d="M10 70H150M10 20H150" stroke="var(--color-rule)" strokeWidth={1} />
      <polyline points={pts} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlipbookLab() {
  const [feelId, setFeelId] = useState("smooth");
  const [t, setT] = useState(LENGTH);
  const [playing, setPlaying] = useState(false);
  const last = useRef<number | null>(null);
  const time = useRef(LENGTH);
  useEffect(() => {
    time.current = t;
  }, [t]);
  const feel = FEELS.find((f) => f.id === feelId) ?? FEELS[0];
  const beat = BEATS.findIndex((b) => t >= b.from && t < b.to);
  const current = beat === -1 ? BEATS.length - 1 : beat;

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (now: number) => {
      const prev = last.current ?? now;
      last.current = now;
      const next = Math.min(LENGTH, time.current + (now - prev) / 1000);
      time.current = next;
      setT(next);
      if (next >= LENGTH) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      last.current = null;
    };
  }, [playing]);

  function play() {
    if (playing) return setPlaying(false);
    // With reduced motion, skip the playback and show the last frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(LENGTH);
    if (t >= LENGTH) setT(0);
    setPlaying(true);
  }

  function pickFeel(id: string) {
    setFeelId(id);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setT(0);
    setPlaying(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Feel word in the prompt" className="flex flex-wrap gap-2">
        {FEELS.map((f) => {
          const active = f.id === feel.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => pickFeel(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                active ? "bg-accent text-page" : "bg-surface text-ink"
              }`}
            >
              {f.word}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-3 md:p-5">
          <Stage t={t} ease={feel.ease} />
          <div className="flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={play}
              className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-page transition-transform duration-100 active:scale-[0.98]"
            >
              {playing ? "Pause" : t >= LENGTH ? "Replay" : "Play"}
            </button>
            <label className="flex w-full items-center gap-3">
              <span className="sr-only">Time in the video</span>
              <input
                type="range"
                min={0}
                max={LENGTH}
                step={0.05}
                value={t}
                onChange={(event) => {
                  setPlaying(false);
                  setT(Number(event.target.value));
                }}
                className="w-full accent-[var(--color-accent)]"
              />
            </label>
            <span className="w-14 shrink-0 text-right text-sm tabular-nums text-muted">
              <span className="font-semibold text-ink">{t.toFixed(1)}</span>s
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-4 md:p-5">
          <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">The request</p>
            <p className="text-[0.9375rem] leading-snug">
              An 8-second video. Everything moves in with a{" "}
              <strong className="font-semibold text-accent">{feel.word}</strong> feel.
            </p>
            <ol className="mt-2 flex flex-col gap-1 text-[0.9375rem] leading-snug">
              {BEATS.map((b, i) => (
                <li
                  key={b.from}
                  className={`rounded-lg px-2 py-1 transition-colors duration-200 ${i === current ? "bg-accent-tint text-ink" : "text-muted"}`}
                >
                  <span className="tabular-nums">
                    {b.from}–{b.to}s
                  </span>
                  : {b.text}
                </li>
              ))}
            </ol>
          </div>
          <div aria-live="polite" className="flex items-center justify-between gap-3 rounded-2xl bg-page p-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted">What &ldquo;{feel.word}&rdquo; does</p>
              <p className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-accent">{feel.gets}</p>
            </div>
            <Curve ease={feel.ease} />
          </div>
        </div>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        An example built into this page, not a real render. Pick a feel word and the same video plays again with only that
        word changed. Drag the slider to any moment: because the video is written as rules, every moment always looks the
        same.
      </p>
    </div>
  );
}
