import { Arrow, Artist, Label, Loop, Mark, Meter, Net, Note, Ringmaster, Trapeze } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="A trapeze artist swings above a blue safety net. The net has four parts: repeats, failures, budget and no progress. On the right, a ringmaster waits to give the go-ahead for a dangerous trick."
    >
      <Trapeze cx={330} top={0} len={90} w={80} />
      <Artist cx={330} barY={90} />
      <Ringmaster cx={680} cy={250} />
      <Label x={680} y={330} muted>
        Approves risky tricks
      </Label>
      <Net x={60} y={290} w={520} sag={14} />
      {["Repeats", "Failures", "Budget", "No progress"].map((t, i) => (
        <Label key={t} x={60 + 65 + i * 130} y={386} size={17} muted>
          {t}
        </Label>
      ))}
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 800 260"
      className={svgClass}
      role="img"
      aria-label="Four ways an agent falls: it repeats the same move, its bar snaps (a tool breaks), its meter keeps running (it spends money), or someone passes up a note with a hidden order."
    >
      <Loop cx={100} cy={110} r={40} />
      <Label x={100} y={220} muted>
        Same move again
      </Label>
      <Trapeze cx={300} top={30} len={90} w={90} broken />
      <Label x={300} y={220} muted>
        A broken bar
      </Label>
      <Meter cx={500} cy={140} r={60} level={0.92} />
      <Label x={500} y={220} muted>
        Meter running
      </Label>
      <Note cx={700} cy={110} w={90} hidden />
      <Label x={700} y={220} muted>
        A sneaky note
      </Label>
    </svg>
  );
}

export function UnderFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The same trapeze act as before, with a blue net now stretched underneath. The act itself doesn't change."
    >
      <Trapeze cx={320} top={0} len={70} w={72} />
      <Artist cx={320} barY={70} />
      <Net x={110} y={240} w={420} sag={12} />
      <Label x={320} y={316} muted>
        Same act, net below
      </Label>
    </svg>
  );
}

export function MeterFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Three meters for steps, time and money. Before every swing the net reads all three; when one reaches its limit, the act stops."
    >
      {[
        ["Steps", 0.4],
        ["Time", 0.6],
        ["Money", 0.95],
      ].map(([t, level], i) => (
        <g key={t as string}>
          <Meter cx={140 + i * 180} cy={170} r={64} level={level as number} />
          <Label x={140 + i * 180} y={230} muted={i !== 2}>
            {t as string}
          </Label>
        </g>
      ))}
      <Mark cx={500} cy={80} ok={false} r={16} />
      <Label x={320} y={300} muted>
        Read before every swing
      </Label>
    </svg>
  );
}

export function RepeatFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Left: the same move three times; the first two go ahead and the third is blocked. Right: a broken bar gets three more tries, then it's marked out of use."
    >
      <Loop cx={70} cy={120} r={34} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Mark cx={150 + i * 50} cy={120} ok={i < 2} r={16} />
          <Label x={150 + i * 50} y={170} size={14} muted>
            {["1st", "2nd", "3rd"][i]}
          </Label>
        </g>
      ))}
      <Label x={170} y={250} muted>
        Third time: blocked
      </Label>
      <Trapeze cx={470} top={40} len={70} w={80} broken />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={430 + i * 40} cy={170} r={9} fill="var(--color-fill)" />
      ))}
      <Mark cx={560} cy={170} ok={false} r={14} />
      <Label x={480} y={250} muted>
        Three tries, then out
      </Label>
    </svg>
  );
}

export function NoteFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A note with a hidden order is passed up. The net checks it first, and the artist gets a crossed-out note instead of the order."
    >
      <Note cx={110} cy={140} w={100} hidden />
      <Label x={110} y={240} muted>
        Note passed up
      </Label>
      <Arrow x1={180} x2={250} y={140} />
      <Net x={260} y={120} w={120} sag={8} sections={1} lit={0} />
      <Label x={320} y={240} muted>
        Checked first
      </Label>
      <Arrow x1={400} x2={460} y={140} />
      <Note cx={530} cy={140} w={100} blocked />
      <Label x={530} y={240} muted>
        Blocked
      </Label>
    </svg>
  );
}

export function RingmasterFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Before a dangerous trick the artist waits for the ringmaster. A nod means go; no answer in five minutes means no."
    >
      <Trapeze cx={140} top={0} len={70} w={70} />
      <Artist cx={140} barY={70} />
      <Label x={140} y={240} muted>
        Risky trick
      </Label>
      <Arrow x1={230} x2={300} y={160} />
      <Ringmaster cx={400} cy={170} nod />
      <Label x={400} y={240} muted>
        Waits for a nod
      </Label>
      <Label x={560} y={150} size={16} muted>
        No answer
      </Label>
      <Label x={560} y={176} size={16} muted>
        means no
      </Label>
    </svg>
  );
}

export function CantFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A politely worded note slips through a gap in the net. Below it, the ringmaster still holds up a hand, so the dangerous trick doesn't happen."
    >
      <Note cx={250} cy={60} w={70} />
      <path d="M250 100V150" stroke="var(--color-muted)" strokeWidth={2} strokeDasharray="4 6" strokeLinecap="round" />
      <Net x={90} y={150} w={320} sag={10} gap={250} />
      <Label x={250} y={240} muted>
        A polite note slips
      </Label>
      <Ringmaster cx={520} cy={170} stop />
      <Label x={520} y={240} muted>
        Still needs a yes
      </Label>
    </svg>
  );
}
