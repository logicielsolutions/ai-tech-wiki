import { AnswerKey, Arrow, Book, Bubble, Label, Mark, Paper, Person, Recorder, ScoreBar, Teacher } from "./cast";

const svgClass = "h-auto w-full";

/** Weakest-link example used by the "two questions" figure: four example scores and their harmonic mean. */
const EXAMPLE_SCORES = [0.95, 0.9, 0.4, 0.92];
const EXAMPLE_OVERALL = EXAMPLE_SCORES.length / EXAMPLE_SCORES.reduce((sum, v) => sum + 1 / v, 0);

export function HeroFigure() {
  return (
    <svg
      viewBox="0 20 800 360"
      className={svgClass}
      role="img"
      aria-label="An answer key sits beside an AI's exam paper. A teacher grades it: most answers ticked, one wrong, and one trick question correctly refused. After launch, a flight recorder keeps recording every answer."
    >
      <AnswerKey x={40} y={96} w={150} h={190} />
      <Label x={115} y={318} muted>
        Answer key
      </Label>
      <Paper x={230} y={50} w={200} h={280} marks={["pass", "pass", "refused", "fail", "pass", "pass"]} />
      <Label x={330} y={362} muted>
        The AI&apos;s answers
      </Label>
      <Arrow x1={446} x2={484} y={190} />
      <Teacher cx={540} cy={190} />
      <Label x={540} y={262} muted>
        The grader
      </Label>
      <Arrow x1={596} x2={634} y={190} />
      <Recorder x={650} y={158} w={112} h={72} />
      <Label x={706} y={262} muted>
        After launch
      </Label>
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 640 300"
      className={svgClass}
      role="img"
      aria-label="Two speech bubbles from the same AI look equally confident. One is right and one is wrong. From the outside you can't tell which; only checking against the answer key shows it."
    >
      <Bubble x={40} y={40} w={240} h={110} />
      <Bubble x={360} y={40} w={240} h={110} />
      <Label x={160} y={196} muted>
        Sounds sure
      </Label>
      <Label x={480} y={196} muted>
        Sounds just as sure
      </Label>
      <Mark cx={160} cy={240} kind="pass" r={18} />
      <Mark cx={480} cy={240} kind="fail" r={18} />
      <Label x={320} y={292} size={18} muted>
        Only the answer key tells them apart
      </Label>
    </svg>
  );
}

export function AnswerKeyFigure() {
  const row = (y: number, title: string, kind: "pass" | "refused") => (
    <g>
      <rect x={250} y={y} width={350} height={70} rx={12} fill="var(--color-page)" />
      <Mark cx={280} cy={y + 35} kind={kind} r={13} />
      <Label x={306} y={y + 30} anchor="start" size={19}>
        {title}
      </Label>
      <path d={`M306 ${y + 50}h220`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The answer key: each entry holds a real question, the facts a good answer must mention, and for trick questions a note that the right answer is to refuse."
    >
      <AnswerKey x={40} y={50} w={170} h={220} />
      {row(40, "Real question", "pass")}
      {row(125, "Must-mention facts", "pass")}
      {row(210, "Trick: should refuse", "refused")}
    </svg>
  );
}

export function ThreeSittingsFigure() {
  const sittings: ("pass" | "fail")[] = ["pass", "pass", "fail"];
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The same question is answered three times. It passes twice and fails once, so it is marked unstable, not passed."
    >
      {sittings.map((kind, i) => (
        <g key={i}>
          <Paper x={40 + i * 150} y={50} w={120} h={170} marks={["blank", kind, "blank"]} />
          <Label x={100 + i * 150} y={252} size={18} muted>
            {`Try ${i + 1}`}
          </Label>
        </g>
      ))}
      <Arrow x1={500} x2={530} y={135} />
      <rect x={536} y={104} width={96} height={62} rx={14} fill="var(--color-accent-tint)" />
      <Label x={584} y={141} size={18}>
        Unstable
      </Label>
      <Label x={320} y={300} size={18} muted>
        Passes only if every try passes
      </Label>
    </svg>
  );
}

export function GradeFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Grading happens in three layers. Simple checks come first. A stricter grader, a bigger AI from a different maker, judges meaning. A person checks the grader."
    >
      <Paper x={30} y={70} w={130} h={180} marks={["pass", "fail", "pass"]} />
      <Label x={95} y={284} size={18} muted>
        Answers
      </Label>
      <Arrow x1={176} x2={206} y={160} />
      <rect x={216} y={110} width={120} height={100} rx={14} fill="var(--color-page)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Mark cx={240} cy={135 + i * 25} kind="pass" r={8} />
          <path d={`M256 ${135 + i * 25}h${60 - i * 12}`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
        </g>
      ))}
      <Label x={276} y={244} size={18} muted>
        Simple checks
      </Label>
      <Arrow x1={348} x2={378} y={160} />
      <Teacher cx={428} cy={160} />
      <Label x={428} y={244} size={18} muted>
        Stricter grader
      </Label>
      <Arrow x1={482} x2={512} y={160} />
      <Person cx={566} cy={160} good />
      <Label x={566} y={244} size={18} muted>
        A person checks
      </Label>
    </svg>
  );
}

