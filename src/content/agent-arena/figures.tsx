import { Arrow, Bay, Car, Clock, Coin, Flag, Foreman, JobBoard, Label, Loop, Mark, Mechanic, Route, Toolbox } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="Two ways to fix the same broken car. On the left, one mechanic keeps trying in a loop. On the right, a workshop follows a job board: the job is sorted, three mechanics try fixes in their own bays, and the foreman picks the best."
    >
      <Bay x={20} y={40} w={250} h={300} />
      <Loop cx={110} cy={130} r={34} />
      <Mechanic cx={190} cy={150} />
      <Car cx={145} cy={265} w={180} broken />
      <Label x={145} y={380} muted>
        One mechanic, a loop
      </Label>

      <JobBoard cx={350} cy={190} w={84} />
      <Route x1={398} y1={190} x2={448} y2={100} />
      <Route x1={398} y1={190} x2={448} y2={190} />
      <Route x1={398} y1={190} x2={448} y2={280} />
      {[100, 190, 280].map((y) => (
        <g key={y}>
          <Bay x={454} y={y - 40} w={200} h={80} roof={false} />
          <Mechanic cx={489} cy={y + 10} s={0.75} />
          <Car cx={584} cy={y + 10} w={100} broken />
        </g>
      ))}
      <Route x1={660} y1={190} x2={700} y2={190} />
      <Foreman cx={740} cy={200} />
      <Label x={560} y={380} muted>
        A workshop with a plan
      </Label>
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 800 260"
      className={svgClass}
      role="img"
      aria-label="Three repair shops each show off a different car with a different fault, so there is no way to tell which shop is better."
    >
      {[0, 1, 2].map((i) => {
        const cx = 140 + i * 260;
        return (
          <g key={i}>
            <Bay x={cx - 110} y={30} w={220} h={170} />
            <Car cx={cx} cy={130 + (i === 1 ? 6 : 0)} w={120 + i * 30} broken={i !== 1} />
            <Label x={cx} y={235} muted>
              {["Shop A, its car", "Shop B, its car", "Shop C, its car"][i]}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

export function SameCarFigure() {
  return (
    <svg viewBox="0 0 640 320" className={svgClass} role="img" aria-label="The same broken car is copied to every shop, with a chequered flag for the test drive it must pass.">
      <Car cx={150} cy={170} w={200} broken />
      <Label x={150} y={270} muted>
        A planted fault
      </Label>
      <Arrow x1={280} x2={350} y={160} />
      {[90, 170, 250].map((y) => (
        <Car key={y} cx={440} cy={y} w={110} broken />
      ))}
      <Flag cx={570} cy={160} s={44} />
      <Label x={490} y={300} muted>
        Same car, same test
      </Label>
    </svg>
  );
}

export function BayFigure() {
  return (
    <svg viewBox="0 0 640 320" className={svgClass} role="img" aria-label="A closed repair bay with the car inside, the same toolbox, a clock and a coin for the limits on time, tries and money.">
      <Bay x={30} y={30} w={360} h={260} />
      <Car cx={210} cy={190} w={220} broken />
      <Toolbox cx={90} cy={80} w={64} />
      <Label x={90} y={130} size={14} muted>
        4 tools
      </Label>
      <Clock cx={515} cy={66} r={30} level={0.25} />
      <Label x={515} y={116} size={14} muted>
        10 minutes
      </Label>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={479 + i * 18} cy={160} r={6} fill={i < 2 ? "var(--color-muted)" : "var(--color-fill)"} />
      ))}
      <Label x={515} y={194} size={14} muted>
        20 tries
      </Label>
      <Coin cx={515} cy={238} r={22} />
      <Label x={515} y={286} size={14} muted>
        50 cents
      </Label>
    </svg>
  );
}

export function LoopFigure() {
  return (
    <svg viewBox="0 0 640 320" className={svgClass} role="img" aria-label="One mechanic works on the car, test-drives it, and goes round again until it passes or the clock runs out.">
      <Mechanic cx={150} cy={150} />
      <Loop cx={150} cy={60} r={30} />
      <Car cx={320} cy={200} w={200} broken />
      <Arrow x1={440} x2={500} y={190} />
      <Flag cx={560} cy={190} s={44} />
      <Label x={150} y={290} muted>
        Try, test, again
      </Label>
      <Clock cx={560} cy={60} r={26} level={0.6} />
    </svg>
  );
}

export function GraphFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The planned job: look at the car, sort the job, three mechanics try fixes at once, the foreman picks the best, and a second mechanic checks it."
    >
      <JobBoard cx={60} cy={160} w={70} />
      <Label x={60} y={260} size={14} muted>
        Look, sort
      </Label>
      <Route x1={100} y1={160} x2={160} y2={70} />
      <Route x1={100} y1={160} x2={160} y2={160} />
      <Route x1={100} y1={160} x2={160} y2={250} />
      {[70, 160, 250].map((y) => (
        <g key={y}>
          <Bay x={166} y={y - 40} w={200} h={80} roof={false} />
          <Mechanic cx={201} cy={y + 10} s={0.75} />
          <Car cx={296} cy={y + 10} w={100} />
        </g>
      ))}
      <Route x1={370} y1={160} x2={420} y2={160} />
      <Foreman cx={460} cy={170} />
      <Label x={460} y={260} size={14} muted>
        Picks the best
      </Label>
      <Route x1={500} y1={160} x2={540} y2={160} />
      <Mechanic cx={570} cy={170} />
      <Label x={580} y={260} size={14} muted>
        Checks it
      </Label>
    </svg>
  );
}

export function FlagFigure() {
  return (
    <svg viewBox="0 0 640 320" className={svgClass} role="img" aria-label="The shop runs the test drive itself. The repaired car passes; a car whose test track was changed does not count.">
      <Car cx={170} cy={170} w={220} fixed />
      <Flag cx={340} cy={170} s={50} />
      <Mark cx={340} cy={250} ok r={18} />
      <Label x={250} y={300} muted>
        Passes the test drive
      </Label>
      <Car cx={530} cy={170} w={150} />
      <Mark cx={530} cy={250} ok={false} r={18} />
      <Label x={530} y={300} muted>
        Changed the test
      </Label>
    </svg>
  );
}

export function CantFigure() {
  return (
    <svg viewBox="0 0 640 320" className={svgClass} role="img" aria-label="A toy car next to a real one: the practice faults were small, and a real codebase is much bigger.">
      <Car cx={150} cy={220} w={90} broken />
      <Label x={150} y={290} muted>
        Our practice cars
      </Label>
      <Car cx={430} cy={190} w={320} broken />
      <Label x={430} y={290} muted>
        A real codebase
      </Label>
    </svg>
  );
}
