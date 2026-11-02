"use client";

import { useState } from "react";

type Failure = {
  id: string;
  label: string;
  off: string;
  offSteps: string;
  on: string;
  onSteps: string;
  /** How many times more the net-off run spent than the net-on run; null when neither run spent much. */
  times: number | null;
  catchName: string;
};

/** Measured on 29 Oct 2026: the sample agent on the fake model, net off and on (agent-safety-net reports/day4.md). */
const FAILURES: Failure[] = [
  {
    id: "again",
    label: "A tool that keeps saying “call me again”",
    off: "The agent obeys every time, until the agent's own 50-step limit ends it.",
    offSteps: "50 steps",
    on: "The third identical call is blocked and the agent is told; it tries again and the net stops the run.",
    onSteps: "Stopped at step 4",
    times: 115,
    catchName: "Repeats",
  },
  {
    id: "errors",
    label: "A tool that only returns errors",
    off: "The agent crashes on the first error.",
    offSteps: "Crashed at step 1",
    on: "Three more tries, waiting a little longer each time, then the tool is marked out of use and the run stops cleanly.",
    onSteps: "Stopped at step 2",
    times: null,
    catchName: "Failures",
  },
  {
    id: "hang",
    label: "A tool that hangs",
    off: "The agent waits forever. We gave up on it after a minute.",
    offSteps: "Still waiting",
    on: "Each try times out, then the tool is marked out of use and the run stops.",
    onSteps: "Stopped at step 2",
    times: null,
    catchName: "Failures",
  },
  {
    id: "garbage",
    label: "A tool that sends back garbage",
    off: "The agent keeps asking, gets nonsense, and asks again until the 50-step limit.",
    offSteps: "50 steps",
    on: "After five steps with nothing new, the net decides the run is going nowhere and stops it.",
    onSteps: "Stopped at step 5",
    times: 87,
    catchName: "No progress",
  },
  {
    id: "burn",
    label: "A tool that sends back huge answers",
    off: "Every step costs more than the last, all the way to the 50-step limit.",
    offSteps: "50 steps",
    on: "The money meter reaches its limit and the run stops.",
    onSteps: "Stopped at step 6",
    times: 82,
    catchName: "Budget",
  },
  {
    id: "disguised",
    label: "A web page that politely asks the agent to delete a file",
    off: "The agent deletes the file.",
    offSteps: "File deleted",
    on: "The polite wording gets past the check, but deleting needs a person's yes. In the test the answer was no, and the file stays.",
    onSteps: "File kept",
    times: null,
    catchName: "Approval",
  },
];

function Side({ title, text, steps, accent }: { title: string; text: string; steps: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] bg-surface p-5 md:p-6">
      <p className={`text-sm font-semibold ${accent ? "text-accent" : "text-muted"}`}>{title}</p>
      <p className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{steps}</p>
      <p className="text-[1.0625rem] leading-snug">{text}</p>
    </div>
  );
}

/** Pick a failure and see the net-off and net-on runs side by side. Example values only: it never runs anything. */
export function FailureLab() {
  const [selected, setSelected] = useState(FAILURES[0].id);
  const f = FAILURES.find((x) => x.id === selected) ?? FAILURES[0];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[20px] bg-surface p-4 md:p-5">
        <h3 className="px-1 text-[1.0625rem] tracking-[-0.01em]">Pick a failure</h3>
        <p className="px-1 pb-3 text-sm text-muted">Each one is a test tool we built to misbehave on purpose.</p>
        <ul className="grid gap-1.5 md:grid-cols-2">
          {FAILURES.map((x) => {
            const active = x.id === f.id;
            return (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(x.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-[0.9375rem] transition-[background-color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                    active ? "bg-page font-semibold" : "bg-transparent text-muted hover:bg-page/60"
                  }`}
                >
                  {x.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div aria-live="polite" className="grid gap-3 md:grid-cols-2">
        <Side title="Without the net" text={f.off} steps={f.offSteps} />
        <Side title={`With the net · ${f.catchName}`} text={f.on} steps={f.onSteps} accent />
      </div>
      {f.times ? (
        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 md:p-6">
          <p className="text-[1.0625rem]">
            Without the net, this run spent about <strong className="text-accent">{f.times} times</strong> as much as with it.
          </p>
          <div className="flex flex-col gap-2" aria-hidden="true">
            <div className="h-3 w-full rounded-full bg-fill">
              <div className="h-3 w-full rounded-full bg-muted" />
            </div>
            <div className="h-3 w-full rounded-full bg-fill">
              <div className="h-3 rounded-full bg-accent transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.max(1.5, 100 / f.times)}%` }} />
            </div>
          </div>
        </div>
      ) : null}
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        Test results from 29 Oct 2026: our sample agent with a scripted stand-in for a real AI model, so every run is the same.
        Spending is compared at a real model&apos;s rates.
      </p>
    </div>
  );
}