export function TwoQuestionsFigure() {
  const labels = ["Nothing made up", "Sticks to pages", "Only useful pages", "Found the pages"];
  const weakest = EXAMPLE_SCORES.indexOf(Math.min(...EXAMPLE_SCORES));
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label={`An open book with the pages the AI used highlighted, leading to its answer. Four example scores, ${EXAMPLE_SCORES.map((v) => Math.round(v * 100)).join(", ")} out of 100, combine into one overall score of ${Math.round(EXAMPLE_OVERALL * 100)}: the weakest score drags it down.`}
    >
      <Book x={24} y={84} w={180} h={130} />
      <Label x={114} y={248} size={18} muted>
        Pages it read
      </Label>
      <Arrow x1={216} x2={244} y={150} />
      {labels.map((label, i) => (
        <g key={label}>
          <Label x={256} y={66 + i * 46} anchor="start" size={18} muted>
            {label}
          </Label>
          <ScoreBar x={256} y={74 + i * 46} w={200} value={EXAMPLE_SCORES[i]} faded={i !== weakest} />
        </g>
      ))}
      <Arrow x1={474} x2={502} y={150} />
      <Label x={512} y={124} anchor="start" size={18}>
        Overall
      </Label>
      <ScoreBar x={512} y={138} w={104} value={EXAMPLE_OVERALL} h={16} />
      <Label x={512} y={186} anchor="start" size={18} muted>
        {`${Math.round(EXAMPLE_OVERALL * 100)} of 100`}
      </Label>
      <Label x={320} y={300} size={18} muted>
        Example numbers
      </Label>
    </svg>
  );
}

export function ReportCardFigure() {
  const rows: ("pass" | "fail" | "refused")[] = ["pass", "fail", "refused"];
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A report card with one row per question: the AI's answer, the answer key beside it, the grade, and the grader's one-line reason."
    >
      <rect x={30} y={30} width={580} height={260} rx={16} fill="var(--color-page)" />
      {["AI's answer", "Answer key", "Grade"].map((head, i) => (
        <Label key={head} x={[60, 270, 520][i]} y={66} anchor="start" size={18} muted>
          {head}
        </Label>
      ))}
      {rows.map((kind, i) => {
        const y = 92 + i * 64;
        return (
          <g key={i}>
            <path d={`M50 ${y - 8}H590`} stroke="var(--color-rule)" strokeWidth={1.5} />
            <path d={`M60 ${y + 14}h170M60 ${y + 30}h120`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
            <path d={`M270 ${y + 14}h190M270 ${y + 30}h140`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
            <Mark cx={540} cy={y + 22} kind={kind} r={13} />
          </g>
        );
      })}
    </svg>
  );
}

export function RecorderLoopFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="After launch, a loop: a live answer is recorded, graded in the background, the worst go to a person to review, and real slip-ups are added to the answer key for the next test."
    >
      <Bubble x={30} y={60} w={130} h={70} lines={2} />
      <Label x={95} y={176} size={18} muted>
        Live answer
      </Label>
      <Arrow x1={176} x2={206} y={96} />
      <Recorder x={216} y={64} w={104} h={66} />
      <Label x={268} y={176} size={18} muted>
        Recorded
      </Label>
      <Arrow x1={334} x2={364} y={96} />
      <Teacher cx={410} cy={100} />
      <Label x={410} y={176} size={18} muted>
        Graded
      </Label>
      <Arrow x1={456} x2={486} y={96} />
      <Person cx={540} cy={100} />
      <Label x={540} y={176} size={18} muted>
        Worst reviewed
      </Label>
      <path
        d="M540 196C540 268 470 280 320 280C200 280 150 262 130 236"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M126 248l4 -12l10 8" fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <AnswerKey x={60} y={196} w={64} h={84} />
      <Label x={330} y={266} size={18} muted>
        Slip-ups join the key
      </Label>
    </svg>
  );
}

export function WrongTickFigure() {
  return (
    <svg
      viewBox="0 0 640 260"
      className={svgClass}
      role="img"
      aria-label="A grader puts a tick next to an answer that is actually wrong. Graders make mistakes too, so a person checks them."
    >
      <Bubble x={60} y={50} w={260} h={110} />
      <Label x={190} y={212} size={18} muted>
        Actually wrong
      </Label>
      <Mark cx={380} cy={104} kind="pass" r={22} />
      <Teacher cx={500} cy={104} />
      <Label x={470} y={212} size={18} muted>
        Grader ticks it
      </Label>
    </svg>
  );
}
