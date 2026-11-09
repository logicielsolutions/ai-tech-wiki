import Link from "next/link";
import { Analogy, Callout, Figure, KeyNumber, KeyNumbers, Prose, Section, Step, Steps, Term, Tiles } from "@/components/wiki";
import { ModelLab } from "./model-lab";
import { BayFigure, CantFigure, FlagFigure, GraphFigure, HeroFigure, LoopFigure, SameCarFigure, WhyFigure } from "./figures";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Loops vs graphs for agents">
        <Figure caption="The same broken car, fixed two ways: one mechanic who keeps trying, or a workshop that follows a plan.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            An AI{" "}
            <Term def="An AI that works through a task on its own, step by step: it reads, uses tools such as files or tests, and decides what to do next.">agent</Term>{" "}
            can be built with many different{" "}
            <Term def="Ready-made building kits for AI agents, such as LangChain, LangGraph and CrewAI. They handle the plumbing so a developer writes less code.">frameworks</Term>
            . Each one says it is the best way to do it.
          </p>
          <p>
            In the week of 2 November 2026 we built the same bug-fixing agent seven ways and raced them, with about 800 runs in total.
            The lesson: how the work is laid out mattered more than which framework we picked.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="Every shop shows off a different car">
        <Prose>
          <p>
            Every framework has a demo that looks great. But each demo uses its own task, its own AI model and its own setup. So when
            a team has to choose, there is nothing fair to compare.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of the frameworks as repair shops. Each one shows you a car it fixed, but every car is different. To know which
            shop is better, you have to give them all the same broken car, the same tools and the same deadline, and see who gets it
            running.
          </p>
        </Analogy>
        <Figure caption="Three shops, three different cars: there is no way to tell which shop is better.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="The same broken car for everyone" figure={<SameCarFigure />}>
            <p>
              We took small, working programs and planted one mistake in each, such as a sum that is off by one or a list sorted the
              wrong way. Each program comes with{" "}
              <Term def="Small checks written with the program that say whether it still does what it should. A planted mistake makes some of them fail.">tests</Term>
              , and the mistake makes them fail.
            </p>
            <p>There are 15 of these faults: 5 simple, 5 trickier, and 5 hard ones, where the clue shows up far from the cause.</p>
          </Step>
          <Step n={2} title="The same bay, toolbox and clock" figure={<BayFigure />}>
            <p>
              Every agent works in its own locked bay: a sealed box that can&apos;t reach the internet or anything else. It gets the
              same four tools: see the files, read a file, rewrite a file, run the tests.
            </p>
            <p>And the same limits for every run: 20 questions to the AI model, 10 minutes and 50 cents.</p>
          </Step>
          <Step n={3} title="One mechanic who keeps trying" figure={<LoopFigure />}>
            <p>
              The first shape is a{" "}
              <Term def="An agent that repeats one cycle: ask the AI model what to do, do it, look at the result, and ask again, until it is done or a limit stops it.">loop</Term>
              . One mechanic looks, makes a change, runs the test drive, and goes round again until the car passes or time is up.
            </p>
            <p>We built this loop four ways: in plain code and with three popular frameworks, LangChain, LangGraph and CrewAI.</p>
          </Step>
          <Step n={4} title="A workshop that follows a plan" figure={<GraphFigure />}>
            <p>
              The second shape is a{" "}
              <Term def="An agent whose work is laid out in advance as a set of steps and the paths between them, like a flowchart. The AI model fills in each step; the plan decides what comes next.">graph</Term>
              . First the workshop looks at the whole car and sorts the job: simple or complex. A complex job gets a short plan.
            </p>
            <p>
              Then three mechanics each try a fix at the same time, in their own bays, with a test drive after each try. The foreman
              picks the best fix that passes, and a second mechanic checks it. If nobody manages, the shop stops and asks a person for a hint.
            </p>
            <p>We built this plan three ways: in plain code, with LangGraph and with CrewAI.</p>
          </Step>
          <Step n={5} title="The test drive decides" figure={<FlagFigure />}>
            <p>
              An agent saying &ldquo;done&rdquo; doesn&apos;t count. When it stops, the shop runs the tests itself. The car is fixed
              only if every test passes and nobody changed the tests to make them pass.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="action" title="See it in action">
        <Prose>
          <p>
            Pick a model to see how many faults each build fixed with it. The loops are on the left and the planned workshops on
            the right.
          </p>
        </Prose>
        <ModelLab />
        <KeyNumbers>
          <KeyNumber value="5 to 14 of 15" label="Hard faults fixed by the four loops on the same big model" />
          <KeyNumber value="14 to 15 of 15" label="Hard faults fixed by the three planned workshops, whatever the framework" />
          <KeyNumber value="79 cents" label="For all 210 runs on OpenAI's small paid model" />
        </KeyNumbers>
        <Prose>
          <p>
            <strong>Why did the loops differ so much?</strong> On the big model, across all 15 faults three times each: in a loop, each framework decides for itself when the agent is
            finished. CrewAI treats any plain reply from the model as &ldquo;finished&rdquo;, so 29 of its 45 runs ended there,
            fixed or not; it fixed 31 of 45, where the plain-code loop fixed 44. Once all three frameworks followed the same plan,
            they fixed almost the same number of faults.
          </p>
          <p>
            <strong>Is the plan always better?</strong> Not always. With a strong model every build fixed almost everything, and
            the workshop cost about two thirds more per fixed fault, because three mechanics and a checker all ask the model
            questions.
          </p>
          <p>
            <strong>What about speed?</strong> On one fault, the big model on a rented graphics card finished in 27 seconds; the
            small model on a laptop took nearly 10 minutes. Most of that gap was one setting: the fast server was told not to
            &ldquo;think out loud&rdquo; before answering.
          </p>
        </Prose>
      </Section>

      <Section id="frameworks" title="Where the frameworks really differ">
        <Prose>
          <p>
            Built as the same plan, the frameworks gave the same results. Where they differed was in running the work, not in the
            work itself:
          </p>
        </Prose>
        <Compare3 />
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="Our practice faults were small programs with one planted mistake. A real codebase is far bigger.">
          <CantFigure />
        </Figure>
        <Prose>
          <p>
            <strong>Practice cars, not real ones.</strong> Each fault is a tiny program with one planted mistake. The results tell
            us how the shapes behave, not how an agent does on a large real project.
          </p>
          <p>
            <strong>A strong model hides the difference.</strong> With OpenAI&apos;s model, every build fixed the easier faults, so
            the race only told the shapes apart on weaker models and harder faults.
          </p>
          <p>
            <strong>Small laptop models struggle.</strong> They were slow and often ran out of time.
          </p>
        </Prose>
        <Callout kind="limit" title="A person stays in charge">
          <p>
            The planned workshop can stop before using a fix and post it in a chat, where a person answers yes or no. We tried it
            for real: a person said yes after two minutes, and the fix went in. With no answer in 20 minutes, nothing is changed.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            We gave seven builds of the same AI agent the same faults, tools and limits. Laying the work out as a plan (sort the
            job, try three fixes, test, pick, check) made the frameworks fix almost the same number of faults, while their loops
            differed a lot. A strong model hides the difference, and the frameworks differ mostly in how easy they make it to
            pause, resume and rewind the work.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers the test bench, the graph and its LangGraph wiring, the stop rules per framework, the
            decisions behind the bench, every results table, what each framework gives you built in, and how to run it yourself.
          </p>
          <p>
            <Link href="/wiki/agent-arena/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}

function Compare3() {
  return (
    <Tiles
      tiles={[
        {
          kicker: "LangGraph",
          title: "Most comes built in",
          children: (
            <p>
              Saving progress after every step, picking up after a crash, rewinding to an earlier step to try a different choice, and
              pausing for a person are all part of the kit.
            </p>
          ),
        },
        {
          kicker: "CrewAI",
          title: "Some built in",
          children: (
            <p>
              It saves progress and can ask a person. Picking up exactly where it stopped and rewinding needed extra work from us.
            </p>
          ),
        },
        {
          kicker: "Plain code",
          title: "Everything by hand",
          children: (
            <p>
              Nothing comes for free, but each feature took only about 60 lines, because the steps of the plan were shared.
            </p>
          ),
        },
      ]}
    />
  );
}

