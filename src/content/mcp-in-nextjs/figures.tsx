import { ArrowTo, Book, Bot, Clock, Door, Label, Mark, Menu, Pass, Person, Rail, Room, Screen, Stamp, Ticket, Window } from "./cast";

const svgClass = "h-auto w-full";

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className={svgClass}
      role="img"
      aria-label="One kitchen with two ways in. On the left, a person comes in through the dining-room door. On the right, an AI assistant uses the blue delivery window. Both arrows lead to one rulebook in the middle of the kitchen, under one order rail."
    >
      <Room x={180} y={40} w={440} h={320} />
      <Label x={400} y={72} size={16} muted>
        The board
      </Label>
      <Rail x={240} y={86} w={320} n={5} />
      <Book cx={400} cy={250} w={130} />
      <Label x={400} y={330} size={16} muted>
        One rulebook
      </Label>
      <Door x={162} y={210} w={56} h={150} />
      <Window x={584} y={210} w={72} />
      <ArrowTo x1={232} y1={292} x2={318} y2={268} />
      <ArrowTo x1={572} y1={250} x2={482} y2={262} />
      <Person cx={90} cy={290} />
      <Label x={90} y={358} muted>
        People
      </Label>
      <Bot cx={720} cy={290} />
      <Label x={720} y={358} muted>
        AI assistants
      </Label>
    </svg>
  );
}

export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 800 300"
      className={svgClass}
      role="img"
      aria-label="The usual way: two separate kitchens. People use one kitchen through its door; AI assistants use a second kitchen through its delivery window. Each kitchen keeps its own rulebook, and one rule in the second book has changed, so the two no longer match."
    >
      <Room x={110} y={30} w={240} h={190} />
      <Door x={96} y={120} w={36} h={100} />
      <Book cx={240} cy={130} w={110} />
      <Person cx={52} cy={176} />
      <Label x={230} y={256} muted>
        Kitchen for people
      </Label>
      <Label x={400} y={142} size={40} muted>
        ≠
      </Label>
      <Room x={450} y={30} w={240} h={190} />
      <Window x={670} y={110} w={46} />
      <Book cx={560} cy={130} w={110} odd />
      <Bot cx={758} cy={176} />
      <Label x={570} y={256} muted>
        Kitchen for assistants
      </Label>
      <Label x={400} y={292} size={17} muted>
        Two rulebooks drift apart
      </Label>
    </svg>
  );
}

export function PassFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A person hands a small dark pass to their AI assistant. The pass is shown only once."
    >
      <Person cx={150} cy={190} />
      <Label x={150} y={262} muted>
        You
      </Label>
      <Label x={320} y={108} size={16} muted>
        Shown once
      </Label>
      <Pass cx={320} cy={146} w={70} />
      <ArrowTo x1={210} y1={204} x2={428} y2={204} />
      <Bot cx={490} cy={190} />
      <Label x={490} y={262} muted>
        Your assistant
      </Label>
    </svg>
  );
}

export function WindowFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="An AI assistant holds up its pass at the blue delivery window of the kitchen. A green check above the window shows the pass is accepted, so the order goes in."
    >
      <Room x={30} y={30} w={330} h={260} />
      <Book cx={190} cy={170} w={110} />
      <Window x={330} y={128} w={80} />
      <Mark cx={370} cy={96} ok r={16} />
      <Pass cx={460} cy={170} w={46} />
      <Bot cx={540} cy={210} />
      <Label x={540} y={282} muted>
        Pass checked first
      </Label>
    </svg>
  );
}

export function MenuFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The delivery window's menu lists seven things an assistant can ask for: next task, list tasks, look one up, draft a task, fill in details, ask to move, comment. Beside it, a person holds the approval stamp, which isn't on the menu."
    >
      <Menu
        x={40}
        y={14}
        w={290}
        items={["Next task", "List tasks", "Look one up", "Draft a task", "Fill in details", "Ask to move", "Comment"]}
      />
      <Person cx={470} cy={180} />
      <Stamp cx={548} cy={196} />
      <Label x={490} y={262} muted>
        People approve
      </Label>
    </svg>
  );
}

