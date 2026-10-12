import { Arrow, Label, Luna, OddsRow, Person, Resume, Sheet, Writer } from "./cast";

/** Example numbers used across the figures, the same ones the source app's walkthrough labels as examples. */
const EXAMPLE_FIT = [0.2, 0.7, 0.1];
const EXAMPLE_LEVELS = [0.05, 0.1, 0.2, 0.4, 0.25];
const EXAMPLE_AVERAGE = EXAMPLE_LEVELS.reduce((sum, p, level) => sum + p * level, 0);

const svgClass = "h-auto w-full";

function Pill({ cx, y, w = 120, children, strong = false }: { cx: number; y: number; w?: number; children: string; strong?: boolean }) {
  return (
    <g>
      <rect x={cx - w / 2} y={y} width={w} height={34} rx={17} fill={strong ? "var(--color-accent-tint)" : "var(--color-fill)"} />
      <text
        x={cx}
        y={y + 22.5}
        textAnchor="middle"
        fontSize={16}
        fontWeight={500}
        fill={strong ? "var(--color-accent)" : "var(--color-ink)"}
      >
        {children}
      </text>
    </g>
  );
}

/** Five columns, one per level: height is that level's odds; the dot marks the average. */
function LevelColumns({ x, y, w, h, levels, dot = true }: { x: number; y: number; w: number; h: number; levels: number[]; dot?: boolean }) {
  const gap = 6;
  const colW = (w - gap * (levels.length - 1)) / levels.length;
  const average = levels.reduce((sum, p, level) => sum + p * level, 0);
  const best = Math.max(...levels);
  const centre = (level: number) => x + level * (colW + gap) + colW / 2;
  return (
    <g>
      {levels.map((p, level) => (
        <g key={level}>
          <rect x={x + level * (colW + gap)} y={y} width={colW} height={h} rx={5} fill="var(--color-fill)" />
          <rect
            x={x + level * (colW + gap)}
            y={y + h - Math.max(4, h * p)}
            width={colW}
            height={Math.max(4, h * p)}
            rx={5}
            fill="var(--color-accent)"
            opacity={p === best ? 1 : 0.45}
          />
          <text x={centre(level)} y={y + h + 20} textAnchor="middle" fontSize={15} fill="var(--color-muted)">
            {level}
          </text>
        </g>
      ))}
      {dot ? (
        <g>
          <path d={`M${centre(0)} ${y + h + 32}H${centre(levels.length - 1)}`} stroke="var(--color-rule)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={centre(0) + (centre(levels.length - 1) - centre(0)) * (average / (levels.length - 1))} cy={y + h + 32} r={6} fill="var(--color-accent)" />
        </g>
      ) : null}
    </g>
  );
}

export function HeroFigure() {
  const sx = 392;
  return (
    <svg
      viewBox="0 36 800 328"
      className={svgClass}
      role="img"
      aria-label="A resume goes into Luna. Luna hands back an answer sheet: for each question, a bar shows how likely each allowed answer is. A person reads the sheet and decides."
    >
      <Resume x={52} y={124} w={116} h={152} />
      <Label x={110} y={306} muted>
        Resume
      </Label>
      <Arrow x1={184} x2={222} y={200} />
      <Luna cx={276} cy={200} size={80} />
      <Label x={276} y={272} muted>
        Luna
      </Label>
      <Arrow x1={330} x2={368} y={200} />

      <rect x={sx} y={52} width={256} height={296} rx={16} fill="var(--color-page)" />
      <Label x={sx + 20} y={84} anchor="start" size={18}>
        Yes or no
      </Label>
      {[
        ["Yes", 0.93],
        ["No", 0.07],
      ].map(([label, p], i) => (
        <g key={label}>
          <Label x={sx + 20} y={108 + i * 20} anchor="start" size={16} muted>
            {label as string}
          </Label>
          <OddsRow x={sx + 100} y={100 + i * 20} w={136} p={p as number} faded={i > 0} />
        </g>
      ))}
      <Label x={sx + 20} y={168} anchor="start" size={18}>
        Pick one
      </Label>
      {["Strong", "Possible", "Weak"].map((label, i) => (
        <g key={label}>
          <Label x={sx + 20} y={192 + i * 20} anchor="start" size={16} muted>
            {label}
          </Label>
          <OddsRow x={sx + 100} y={184 + i * 20} w={136} p={EXAMPLE_FIT[i]} faded={i !== 1} />
        </g>
      ))}
      <Label x={sx + 20} y={272} anchor="start" size={18}>
        Rate it
      </Label>
      <LevelColumns x={sx + 100} y={258} w={136} h={44} levels={EXAMPLE_LEVELS} dot={false} />

      <Arrow x1={664} x2={696} y={200} />
      <Person cx={740} cy={200} good />
      <Label x={740} y={272} muted>
        You decide
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
      aria-label="Left: a writing AI hands back a paragraph of text. Right: Luna hands back an answer sheet with odds on each allowed answer."
    >
      <Writer cx={70} cy={130} size={60} />
      <Arrow x1={110} x2={138} y={130} />
      <path d="M150 70h126a14 14 0 0 1 14 14v92a14 14 0 0 1 -14 14h-96l-18 18v-18h-12a14 14 0 0 1 -14 -14v-92a14 14 0 0 1 14 -14z" fill="var(--color-page)" />
      {[92, 110, 128, 146, 164].map((y, i) => (
        <path key={y} d={`M162 ${y}h${i === 4 ? 70 : 116}`} stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
      ))}
      <Label x={190} y={262} muted>
        A paragraph
      </Label>

      <path d="M320 40v220" stroke="var(--color-rule)" strokeWidth={1.5} strokeLinecap="round" />

      <Luna cx={392} cy={130} size={60} />
      <Arrow x1={432} x2={460} y={130} />
      <Sheet x={472} y={50} w={140} h={176} groups={[[0.93, 0.07], [0.2, 0.7, 0.1], [0.3, 0.7]]} />
      <Label x={512} y={262} muted>
        Odds per answer
      </Label>
    </svg>
  );
}

