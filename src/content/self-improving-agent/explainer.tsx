import Link from "next/link";
import { Analogy, Callout, Compare, Figure, KeyNumber, KeyNumbers, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import { ExamLab } from "./exam-lab";
import {
  CheckFigure,
  CoachFigure,
  HeroFigure,
  InspectFigure,
  InstallFigure,
  SignOffFigure,
  SplitFigure,
  TownFigure,
  WhyFigure,
  WorksFigure,
} from "./figures";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="An AI that coaches itself">
        <Figure caption="The installer follows a handbook, fake fires show which alarms work, and a sealed set of new buildings decides whether a new handbook is really better.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            We built an AI{" "}
            <Term def="An AI that works through a task on its own, step by step: reading, trying, checking and trying again.">agent</Term>{" "}
            that writes software{" "}
            <Term def="Small automatic checks that run the code and confirm it does what it should. When someone breaks something later, a test fails and warns them.">tests</Term>.
            Then we let it try to get better on its own, by rewriting its own instructions from its mistakes.
          </p>
          <p>
            Between 13 and 22 October 2026 our AI Practice ran this for ten days and measured every version on code it had never
            seen. This page explains how it worked and what we found.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="Everyone wants an AI that improves itself. Few check whether it did">
        <Prose>
          <p>
            Tests are how a software team knows a change didn&apos;t break something. Writing them is slow, so they often get
            skipped, and problems reach customers. An AI that writes tests could fill that gap.
          </p>
          <p>
            The bigger promise is an AI that coaches itself: it looks at what went wrong, rewrites its own instructions and gets
            better without a person tuning it. The risk is that &ldquo;it got better&rdquo; is easy to believe. Scores bounce
            around from one try to the next, so a lucky try can look like progress.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of tests as smoke alarms and the code as buildings. The AI is an installer who follows a handbook. To check the
            alarms, we light small fake fires and count how many alarms go off. A self-coaching installer rewrites their own
            handbook after every job that went wrong.
          </p>
        </Analogy>
        <Figure caption="Without alarms, a small fire goes unnoticed. With them, it's caught early. Tests do the same for code.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="Split the buildings three ways" figure={<SplitFigure />}>
            <p>
              We picked 30 real pieces of code from one of our own apps, Interview Buddy. Fourteen are for practice, six for a mock
              exam and ten are sealed away for the final test.
            </p>
            <p>
              <strong>The sealed ten are never used to coach.</strong> They are opened only to judge a finished handbook, so
              the final score is a fair look at buildings the installer has never seen.
            </p>
          </Step>
          <Step n={2} title="The installer works alone" figure={<InstallFigure />}>
            <p>
              For each building, the agent reads the code and writes a file of tests. It works in a closed room with no internet,
              and the tests people had already written for the mock and sealed buildings are removed, so it can&apos;t copy them.
            </p>
          </Step>
          <Step n={3} title="Light fake fires, and fail any faulty alarm" figure={<CheckFigure />}>
            <p>
              We plant small{" "}
              <Term def="A deliberate, tiny change to the code, such as turning “more than” into “at least”, to see whether the tests notice.">fake bugs</Term>{" "}
              in the code and count how many the tests catch. That share is the score.
            </p>
            <p>
              <strong>One faulty alarm and the whole building scores zero.</strong> The file must be tidy, make sense to the
              computer, never cheat (for example by faking the very code it should test) and pass three times in a row.
            </p>
          </Step>
          <Step n={4} title="The coach rewrites the handbook" figure={<CoachFigure />}>
            <p>
              A stronger AI model, called Sol, plays the senior coach. It reads what went wrong on the practice buildings only and
              rewrites the installer&apos;s handbook. In a second method it keeps a short list of lessons instead of rewriting
              everything.
            </p>
            <p>The coach also rewrote the descriptions of the installer&apos;s tools and a separate how-to page.</p>
          </Step>
          <Step n={5} title="The inspector needs a clear win" figure={<InspectFigure />}>
            <p>
              The new handbook and the current one are tested on the same sealed buildings. The new one replaces the old only if it
              catches at least one tenth more of the fake fires, by a margin too wide to be luck, and a person approves it.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="happened" title="What happened">
        <KeyNumbers>
          <KeyNumber value="7 in 10" label="Fake fires caught on the sealed buildings by the hand-written handbook" />
          <KeyNumber value="4–5 in 10" label="Caught by every handbook the coach produced: all lower" />
          <KeyNumber value="4" label="Times a new handbook looked better and the checks caught it" />
          <KeyNumber value="11 of 11" label="Tests that worked when it wrote them for a real code change" />
        </KeyNumbers>
        <Prose>
          <p>
            Pick a handbook and compare its mock-exam score with its sealed-final score. The mock exam is what the coach could see
            while choosing; the sealed final is the honest test.
          </p>
        </Prose>
        <ExamLab />

        <Prose>
          <h3 className="text-[1.25rem] tracking-[-0.01em]">Looked better, wasn&apos;t</h3>
        </Prose>
        <Compare
          left={{
            title: "A scoring mix-up: “74%” that was really 34%",
            children: (
              <p>
                The coach&apos;s own scorekeeping mixed up practice and mock-exam buildings and reported a big gain. Re-scored
                properly, the new handbook was no better than the one it replaced.
              </p>
            ),
          }}
          right={{
            title: "A better tool, a lower score",
            children: (
              <p>
                A tool change cut the installer&apos;s slips from about one per job to about one in twelve jobs. But it then
                worked in many small steps, ran out of reading room, and caught only about 14% of fake fires on the mock exam.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Best on the mock, lower on the final",
            children: (
              <p>
                A bare-bones three-line handbook had the best mock-exam score, above the hand-written one. On the sealed buildings
                it scored lower. Picking the best of several lucky scores flatters the winner.
              </p>
            ),
          }}
          right={{
            title: "Wins on three buildings",
            children: (
              <p>
                The coach kept a rewrite whenever it beat the old one on three practice buildings, tried once each. Those wins
                later disappeared on the mock exam or the sealed final.
              </p>
            ),
          }}
        />

        <Prose>
          <h3 className="text-[1.25rem] tracking-[-0.01em]">A fairer practice town</h3>
          <p>
            Maybe our app left no room to improve: the hand-written handbook was already good, and the hardest buildings failed for
            reasons no wording can fix. So we built a simpler town, a small library of 24 sets of business rules with no internet or
            database, and wrote down what would count as a win before the first run.
          </p>
          <p>
            <strong>Same answer.</strong> The coach&apos;s best rewrite was clearly worse than the starting handbook.
          </p>
        </Prose>
        <Figure caption="On eight sealed buildings in the practice town: alarms written by people, the starting handbook, and the coach's best rewrite.">
          <TownFigure />
        </Figure>

        <Prose>
          <h3 className="text-[1.25rem] tracking-[-0.01em]">The installer itself works</h3>
          <p>
            We gave the hand-written version a real change to our app. It found both changed parts, wrote 11 tests, and all 11
            passed every check. Together they ran every line of that piece of code.
          </p>
        </Prose>
        <Figure caption="On a practice change to Interview Buddy, every one of the 11 tests it wrote worked.">
          <WorksFigure />
        </Figure>
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="A person reads every rewrite, and nothing replaces the current handbook without a person's approval.">
          <SignOffFigure />
        </Figure>
        <Compare
          left={{
            title: "It didn't improve itself here",
            children: (
              <p>
                With this model and this much testing, no self-coached handbook beat the one a person wrote. That doesn&apos;t
                prove it never can: with ten sealed buildings, tried twice each, a gain smaller than about 15 points would be
                invisible.
              </p>
            ),
          }}
          right={{
            title: "Scores swing a lot",
            children: (
              <p>
                The same handbook scored about 62% after one try on the sealed buildings and 71% after two. Some buildings flip
                between zero and about 90% from one try to the next, because a single faulty alarm zeroes them.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "The coach's advice needs a reader",
            children: (
              <p>
                Some rewrites sounded sensible and were wrong, such as asking for tools the installer doesn&apos;t have. One
                handbook once faked the code it was meant to test; the checks scored it zero.
              </p>
            ),
          }}
          right={{
            title: "Not yet on a real team's work",
            children: (
              <p>
                It has written tests for a practice change only. It has never opened a real request to change a team&apos;s code,
                and no reviewer has judged its work yet.
              </p>
            ),
          }}
        />
        <Callout kind="note" title="The bigger lever was the model">
          <p>
            In one check on five practice buildings, a stronger model caught about 97% of fake fires where our everyday model caught
            about 16%. A better model mattered far more than any rewrite of the handbook.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            We let an AI that writes tests rewrite its own instructions, and judged every version on code it had never seen. None
            beat the hand-written instructions, on our app or on a simpler one built to give it room. The checks caught every
            version that only looked better, and the AI itself writes tests that work.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers the architecture, the scoring and promotion rules, every result with its confidence range,
            the decisions behind them, and how to run it yourself.
          </p>
          <p>
            <Link href="/wiki/self-improving-agent/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
