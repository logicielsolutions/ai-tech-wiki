import Link from "next/link";
import {
  Analogy,
  Callout,
  Compare,
  Figure,
  KeyNumber,
  KeyNumbers,
  OutcomePicker,
  Prose,
  Section,
  Step,
  Steps,
  Term,
  type OutcomeChoice,
} from "@/components/wiki";
import {
  ChatFigure,
  DoorFigure,
  FenceFigure,
  GateFigure,
  HeroFigure,
  LimitsFigure,
  SignFigure,
  TeamFigure,
  TimelineFigure,
  WhyFigure,
} from "./figures";

/** Outcomes from the factory's own tests (brief.md, "Interactive figure"). */
const TRIES: OutcomeChoice[] = [
  {
    id: "tests",
    label: "Run the tests",
    outcome: "allowed",
    result: "Normal work inside the yard goes ahead without asking anyone.",
    detail: "In the break-in tests, everyday work such as saving changes and installing packages still worked inside the fence.",
  },
  {
    id: "branch",
    label: "Save its work to its own copy",
    outcome: "allowed",
    result: "Saving to its own working copy of the code is on the work order, so it just happens.",
    detail: "The example work order lists this as an allowed action.",
  },
  {
    id: "keys",
    label: "Read the machine's passwords and keys",
    outcome: "refused",
    result: "The fence blocks it. The agent never sees them.",
    detail: "Tried in the break-in tests along with 97 other attempts. All were refused.",
  },
  {
    id: "tool",
    label: "Use a tool the work order doesn't list",
    outcome: "refused",
    result: "The gatekeeper refuses it with a reason, so the agent can adapt. Nobody is asked to approve it.",
    detail: "The work order names exact tools. A tool that isn't named stays refused until a new version of the order is signed.",
  },
  {
    id: "main",
    label: "Overwrite the main copy of the code",
    outcome: "stopped",
    result: "Refused. The work stops, one alert goes to a private channel, and only a person in the factory can restart it.",
    detail: "In testing, the work stopped 13 seconds after the agent woke, with exactly one alert. After a person resolved it, the agent carried on and never retried the move.",
  },
  {
    id: "settings",
    label: "Change its own settings",
    outcome: "stopped",
    result: "The work stops until a person puts the settings back.",
    detail: "The tests found that an agent could do this. The factory was fixed to treat it as a rule break, then tested again.",
  },
];

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Sign once, then hands off">
        <Figure caption="The whole workshop: a signed work order at the front desk, AI workers in a fenced yard, a gatekeeper, one bell in the office, and a loading door only a person opens.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Software can now be built by a team of AI{" "}
            <Term def="An AI program that does a job on its own: it reads, decides, uses tools and hands work on, without a person at each step.">agents</Term>
            : one plays the business analyst, one the project manager, others the developers and the tester. They run on a
            tool called Paperclip, which organizes them like a small company.
          </p>
          <p>
            We built and tested a way to run that team inside strict limits. It is still in testing and has not been used for
            client work. A person agrees what to build and signs it once. After that the agents work on their own, but only
            inside what was signed. Anything else is refused, and a rule break stops the work and calls a person.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="A capable team with no limits">
        <Prose>
          <p>
            An AI team that can build software is useful. Out of the box, though, nothing limited what it could touch or do.
            When we checked the setup, any program on the machine could act as the boss, the agents could reach the
            owner&apos;s own passwords and keys, every &ldquo;may I?&rdquo; was answered yes automatically, and nothing stopped
            the work if an agent did something it shouldn&apos;t.
          </p>
          <p>
            Asking a person before every step would fix that and also defeat the point. The goal was the opposite: no
            questions after planning, and no way to step outside what was agreed.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of a workshop. The client signs a work order at the front desk. Inside a fenced yard the workers do
            whatever the order covers, without asking. A gatekeeper checks every tool against the order. Reaching for
            something that isn&apos;t on it rings one bell in the office, and only the office can restart the job.
            Finished work leaves through a loading door that only a person can open.
          </p>
        </Analogy>
        <Figure caption="The same workshop with no fence and no gatekeeper: nothing stops a worker reaching into the safe, and nobody is told.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="Sign the work order" figure={<SignFigure />}>
            <p>
              The AI analyst asks the client rounds of questions and writes down what &ldquo;done&rdquo; means, as checks
              anyone can test. The client then signs one version of a{" "}
              <Term def="The signed work order: what done means, which code the team may change, which tools and websites it may use, how much it may spend, and how the work is handed over.">contract</Term>
              .
            </p>
            <p>
              <strong>This is the only point where a person approves anything.</strong> Changing the contract later cancels
              the signature, and the client has to sign again.
            </p>
          </Step>
          <Step n={2} title="The team works on its own" figure={<TeamFigure />}>
            <p>
              A planner agent splits the job into tickets of about a day each. Developer agents build them. A tester agent
              checks every line of &ldquo;done&rdquo; and sends failures back to the developer.
            </p>
            <p>
              <strong>Nobody is asked anything along the way.</strong> A failed check is routine: it loops back without
              bothering a person.
            </p>
          </Step>
          <Step n={3} title="Each agent works inside a fence" figure={<FenceFigure />}>
            <p>
              When the fence is switched on, every agent runs inside a{" "}
              <Term def="A sealed space on the computer. A program inside it can only see and change what the rules allow.">sandbox</Term>
              : it can change only its own working folder, can&apos;t see the machine&apos;s passwords, keys or the
              factory&apos;s own records, and can reach only a short list of websites.
            </p>
          </Step>
          <Step n={4} title="The gatekeeper says no, never “may I?”" figure={<GateFigure />}>
            <p>
              Anything the contract doesn&apos;t allow is refused on the spot, with a reason, so the agent can try another
              way. Nobody is asked to approve it.
            </p>
            <p>
              <strong>A real rule break stops the work</strong> (when the gatekeeper is on) and sends one alert to a private{" "}
              <Term def="A team chat app. Here it only receives alerts; nothing typed in it can change the factory.">Slack</Term>{" "}
              channel. A person fixes the cause inside the factory. A reply in the chat can never restart the work, and the
              refused move is not tried again.
            </p>
          </Step>
          <Step n={5} title="Out through the loading door" figure={<DoorFigure />}>
            <p>
              Finished work leaves as a{" "}
              <Term def="A proposed change to the code, waiting for someone to review it and accept it.">pull request</Term>
              : a proposal waiting for review. The agents can&apos;t accept their own work.{" "}
              <strong>Only a person can merge it</strong> into the client&apos;s code.
            </p>
          </Step>
          <Step n={6} title="Talking from a chat app (lab only)" figure={<ChatFigure />}>
            <p>
              In a lab version, the client talks to the AI analyst from Buzz, a chat app, instead of the factory&apos;s
              own screens. They answer its questions there and can sign off with a check mark.
            </p>
            <p>
              The check mark is digitally signed, so the factory checks that it really came from the client, for that exact
              version of the contract, and files it as proof.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="action" title="See it in action: a small to-do app">
        <Prose>
          <p>The factory&apos;s own test job is a simple to-do list web page. Its signed work order says &ldquo;done&rdquo; means:</p>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">
            <li>Typing an item and pressing Enter adds it to the bottom of the list.</li>
            <li>An empty item isn&apos;t added, and the page says so.</li>
            <li>Checking an item marks it done; unchecking it undoes that.</li>
            <li>Deleting an item removes it and keeps the others in order.</li>
            <li>The list is still there after the page reloads.</li>
          </ol>
          <p>
            In one test run, a ticket was built, failed the tester&apos;s check, was fixed and passed, in about three and a
            half minutes, with no person involved. In another, an agent tried to overwrite the main copy of the code. That
            isn&apos;t on any work order, so it was refused and the work stopped.
          </p>
        </Prose>
        <Figure scroll caption="Two runs from the factory's tests. Top: the routine loop, no alert. Bottom: a forbidden move stopped 13 seconds after the agent woke, one bell, then a person resolves it and the work carries on.">
          <TimelineFigure />
        </Figure>
        <OutcomePicker
          title="What if an agent tries…"
          hint="Pick one to see what the factory does."
          choices={TRIES}
          note="These are example outcomes written into this page, taken from the factory's own tests. Nothing here talks to the factory."
        />
        <KeyNumbers>
          <KeyNumber value="98 of 98" label="Break-in attempts on the fence in lab tests, all refused" />
          <KeyNumber value="13 s" label="From the agent waking to a full stop" />
          <KeyNumber value="1" label="Alert per problem, never a flood" />
        </KeyNumbers>
      </Section>

      <Section id="limits" title="What it can't do yet">
        <Figure caption="Built and tested, but not switched on everywhere yet. And a person still checks the work before it leaves.">
          <LimitsFigure />
        </Figure>
        <Compare
          left={{
            title: "It's still a test",
            children: (
              <p>
                It runs on one machine. The fence, the gatekeeper and the bell are built and pass their tests in separate
                trial setups, but on the main setup they are switched off while testing goes on.
              </p>
            ),
          }}
          right={{
            title: "Not yet with a real client",
            children: (
              <p>
                No real client has used it, and handing work to real code storage has only been tested against a stand-in.
                Each person also needs their own login before anyone else can use it safely.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Looking right isn't being right",
            children: (
              <p>
                AI agents can produce work that looks correct and isn&apos;t. That is why a person reviews and merges every
                piece of finished work.
              </p>
            ),
          }}
          right={{
            title: "Cost isn't measured yet",
            children: (
              <p>
                The agents run on a Claude subscription, so there is no bill per run, and nobody has measured the cost of a
                whole project yet. Each agent is capped at an hour per run and 50 runs a day.
              </p>
            ),
          }}
        />
        <Callout kind="warning" title="Where people stay in charge">
          <p>
            A person signs the contract, a person resolves every stop, and a person merges the result. Signing from a chat
            app works only in the lab so far.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            A person signs one work order. Inside it, an AI team builds and tests on its own, without asking. Anything
            outside it is refused, a real rule break stops the work and calls a person, and a person still opens the
            loading door.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers how each layer works and what it stops, the alternatives we compared and why we
            chose these, the test results in full, and how a developer installs it.
          </p>
          <p>
            <Link href="/wiki/paperclip-factory/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