export function WriteExamFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A job post goes to a writing model, which drafts an exam of questions. A person edits the draft."
    >
      <Resume x={20} y={96} w={96} h={128} />
      <Label x={68} y={256} muted>
        Job post
      </Label>
      <Arrow x1={128} x2={154} y={160} />
      <Writer cx={198} cy={160} size={64} />
      <Label x={198} y={256} muted>
        Writing model
      </Label>
      <Arrow x1={242} x2={268} y={160} />
      <Sheet x={280} y={60} w={140} h={176} blank groups={[[0, 0], [0, 0, 0], [0, 0]]} />
      <Label x={350} y={268} muted>
        Draft exam
      </Label>
      <Arrow x1={432} x2={458} y={160} />
      <Person cx={530} cy={160} />
      <path d="M556 174l26 -26l8 8l-26 26h-8z" fill="var(--color-accent-tint)" />
      <path d="M556 174l26 -26l8 8l-26 26h-8z" fill="none" stroke="var(--color-ink)" strokeWidth={1.5} strokeLinejoin="round" />
      <Label x={530} y={256} muted>
        You edit
      </Label>
    </svg>
  );
}

export function ThreeKindsFigure() {
  const tiles = [
    { x: 24, title: "Yes or no", options: ["Yes", "No"] },
    { x: 228, title: "Pick one", options: ["Strong fit", "Possible fit", "Weak fit"] },
  ];
  return (
    <svg
      viewBox="0 0 640 300"
      className={svgClass}
      role="img"
      aria-label="Three kinds of question. Yes or no, with two answers. Pick one, with strong, possible or weak fit. Rate it, with five levels from 0 to 4."
    >
      {tiles.map((tile) => (
        <g key={tile.title}>
          <rect x={tile.x} y={36} width={188} height={228} rx={16} fill="var(--color-page)" />
          <Label x={tile.x + 94} y={74}>
            {tile.title}
          </Label>
          {tile.options.map((option, i) => (
            <Pill key={option} cx={tile.x + 94} y={96 + i * 44} w={148}>
              {option}
            </Pill>
          ))}
        </g>
      ))}
      <rect x={432} y={36} width={188} height={228} rx={16} fill="var(--color-page)" />
      <Label x={526} y={74}>
        Rate it
      </Label>
      {[0, 1, 2, 3, 4].map((level) => (
        <g key={level}>
          <rect x={449 + level * 31} y={96} width={28} height={34} rx={9} fill="var(--color-fill)" />
          <text x={463 + level * 31} y={118.5} textAnchor="middle" fontSize={16} fontWeight={500} fill="var(--color-ink)">
            {level}
          </text>
        </g>
      ))}
      <Label x={526} y={166} muted size={16}>
        None to Expert
      </Label>
    </svg>
  );
}

