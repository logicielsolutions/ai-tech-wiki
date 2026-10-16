"use client";

import { useState } from "react";

/** Pick a job, see which AI video tool to hire for it. Recommendations as of Oct 2026; see the brief for sources. */

type Job = {
  id: string;
  job: string;
  pick: string;
  also: string;
  tip: string;
  cost?: string;
};

const JOBS: Job[] = [
  {
    id: "faces",
    job: "Real people and faces",
    pick: "Seedance 2.5 or MiniMax H3",
    also: "Veo 3.1 for a polished film look, Vidu Q4 for small facial expressions",
    tip: "Make a still photo of the person first, then ask the tool to bring that photo to life. Keep the movement gentle.",
    cost: "MiniMax H3: about 25 to 50 cents per 10-second clip",
  },
  {
    id: "talking",
    job: "Someone speaking a line",
    pick: "Vidu Q4 or Kling 3.0",
    also: "Veo 3.1",
    tip: "Keep it short: about 2 to 3 words for every second of video. An 8-second clip fits one or two short sentences.",
  },
  {
    id: "presenter",
    job: "A presenter reading a script",
    pick: "HeyGen",
    also: "Synthesia for training videos",
    tip: "These tools turn a script and a photo into minutes of talking video, and can translate it into 175+ languages with matching lips. Use them for anything longer than about 15 seconds of talking.",
  },
  {
    id: "product",
    job: "Product shots",
    pick: "Seedance 2.5",
    also: "Veo 3.1 for the hero shot",
    tip: "Always start from a real photo of the product, never a description. Add the logo and label text afterwards in editing.",
  },
  {
    id: "anime",
    job: "Anime and 2D cartoons",
    pick: "Seedance 2.0 or 2.5",
    also: "Kling 3.0, Midjourney",
    tip: "Draw or generate one still in the exact style first, plus the character from a few angles, and animate from those.",
  },
  {
    id: "3d",
    job: "3D animated look",
    pick: "Kling 3.0 or Seedance",
    also: "Luma Ray 3.14",
    tip: "Start from a still in the 3D style. Asked from words alone, these tools drift toward real-life footage.",
  },
  {
    id: "action",
    job: "Action and movement",
    pick: "Veo 3.1",
    also: "Wan 3.0, Seedance 2.5",
    tip: "Keep the action simple, give it the final frame you want, and cut away at the moment of impact.",
  },
  {
    id: "same",
    job: "The same character in every shot",
    pick: "Seedance 2.5",
    also: "Kling 3.0, Vidu Q4",
    tip: "Make a character sheet (front, three-quarter, side) and give it to the tool in every shot. Describe the character with the exact same words each time.",
  },
  {
    id: "budget",
    job: "On a tight budget",
    pick: "Vidu Q4 or MiniMax H3",
    also: "Wan 3.0 at low resolution",
    tip: "Try ideas on a cheap tool, then make only the winners again on a premium one.",
    cost: "MiniMax H3: about 25 to 50 cents per 10-second clip",
  },
  {
    id: "text",
    job: "Words or logos on screen",
    pick: "Add them in editing",
    also: "No tool does this reliably yet",
    tip: "Every tool still scrambles letters. Generate the shot clean and put the text and logo on top in a video editor.",
  },
];

export function CrewPicker() {
  const [jobId, setJobId] = useState(JOBS[0].id);
  const job = JOBS.find((j) => j.id === jobId) ?? JOBS[0];

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div role="tablist" aria-label="Jobs" aria-orientation="vertical" className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap">
        {JOBS.map((j) => {
          const active = j.id === job.id;
          return (
            <button
              key={j.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setJobId(j.id)}
              className={`rounded-full px-4 py-1.5 text-left text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                active ? "bg-accent text-page" : "bg-surface text-ink"
              }`}
            >
              {j.job}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="flex flex-col gap-3 self-start rounded-[20px] bg-surface p-4 md:p-6">
        <p className="text-xs font-semibold text-muted">{job.job}</p>
        <p className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-accent">{job.pick}</p>
        <p className="text-[0.9375rem] text-muted">
          <span className="font-semibold text-ink">Also good: </span>
          {job.also}
        </p>
        <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
          <p className="text-xs font-semibold text-muted">How to get it right</p>
          <p className="text-[0.9375rem] leading-snug">{job.tip}</p>
        </div>
        {job.cost ? <p className="text-sm text-muted">{job.cost}</p> : null}
      </div>
    </div>
  );
}
