"use client";

import { useState } from "react";

/**
 * "What can this person see?" — the access rule made visible. Four made-up calls, three made-up
 * colleagues. Switching the person re-draws the list the way their own assistant would see it.
 * Every value here is written into this page: nothing is fetched, and no real call is involved.
 *
 * The list deliberately renders only the calls that person can read. A greyed-out or dashed row for
 * an unreadable call would teach the opposite of what the section says: the point is that such a
 * call is absent, not withheld, so the list simply gets shorter. The full set is shown separately,
 * labelled as a view no single person actually has.
 */

type Why = "host" | "joined" | "invited" | "none";

const PEOPLE = [
  { id: "priya", name: "Priya", role: "hosted two of these" },
  { id: "sam", name: "Sam", role: "was in one, invited to another" },
  { id: "dev", name: "Dev", role: "was in none of them" },
] as const;

const CALLS: { title: string; when: string; who: Record<string, Why> }[] = [
  { title: "Acme migration — kickoff", when: "2 Oct 2026", who: { priya: "host", sam: "joined", dev: "none" } },
  { title: "Sprint planning", when: "6 Oct 2026", who: { priya: "host", sam: "none", dev: "none" } },
  { title: "Pricing review", when: "9 Oct 2026", who: { priya: "none", sam: "invited", dev: "none" } },
  { title: "Board update", when: "13 Oct 2026", who: { priya: "none", sam: "none", dev: "none" } },
];

const REASON: Record<Exclude<Why, "none">, string> = {
  host: "You hosted it",
  joined: "You were in it",
  invited: "You were invited",
};

export function VisibilityLab() {
  const [person, setPerson] = useState<string>("priya");
  const active = PEOPLE.find((p) => p.id === person) ?? PEOPLE[0];
  const visible = CALLS.filter((c) => c.who[person] !== "none");

  return (
    <div className="flex flex-col gap-5 rounded-[20px] bg-surface px-5 py-6 sm:px-8">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted">The four calls in this example</p>
        <ul className="flex flex-wrap gap-2">
          {CALLS.map((call) => (
            <li key={call.title} className="rounded-full bg-page px-3 py-1 text-xs text-muted">
              {call.title}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Nobody below can see all four. This row is a view no real person has.</p>
      </div>

      <div role="group" aria-label="Whose assistant is asking" className="flex flex-wrap gap-2">
        {PEOPLE.map((p) => {
          const on = p.id === person;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setPerson(p.id)}
              className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-transform duration-100 active:scale-[0.98] ${
                on ? "bg-accent text-page" : "bg-page text-muted"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3" aria-live="polite">
        <p className="text-sm text-muted">
          {active.name} {active.role}. This is the whole list {active.name}&apos;s assistant gets back:
        </p>
        {visible.length === 0 ? (
          <p className="rounded-xl bg-page px-4 py-6 text-center text-[0.9375rem] text-muted">
            Nothing. An empty list — not a refusal.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map((call) => (
              <li key={call.title} className="flex items-center justify-between gap-4 rounded-xl bg-page px-4 py-3">
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.9375rem]">{call.title}</span>
                  <span className="text-sm text-muted">{call.when}</span>
                </span>
                <span className="shrink-0 rounded-full bg-accent-tint px-3 py-1 text-xs font-medium text-accent">
                  {REASON[call.who[person] as Exclude<Why, "none">]}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-muted">
          {visible.length === 0
            ? `No path to any of them, so ${active.name} is told about none of them.`
            : `${visible.length} of four. The others are not further down behind a lock — they are not in the answer at all.`}
        </p>
      </div>

      <p className="text-xs text-muted">Made-up calls and made-up colleagues, written into this page as an example.</p>
    </div>
  );
}
