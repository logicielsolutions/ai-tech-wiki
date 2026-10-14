import { Arrow, Camera, Chair, Clapper, Cross, FilmStrip, Label, Screen, Static, Tick } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="A director's chair and a clapperboard with a shot list. An arrow leads to a camera, the AI model, which films a screen. The screen is half static and half a clear picture of a lighthouse at dusk."
    >
      <Chair cx={90} cy={230} s={1.1} />
      <Label x={90} y={330} muted>
        You direct
      </Label>
      <Clapper x={170} y={150} w={120} h={110} />
      <Label x={230} y={330} muted>
        The shot list
      </Label>
      <Arrow x1={306} x2={346} y={210} />
      <Camera cx={410} cy={214} s={1.1} />
      <Label x={404} y={330} muted>
        The AI model
      </Label>
      <Arrow x1={478} x2={518} y={210} />
      <Screen x={530} y={120} w={240} h={170} clear={0.5} />
      <Label x={650} y={330} muted>
        The shot appears
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
      aria-label="A strip of five takes of the same shot. Four are faded and crossed out; one is kept with a green tick."
    >
      <FilmStrip x={22} y={60} frameW={100} frameH={110} kinds={["reject", "reject", "scene", "reject", "reject"]} gap={12} />
      {[0, 1, 3, 4].map((i) => (
        <Cross key={i} cx={22 + 12 + i * 112 + 50} cy={60 + 16 + 55} r={16} />
      ))}
      <Tick cx={22 + 12 + 2 * 112 + 50} cy={60 + 16 + 55} r={16} />
      <Label x={320} y={250} muted>
        Several tries for every clip you keep
      </Label>
    </svg>
  );
}

const SLOTS = ["Shot", "Camera move", "Subject", "Action", "Light", "Sound"];

export function ShotListFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A shot list with six slots: shot, camera move, subject, action, light and sound. An arrow hands it to the camera."
    >
      <rect x={40} y={30} width={300} height={260} rx={16} fill="var(--color-page)" />
      {SLOTS.map((slot, i) => (
        <g key={slot}>
          <rect x={60} y={50 + i * 38} width={110} height={28} rx={14} fill="var(--color-accent-tint)" />
          <text x={115} y={69 + i * 38} textAnchor="middle" fontSize={14} fontWeight={500} fill="var(--color-accent)">
            {slot}
          </text>
          <path d={`M186 ${64 + i * 38}H${310 - (i % 3) * 30}`} stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
      <Arrow x1={360} x2={420} y={160} />
      <Camera cx={510} cy={170} s={1.2} />
    </svg>
  );
}

export function StaticFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A screen full of random static. Nothing is filmed yet; this is where every clip starts."
    >
      <defs>
        <clipPath id="static-fig">
          <rect x={150} y={30} width={340} height={220} rx={16} />
        </clipPath>
      </defs>
      <g clipPath="url(#static-fig)">
        <Static x={150} y={30} w={340} h={220} cell={10} seed={21} />
      </g>
      <Label x={320} y={292} muted>
        Every clip starts as pure static
      </Label>
    </svg>
  );
}

export function ClearingFigure() {
  const frames = [
    { clear: 0.15, label: "Early passes" },
    { clear: 0.55, label: "Middle" },
    { clear: 1, label: "Last passes" },
  ];
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Three frames of the same shot. Early passes are mostly static with the rough layout showing; in the middle the shapes are clear; after the last passes the detail is sharp."
    >
      {frames.map((f, i) => (
        <g key={f.label}>
          <Screen x={20 + i * 212} y={60} w={176} h={130} clear={f.clear} seed={11 + i} cell={8} />
          <Label x={108 + i * 212} y={230} muted>
            {f.label}
          </Label>
          {i < 2 ? <Arrow x1={200 + i * 212} x2={228 + i * 212} y={125} /> : null}
        </g>
      ))}
      <Label x={320} y={286} size={16} muted>
        Layout and movement first, fine detail last
      </Label>
    </svg>
  );
}

