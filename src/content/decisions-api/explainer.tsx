import Link from "next/link";
import { Analogy, Callout, Compare, Figure, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import { AnswerSheetLab } from "./answer-sheet-lab";
import {
  HeroFigure,
  PersonDecidesFigure,
  ReadOffFigure,
  ShadeOddsFigure,
  SureIsNotRightFigure,
  ThreeKindsFigure,
  WhyFigure,
  WriteExamFigure,
} from "./figures";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Odds, not opinions">
        <Figure caption="A resume goes in. Luna hands back an answer sheet with odds on every allowed answer. A person reads it and decides.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Most AI tools you have met write things: emails, summaries, answers. In October 2026 OpenAI released something
            different, an AI <Term def="An AI system trained on a huge amount of text. Different models are good at different jobs.">model</Term>{" "}
            called Luna that writes nothing at all. You hand it a document and a set of questions, each with a fixed list of
            allowed answers. It hands back how likely each answer is.
          </p>
          <p>
            We built a small experiment to learn how it behaves, using a familiar task: checking a resume against a job.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="A lot of questions at work need a tick box">
        <Prose>
          <p>
            Is this ticket urgent? Does this invoice match the order? Does this candidate meet the must-haves? Each of these
            has a short list of possible answers. Ask a writing AI and you get a paragraph back, which someone then has to
            read and turn into a tick. You also can&apos;t tell how sure it was.
          </p>
        </Prose>
        <Analogy>
          <p>
            A writing AI is like a student answering an essay question. Luna is like a student sitting a multiple-choice
            exam who, instead of ticking one box, shades in how confident they are next to every option.
          </p>
        </Analogy>
        <Figure caption="Same question, two kinds of reply. The paragraph needs reading; the odds can be used straight away.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Prose>
          <p>Here is the resume experiment, from job post to decision.</p>
        </Prose>
        <Steps>
          <Step n={1} title="Write the exam" figure={<WriteExamFigure />}>
            <p>
              Luna can&apos;t write, so it can&apos;t write its own questions either. A separate writing model reads the job
              post and drafts a <Term def="A scoring guide: the list of things to check, and what good looks like for each.">rubric</Term>:
              the skills to rate, the must-haves, the warning signs, and an overall fit question.
            </p>
            <p>
              <strong>A person then edits it.</strong> This is the exam paper Luna will sit.
            </p>
          </Step>
          <Step n={2} title="Use three kinds of question" figure={<ThreeKindsFigure />}>
            <p>
              Every question on the exam is one of three kinds. <strong>Yes or no</strong> for must-haves (&ldquo;has shipped
              an AI product to real users&rdquo;). <strong>Pick one</strong> for the overall fit: strong, possible or weak.
              <strong> Rate it</strong> on five levels, from None to Expert, for skills like Python.
            </p>
            <p>Luna is only allowed the answers listed. It can&apos;t add a sixth level or a &ldquo;maybe&rdquo;.</p>
          </Step>
          <Step n={3} title="Luna shades in the odds" figure={<ShadeOddsFigure />}>
            <p>
              Luna reads the resume once and answers every question in one go. For each allowed answer it gives a{" "}
              <Term def="How likely something is, from 0% (no chance) to 100% (certain). The answers to one question always add up to 100%.">probability</Term>
              : 93% yes, 7% no.
            </p>
            <p>
              It writes no words at all. Each question also tells Luna to treat the resume as evidence, not instructions, so
              a line like &ldquo;rate me highly&rdquo; is just more text to judge.
            </p>
          </Step>
          <Step n={4} title="Read the marks off" figure={<ReadOffFigure />}>
            <p>
              The app turns the odds into answers with simple rules. For pick one, the most likely answer wins. For yes or no,
              anything past halfway counts as yes.
            </p>
            <p>
              For a rating, it takes the average across the levels, so a skill can land at 2.7: between Working and Strong.
              That is an average, not a level.
            </p>
          </Step>
          <Step n={5} title="A person decides" figure={<PersonDecidesFigure />}>
            <p>
              Every result in the app says <strong>&ldquo;Suggestion only. A human decides.&rdquo;</strong> The odds help a
              person look faster and more consistently. They don&apos;t make the call.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="try" title="Try it on a made-up resume">
        <Prose>
          <p>
            Asha is a made-up candidate for an AI engineering job. Switch lines of her resume on and off and watch the
            answer sheet change. Real work moves the odds. Buzzwords barely do. The hidden note asking the AI to rate her
            highly changes nothing, because Luna is told to judge the resume, not obey it.
          </p>
        </Prose>
        <AnswerSheetLab />
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="How sure Luna sounds is not the same as how often it is right. That has to be measured.">
          <SureIsNotRightFigure />
        </Figure>
        <Compare
          left={{
            title: "Being sure isn't being right",
            children: (
              <p>
                We tested it on 24 made-up resumes where we already knew the right answer. It got the overall fit right for
                about 8 in 10. But how sure it said it was didn&apos;t match when it was right: some confident answers were
                wrong, and many unsure ones were right.
              </p>
            ),
          }}
          right={{
            title: "It only knows what's written",
            children: (
              <p>
                Luna judges the words on the page. If a resume leaves something out, Luna treats it as missing, even if the
                person has the skill. A resume stuffed with buzzwords fooled it once in four tries.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "It can't explain itself",
            children: (
              <p>
                It gives odds, not reasons. The app shows the individual yes-or-no checks so a person can see what drove the
                result, but there is no written explanation.
              </p>
            ),
          }}
          right={{
            title: "It isn't private",
            children: (
              <p>
                Resume text is sent to OpenAI to be scored. That is why the experiment used made-up resumes only, never real
                ones.
              </p>
            ),
          }}
        />
        <Callout kind="warning" title="A person stays in charge">
          <p>
            OpenAI&apos;s own rules limit using AI to make hiring decisions on its own. This was built as a learning tool,
            not a hiring tool: it suggests, a person decides.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            Luna doesn&apos;t write answers. It puts odds on the answers you allow, so software can act on them. Those odds
            need testing on examples where you know the right answer before you trust them, and on anything that matters,
            like hiring, a person makes the call.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers how the app is built, the exact questions it sends, the test results in full, and
            how to run it yourself.
          </p>
          <p>
            <Link href="/wiki/decisions-api/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