export function RulebookFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="A person at the door and an AI assistant at the blue window. Arrows from both lead to the same rulebook in the middle of the kitchen. The assistant's side is a little stricter."
    >
      <Room x={125} y={30} w={390} h={270} />
      <Book cx={320} cy={170} w={130} />
      <Label x={320} y={268} size={16} muted>
        One rulebook
      </Label>
      <Door x={110} y={150} w={46} h={150} />
      <Window x={490} y={150} w={60} />
      <ArrowTo x1={168} y1={214} x2={240} y2={196} />
      <ArrowTo x1={478} y1={186} x2={400} y2={192} />
      <Person cx={55} cy={210} />
      <Bot cx={595} cy={210} />
      <Label x={578} y={276} size={16} muted>
        A bit stricter
      </Label>
    </svg>
  );
}

export function RailFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className={svgClass}
      role="img"
      aria-label="The order rail with five tickets, one of them highlighted because it just moved. Below, three screens each show the same rail with the same ticket highlighted. A clock marks the check every 10 seconds."
    >
      <Rail x={120} y={30} w={400} n={5} tint={2} />
      <Clock cx={580} cy={60} />
      <Label x={575} y={112} size={15} muted>
        Every 10 seconds
      </Label>
      <ArrowTo x1={300} y1={100} x2={130} y2={146} />
      <ArrowTo x1={320} y1={100} x2={320} y2={146} />
      <ArrowTo x1={340} y1={100} x2={510} y2={146} />
      <Screen x={40} y={154} w={170} h={96} tint={1} />
      <Screen x={235} y={154} w={170} h={96} tint={1} />
      <Screen x={430} y={154} w={170} h={96} tint={1} />
      <Label x={320} y={292} muted>
        Every open board
      </Label>
    </svg>
  );
}

export function ActionFigure() {
  return (
    <svg
      viewBox="0 0 800 280"
      className={svgClass}
      role="img"
      aria-label="Three panels. First, an AI assistant hands in an order at the blue window to move ticket 1003 to Review. Second, the rulebook sees an assistant asking and puts the move on hold, waiting for a person. Third, every open board shows the ticket waiting."
    >
      <Window x={40} y={86} w={64} />
      <Ticket cx={136} cy={110} s={1.1} tint />
      <Bot cx={200} cy={170} />
      <Label x={130} y={250} size={17} muted>
        Asks to move 1003
      </Label>
      <ArrowTo x1={250} y1={140} x2={300} y2={140} />
      <Book cx={400} cy={140} w={120} />
      <Clock cx={468} cy={88} r={18} />
      <Label x={400} y={250} size={17} muted>
        Waits for approval
      </Label>
      <ArrowTo x1={500} y1={140} x2={550} y2={140} />
      <Screen x={570} y={84} w={200} h={110} tint={1} />
      <Label x={670} y={250} size={17} muted>
        On every board
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
      aria-label="At the blue delivery window, an arrow carries the assistant's order in and another carries the answer back out; nothing goes out unless the assistant asks. Inside the kitchen, a person holds the approval stamp."
    >
      <Room x={30} y={30} w={300} h={260} />
      <Person cx={140} cy={190} />
      <Stamp cx={214} cy={206} />
      <Label x={160} y={268} size={16} muted>
        People approve
      </Label>
      <Window x={300} y={110} w={80} />
      <ArrowTo x1={470} y1={140} x2={398} y2={140} />
      <Label x={434} y={124} size={14} muted>
        Order in
      </Label>
      <ArrowTo x1={398} y1={176} x2={470} y2={176} />
      <Label x={434} y={204} size={14} muted>
        Answer out
      </Label>
      <Bot cx={540} cy={200} />
      <Label x={540} y={272} size={16} muted>
        Only when asked
      </Label>
    </svg>
  );
}
