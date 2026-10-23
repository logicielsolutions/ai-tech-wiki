import { Arrow, Check, Flipbook, Label, LinkChip, PageRow, Person, Preview, RedrawStack, Request, RuleSheet, VideoFile } from "./cast";

/** Hero: Claude writes the rules, the renderer draws and flips the pages, a video comes out. */
export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="h-auto w-full"
      role="img"
      aria-label="A sheet of timed rules, labelled the rules, turns into a flipbook, labelled the flipbook, which becomes a video file, labelled the video."
    >
      <RuleSheet x={40} y={100} w={230} h={190} rows={4} />
      <Arrow x1={290} x2={334} y={195} />
      <Flipbook x={356} y={130} w={190} h={140} />
      <Arrow x1={590} x2={634} y={195} />
      <VideoFile x={654} y={150} s={1.3} />
      <Label x={155} y={338}>the rules</Label>
      <Label x={155} y={362} muted size={15}>Claude writes them</Label>
      <Label x={451} y={338}>the flipbook</Label>
      <Label x={451} y={362} muted size={15}>the renderer</Label>
      <Label x={690} y={338}>the video</Label>
      <Label x={690} y={362} muted size={15}>same every time</Label>
    </svg>
  );
}

/** Why it matters: redrawing every page by hand vs changing one rule. */
export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="Left: a stack of pages with scribbled drawings and a pencil, labelled redraw by hand. Right: a sheet of rules with one rule highlighted, labelled change one rule."
    >
      <RedrawStack x={60} y={90} w={190} h={140} />
      <RuleSheet x={370} y={70} w={220} h={170} rows={4} highlight={1} />
      <Label x={165} y={284}>redraw by hand</Label>
      <Label x={480} y={284}>change one rule</Label>
    </svg>
  );
}

export function DescribeFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="A person hands over a request bubble with three lines of text and a row of time marks."
    >
      <Person cx={130} cy={190} />
      <Request x={220} y={70} w={340} h={130} />
      <Label x={250} y={250} anchor="start" muted size={15}>0s</Label>
      <Label x={530} y={250} anchor="end" muted size={15}>8s</Label>
      <Label x={390} y={284}>timings and words</Label>
    </svg>
  );
}

export function WriteFigure() {
  return (
    <svg viewBox="0 0 640 320" className="h-auto w-full" role="img" aria-label="A sheet of rules, each starting with a time: at 0 seconds, at 3 seconds, at 5 seconds.">
      <RuleSheet x={120} y={40} w={400} h={210} rows={3} />
      <Label x={60} y={84} muted size={15}>0s</Label>
      <Label x={60} y={150} muted size={15}>3s</Label>
      <Label x={60} y={216} muted size={15}>5s</Label>
      <Label x={320} y={290} muted size={15}>rules with times</Label>
    </svg>
  );
}

export function RehearseFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="A preview screen with a comment pinned to the timeline at 3 seconds, reading: title bigger."
    >
      <Preview x={60} y={40} w={330} h={230} pin={0.38} />
      <path d="M410 120h170a14 14 0 0 1 14 14v40a14 14 0 0 1 -14 14H440l-18 14v-14h-12a14 14 0 0 1 -14 -14v-40a14 14 0 0 1 14 -14z" fill="var(--color-page)" />
      <Label x={496} y={150} size={15} muted>at 0:03</Label>
      <Label x={496} y={174} size={16}>title bigger</Label>
      <Label x={225} y={304} muted size={15}>one change</Label>
    </svg>
  );
}

export function PerformFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="The rules become a row of flipbook pages, drawn one by one, which are saved as a video file."
    >
      <RuleSheet x={20} y={95} w={140} h={120} rows={3} />
      <Arrow x1={172} x2={202} y={155} />
      <PageRow x={214} y={115} w={300} h={80} count={4} />
      <Arrow x1={526} x2={556} y={155} />
      <VideoFile x={568} y={120} s={0.9} />
      <Label x={364} y={236} muted size={15}>page by page</Label>
      <Label x={593} y={222} size={14}>MP4</Label>
    </svg>
  );
}

export function AgainFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="A sheet of rules with one rule highlighted produces two identical rows of pages, each with a check mark."
    >
      <RuleSheet x={30} y={70} w={210} h={170} rows={4} highlight={1} />
      <Arrow x1={256} x2={290} y={155} />
      <PageRow x={306} y={68} w={300} h={76} count={4} mark />
      <PageRow x={306} y={168} w={300} h={76} count={4} mark />
      <Label x={135} y={284} muted size={15}>one rule changed</Label>
      <Label x={456} y={284} muted size={15}>identical every run</Label>
    </svg>
  );
}

/** Two ways to flip: HyperFrames (on your machine, a file) and Claude Motion (in the browser, a link). */
export function PlayersFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="Left: a flipbook produces a video file, labelled HyperFrames, file to ship. Right: a sheet of rules in a browser window produces a shareable link, labelled Claude Motion, link to share."
    >
      <Flipbook x={40} y={100} w={130} h={100} />
      <Arrow x1={196} x2={222} y={150} />
      <VideoFile x={232} y={115} />
      <Label x={160} y={262}>HyperFrames</Label>
      <Label x={160} y={286} muted size={15}>file to ship</Label>
      <rect x={360} y={80} width={150} height={130} rx={14} fill="var(--color-page)" />
      <rect x={360} y={80} width={150} height={24} rx={12} fill="var(--color-fill)" />
      {[376, 390, 404].map((cx) => (
        <circle key={cx} cx={cx} cy={92} r={4} fill="var(--color-page)" />
      ))}
      <RuleSheet x={366} y={108} w={138} h={96} rows={3} />
      <Arrow x1={520} x2={542} y={145} />
      <LinkChip x={548} y={127} w={80} />
      <Label x={470} y={262}>Claude Motion</Label>
      <Label x={470} y={286} muted size={15}>link to share</Label>
    </svg>
  );
}

/** Asking: a vague request gives jumbled pages; a request with times and exact words gives pages that build in order. */
export function AskFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="Top: a short, vague request produces pages out of order, as if guessed. Bottom: a request with time marks produces pages that build in order, with a check mark."
    >
      <Request x={20} y={30} w={190} h={80} vague />
      <Arrow x1={226} x2={262} y={68} />
      <PageRow x={276} y={34} w={300} h={70} count={4} faded />
      <Label x={596} y={76} anchor="start" muted size={22}>?</Label>
      <Request x={20} y={168} w={190} h={96} />
      <Arrow x1={226} x2={262} y={214} />
      <PageRow x={276} y={180} w={300} h={70} count={4} mark />
      <Label x={115} y={308} muted size={15}>timed and exact</Label>
    </svg>
  );
}

/** Limits: a person watches the result and approves it before the final render. */
export function ReviewFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="h-auto w-full"
      role="img"
      aria-label="A person watches a preview screen; a check mark shows they approve it before the final video is made."
    >
      <Person cx={120} cy={190} />
      <Preview x={210} y={60} w={300} h={210} />
      <Check cx={540} cy={90} r={18} />
      <Label x={360} y={304} muted size={15}>you approve</Label>
    </svg>
  );
}
