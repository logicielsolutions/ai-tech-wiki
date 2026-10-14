import { Arrow, Bar, Camera, Label, Lens, OpenCamera, Photo, StudioCamera } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 40 800 320"
      className={svgClass}
      role="img"
      aria-label="A camera with a small blue lens clipped onto it. It takes three sharp photos, each marked right. The camera is the AI model, which stays as it is; the lens is the small add-on that learned one job."
    >
      <Camera cx={210} cy={196} w={230} lens />
      <Label x={210} y={322} muted>
        Same model, new lens
      </Label>
      <Arrow x1={352} x2={398} y={196} />
      {[0, 1, 2].map((i) => (
        <Photo key={i} x={424 + i * 116} y={150} w={96} mark="good" />
      ))}
      <Label x={598} y={322} muted>
        Better at one job
      </Label>
    </svg>
  );
}

export function WhyFigure() {
  const marks: ("good" | "bad")[] = ["good", "bad", "bad", "good"];
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A general camera with no special lens takes four photos of the same kind of shot. Two come out sharp and right, two come out blurry and wrong: about half right."
    >
      <Camera cx={150} cy={150} w={190} />
      <Label x={150} y={270} muted>
        A general model
      </Label>
      <Arrow x1={268} x2={306} y={150} />
      {marks.map((mark, i) => (
        <Photo key={i} x={336 + (i % 2) * 112} y={64 + Math.floor(i / 2) * 96} w={92} sharp={mark === "good"} mark={mark} />
      ))}
      <Label x={438} y={290} muted>
        About half right
      </Label>
    </svg>
  );
}

export function KeepFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The camera with a small padlock on it: the model's own settings are locked and do not change."
    >
      <Camera cx={320} cy={160} w={240} locked />
      <Label x={320} y={292} muted>
        Stays as it is
      </Label>
    </svg>
  );
}

export function ClipOnFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A small blue lens on the left, with an arrow to the locked camera on the right. Only the lens learns; the camera stays frozen."
    >
      <Lens cx={140} cy={160} r={52} />
      <Label x={140} y={270} muted>
        Only this learns
      </Label>
      <Arrow x1={222} x2={270} y={160} />
      <Camera cx={430} cy={160} w={220} locked />
      <Label x={430} y={290} muted>
        Stays frozen
      </Label>
    </svg>
  );
}

export function CompactFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Left, a full-size camera with the blue lens, using 8.5 GB of graphics-card memory. Right, a compact camera with the same lens, using 3.6 GB. Both scored about 78% on the familiar test."
    >
      <Camera cx={170} cy={118} w={176} lens />
      <Camera cx={470} cy={128} w={112} lens />
      <Label x={170} y={210} size={22}>
        Full size
      </Label>
      <Label x={470} y={210} size={22}>
        Compressed
      </Label>
      <Bar x={70} y={232} w={200} value={8.48} max={9} />
      <Bar x={370} y={232} w={200} value={3.56} max={9} strong />
      <Label x={170} y={280} muted size={22}>
        8.5 GB memory
      </Label>
      <Label x={470} y={280} muted size={22}>
        3.6 GB memory
      </Label>
    </svg>
  );
}

export function RebuildFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A small camera opened up, its front panel set aside, with every part inside highlighted: in full fine-tuning every part of the model learns."
    >
      <OpenCamera cx={250} cy={150} w={230} />
      <Label x={320} y={276} muted>
        Every part learns
      </Label>
    </svg>
  );
}

export function TestFigure() {
  const columns = [
    { label: "Familiar", good: 5, value: "78% right" },
    { label: "Harder", good: 3, value: "48% right" },
    { label: "Unfamiliar", good: 1, value: "16% right" },
  ];
  const w = 50;
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Three test sets of photos. Familiar questions: most come out right, 78%. Harder questions: about half, 48%. Unfamiliar real databases: few, 16%."
    >
      {columns.map((column, c) => {
        const cx = 112 + c * 208;
        return (
          <g key={column.label}>
            <Label x={cx} y={56} size={24}>
              {column.label}
            </Label>
            {Array.from({ length: 6 }, (_, i) => {
              const good = i < column.good;
              return (
                <Photo
                  key={i}
                  x={cx - 84 + (i % 3) * 59}
                  y={84 + Math.floor(i / 3) * 52}
                  w={w}
                  sharp={good}
                  mark={good ? "good" : "bad"}
                />
              );
            })}
            <Label x={cx} y={240} muted size={24}>
              {column.value}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

export function UnfamiliarFigure() {
  const rows = [
    { label: "Untrained", value: 23.8, icon: <Camera cx={70} cy={70} w={78} /> },
    { label: "With the add-on", value: 16.0, icon: <Camera cx={70} cy={160} w={78} lens />, strong: true },
    { label: "Large hosted model", value: 41.6, icon: <StudioCamera cx={70} cy={240} w={78} /> },
  ];
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="On unfamiliar real databases: the untrained model got 24% right, the model with the add-on got 16%, and a large hosted model got 42%."
    >
      {rows.map((row, i) => {
        const y = 70 + i * 88;
        return (
          <g key={row.label}>
            {row.icon}
            <Label x={150} y={y - 12} anchor="start" size={22} muted>
              {row.label}
            </Label>
            <Bar x={150} y={y} w={340} value={row.value} max={50} strong={row.strong} />
            <Label x={508} y={y + 13} anchor="start" size={26}>
              {`${Math.round(row.value)}%`}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

export function ThreeWaysFigure() {
  return (
    <svg
      viewBox="0 0 800 260"
      className={svgClass}
      role="img"
      aria-label="Three ways to teach a model one job: open a small camera and rebuild it, clip a lens onto a camera, or clip the same lens onto a compact camera."
    >
      <OpenCamera cx={120} cy={110} w={150} />
      <Label x={150} y={226} muted size={26}>
        Rebuild it
      </Label>
      <Camera cx={420} cy={112} w={170} lens />
      <Label x={420} y={226} muted size={26}>
        Clip on a lens
      </Label>
      <Camera cx={670} cy={120} w={112} lens />
      <Label x={670} y={226} muted size={26}>
        Compact + lens
      </Label>
    </svg>
  );
}
