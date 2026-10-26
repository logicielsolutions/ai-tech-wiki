import { Alarm, type AlarmState, Arrow, Bar, Building, Envelope, Fire, Handbook, Inspector, Installer, Label, Mark, Person } from "./cast";

const svgClass = "h-auto w-full";

/**
 * A building with its alarms along the ceiling and the fake fires lit inside it (in the windows, then the
 * bottom corners). Geometry follows `Building`: body height 0.72w, top at cy − 0.36w.
 */
function Site({ cx, cy, w, alarms = [], fires = 0, crossed = false }: { cx: number; cy: number; w: number; alarms?: AlarmState[]; fires?: number; crossed?: boolean }) {
  const h = w * 0.72;
  const top = cy - h / 2;
  const n = alarms.length;
  const spread = n > 1 ? Math.min(0.72, 0.24 * (n - 1)) : 0;
  const fireSpots = [
    [cx - w * 0.23, top + h * 0.22 + w * 0.1],
    [cx + w * 0.23, top + h * 0.22 + w * 0.1],
    [cx - w * 0.32, top + h * 0.82],
    [cx + w * 0.32, top + h * 0.82],
  ];
  return (
    <g>
      <Building cx={cx} cy={cy} w={w} crossed={crossed} />
      <g opacity={crossed ? 0.55 : 1}>
        {fireSpots.slice(0, fires).map(([fx, fy], i) => (
          <Fire key={i} cx={fx} cy={fy} s={w * 0.075} />
        ))}
        {alarms.map((state, i) => (
          <Alarm key={i} cx={cx - (w * spread) / 2 + (n > 1 ? (i * w * spread) / (n - 1) : 0)} cy={top + h * 0.11} r={w * 0.05} state={state} />
        ))}
      </g>
    </g>
  );
}

export function HeroFigure() {
  return (
    <svg
      viewBox="0 20 800 360"
      className={svgClass}
      role="img"
      aria-label="An installer carries a blue handbook into a building. Inside, fake fires are lit and two of three smoke alarms go off. On the right, an inspector holds a sealed envelope of new buildings for the final test."
    >
      <Installer cx={120} cy={210} edited />
      <Label x={130} y={310} muted>
        The installer
      </Label>
      <Arrow x1={196} x2={244} y={210} />
      <Site cx={400} cy={220} w={240} alarms={["ringing", "ringing", "idle"]} fires={3} />
      <Label x={400} y={340} muted>
        Alarms meet fake fires
      </Label>
      <Arrow x1={556} x2={604} y={210} />
      <Inspector cx={650} cy={214} />
      <Envelope cx={732} cy={226} w={76} />
      <Label x={680} y={310} muted>
        A sealed final
      </Label>
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="-80 0 800 320"
      className={svgClass}
      role="img"
      aria-label="Two buildings, each with two small fires. The left one has no alarms, so nobody notices. The right one has two alarms, both going off: the fires are caught early."
    >
      <Site cx={170} cy={160} w={210} fires={2} />
      <Label x={170} y={284} muted>
        No alarms
      </Label>
      <Site cx={470} cy={160} w={210} alarms={["ringing", "ringing"]} fires={2} />
      <Label x={470} y={284} muted>
        Caught early
      </Label>
    </svg>
  );
}

function MiniTown({ x, y, cols, count, w = 40 }: { x: number; y: number; cols: number; count: number; w?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <Building key={i} cx={x + (i % cols) * (w + 12)} cy={y + Math.floor(i / cols) * (w * 1.2 + 14)} w={w} />
      ))}
    </g>
  );
}

export function SplitFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Three groups of buildings. Fourteen practice buildings, six mock-exam buildings, and ten more sealed inside an envelope that only opens for the final test."
    >
      <MiniTown x={48} y={100} cols={5} count={14} />
      <Label x={152} y={280} muted>
        Practice: 14
      </Label>
      <MiniTown x={330} y={126} cols={3} count={6} />
      <Label x={382} y={280} muted>
        Mock: 6
      </Label>
      <Envelope cx={550} cy={160} w={110} />
      <Label x={550} y={280} muted>
        Sealed: 10
      </Label>
    </svg>
  );
}

export function InstallFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The installer, holding the handbook, puts three smoke alarms into a building. The building sits in a closed room with no way out to the internet or to the answer sheets."
    >
      <Installer cx={130} cy={170} />
      <Label x={140} y={270} muted>
        Reads the handbook
      </Label>
      <Arrow x1={206} x2={254} y={170} />
      <rect x={290} y={40} width={300} height={240} rx={20} fill="var(--color-page)" />
      <Site cx={440} cy={170} w={200} alarms={["idle", "idle", "idle"]} />
      <Label x={440} y={306} muted>
        A closed room
      </Label>
    </svg>
  );
}

