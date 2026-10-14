import Link from "next/link";
import { Analogy, Callout, Compare, Figure, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import {
  AnswerKeyFigure,
  GradeFigure,
  HeroFigure,
  RecorderLoopFigure,
  ReportCardFigure,
  ThreeSittingsFigure,
  TwoQuestionsFigure,
  WhyFigure,
  WrongTickFigure,
} from "./figures";
import { GradingLab } from "./grading-lab";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Trust, but test">
        <Figure caption="The AI sits an exam against an answer key. A grader marks it, including the trick question it was right to refuse. After launch, a flight recorder keeps watching.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Every AI project eventually meets the same question from a manager or a client: <strong>how do we know it
            works?</strong> A good demo doesn&apos;t answer it. A demo shows the questions the team already knew would go well.
          </p>
          <p>
            This page explains how our AI Practice answers that question, drawn from every system we tested in 2026. The
            way of testing is the same whatever the system does, so it works for whatever you are building next.
          </p>
          <p>
            Two words you will hear engineers use: this whole practice of testing is called <strong>evals</strong>, short
            for evaluations, and the recording that keeps going after launch is called <strong>observability</strong> or
            tracing.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="An AI sounds just as sure when it's wrong">
        <Prose>
          <p>
            A person who doesn&apos;t know usually sounds unsure. An AI doesn&apos;t. It writes a wrong answer in the same calm,
            tidy style as a right one.
          </p>
          <p>
            One of our assistants was asked about a colleague. It replied with a name, a role and a team, laid out exactly
            like a real staff-directory answer. The person didn&apos;t exist. Nobody reported it, because nothing about the
            answer looked wrong. We only found it by re-running real conversations and checking every answer against
            the facts.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of a student who writes every exam answer in beautiful handwriting with total confidence. You can&apos;t
            grade them on how sure they sound. You need an answer key, and you need to mark every paper.
          </p>
        </Analogy>
        <Figure caption="Two answers from the same AI, equally confident. Only checking against known-good answers tells them apart.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Prose>
          <p>Six steps, from before launch to long after it.</p>
        </Prose>
        <Steps>
          <Step n={1} title="Write the answer key first" figure={<AnswerKeyFigure />}>
            <p>
              Before changing anything, the team writes a{" "}
              <Term def="A fixed list of test questions, each with a known-good answer and the facts that answer must mention. Engineers call it a golden set.">golden set</Term>:
              questions with known-good answers and the facts a good answer must mention.
            </p>
            <p>
              <strong>Use the questions real people ask.</strong> When we tested one assistant on questions we had written
              ourselves, it passed more than 9 in 10. On the questions staff actually typed, it passed 7 in 10. All the
              problems lived in the real questions.
            </p>
            <p>
              <strong>Add trick questions</strong>, about a third of the set: questions its documents don&apos;t cover, so
              the honest answer is &ldquo;I don&apos;t know&rdquo;. Otherwise a system that confidently answers everything
              looks great, and that is the dangerous one.
            </p>
          </Step>
          <Step n={2} title="Sit the exam three times" figure={<ThreeSittingsFigure />}>
            <p>
              Ask an AI the same question twice and you can get two different answers. So every question is asked three
              times, and it passes only if all three pass.
            </p>
            <p>
              <strong>Two out of three is &ldquo;unstable&rdquo;, not a pass.</strong> We once let an unstable question go.
              It later failed for a real user.
            </p>
          </Step>
          <Step n={3} title="Grade it, then check the grader" figure={<GradeFigure />}>
            <p>
              Where the answer can be checked simply, check it simply: did it give the right number? Did it refuse when it
              should? These checks are cheap and give the same result every time.
            </p>
            <p>
              Where meaning matters, a stricter grader reads each answer next to the key: a bigger AI{" "}
              <Term def="An AI system trained on a huge amount of text. Different models are good at different jobs.">model</Term>{" "}
              from a different maker, so it isn&apos;t marking its own family&apos;s homework. <strong>Then a person checks the
              grader</strong>, because graders make mistakes too.
            </p>
          </Step>
          <Step n={4} title="Ask two questions about every answer" figure={<TwoQuestionsFigure />}>
            <p>
              Many AI assistants look things up in your documents before answering, like a student with an open book. That
              gives two separate things to check: <strong>did it open the right pages, and did it stick to them?</strong>
            </p>
            <p>
              Four scores cover this, including one for{" "}
              <Term def="When an AI states something that isn't in its sources, as if it were fact. It sounds just as confident as everything else.">made-up claims</Term>.
              They roll into one overall score that is pulled toward the weakest, so one bad score can&apos;t hide behind three
              good ones.
            </p>
          </Step>
          <Step n={5} title="Read the report card row by row" figure={<ReportCardFigure />}>
            <p>
              Every test produces a report with one row per question: the AI&apos;s answer, the key beside it, the grade, and
              the grader&apos;s one-line reason.
            </p>
            <p>
              <strong>A single headline number is easy to make and impossible to check. Rows can be checked.</strong> One
              of our reports once said 94%. Reading the rows showed a third of the questions had never reached the AI at
              all. The honest figure was about 27%.
            </p>
          </Step>
          <Step n={6} title="Keep a flight recorder after launch" figure={<RecorderLoopFigure />}>
            <p>
              Once real people use it, every answer is recorded and graded in the background within a couple of minutes,
              without slowing the reply. The worst-scoring answers go to a person first.
            </p>
            <p>
              <strong>Real slip-ups become new exam questions</strong>, so the same mistake can&apos;t quietly come back.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="try" title="Grade three answers yourself">
        <Prose>
          <p>
            A made-up shop assistant answers questions about its returns policy. Pick an answer to see how the grader marks
            it and how the four scores add up. Then drag the scores: the overall score follows the weakest one.
          </p>
        </Prose>
        <GradingLab />
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="Graders are tools, not judges. They can tick a wrong answer, so a person checks them.">
          <WrongTickFigure />
        </Figure>
        <Compare
          left={{
            title: "The grader can be wrong",
            children: (
              <p>
                A checker was meant to let an invented detail through only if the AI had flagged it as unsure. The detail
                had a two-letter short name, &ldquo;ct&rdquo;. The checker looked for those letters in the flags and found
                them inside an unrelated word, &ldquo;doctor&rdquo;. The test said 100%. We now check the grader as carefully
                as the AI.
              </p>
            ),
          }}
          right={{
            title: "Sticking to the book isn't being right",
            children: (
              <p>
                One assistant repeated a figure from its own documents perfectly. The figure in the document was wrong. Every
                score said the answer was faithful to its source. Only the answer key caught it, and the fix was the
                document, not the AI.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Your own questions can't surprise it",
            children: (
              <p>
                Questions written by the people who built the system test what they already thought of. Real users type
                differently, follow up, and make typos. That is why real questions matter most.
              </p>
            ),
          }}
          right={{
            title: "Small tests can't see small differences",
            children: (
              <p>
                With around 100 questions, a gap of two or three questions between two versions is noise, not a winner.
                Good teams say how sure they are, not just which number is bigger.
              </p>
            ),
          }}
        />
        <Callout kind="warning" title="A person stays in charge">
          <p>
            Automatic scores sort answers so a person knows where to look first. On one live assistant the automatic scores
            looked healthy, yet a person reading the same answers failed about 1 in 8. The scores point; a person decides.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            Write the answer key before you change anything, fill it with real questions and trick questions, and ask each
            one more than once. Let a stricter grader mark the answers, check the grader, and read the rows, not just the
            headline. After launch, keep recording, and turn every real slip-up into a new test question.
          </p>
        </Prose>
        <Callout kind="note" title="Five questions to ask any team showing you an AI">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>Where did the test questions come from, and how many came from real users?</li>
            <li>Does the test include questions it should refuse, and how often did it refuse them?</li>
            <li>How many times was each question asked, and which ones gave different answers?</li>
            <li>Who graded the answers, and who checked the grader?</li>
            <li>What happens to a wrong answer after launch?</li>
          </ul>
        </Callout>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers how to build a golden set, set up a grader, turn the four scores into one number,
            record live answers in a tracing tool called Langfuse, and the mistakes we paid for along the way.
          </p>
          <p>
            <Link href="/wiki/evals/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
