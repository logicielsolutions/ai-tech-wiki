import Link from "next/link";
import { Analogy, BulletList, Callout, Figure, Prose, Section, Step, Steps, Term, Tiles } from "@/components/wiki";
import {
  AgainFigure,
  AskFigure,
  DescribeFigure,
  HeroFigure,
  PerformFigure,
  PlayersFigure,
  RehearseFigure,
  ReviewFigure,
  WhyFigure,
  WriteFigure,
} from "./figures";
import { FlipbookLab } from "./flipbook-lab";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Claude writes the rules, the renderer flips the pages">
        <Figure caption="Claude writes down a rule for every moment. The renderer draws each page of the flipbook from those rules and flips through them, and out comes the video, the same every time.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Claude (the model we use is Opus 5.5) can make short videos: launch clips, explainers, animated titles, captions
            over footage. You describe what you want in plain words. Claude writes the whole video down, and a second
            program plays what it wrote and records it as a video file.
          </p>
          <p>
            This page explains how that works, which of two tools to use, and how to ask so the first version is close to
            what you pictured.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="One word changed, the whole edit redone">
        <Prose>
          <p>
            A short launch video usually means a motion designer and editing software. Then someone spots a typo in the
            title, or the number changes, and the edit is opened up and redone by hand.
          </p>
          <p>
            When the video is <strong>written down</strong> instead, changing a word is like fixing a typo in a document.
            Change it, make the video again, and everything else stays exactly as it was.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of a flipbook. Drawn by hand, moving the title a little means redrawing every one of its pages. Now
            imagine the flipbook is written as rules instead: &ldquo;at 0 seconds the title appears, at 3 seconds it slides
            up&rdquo;. Change one rule and every page redraws itself, exactly the same each time.
          </p>
        </Analogy>
        <Figure caption="Drawn by hand, every page has to be redrawn. Written as rules, only the one rule changes.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="You describe the piece" figure={<DescribeFigure />}>
            <p>
              Say how long it is, what shape (wide for a website, tall for a phone), what happens at each moment, and the{" "}
              <strong>exact words</strong> that appear on screen. You don&apos;t need a design plan; it asks for anything
              missing.
            </p>
          </Step>
          <Step n={2} title="Claude writes the rules" figure={<WriteFigure />}>
            <p>
              Claude writes the video scene by scene as a{" "}
              <Term def="The same kind of file a website is made of. Here it holds the text, colors and moves of the video, each tied to a moment in time.">
                web page
              </Term>{" "}
              with a rule for every element at every moment: where it is, what it looks like, how it moves. Those rules are the video.
            </p>
          </Step>
          <Step n={3} title="You watch a rehearsal and give notes" figure={<RehearseFigure />}>
            <p>
              A live preview plays in your browser. You give notes like a video editor would: &ldquo;at 0:03 the title
              should be bigger&rdquo;. <strong>One change per round</strong>, so you can tell what helped.
            </p>
          </Step>
          <Step n={4} title="The renderer flips the pages" figure={<PerformFigure />}>
            <p>
              When you approve, the{" "}
              <Term def="The program that plays the written-down video in a hidden browser, takes a picture of every moment, and joins the pictures into a video file.">
                renderer
              </Term>{" "}
              draws every page from the rules, 30 pages for every second of video, and flips them into a video file. It
              waits for your OK before it starts.
            </p>
          </Step>
          <Step n={5} title="Change one rule, flip again" figure={<AgainFigure />}>
            <p>
              The rules stay. Change a word or a color and render again: the rest comes out <strong>identical</strong>.
              A good set of rules can also become a template for the next video.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="try" title="Change one word, watch the video change">
        <Prose>
          <p>
            Here is a tiny 8-second video, written the same way. Press play, or drag the slider to any moment. Then pick a
            different feel word: only that one word in the request changes, and every entrance moves differently.
          </p>
        </Prose>
        <FlipbookLab />
      </Section>

      <Section id="pick" title="Two tools to choose from">
        <Figure caption="HyperFrames runs on your own computer and gives you a video file. Claude Motion runs on the Claude website and gives you a link to share.">
          <PlayersFigure />
        </Figure>
        <Tiles
          tiles={[
            {
              kicker: "A file to ship",
              title: "HyperFrames",
              children: (
                <>
                  <p>
                    Free and open, made by HeyGen. Runs on your computer and gives you a video file. Best for launch videos,
                    explainers with a voiceover and music, captions on your own footage, and tall videos for phones.
                  </p>
                  <p>Needs a one-time setup by someone comfortable with a terminal.</p>
                </>
              ),
            },
            {
              kicker: "A link to share",
              title: "Claude Motion",
              children: (
                <>
                  <p>
                    Built into the Claude website, nothing to install, included in your Claude plan. Best for a quick
                    animated explainer you want the team to comment on.
                  </p>
                  <p>Your team can comment on an exact moment in the video, and you can download it as a video file.</p>
                </>
              ),
            },
          ]}
        />
        <Prose>
          <p>
            Rule of thumb: if you need a file to publish, your own footage, a narrator or a phone-shaped video, use
            HyperFrames. If you want a quick explainer to share for feedback, use Claude Motion.
          </p>
        </Prose>
      </Section>

      <Section id="ask" title="How to ask for a good video">
        <Figure caption="A vague request leaves Claude guessing. A request with timings and exact words gets you the video you pictured.">
          <AskFigure />
        </Figure>
        <Prose>
          <BulletList>
            <li>
              <strong>Say how long and what shape.</strong> &ldquo;8 seconds, tall for a phone&rdquo; beats &ldquo;a short
              video&rdquo;.
            </li>
            <li>
              <strong>Give each moment a time.</strong> &ldquo;0 to 3 seconds: the title comes in. 3 to 5: the number counts
              up.&rdquo; Include pauses, or they get skipped.
            </li>
            <li>
              <strong>Quote the exact words.</strong> Words you don&apos;t quote get rewritten.
            </li>
            <li>
              <strong>Show 2 to 4 examples of the look you want</strong>, as files rather than links, and say what to take
              from each: &ldquo;the pace from this one, the lettering from that one&rdquo;.
            </li>
            <li>
              <strong>Use feel words on purpose.</strong> &ldquo;Snappy&rdquo;, &ldquo;bouncy&rdquo; and &ldquo;dreamy&rdquo;
              each mean a specific kind of movement, as the example above shows.
            </li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="The tools check that the video is well made, not that it is good. A person watches it and approves it before the final version is made.">
          <ReviewFigure />
        </Figure>
        <Prose>
          <BulletList>
            <li>
              <strong>No lifelike footage.</strong> These tools make moving text, shapes, charts and screens. For realistic
              people or places, see{" "}
              <Link href="/wiki/ai-video" className="font-medium">
                Making video with AI
              </Link>
              .
            </li>
            <li>
              <strong>&ldquo;It passed the checks&rdquo; doesn&apos;t mean it&apos;s good.</strong> The checks catch broken
              layouts, not boring ones. Always watch it.
            </li>
            <li>
              <strong>An exact copy of a look is hard.</strong> Words get most of the way. The last bit, like how soft a
              glow is, takes a few rounds of notes or never quite lands.
            </li>
            <li>
              <strong>No copying other brands.</strong> Use examples for style and pace. Don&apos;t recreate another
              company&apos;s logo, screens or characters.
            </li>
            <li>
              <strong>Claude Motion has narrower limits.</strong> Your own video clips play without sound, the music it
              makes has no words, and each video has one shape, so a phone version is a second video.
            </li>
          </BulletList>
        </Prose>
        <Callout kind="warning" title="A person stays in charge">
          <p>
            You give the notes and you approve the preview. The final video isn&apos;t made until you say so, and someone
            watches it before it goes out.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            Claude writes a video down as rules, and a renderer draws and flips the pages the same way every time, so changing one word
            means a new video in minutes. Use HyperFrames for a file to ship and Claude Motion for a quick link to share.
            Ask with timings and exact words, and change one thing at a time.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers setup, the prompt structure that works, the words that map to animation settings,
            how to match a reference, voice and music, export options, and the rules that stop renders from breaking.
          </p>
          <p>
            <Link href="/wiki/motion-with-claude-code/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
