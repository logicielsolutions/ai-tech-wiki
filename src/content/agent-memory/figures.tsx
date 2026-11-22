import { Arrow, Card, CardBox, Clock, Label, Marker, Person, Phone, Shredder } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="A call ends. A checker with a black marker cleans the notes on a blue guest card. The card is filed in a card box, one section per guest. When the guest calls again, the receptionist has the card in hand."
    >
      <Phone cx={80} cy={180} ringing />
      <Label x={90} y={300} muted>
        A call ends
      </Label>
      <Arrow x1={160} x2={210} y={180} />
      <Card x={230} y={130} w={150} redact={[1]} strike={[2]} />
      <Marker x={372} y={172} />
      <Label x={305} y={300} muted>
        Checked
      </Label>
      <Arrow x1={440} x2={490} y={180} />
      <CardBox x={505} y={190} w={150} lit={2} />
      <Label x={580} y={300} muted>
        Filed per guest
      </Label>
      <Arrow x1={668} x2={705} y={180} />
      <Person cx={745} cy={190} />
      <Card x={748} y={112} w={44} lines={2} />
      <Label x={745} y={300} muted>
        Next call
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
      aria-label="Three cards a careless memory keeps: one with a bank card number, one with a fake rule for everyone, and one with an allergy the guest asked it to forget."
    >
      <Card x={60} y={40} w={160} plain badge="bank" />
      <Label x={140} y={210} muted>
        Keeps card numbers
      </Label>
      <Card x={320} y={40} w={160} plain badge="everyone" />
      <Label x={400} y={210} muted>
        Believes fake rules
      </Label>
      <Card x={580} y={40} w={160} plain badge="nut" />
      <Label x={660} y={210} muted>
        Won&apos;t forget
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
      aria-label="Left: the notes from a call, not yet checked. Right: the same notes after the checker, with one line blacked out and one line crossed out, on a blue guest card."
    >
      <Card x={50} y={70} w={200} lines={4} plain />
      <Label x={150} y={260} muted>
        Before
      </Label>
      <Arrow x1={270} x2={340} y={136} />
      <Card x={360} y={70} w={200} lines={4} redact={[1]} strike={[3]} />
      <Marker x={548} y={110} />
      <Label x={460} y={260} muted>
        After the checker
      </Label>
    </svg>
  );
}

export function FileFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A card box with one section per guest. One guest's card is raised, with a blue tab."
    >
      <CardBox x={170} y={140} w={300} lit={2} />
      <Label x={320} y={305} muted>
        One section per guest
      </Label>
    </svg>
  );
}

export function PullFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The guest calls again. Before saying hello, the receptionist holds up that guest's blue card."
    >
      <Phone cx={100} cy={150} ringing />
      <Label x={110} y={270} muted>
        Guest calls again
      </Label>
      <Arrow x1={190} x2={250} y={150} />
      <Person cx={320} cy={170} />
      <Card x={370} y={80} w={150} />
      <Label x={420} y={270} muted>
        Card read first
      </Label>
    </svg>
  );
}

export function StampFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="An old grey card with a stamp across it, marked no longer true, next to a new blue card that is the one used."
    >
      <Card x={70} y={80} w={200} plain faded stamped />
      <Label x={170} y={260} muted>
        Old: stamped
      </Label>
      <Arrow x1={290} x2={350} y={146} />
      <Card x={370} y={80} w={200} />
      <Label x={470} y={260} muted>
        New: used
      </Label>
    </svg>
  );
}

export function ShredFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A blue guest card goes into a shredder and comes out in strips."
    >
      <Card x={250} y={40} w={140} />
      <Shredder cx={320} y={120} w={220} />
      <Label x={320} y={312} muted>
        Gone, copies too
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
      aria-label="A guest calls, but the card box answers too slowly, shown as a clock. The receptionist greets the guest with no card in hand."
    >
      <Phone cx={90} cy={150} ringing />
      <Arrow x1={170} x2={200} y={150} />
      <Clock cx={260} cy={150} r={46} />
      <Label x={260} y={270} muted>
        Lookup too slow
      </Label>
      <Arrow x1={320} x2={400} y={150} />
      <Person cx={470} cy={170} />
      <Label x={470} y={270} muted>
        Greets without it
      </Label>
    </svg>
  );
}
