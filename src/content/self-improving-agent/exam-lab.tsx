"use client";

import { useState } from "react";

/**
 * Our measured results, baked into the page. Nothing here calls a model. Every value is in brief.md under
 * "Lab values": mock = the validation modules, sealed = the held-out modules, both as the mean score per building.
 */

type Verdict = "kept" | "worse" | "unclear";
type Handbook = { id: string; label: string; detail: string; mock: number | null; sealed: number; verdict: Verdict; note: string };
type Town = { id: string; label: string; intro: string; mockLabel: string; sealedLabel: string; handbooks: Handbook[] };

const TOWNS: Town[] = [
  {
    id: "ib",
    label: "Interview Buddy",
    intro: "Our own app. 6 mock buildings and 10 sealed ones, each tested twice unless marked.",
    mockLabel: "Mock exam (6 buildings)",
    sealedLabel: "Sealed final (10 new buildings)",
    handbooks: [
      {
        id: "v001",
        label: "Hand-written",
        detail: "Written by a person at the start",
        mock: 0.654,
        sealed: 0.714,
        verdict: "kept",
        note: "The champion. Nothing replaced it.",
      },
      {
        id: "v009",
        label: "Three plain lines",
        detail: "A bare-bones handbook, as a test",
        mock: 0.695,
        sealed: 0.557,
        verdict: "unclear",
        note: "The best mock score of any handbook, and lower on the sealed final. The inspector's range still allowed no difference, so it was not a clear win either way.",
      },
      {
        id: "naive-c002",
        label: "Coach's rewrite of the plain one",
        detail: "The coach rewrote the three plain lines",
        mock: 0.625,
        sealed: 0.48,
        verdict: "worse",
        note: "Clearly worse than the hand-written handbook: the whole range sat below zero.",
      },
      {
        id: "v007",
        label: "Lesson notes",
        detail: "A short list of lessons added to the handbook",
        mock: 0.57,
        sealed: 0.504,
        verdict: "worse",
        note: "Clearly worse. Most of its lessons were about catching more fires, while the real trouble was faulty alarms and running out of reading room.",
      },
      {
        id: "v006",
        label: "Coach's best rewrite",
        detail: "The best rewrite, with more reading room; tested once",
        mock: 0.546,
        sealed: 0.422,
        verdict: "unclear",
        note: "The lowest sealed score of all. Not better.",
      },
      {
        id: "v008",
        label: "Rewrite plus lesson notes",
        detail: "Both together; tested once, no mock score",
        mock: null,
        sealed: 0.442,
        verdict: "unclear",
        note: "Not better.",
      },
    ],
  },
  {
    id: "town",
    label: "A simpler practice town",
    intro: "A small library of rules we built so a better handbook would have room to show. 4 mock buildings and 8 sealed ones, each tested twice.",
    mockLabel: "Mock exam (4 buildings)",
    sealedLabel: "Sealed final (8 new buildings)",
    handbooks: [
      {
        id: "human",
        label: "Human-written alarms",
        detail: "Tests written by a person: the ceiling",
        mock: 0.989,
        sealed: 0.968,
        verdict: "kept",
        note: "What good looks like here.",
      },
      {
        id: "v010",
        label: "Starting handbook",
        detail: "Written before any test in this town",
        mock: 0.924,
        sealed: 0.726,
        verdict: "kept",
        note: "The reference point the rewrite had to beat.",
      },
      {
        id: "c005",
        label: "Coach's best rewrite",
        detail: "Longer and more ambitious",
        mock: 0.81,
        sealed: 0.501,
        verdict: "worse",
        note: "Clearly worse. It asked for more alarms at once, so more of them were wired wrong: 7 of its 16 tries failed, against 3 for the starting handbook.",
      },
    ],
  },
];

const VERDICT: Record<Verdict, string> = { kept: "Kept", worse: "Clearly worse", unclear: "Not a clear win" };

const pct = (v: number) => `${Math.round(v * 100)}%`;

function ScoreRow({ label, value, strong }: { label: string; value: number | null; strong: boolean }) {
  return (
    <li className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3rem] items-center gap-3 text-sm sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_3rem]">
      <span className="leading-tight">{label}</span>
      {value === null ? (
        <span className="text-xs text-muted">not measured</span>
      ) : (
        <span className="h-2.5 overflow-hidden rounded-full bg-fill" aria-hidden="true">
          <span
            className={`block h-full rounded-full transition-[width] duration-500 ease-apple motion-reduce:transition-none ${strong ? "bg-accent" : "bg-accent/45"}`}
            style={{ width: `${value * 100}%` }}
          />
        </span>
      )}
      <span className="text-right tabular-nums">{value === null ? "–" : pct(value)}</span>
    </li>
  );
}

export function ExamLab() {
  const [townId, setTownId] = useState(TOWNS[0].id);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const town = TOWNS.find((t) => t.id === townId) ?? TOWNS[0];
  const book = town.handbooks.find((h) => h.id === picked[town.id]) ?? town.handbooks[0];

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Town" className="flex flex-wrap gap-2">
        {TOWNS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === town.id}
            onClick={() => setTownId(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
              t.id === town.id ? "bg-accent text-page" : "bg-surface text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="lab-town" className="flex flex-col gap-4 rounded-[20px] bg-surface p-4 md:p-6">
        <div className="flex flex-col gap-1 px-1">
          <h3 id="lab-town" className="text-[1.0625rem] tracking-[-0.01em]">
            {town.label}
          </h3>
          <p className="text-sm text-muted">{town.intro}</p>
        </div>

        <div role="radiogroup" aria-label="Handbook" className="flex flex-wrap gap-2">
          {town.handbooks.map((h) => {
            const selected = h.id === book.id;
            return (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPicked((current) => ({ ...current, [town.id]: h.id }))}
                className={`rounded-full px-3 py-1 text-[0.8125rem] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                  selected ? "bg-accent text-page" : "bg-page text-ink"
                }`}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="flex flex-col gap-3 rounded-2xl bg-page p-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">{book.label}</p>
            <p className="text-xs text-muted">{book.detail}</p>
          </div>
          <p className="text-xs text-muted">Share of fake fires caught, per building; a building with a faulty alarm counts as none</p>
          <ul className="flex flex-col gap-3">
            <ScoreRow label={town.mockLabel} value={book.mock} strong={false} />
            <ScoreRow label={town.sealedLabel} value={book.sealed} strong />
          </ul>
          <p className="text-sm">
            <span className={`font-semibold ${book.verdict === "worse" ? "text-ink" : ""}`}>{VERDICT[book.verdict]}. </span>
            <span className="text-muted">{book.note}</span>
          </p>
        </div>
      </section>

      <p className="max-w-[68ch] px-1 text-sm text-muted">
        These are our measured results from October 2026, built into the page; nothing here calls a model. &ldquo;Not measured&rdquo; means we
        never ran that handbook on the mock exam.
      </p>
    </div>
  );
}