export function ShadeOddsFigure() {
  return (
    <svg
      viewBox="0 0 640 300"
      className={svgClass}
      role="img"
      aria-label="Luna reads the resume once and shades in how likely each allowed answer is, on every question at the same time. It writes no text."
    >
      <Resume x={24} y={84} w={100} h={132} />
      <Label x={74} y={248} muted>
        Resume
      </Label>
      <Arrow x1={138} x2={170} y={150} />
      <Luna cx={222} cy={150} size={72} />
      <Label x={222} y={216} muted>
        Reads once
      </Label>
      <Arrow x1={274} x2={306} y={150} />
      <Sheet x={320} y={30} w={296} h={240} groups={[[0.93, 0.07], EXAMPLE_FIT, EXAMPLE_LEVELS]} />
    </svg>
  );
}

export function ReadOffFigure() {
  const panel = (x: number) => <rect x={x} y={24} width={196} height={252} rx={16} fill="var(--color-page)" />;
  const levelsX = 446;
  return (
    <svg
      viewBox="0 0 640 300"
      className={svgClass}
      role="img"
      aria-label={`Reading the marks off. Pick one: the top answer, possible fit at 70 percent, wins. Yes or no: a bar past the halfway line means yes. Rate it: the rating is the average across levels, ${EXAMPLE_AVERAGE.toFixed(1)}, which can land between levels.`}
    >
      {panel(8)}
      <Label x={106} y={58}>
        Pick one
      </Label>
      {["Strong", "Possible", "Weak"].map((label, i) => (
        <g key={label}>
          <Label x={28} y={100 + i * 34} anchor="start" size={16} muted={i !== 1}>
            {label}
          </Label>
          <OddsRow x={104} y={92 + i * 34} w={84} p={EXAMPLE_FIT[i]} faded={i !== 1} />
        </g>
      ))}
      <Pill cx={106} y={216} w={136} strong>
        Top one wins
      </Pill>

      {panel(222)}
      <Label x={320} y={58}>
        Yes or no
      </Label>
      <rect x={242} y={120} width={156} height={16} rx={8} fill="var(--color-fill)" />
      <rect x={242} y={120} width={156 * 0.72} height={16} rx={8} fill="var(--color-accent)" />
      <path d="M320 104v48" stroke="var(--color-ink)" strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" />
      <Label x={320} y={172} size={16} muted>
        Halfway
      </Label>
      <Pill cx={320} y={216} w={136} strong>
        Past half: yes
      </Pill>

      {panel(436)}
      <Label x={534} y={58}>
        Rate it
      </Label>
      <LevelColumns x={levelsX + 10} y={84} w={156} h={72} levels={EXAMPLE_LEVELS} />
      <Pill cx={534} y={216} w={136} strong>
        {`Average: ${EXAMPLE_AVERAGE.toFixed(1)}`}
      </Pill>
    </svg>
  );
}

export function PersonDecidesFigure() {
  return (
    <svg
      viewBox="0 0 640 300"
      className={svgClass}
      role="img"
      aria-label="The answer sheet is marked as a suggestion only. It goes to a person, who makes the decision."
    >
      <Sheet x={130} y={30} w={170} h={196} groups={[[0.93, 0.07], EXAMPLE_FIT, [0.3, 0.7]]} />
      <Pill cx={215} y={244} w={150}>
        Suggestion only
      </Pill>
      <Arrow x1={324} x2={384} y={128} />
      <Person cx={460} cy={128} good />
      <Label x={460} y={200} muted>
        A person decides
      </Label>
    </svg>
  );
}

export function SureIsNotRightFigure() {
  const rows = [
    { y: 70, label: "Very sure", p: 0.9, right: false },
    { y: 160, label: "Unsure", p: 0.42, right: true },
  ];
  return (
    <svg
      viewBox="0 0 640 230"
      className={svgClass}
      role="img"
      aria-label="Being sure is not being right. One answer is marked very sure and is wrong; another is marked unsure and is right."
    >
      {rows.map((row) => (
        <g key={row.label}>
          <Label x={24} y={row.y + 5} anchor="start">
            {row.label}
          </Label>
          <rect x={140} y={row.y - 6} width={300} height={12} rx={6} fill="var(--color-fill)" />
          <rect x={140} y={row.y - 6} width={300 * row.p} height={12} rx={6} fill="var(--color-accent)" opacity={row.right ? 0.45 : 1} />
          <circle cx={490} cy={row.y} r={14} fill={row.right ? "var(--color-good)" : "var(--color-fill)"} />
          {row.right ? (
            <path d={`M483 ${row.y}l5 5l9 -10`} fill="none" stroke="var(--color-page)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d={`M485 ${row.y - 5}l10 10m0 -10l-10 10`} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
          )}
          <Label x={516} y={row.y + 5} anchor="start" muted>
            {row.right ? "Right" : "Wrong"}
          </Label>
        </g>
      ))}
    </svg>
  );
}