export function WholeClipFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A film strip of four frames, each linked to every other, because the model looks at the whole clip at once. Below, bars show that a clip twice as long takes about four times the work."
    >
      <FilmStrip x={60} y={20} frameW={110} frameH={70} kinds={["scene", "scene", "scene", "scene"]} gap={20} />
      {[0, 1, 2].map((a) =>
        [1, 2, 3]
          .filter((b) => b > a)
          .map((b) => {
            const ax = 60 + 20 + a * 130 + 55;
            const bx = 60 + 20 + b * 130 + 55;
            return (
              <path
                key={`${a}-${b}`}
                d={`M${ax} 130Q${(ax + bx) / 2} ${130 + (b - a) * 22} ${bx} 130`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            );
          })
      )}
      <text x={60} y={234} fontSize={14} fontWeight={500} fill="var(--color-ink)">
        5 seconds
      </text>
      <rect x={160} y={220} width={70} height={20} rx={10} fill="var(--color-fill)" />
      <text x={60} y={276} fontSize={14} fontWeight={500} fill="var(--color-ink)">
        10 seconds
      </text>
      <rect x={160} y={262} width={280} height={20} rx={10} fill="var(--color-accent)" />
      <Label x={456} y={277} anchor="start" size={14} muted>
        about 4× the work
      </Label>
    </svg>
  );
}

export function TimelineFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Four short shots of a few seconds each, placed end to end on an editing timeline to make one longer video with a sound track underneath."
    >
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Screen x={30 + i * 148} y={50} w={134} h={90} seed={40 + i} />
          <Label x={97 + i * 148} y={170} size={14} muted>
            {`Shot ${i + 1}`}
          </Label>
        </g>
      ))}
      <rect x={30} y={200} width={578} height={26} rx={13} fill="var(--color-fill)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={34 + i * 144} y={204} width={138} height={18} rx={9} fill="var(--color-page)" />
      ))}
      <path d="M40 252q20 -14 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
      <Label x={320} y={300} size={16} muted>
        Short shots, edited into one video
      </Label>
    </svg>
  );
}

export function PromptFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="On the left, a vague request produces a frame still half static: the model has to guess. On the right, a shot list produces a clear frame."
    >
      <rect x={30} y={30} width={260} height={64} rx={14} fill="var(--color-page)" />
      <text x={160} y={68} textAnchor="middle" fontSize={15} fontWeight={500} fill="var(--color-muted)">
        &ldquo;Epic cinematic lighthouse&rdquo;
      </text>
      <Screen x={60} y={120} w={200} h={130} clear={0.35} seed={60} />
      <Label x={160} y={290} muted>
        The model guesses
      </Label>
      <Clapper x={394} y={24} w={150} h={76} />
      <Screen x={370} y={120} w={200} h={130} clear={1} />
      <Label x={470} y={290} muted>
        It films what you asked
      </Label>
    </svg>
  );
}

export function FlawsFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A frame with three weak spots circled: a hand with too many fingers, a sign with garbled letters, and a shape melting into the background."
    >
      <rect x={60} y={30} width={520} height={240} rx={16} fill="var(--color-accent-tint)" />
      <path d="M60 220Q220 170 360 214T580 200V270H60Z" fill="var(--color-fill)" />
      {/* a hand with six fingers */}
      <rect x={130} y={150} width={50} height={46} rx={14} fill="var(--color-ink)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={128 + i * 9} y={118} width={7} height={38} rx={3.5} fill="var(--color-ink)" />
      ))}
      <circle cx={158} cy={160} r={62} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} />
      {/* a sign with garbled letters */}
      <rect x={290} y={70} width={140} height={60} rx={10} fill="var(--color-page)" />
      <path d="M306 92h20m6 0h8m10 0h26M306 110h12m8 0h30m6 0h14" stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
      <circle cx={360} cy={100} r={58} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} />
      {/* a shape melting into the ground */}
      <path d="M480 130h50v60q-10 18 -25 6t-25 14z" fill="var(--color-ink)" opacity={0.85} />
      <circle cx={505} cy={170} r={52} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} />
      <Label x={158} y={302} size={15} muted>
        Hands
      </Label>
      <Label x={360} y={302} size={15} muted>
        Words and logos
      </Label>
      <Label x={505} y={302} size={15} muted>
        Melting shapes
      </Label>
    </svg>
  );
}