export function CheckFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Left: four fake fires are lit and three of the four alarms go off, so the building scores three in four. Right: one alarm in the other building is faulty, so that whole building scores zero."
    >
      <Site cx={170} cy={156} w={220} alarms={["ringing", "ringing", "ringing", "idle"]} fires={4} />
      <Label x={170} y={286} muted>
        3 of 4 caught
      </Label>
      <Site cx={470} cy={156} w={220} alarms={["ringing", "faulty"]} fires={2} crossed />
      <Mark cx={560} cy={84} good={false} r={18} />
      <Label x={470} y={286} muted>
        One fault: zero
      </Label>
    </svg>
  );
}

export function CoachFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The old handbook goes to a senior coach, who reads which practice buildings went wrong and hands back a rewritten handbook with crossed-out and new lines."
    >
      <Handbook x={60} y={76} w={110} />
      <Label x={115} y={270} muted>
        Old handbook
      </Label>
      <Arrow x1={196} x2={244} y={150} />
      <Person cx={320} cy={160} />
      <Building cx={290} cy={66} w={36} crossed />
      <Building cx={350} cy={66} w={36} crossed />
      <Label x={320} y={270} muted>
        A senior coach
      </Label>
      <Arrow x1={396} x2={444} y={150} />
      <Handbook x={470} y={76} w={110} edited />
      <Label x={525} y={270} muted>
        Rewritten
      </Label>
    </svg>
  );
}

export function InspectFigure() {
  const x0 = 230;
  const w = 340;
  const need = 0.714 + 0.1;
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="An inspector compares two handbooks on the same sealed buildings. The old handbook's bar reaches about 7 in 10. A new handbook must reach past a marked line about one tenth higher, by a clear margin, before it can replace the old one."
    >
      <Inspector cx={80} cy={170} />
      <Handbook x={150} y={86} w={40} />
      <Label x={x0} y={92} anchor="start" size={18} muted>
        Old handbook
      </Label>
      <Bar x={x0} y={104} w={w} value={0.714} strong />
      <Handbook x={150} y={176} w={40} edited faded />
      <Label x={x0} y={182} anchor="start" size={18} muted>
        New handbook
      </Label>
      <Bar x={x0} y={194} w={w} value={0.557} />
      <path d={`M${x0 + w * need} 70V232`} stroke="var(--color-ink)" strokeWidth={2} strokeDasharray="4 6" strokeLinecap="round" />
      <Label x={x0 + w * need} y={262} size={18}>
        Clear win line
      </Label>
    </svg>
  );
}

export function TownFigure() {
  const rows = [
    { label: "Human-written alarms", value: 0.968 },
    { label: "Starting handbook", value: 0.726, strong: true },
    { label: "Rewritten handbook", value: 0.501 },
  ];
  return (
    <svg
      viewBox="0 20 800 270"
      className={svgClass}
      role="img"
      aria-label="In the simpler practice town, on eight sealed buildings: alarms written by people caught about 97% of fake fires, the starting handbook about 73%, and the coach's rewrite about 50%."
    >
      {rows.map((row, i) => {
        const y = 70 + i * 90;
        return (
          <g key={row.label}>
            <Label x={40} y={y - 12} anchor="start" size={20} muted>
              {row.label}
            </Label>
            <Bar x={40} y={y} w={460} value={row.value} strong={row.strong} h={16} />
            <Label x={520} y={y + 15} anchor="start" size={24}>
              {`${Math.round(row.value * 100)}%`}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

export function WorksFigure() {
  return (
    <svg
      viewBox="-60 30 800 290"
      className={svgClass}
      role="img"
      aria-label="On a real change to the code, the installer put in eleven alarms. All eleven work, each marked with a tick."
    >
      <Installer cx={110} cy={160} />
      <Arrow x1={186} x2={234} y={160} />
      {Array.from({ length: 11 }, (_, i) => {
        const cx = 290 + (i % 4) * 82;
        const cy = 80 + Math.floor(i / 4) * 76;
        return (
          <g key={i}>
            <Alarm cx={cx} cy={cy} r={20} />
            <Mark cx={cx + 20} cy={cy - 18} good r={10} />
          </g>
        );
      })}
      <Label x={414} y={300} muted>
        11 of 11 work
      </Label>
    </svg>
  );
}

export function SignOffFigure() {
  return (
    <svg
      viewBox="-80 30 800 290"
      className={svgClass}
      role="img"
      aria-label="A rewritten handbook next to the inspector, who has a green tick: a person has to read every rewrite and sign off any change."
    >
      <Handbook x={200} y={90} w={110} edited />
      <Inspector cx={440} cy={170} stamp />
      <Label x={320} y={290} muted>
        A person signs off
      </Label>
    </svg>
  );
}
