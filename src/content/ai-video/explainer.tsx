import Link from "next/link";
import { Analogy, Callout, Compare, Figure, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import { CrewPicker } from "./crew-picker";
import { DenoiseLab } from "./denoise-lab";
import {
  ClearingFigure,
  FlawsFigure,
  HeroFigure,
  PromptFigure,
  ShotListFigure,
  StaticFigure,
  TimelineFigure,
  WholeClipFigure,
  WhyFigure,
} from "./figures";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="You direct, the AI films">
        <Figure caption="You write the shot list. The AI model is the camera crew. The shot comes out of static, a little clearer with every pass.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            AI video tools turn a written description into a short video clip, usually with sound. A shot that used to
            need a camera crew, a location and a day of filming can now start as a paragraph.
          </p>
          <p>
            This page explains how these tools work, which one to use for which job, roughly what they cost, and how to ask
            for a shot so you get one you can use.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="Easy to start, easy to waste">
        <Prose>
          <p>
            Anyone can type &ldquo;a lighthouse at sunset&rdquo; and get a clip back. Getting the clip you actually wanted is
            harder. Even good teams throw away <strong>3 to 10 tries for every clip they keep</strong>, and every try costs
            money and time.
          </p>
          <p>
            There are dozens of tools, each good at different things, and the best one changes every few months. Picking
            the wrong tool, or asking vaguely, is where most of the waste comes from.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of hiring a film crew. Tell them &ldquo;make something epic&rdquo; and they&apos;ll film something,
            just probably not what you pictured. Hand them a shot list (where the camera is, how it moves, what&apos;s in
            frame, where the light comes from) and you get your shot. You also hire a different crew for a cartoon than
            for a product ad.
          </p>
        </Analogy>
        <Figure caption="Five takes of the same shot. Four go in the bin; one is kept. Planning cuts the number of takes, and with it the cost.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Prose>
          <p>Five steps, from your words to a finished clip.</p>
        </Prose>
        <Steps>
          <Step n={1} title="You hand over a shot list" figure={<ShotListFigure />}>
            <p>
              Your description is called a{" "}
              <span className="whitespace-nowrap">
                <Term def="The written instructions you give an AI tool. For video, the best prompts read like a film shot list.">prompt</Term>.
              </span>
              The tool first turns your words into numbers it can follow, a bit like a crew reading the script before the
              shoot.
            </p>
            <p>
              <strong>It reads facts better than feelings.</strong> &ldquo;Close-up, slow push-in, window light from the
              left&rdquo; works. &ldquo;Epic, stunning, 8K masterpiece&rdquo; does almost nothing.
            </p>
          </Step>
          <Step n={2} title="It starts from pure static" figure={<StaticFigure />}>
            <p>
              Every clip starts as random static, like an old TV between channels, or a film set lost in thick fog. There is
              no picture in it yet.
            </p>
            <p>
              The tool has learned, from watching a huge amount of video, how to turn static into a picture that matches a
              description.
            </p>
          </Step>
          <Step n={3} title="It clears the fog a little at a time" figure={<ClearingFigure />}>
            <p>
              The tool removes a little static at a time, over 20 to 50 passes. Engineers call this{" "}
              <span className="whitespace-nowrap">
                <Term def="The method behind almost every AI image and video tool: start from random static and remove a little of it at a time, guided by the prompt, until a picture appears.">diffusion</Term>.
              </span>
            </p>
            <p>
              <strong>The first passes decide the layout and the movement; the last passes add detail.</strong> That&apos;s
              why changing the camera move in your prompt changes the whole shot, while a style word only changes the finish.
            </p>
          </Step>
          <Step n={4} title="It looks at the whole clip at once" figure={<WholeClipFigure />}>
            <p>
              The tool doesn&apos;t make one frame after another. It works on every frame together, so a face or a cup stays
              the same from the start of the clip to the end.
            </p>
            <p>
              That&apos;s also why clips are short, usually 5 to 15 seconds. <strong>Double the length and the work goes up
              about four times</strong>, because every frame has to be compared with every other frame.
            </p>
          </Step>
          <Step n={5} title="Short shots become a video" figure={<TimelineFigure />}>
            <p>
              What comes out is a short clip, and most tools now add matching sound: voices, footsteps, music. A 30-second ad
              is several short shots, made one at a time and joined in a video editor, the same way a real film is cut.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="try" title="Watch a shot come out of the static">
        <Prose>
          <p>
            Drag the slider, or press Play, to step from pure static to a finished frame. Then switch the prompt: the
            starting static is exactly the same, and the words decide what it turns into.
          </p>
        </Prose>
        <DenoiseLab />
      </Section>

      <Section id="pick" title="Hire the right crew for the job">
        <Prose>
          <p>
            No single tool is best at everything. Pick the job you have in mind to see which tool to use, a good second
            choice, and the one habit that makes it work. These picks are from October 2026; the leaders change every few
            months, so the engineering page keeps the full rankings and prices.
          </p>
        </Prose>
        <CrewPicker />
        <Callout kind="note" title="Start from a picture, not just words">
          <p>
            Professionals rarely type a description and hope. They make a still image first (cheap and quick to change),
            get it approved, then ask the video tool to bring that image to life. Still images cost a small fraction of
            video, so you settle the look before you pay for movement.
          </p>
        </Callout>
      </Section>

      <Section id="prompt" title="How to ask for a good shot">
        <Figure caption="A vague request leaves the model guessing. A shot list tells it what to film.">
          <PromptFigure />
        </Figure>
        <Prose>
          <p>Write it like a shot list, in this order, in about 60 to 150 words:</p>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong>The shot</strong>: close-up, wide, over the shoulder.
            </li>
            <li>
              <strong>One camera move</strong> and its speed: &ldquo;slow push-in&rdquo;, &ldquo;static tripod&rdquo;.
            </li>
            <li>
              <strong>Who or what</strong>, with 3 to 5 fixed details: age, hair, clothes, one prop.
            </li>
            <li>
              <strong>What happens</strong>, in small beats: &ldquo;she lifts the cup, pauses, smiles&rdquo;.
            </li>
            <li>
              <strong>Where, and where the light comes from</strong>: &ldquo;small kitchen, morning window light from the
              left&rdquo;.
            </li>
            <li>
              <strong>The look</strong>: 3 to 5 colors, or a film style like &ldquo;35mm film, warm tones&rdquo;.
            </li>
            <li>
              <strong>Sound</strong>, one line each: what&apos;s said, sound effects, background, music.
            </li>
          </ol>
        </Prose>
        <Compare
          left={{
            title: "Vague",
            children: <p>&ldquo;A beautiful cinematic video of a woman drinking coffee, epic lighting, 8K.&rdquo;</p>,
          }}
          right={{
            title: "A shot list",
            children: (
              <p>
                &ldquo;Medium close-up, slow push-in. A woman in her 30s with short grey hair and a green wool sweater sits at
                a small kitchen table. She lifts a blue mug, blows on it, and smiles. Morning window light from the left,
                warm tones. Sound: a quiet kitchen, a spoon clinks. No music.&rdquo;
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Habits that help",
            children: (
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>One camera move per shot.</li>
                <li>Say what stays still: &ldquo;camera stays locked&rdquo;.</li>
                <li>Bringing a photo to life? Describe only the movement; the photo already shows the rest.</li>
                <li>Change one thing per retry, so you know what fixed it.</li>
                <li>Ask for 3 or 4 versions and pick the best.</li>
              </ul>
            ),
          }}
          right={{
            title: "Habits that waste tries",
            children: (
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>Feeling words instead of facts: &ldquo;epic&rdquo;, &ldquo;stunning&rdquo;.</li>
                <li>Three camera moves in one 8-second clip.</li>
                <li>A whole story squeezed into one shot.</li>
                <li>Asking for readable words or logos.</li>
                <li>Writing &ldquo;no dogs&rdquo;: it can put a dog in.</li>
              </ul>
            ),
          }}
        />
      </Section>

      <Section id="limits" title="What it can't do (yet)">
        <Figure caption="The usual weak spots: hands, written words and logos, and objects that melt or change shape when things move fast.">
          <FlawsFigure />
        </Figure>
        <Compare
          left={{
            title: "Small details go wrong",
            children: (
              <p>
                Hands gain or lose fingers, letters come out scrambled, and logos are invented. Keep hands still or out of
                frame, and always add words and logos afterwards in editing.
              </p>
            ),
          }}
          right={{
            title: "It knows how things look, not how they work",
            children: (
              <p>
                Pouring water, a ball bouncing, two objects colliding: the tool copies what these look like and often gets
                the physics wrong. Keep the action simple and cut away at the moment of impact.
              </p>
            ),
          }}
        />
        <Compare
          left={{
            title: "Faces drift between shots",
            children: (
              <p>
                Each shot is made separately, so the same person can look slightly different in shot two. Reference images
                and identical descriptions in every shot fix most of it.
              </p>
            ),
          }}
          right={{
            title: "Long takes fall apart",
            children: (
              <p>
                Anything longer than about 10 to 15 seconds in one take tends to wander. Plan short shots and edit them
                together.
              </p>
            ),
          }}
        />
        <Callout kind="warning" title="A person stays in charge">
          <p>
            The tool makes takes; a person picks the keepers, edits them together, and checks every frame for mistakes. If a
            video shows realistic AI people, label it as AI-made, use real people&apos;s faces or voices only with their
            written consent, and check with legal before it runs as an ad.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            AI video starts from static and clears it step by step, guided by your words: layout first, detail last. Pick the
            tool by the job, start from an approved still image, and write your prompt like a shot list. Plan short shots,
            expect several tries for each keeper, and add text and logos in the edit.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers what happens inside the model, the full rankings, prices with links to each
            vendor&apos;s own pricing page, a prompt structure that works across tools, each tool&apos;s quirks, and a
            workflow from brief to finished ad.
          </p>
          <p>
            <Link href="/wiki/ai-video/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
