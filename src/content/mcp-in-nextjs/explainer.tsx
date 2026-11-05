import Link from "next/link";
import { Analogy, Callout, Figure, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import {
  ActionFigure,
  CantFigure,
  HeroFigure,
  MenuFigure,
  PassFigure,
  RailFigure,
  RulebookFigure,
  WhyFigure,
  WindowFigure,
} from "./figures";
import { RulesLab } from "./rules-lab";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Two doors, one set of rules">
        <Figure caption="One kitchen, two ways in: people come through the dining-room door, AI assistants use the delivery window. Every order goes by the same rulebook.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Our AI team keeps its work on a shared board: a list of tasks, each moving through stages from To Do to Done. People
            use it in a web browser. Their{" "}
            <Term def="Also called an agent: an AI that does things for you, such as picking up a task and updating it, not only chatting. Claude Code is one.">
              AI assistants
            </Term>{" "}
            use it too: they pick up tasks, draft new ones and ask to move them along.
          </p>
          <p>
            The title says it in engineers&apos; words: MCP inside a{" "}
            <Term def="The toolkit the board's website is built with.">Next.js</Term> app. In plain words: the website people use
            has a second door just for AI assistants, and both doors lead to the same rules.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="One kitchen, not two">
        <Prose>
          <p>
            For assistants to work on the board, the board needs a way to take their requests. That way has a name,{" "}
            <Term def="Short for Model Context Protocol: a standard way for AI assistants to use other apps, so any assistant that speaks it can connect to any app that offers it.">
              MCP
            </Term>
            .
          </p>
          <p>
            The usual way to offer it is a separate program built just for assistants, with its own setup, its own keys and its own
            copy of the board&apos;s rules. Two copies of the rules drift apart: someone changes a rule in one place and not the
            other, and from then on people and assistants play by different rules.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of a restaurant. Diners order in the dining room; delivery apps hand their orders in at a window. MCP is the
            standard order slip every delivery app knows how to fill in.
          </p>
          <p>
            A sensible restaurant runs one kitchen with one rulebook for both. The usual way of letting assistants in is like
            opening a second, delivery-only kitchen with its own copy of the rulebook. Our board keeps one kitchen and adds a
            window.
          </p>
        </Analogy>
        <Figure caption="The usual way: a separate kitchen for assistants, with its own rulebook. Change a rule in one and not the other, and the two drift apart.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="Get a pass for your assistant" figure={<PassFigure />}>
            <p>
              On the board&apos;s settings page, a person creates a pass for their assistant. The board shows it once, inside a
              ready-made line to paste into the assistant.
            </p>
            <p>
              Each pass belongs to one person. Give each assistant its own pass, and a <strong>Disconnect</strong> button stops any
              one of them straight away.
            </p>
          </Step>
          <Step n={2} title="Show the pass at the window" figure={<WindowFigure />}>
            <p>
              Every order an assistant sends goes to the delivery window with its pass. No pass, or a cancelled one, and the order
              is turned away at the window. The pass is checked again with every single order.
            </p>
          </Step>
          <Step n={3} title="Order from a short menu" figure={<MenuFigure />}>
            <p>
              The window has a menu of seven things an assistant can ask for: its next task, a list of tasks, one task in full, a
              new draft, filling in a task&apos;s details, a move to the next stage, and a comment.
            </p>
            <p>
              <strong>Approving is kept for people.</strong> It isn&apos;t on the menu at all.
            </p>
          </Step>
          <Step n={4} title="One rulebook checks every order" figure={<RulebookFigure />}>
            <p>
              Orders from both doors go to the same rulebook, kept in the board&apos;s{" "}
              <Term def="The place an app keeps its information, and here its rules too.">database</Term>. It checks each order as
              if the pass&apos;s owner had asked, so an assistant sees and does only what its person can.
            </p>
            <p>
              For assistants it&apos;s a little stricter. A task an assistant drafts waits until a person approves it, and a move
              that needs sign-off always waits for a person.
            </p>
          </Step>
          <Step n={5} title="Everyone sees the change" figure={<RailFigure />}>
            <p>
              Open boards check for changes every 10 seconds. So when an assistant moves a task, it shows up on everyone&apos;s
              screen within 10 seconds, for the people allowed to see that task.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="action" title="See it in action">
        <Prose>
          <p>
            Say an assistant is asked to move task 1003 to the Review stage. It hands the order in at the window with its pass. The
            pass checks out and the order is on the menu. The rulebook checks the task the same way it would for a person, then
            sees it&apos;s an assistant asking, so the move doesn&apos;t happen yet. It becomes a request waiting for a person.
          </p>
          <p>
            The assistant gets back the answer &ldquo;waiting&rdquo;, with a reason it can pass on. Within 10 seconds, every open
            board that can see task 1003 shows it waiting for approval.
          </p>
        </Prose>
        <Figure caption="One order, start to finish: the assistant asks, the rulebook puts the move on hold for a person, and every board shows it.">
          <ActionFigure />
        </Figure>
        <Prose>
          <p>Now try it yourself: pick who&apos;s asking and what they want.</p>
        </Prose>
        <RulesLab />
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="The window only answers: an order comes in and an answer goes back out. The approval stamp stays with people.">
          <CantFigure />
        </Figure>
        <Prose>
          <p>
            <strong>It can&apos;t call an assistant back.</strong> The board answers when an assistant asks, and that&apos;s all; it
            can&apos;t send news out on its own.
          </p>
          <p>
            <strong>It only looks after the board.</strong> It can&apos;t open files on your computer. Assistants use their own tools
            for that, and the board only for tasks.
          </p>
          <p>
            <strong>Assistants in the cloud need the board on the internet.</strong> An assistant on your own laptop can use a copy
            of the board running there; one in the cloud can&apos;t reach it.
          </p>
          <p>
            <strong>Passes are set up by hand.</strong> The assistant has to be given its pass before it starts. A sign-in where the
            assistant asks for access by itself isn&apos;t built yet.
          </p>
        </Prose>
        <Callout kind="limit" title="A person always approves">
          <p>
            Assistants can draft, fill in and ask. Saying yes stays with people, on purpose, and an assistant can never do more than
            the person it works for.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            The board has two doors: a website for people and a delivery window for their AI assistants. Both lead to one rulebook,
            which treats an assistant as the person it works for, only stricter. Assistants can draft and ask; people approve.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers the route that serves MCP, the seven tools, how passes are checked on every request, the
            decisions behind the design, how it compares with the usual setups, and how to run it yourself.
          </p>
          <p>
            <Link href="/wiki/mcp-in-nextjs/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
