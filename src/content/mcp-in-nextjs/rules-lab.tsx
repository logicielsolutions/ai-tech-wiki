"use client";

import { useState } from "react";

type Asker = "person" | "assistant";
type Kind = "done" | "waits" | "no";

type Answer = { kind: Kind; headline: string; result: string; detail: string };

type Action = { id: string; label: string; verb: string; answers: Record<Asker, Answer> };

/** Example outcomes, written from the board's rules as docs/mcp-in-nextjs.md describes them (§3, §5, §7.5). */
const ACTIONS: Action[] = [
  {
    id: "draft",
    label: "Draft a new task",
    verb: "draft a new task",
    answers: {
      person: {
        kind: "done",
        headline: "Added",
        result: "The task goes straight into To Do.",
        detail: "New tasks from people land in To Do.",
      },
      assistant: {
        kind: "waits",
        headline: "Waits for a person",
        result: "The draft waits in Proposed until a person approves it.",
        detail: "Every task an assistant creates starts in Proposed.",
      },
    },
  },
  {
    id: "move",
    label: "Move a task on, no sign-off needed",
    verb: "move a task on, where no sign-off is needed",
    answers: {
      person: {
        kind: "done",
        headline: "Moved",
        result: "The task moves to the next stage.",
        detail: "The rulebook still checks the details the next stage needs are filled in.",
      },
      assistant: {
        kind: "done",
        headline: "Moved",
        result: "The task moves, just as if its person had moved it.",
        detail: "Moves that need no sign-off go through for an assistant like a person's would.",
      },
    },
  },
  {
    id: "signoff",
    label: "Move a task to a stage that needs sign-off",
    verb: "move a task to a stage that needs sign-off",
    answers: {
      person: {
        kind: "waits",
        headline: "Goes to the approver",
        result: "The move needs the approver's yes, and approving is something people can do.",
        detail: "People can approve; the rulebook checks who the approver is.",
      },
      assistant: {
        kind: "waits",
        headline: "Waits for a person",
        result: "An assistant's request always waits for a person, even when the person it works for is the approver.",
        detail: "The assistant gets the answer “waiting”, with a reason it can pass on.",
      },
    },
  },
  {
    id: "approve",
    label: "Approve a waiting move",
    verb: "approve a waiting move",
    answers: {
      person: {
        kind: "done",
        headline: "Approved",
        result: "The move goes through.",
        detail: "Approving is kept for people.",
      },
      assistant: {
        kind: "no",
        headline: "Not possible",
        result: "Approving isn't on an assistant's menu, and the rulebook has no way for one to do it.",
        detail: "Even an assistant that wrote the request out by hand couldn't approve.",
      },
    },
  },
];

const ASKERS: { id: Asker; label: string }[] = [
  { id: "person", label: "A person" },
  { id: "assistant", label: "Their AI assistant" },
];

function Badge({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden="true">
      {kind === "done" ? (
        <g>
          <circle cx={24} cy={24} r={22} fill="var(--color-good)" />
          <path d="M14 24l7 7l13 -14" fill="none" stroke="var(--color-page)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : kind === "waits" ? (
        <g>
          <circle cx={24} cy={24} r={22} fill="var(--color-fill)" />
          <path d="M24 24V12M24 24h9" stroke="var(--color-ink)" strokeWidth={3.5} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx={24} cy={24} r={22} fill="var(--color-ink)" />
          <path d="M16 16l16 16M32 16l-16 16" stroke="var(--color-page)" strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Pick who is asking and what they want; see the rulebook's answer. Example values only: it never calls anything. */
export function RulesLab() {
  const [asker, setAsker] = useState<Asker>("assistant");
  const [actionId, setActionId] = useState(ACTIONS[2].id);
  const action = ACTIONS.find((a) => a.id === actionId) ?? ACTIONS[0];
  const answer = action.answers[asker];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section aria-labelledby="rules-lab-title" className="flex flex-col gap-4 rounded-[20px] bg-surface p-4 md:p-5">
          <h3 id="rules-lab-title" className="px-1 text-[1.0625rem] tracking-[-0.01em]">
            Who&apos;s asking, and for what?
          </h3>
          <div role="group" aria-label="Who's asking" className="grid grid-cols-2 gap-1 rounded-full bg-page p-1">
            {ASKERS.map((a) => {
              const active = a.id === asker;
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAsker(a.id)}
                  className={`rounded-full px-3 py-2 text-[0.9375rem] transition-[background-color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                    active ? "bg-accent font-semibold text-page" : "text-muted hover:text-ink"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
          <ul className="flex flex-col gap-1.5" aria-label="What they want">
            {ACTIONS.map((a) => {
              const active = a.id === action.id;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActionId(a.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-[0.9375rem] transition-[background-color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                      active ? "bg-page font-semibold" : "bg-transparent text-muted hover:bg-page/60"
                    }`}
                  >
                    <span>{a.label}</span>
                    <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                      ›
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-live="polite" aria-label="The rulebook's answer" className="flex flex-col gap-4 rounded-[20px] bg-surface p-5 md:p-6">
          <p className="text-sm text-muted">
            If {asker === "person" ? "a person" : "an AI assistant"} asks to {action.verb}:
          </p>
          <div className="flex items-center gap-4">
            <Badge kind={answer.kind} />
            <p className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{answer.headline}</p>
          </div>
          <p className="text-[1.0625rem] leading-snug">{answer.result}</p>
          <p className="text-sm text-muted">{answer.detail}</p>
        </section>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        Example answers, written from the board&apos;s rules as its design doc describes them. Nothing here talks to the real board.
      </p>
    </div>
  );
}
