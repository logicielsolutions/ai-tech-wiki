import { Arrow, Label } from "@/components/wiki/art-kit";
import {
  Bell,
  Bench,
  Bubble,
  Card,
  Crate,
  Cross,
  CurveArrow,
  Fence,
  Gatekeeper,
  Human,
  LoadingDoor,
  Office,
  Phone,
  Safe,
  Tick,
  WorkOrder,
  Worker,
} from "./cast";

const svgClass = "h-auto w-full";
const LABEL = 17;

/** A small key, held by the person who opens the loading door. */
function Key({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="none" stroke="var(--color-ink)" strokeWidth={2.5} />
      <path d={`M${x + 7} ${y}h16m-5 0v6m-5 -6v4`} fill="none" stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="The workshop, left to right. A client at the front desk with a signed work order. A fenced yard where AI workers do the job. A gatekeeper at the yard's exit with its barrier down. An office with one bell. A loading door, where a person holds the key."
    >
      <rect x={20} y={262} width={160} height={20} rx={8} fill="var(--color-fill)" />
      <Human cx={62} cy={212} s={1.1} />
      <WorkOrder x={104} y={176} s={0.8} />
      <Label x={100} y={322} size={LABEL}>Work order</Label>
      <Arrow x1={192} x2={214} y={222} />

      <Fence x={226} y={64} w={302} h={276} />
      <Worker cx={286} cy={156} />
      <Card x={312} y={104} />
      <Worker cx={384} cy={134} />
      <Worker cx={462} cy={176} />
      <Worker cx={318} cy={262} />
      <Card x={348} y={224} />
      <Worker cx={420} cy={272} />
      <Label x={377} y={370} size={LABEL}>Fenced yard</Label>

      <Gatekeeper x={506} y={182} s={0.9} />
      <Label x={552} y={286} size={LABEL}>Gatekeeper</Label>

      <Office x={636} y={36}>
        <Bell cx={98} cy={30} s={0.8} />
      </Office>
      <Label x={696} y={160} size={LABEL}>Office</Label>

      <LoadingDoor x={640} y={212} s={0.86} />
      <Human cx={758} cy={286} s={0.82} />
      <Key x={746} y={262} />
      <Label x={696} y={334} size={LABEL}>Loading door</Label>
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The yard with no fence and no gatekeeper. An AI worker reaches into the office safe, which stands open with keys spilling out. The person in the office doesn't notice."
    >
      <Worker cx={110} cy={180} />
      <Worker cx={200} cy={236} />
      <Card x={140} y={210} />
      <CurveArrow x1={136} y1={140} x2={316} y2={150} bend={-60} />
      <Safe x={330} y={140} s={1.1} open />
      <Office x={470} y={58} />
      <Label x={150} y={300} size={LABEL}>No fence</Label>
      <Label x={360} y={260} size={LABEL}>Safe left open</Label>
      <Label x={530} y={190} size={LABEL}>Nobody told</Label>
    </svg>
  );
}

export function SignFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The AI analyst asks questions; the client answers and signs the work order. An older version of the order is torn: a change means signing again."
    >
      <Bubble x={64} y={44} />
      <Bubble x={128} y={98} />
      <Worker cx={110} cy={210} />
      <Human cx={272} cy={210} />
      <Bubble x={226} y={98} right />
      <Arrow x1={320} x2={352} y={196} />
      <g opacity={0.55}>
        <WorkOrder x={372} y={72} s={0.86} torn />
      </g>
      <Cross cx={440} cy={74} r={11} />
      <WorkOrder x={486} y={110} s={1.05} />
      <Label x={110} y={290} size={LABEL}>Questions</Label>
      <Label x={272} y={290} size={LABEL}>Client signs</Label>
      <Label x={406} y={196} size={LABEL} muted>Old version</Label>
      <Label x={528} y={248} size={LABEL}>Signed</Label>
    </svg>
  );
}

export function TeamFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Inside the fence, one AI worker splits the job into cards, a second builds, a third checks. Work that fails the check goes back to the builder; work that passes moves on. No person is in the yard."
    >
      <Fence x={16} y={20} w={608} h={282} />
      <Card x={58} y={58} />
      <Card x={86} y={66} />
      <Card x={114} y={74} />
      <Worker cx={100} cy={170} />
      <Arrow x1={146} x2={196} y={170} />
      <Worker cx={262} cy={170} />
      <Bench x={224} y={204} />
      <CurveArrow x1={300} y1={128} x2={432} y2={128} bend={-56} />
      <Tick cx={366} cy={86} r={11} />
      <CurveArrow x1={432} y1={226} x2={300} y2={226} bend={56} />
      <Cross cx={366} cy={268} r={11} />
      <Worker cx={472} cy={170} />
      <Crate x={540} y={150} />
      <Label x={100} y={252} size={LABEL}>Plan</Label>
      <Label x={262} y={274} size={LABEL}>Build</Label>
      <Label x={472} y={252} size={LABEL}>Check</Label>
    </svg>
  );
}

export function FenceFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="An AI worker at its own bench inside the fence. Its reach toward the safe outside stops at the fence. One narrow road leads out."
    >
      <Fence x={24} y={36} w={376} h={250} />
      <Worker cx={140} cy={168} />
      <Bench x={182} y={176} />
      <Card x={206} y={136} />
      <CurveArrow x1={166} y1={118} x2={388} y2={96} bend={-36} />
      <Cross cx={400} cy={96} r={12} />
      <Safe x={480} y={66} s={1.2} />
      <Arrow x1={406} x2={476} y={236} />
      <Label x={212} y={262} size={LABEL}>Own bench</Label>
      <Label x={510} y={160} size={LABEL}>Out of reach</Label>
      <Label x={540} y={242} size={LABEL}>Few roads out</Label>
    </svg>
  );
}

