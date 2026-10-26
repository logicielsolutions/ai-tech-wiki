import Link from "next/link";
import { Analogy, Callout, Compare, Figure, KeyNumber, KeyNumbers, Prose, Section, Step, Steps, Term, Tiles } from "@/components/wiki";
import {
  ClipOnFigure,
  CompactFigure,
  HeroFigure,
  KeepFigure,
  RebuildFigure,
  TestFigure,
  ThreeWaysFigure,
  UnfamiliarFigure,
  WhyFigure,
} from "./figures";
import { MethodLab } from "./method-lab";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="A lens, not a new camera">
        <Figure caption="The model stays as it is. A small add-on, clipped on like a lens, learns one job, and the results for that job get sharper.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            An AI{" "}
            <Term def="An AI system trained on a huge amount of text. Different models are good at different jobs.">model</Term>{" "}
            arrives knowing a little about almost everything. Teaching it to be good at one particular job is called{" "}
            <Term def="Giving an existing model extra practice on worked examples of one job, so it gets better at that job.">fine-tuning</Term>.
          </p>
          <p>
            Between July and August 2026 our AI Practice tried three ways of doing it, on five different jobs (plus a model-merging study), and measured
            every result. This page explains the three ways and what we found.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="A general AI is fair at everything and sloppy at your one job">
        <Prose>
          <p>
            We asked a small open model to turn plain-English questions into{" "}
            <Term def="A precise instruction that pulls the right rows out of a company database, written in a language called SQL.">database queries</Term>,
            such as &ldquo;how many orders shipped last week?&rdquo; It got about half of them right. Good enough for a demo,
            not for a tool people rely on.
          </p>
          <p>
            Building a new model from scratch for one job costs far too much. Retraining every part of a big model needs
            expensive hardware. The question was whether we could make it good at this one job cheaply.
          </p>
        </Prose>
        <Analogy>
          <p>
            A good camera takes decent pictures of anything. For one kind of shot, say close-ups of small print, it struggles.
            You don&apos;t build a new camera. You clip on a lens made for that shot.
          </p>
        </Analogy>
        <Figure caption="Without help, the general model gets about half of the database questions right.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Prose>
          <p>There are three ways to teach a model one job. The first three steps describe the lens; step four is the alternative.</p>
        </Prose>
        <Steps>
          <Step n={1} title="Keep the camera as it is" figure={<KeepFigure />}>
            <p>
              Start from an existing model and lock it. The billions of settings it learned from its original training don&apos;t
              change. That is what keeps the job cheap.
            </p>
          </Step>
          <Step n={2} title="Clip on a lens" figure={<ClipOnFigure />}>
            <p>
              Attach a small add-on to the model, called a{" "}
              <Term def="Short for low-rank adaptation: a small add-on attached to a frozen model. Only the add-on is trained.">LoRA</Term>,
              and train only that. The model practises on worked examples of the job; we used about 20,000 database questions
              with correct answers.
            </p>
            <p>
              <strong>The add-on is tiny next to the model</strong>, so it trains on a single cloud{" "}
              <Term def="The chip that does the heavy maths when training an AI model. Its memory limits how big a model fits on it.">graphics card</Term>.
              Ours took about two hours on a free one.
            </p>
          </Step>
          <Step n={3} title="Or use the same lens on a compact camera" figure={<CompactFigure />}>
            <p>
              A version called{" "}
              <Term def="LoRA on a compressed copy of the model: the model is stored at lower precision to save memory, and the add-on is the same.">QLoRA</Term>{" "}
              does the same thing on a compressed copy of the model. Same add-on, much smaller camera body.
            </p>
            <p>
              <strong>It needed less memory and showed no measurable difference in score.</strong> On the database job: 3.6 GB
              instead of 8.5 GB, and about 78% right either way. On the character-voice job the saving was smaller (about
              40%) and it trained about 15% slower.
            </p>
          </Step>
          <Step n={4} title="Or open the camera up and rebuild it" figure={<RebuildFigure />}>
            <p>
              <strong>Full fine-tuning</strong> trains every part of the model, not an add-on. For big models that needs a lot
              of hardware. Small models, a few hundred million parts instead of billions, fit on a single graphics card.
            </p>
            <p>We did this for tweet moods, Mac commands and a spam filter. The tweet-mood model trained in about 27 minutes on a free one.</p>
          </Step>
          <Step n={5} title="Test it on shots it has never seen" figure={<TestFigure />}>
            <p>
              We tested every model on questions it never practised on: familiar ones, harder ones, and questions about real
              databases it had never seen. We also gave it a general-knowledge quiz to check it hadn&apos;t forgotten things.
            </p>
            <p>
              <strong>Familiar and harder questions got much better. Unfamiliar ones got worse.</strong>
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="measured" title="What we measured">
        <KeyNumbers>
          <KeyNumber value="78%" label="Database questions right, up from 52%" />
          <KeyNumber value="58%" label="Less memory in use on the database job, no measurable score difference" />
          <KeyNumber value="~2 hours" label="Training on one free cloud graphics card" />
          <KeyNumber value="16%" label="Unfamiliar databases: down from 24%" />
        </KeyNumbers>
        <Prose>
          <p>
            Pick a job, and a test where there is more than one. Each bar is a real result from our runs. Where a method was
            never tried on that job, it says so.
          </p>
        </Prose>
        <MethodLab />
      </Section>

      <Section id="pick" title="Which one to pick">
        <Figure caption="The three ways: rebuild a small model, clip a lens onto a bigger one, or clip the same lens onto a compressed one.">
          <ThreeWaysFigure />
        </Figure>
        <Tiles
          tiles={[
            {
              kicker: "Full fine-tuning",
              title: "Rebuild a small camera",
              children: (
                <p>
                  When a small model can do the job, train all of it. For Mac commands, a small model built for actions and
                  fully trained got 92% right, against 79% for a model nearly four times bigger with a lens, and answered
                  three times faster. This is not a clean method comparison: the two started from different models and recipes,
                  and the test commands also guided how the training data was revised.
                </p>
              ),
            },
            {
              kicker: "LoRA",
              title: "Clip a lens on",
              children: (
                <p>
                  When the job needs a bigger model that is too costly to retrain. One model can also carry several lenses,
                  one per job, swapped as needed.
                </p>
              ),
            },
            {
              kicker: "QLoRA",
              title: "Same lens, compact camera",
              children: (
                <p>
                  Our default for bigger models. In both of our side-by-side tests it scored about the same as the full-size
                  version while using roughly 40 to 60% less memory in use, so bigger models fit on cheaper hardware. The card
                  still has to reserve more than that, and it was not faster.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="On real databases it had never seen, the trained model did worse than the untrained one, and a hosted commercial model with no training at all did best.">
          <UnfamiliarFigure />
        </Figure>
        <Compare
          left={{
            title: "A specialist gets worse off its subject",
            children: (
              <p>
                Practising on one kind of database made the model worse at unfamiliar ones: 16% right, down from 24%. A large
                hosted model, simply shown three examples, got 42%. Fine-tune only when the real work looks like the practice
                examples.
              </p>
            ),
          }}
          right={{
            title: "It teaches a skill, not facts",
            children: (
              <p>
                Fine-tuning changes how a model answers: the format, the style, the habits of one job. It is not a reliable
                way to teach it your company&apos;s facts. For that, the model should look things up in your documents.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Small tests, one try each",
            children: (
              <p>
                Every result here comes from a single training run, and some tests are small: the character-voice comparison
                used 12 prompts, each asked two ways, scored by one AI judge. Differences of a few points can be luck.
              </p>
            ),
          }}
          right={{
            title: "Never on one model, all three ways",
            children: (
              <p>
                We compared the lens and the compact camera on the same model. Full fine-tuning was always on smaller models,
                so we haven&apos;t yet measured all three ways side by side on one model.
              </p>
            ),
          }}
        />
        <Callout kind="warning" title="Try the big model first">
          <p>
            Before training anything, ask a hosted commercial model to do the job with a few examples. Train only when you need the
            same style every time or a lower cost per answer, and test it on unfamiliar cases before anyone relies on it.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            You don&apos;t have to rebuild an AI model to make it good at one job. A small add-on, trained on a free graphics
            card in about two hours, took ours from about half right to about 8 in 10, and the compressed version used less
            memory with no measurable difference in score. Small models can simply be retrained whole. Either way you get a
            specialist that is worse off its subject, so test it there first.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers the exact setup, the full results with statistics, the decisions behind them, and how
            to run the experiments yourself.
          </p>
          <p>
            <Link href="/wiki/lora-fine-tuning/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
