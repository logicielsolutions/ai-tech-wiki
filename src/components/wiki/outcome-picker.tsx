"use client";

import { useState } from "react";

export type Outcome = "allowed" | "refused" | "stopped";

export type OutcomeChoice = {
  id: string;
  /** What is tried, e.g. "Run the tests". */
  label: string;
  outcome: Outcome;
  /** One plain sentence: what happens. */
  result: string;
  /** Where the outcome comes from, in plain words. */
  detail: string;
};

const HEADLINES: Record<Outcome, string> = {
  allowed: "Allowed",
  refused: "Refused",
  stopped: "Refused, and the work stops",
};

function Badge({ outcome }: { outcome: Outcome }) {
  return (
    <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden="true">
      {outcome === "allowed" ? (
        <g>
          <circle cx={24} cy={24} r={22} fill="var(--color-good)" />
          <path d="M14 24l7 7l13 -14" fill="none" stroke="var(--color-page)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <circle cx={24} cy={24} r={22} fill="var(--color-ink)" />
          <path d="M16 16l16 16M32 16l-16 16" stroke="var(--color-page)" strokeWidth={4} strokeLinecap="round" />
          {outcome === "stopped" ? <circle cx={24} cy={24} r={22} fill="none" stroke="var(--color-accent)" strokeWidth={3} /> : null}
        </g>
      )}
    </svg>
  );
}

/**
 * Pick one thing to try and see what happens. Runs only on the example outcomes passed in; it never calls anything.
 */
export function OutcomePicker({
  title,
  hint,
  choices,
  note,
}: {
  title: string;
  hint: string;
  choices: OutcomeChoice[];
  /** Visible line under the picker that labels the outcomes as examples. */
  note: string;
}) {
  const [selected, setSelected] = useState(choices[0]?.id);
  const current = choices.find((choice) => choice.id === selected) ?? choices[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section aria-labelledby="picker-title" className="rounded-[20px] bg-surface p-4 md:p-5">
          <h3 id="picker-title" className="px-1 text-[1.0625rem] tracking-[-0.01em]">
            {title}
          </h3>
          <p className="px-1 pb-3 text-sm text-muted">{hint}</p>
          <ul className="flex flex-col gap-1.5">
            {choices.map((choice) => {
              const active = choice.id === current.id;
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(choice.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-[0.9375rem] transition-[background-color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                      active ? "bg-page font-semibold" : "bg-transparent text-muted hover:bg-page/60"
                    }`}
                  >
                    <span>{choice.label}</span>
                    <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                      ›
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-live="polite" aria-label="What happens" className="flex flex-col gap-4 rounded-[20px] bg-surface p-5 md:p-6">
          <p className="text-sm text-muted">If an agent tries to {current.label.charAt(0).toLowerCase() + current.label.slice(1)}:</p>
          <div className="flex items-center gap-4">
            <Badge outcome={current.outcome} />
            <p className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{HEADLINES[current.outcome]}</p>
          </div>
          <p className="text-[1.0625rem] leading-snug">{current.result}</p>
          <p className="text-sm text-muted">{current.detail}</p>
        </section>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">{note}</p>
    </div>
  );
}