export function GateFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="An AI worker reaches for something not on the work order. The gatekeeper's barrier stays down and one bell rings in the office. A chat message shouted over the fence has no effect."
    >
      <Fence x={16} y={40} w={300} h={244} />
      <Worker cx={130} cy={170} />
      <Card x={170} y={128} />
      <Arrow x1={208} x2={262} y={146} />
      <Gatekeeper x={290} y={128} />
      <Cross cx={364} cy={112} r={12} />
      <Label x={364} y={88} size={LABEL}>Refused</Label>
      <Office x={476} y={28}>
        <Bell cx={98} cy={30} s={0.8} ringing />
      </Office>
      <Label x={536} y={152} size={LABEL}>One bell</Label>
      <Bubble x={430} y={206} right />
      <Cross cx={432} cy={210} r={10} />
      <Label x={470} y={290} size={LABEL}>Chat: no effect</Label>
    </svg>
  );
}

export function DoorFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="Finished work leaves the fenced yard as a crate and waits at the loading door. Only a person with the key opens it."
    >
      <Fence x={16} y={40} w={150} h={240} />
      <Worker cx={90} cy={170} />
      <Crate x={212} y={190} s={1.2} />
      <Arrow x1={276} x2={320} y={212} />
      <LoadingDoor x={330} y={74} s={1.4} />
      <Human cx={540} cy={204} s={1.15} />
      <Key x={500} y={174} />
      <Label x={248} y={268} size={LABEL}>Ready for review</Label>
      <Label x={540} y={290} size={LABEL}>A person merges</Label>
    </svg>
  );
}

export function ChatFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A phone showing a chat thread with the analyst. The client's signed check mark goes to the work order, which the factory checks and files."
    >
      <Phone x={110} y={36} s={1.6} />
      <Arrow x1={256} x2={330} y={170} />
      <WorkOrder x={360} y={84} s={1.3} />
      <Tick cx={466} cy={214} r={18} />
      <Label x={168} y={300} size={LABEL}>Chat app</Label>
      <Label x={412} y={300} size={LABEL} muted>Lab only</Label>
    </svg>
  );
}

/** Two timelines from the factory's own tests: a ticket that loops through the checker, and a forbidden push. */
export function TimelineFigure() {
  const track = (y: number, x1: number, x2: number) => (
    <path d={`M${x1} ${y}H${x2}`} stroke="var(--color-rule)" strokeWidth={4} strokeLinecap="round" />
  );
  return (
    <svg
      viewBox="0 0 800 340"
      className="h-auto w-full min-w-[620px]"
      role="img"
      aria-label="Two timelines. Top: a ticket is built, fails the check, is fixed and passes, in about three and a half minutes with no person. Bottom: an agent tries to push straight to the main copy; it is refused and the work stops 13 seconds after the agent woke; one bell rings; a person resolves it; the work resumes without retrying the push."
    >
      <Label x={40} y={34} anchor="start" size={15} muted>No person needed</Label>
      {track(96, 70, 730)}
      <Worker cx={70} cy={84} s={0.62} />
      <Cross cx={290} cy={96} r={14} />
      <Worker cx={510} cy={84} s={0.62} />
      <Tick cx={730} cy={96} r={14} />
      <Label x={70} y={140} size={LABEL}>Built</Label>
      <Label x={290} y={140} size={LABEL}>Check fails</Label>
      <Label x={510} y={140} size={LABEL}>Fixed</Label>
      <Label x={730} y={140} size={LABEL}>Check passes</Label>
      <Label x={730} y={64} size={15} muted>3.5 min</Label>

      <Label x={40} y={204} anchor="start" size={15} muted>A forbidden move</Label>
      {track(264, 70, 730)}
      <Worker cx={70} cy={252} s={0.62} />
      <Cross cx={235} cy={264} r={14} />
      <Bell cx={400} cy={260} s={0.8} ringing />
      <Human cx={565} cy={256} s={0.6} />
      <Tick cx={730} cy={264} r={14} />
      <Label x={70} y={308} size={LABEL}>Push to main</Label>
      <Label x={235} y={308} size={LABEL}>Stopped</Label>
      <Label x={400} y={308} size={LABEL}>One bell</Label>
      <Label x={565} y={308} size={LABEL}>Person resolves</Label>
      <Label x={730} y={308} size={LABEL}>Work resumes</Label>
      <Label x={235} y={232} size={15} muted>13 s</Label>
    </svg>
  );
}

export function LimitsFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The workshop with its fence drawn faint and a sign reading Testing: the fence is built and tested but not switched on everywhere. At the loading door a person inspects the crate before it leaves."
    >
      <Fence x={24} y={56} w={300} h={220} off />
      <rect x={110} y={24} width={128} height={40} rx={12} fill="var(--color-page)" />
      <Label x={174} y={51} size={LABEL}>Testing</Label>
      <Worker cx={110} cy={170} />
      <Worker cx={220} cy={196} />
      <LoadingDoor x={400} y={60} />
      <Crate x={410} y={206} s={1.1} />
      <Human cx={560} cy={214} s={1.05} />
      <Label x={174} y={304} size={LABEL}>Built, switched off</Label>
      <Label x={520} y={304} size={LABEL}>Person checks</Label>
    </svg>
  );
}
