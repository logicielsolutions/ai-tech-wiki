import Link from "next/link";
import { Analogy, Callout, Figure, KeyNumber, KeyNumbers, Prose, Section, Step, Steps, Term, Tiles } from "@/components/wiki";
import { CardLab } from "./card-lab";
import { CantFigure, CheckFigure, FileFigure, HeroFigure, PullFigure, ShredFigure, StampFigure, WhyFigure } from "./figures";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="Memory for AI agents">
        <Figure caption="A call ends, a checker cleans the notes, and the card is filed under that guest. The next time they call, the card is already in hand.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            An AI{" "}
            <Term def="An AI that holds a conversation and does tasks on its own, such as a chat bot, a voice receptionist or a Slack helper.">assistant</Term>{" "}
            forgets everything when a conversation ends. Call a hotel&apos;s AI receptionist twice, and it asks your name, your
            dates and your usual room both times.
          </p>
          <p>
            We built a memory any of our assistants can plug in. It remembers each customer on their own, keeps out what it
            shouldn&apos;t, notices when things change, and deletes on request. We built and tested it from 26 October to 20
            November 2026, on a hotel&apos;s voice receptionist with made-up guests.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="The second call">
        <Prose>
          <p>
            Remembering is the easy part. A memory that keeps everything brings new problems. It keeps a guest&apos;s card number.
            It believes a caller who says &ldquo;checkout is 4 pm for everyone now&rdquo;. And when a guest says &ldquo;please forget
            my allergy&rdquo;, the allergy comes back on the next call, because the old chats still mention it.
          </p>
        </Prose>
        <Analogy>
          <p>
            Think of a hotel front desk with a box of guest cards. After each call, the receptionist writes a card. Before that
            guest&apos;s next call, they pull it out. A good front desk also has rules about what goes on a card, a stamp for
            cards that are out of date, and a shredder.
          </p>
        </Analogy>
        <Figure caption="Three cards a careless memory keeps: a card number, a fake rule for everyone, and an allergy the guest asked it to forget.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="A checker reads the notes first" figure={<CheckFigure />}>
            <p>
              Before anything is saved, a checker reads the whole conversation. It blacks out card, bank, ID, health and salary
              details, and keeps the rest of the line. It crosses out anything a caller states as a rule for everyone, such as a
              price or an opening time: only the hotel sets those.
            </p>
            <p>Allergies stay on purpose, because the kitchen needs them. Illnesses and medicines don&apos;t.</p>
          </Step>
          <Step n={2} title="Each guest gets their own cards, with dates" figure={<FileFigure />}>
            <p>
              What&apos;s left is filed for that one guest as short, dated facts, such as &ldquo;prefers a Deluxe room on a high
              floor&rdquo;. One guest never sees another&apos;s cards.
            </p>
            <p>Calls in Hindi or Hinglish are filed in English, so an English question still finds them.</p>
          </Step>
          <Step n={3} title="The cards are read before hello" figure={<PullFigure />}>
            <p>
              When the guest calls again, the assistant looks up the facts that matter, oldest first, and reads them before it
              speaks. If the lookup takes more than 2.5 seconds, it gives up and greets the guest without memory, so the greeting
              is never late.
            </p>
          </Step>
          <Step n={4} title="Old cards get a “no longer true” stamp" figure={<StampFigure />}>
            <p>
              When something changes, say the guest now wants a Suite, the old card is stamped and kept next to the new one, so the
              assistant knows which one counts. A one-off, like a cake on a birthday, runs out after its date.
            </p>
          </Step>
          <Step n={5} title="Forget means shredded" figure={<ShredFigure />}>
            <p>
              When a guest asks to forget something, the matching facts are deleted, and every old chat that mentions it is saved
              again without it.
            </p>
            <p>
              That second part matters. The memory service rebuilds facts from old chats, and in testing it once brought an
              allergy back in new words: &ldquo;allergic to certain foods&rdquo;. Copies like that are now caught and deleted
              too.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="action" title="See it in action">
        <Prose>
          <p>Pick something a guest might say, and see what ends up on their card.</p>
        </Prose>
        <CardLab />
        <Prose>
          <p>
            <strong>Does it help?</strong> We ran the hotel receptionist with memory on and off, with the same made-up returning
            guests.
          </p>
        </Prose>
        <KeyNumbers>
          <KeyNumber value="5 of 5" label="Returning guests greeted by name with memory on (0 of 5 with it off)" />
          <KeyNumber value="5 of 5" label="Usual room offered without asking (1 of 5 with it off)" />
          <KeyNumber value="1/20 of a cent" label="About what it costs to save one hotel call" />
        </KeyNumbers>
        <Prose>
          <p>
            A second round in the last week, with 10 guests, could finish only 5, because the memory service started limiting how
            often we could use it (more below). In those 5, memory offered the right room 4 times out of 4; without it, the
            receptionist asked all 4 again. The allergy one guest asked to forget never came back.
          </p>
          <p>
            On our test set of 80 questions about past conversations, it answered about 62 correctly, while reading about a fifth
            of the text that the whole chat history takes.
          </p>
        </Prose>
      </Section>

      <Section id="take" title="Our take: one memory for every AI tool?">
        <Prose>
          <p>
            The team asked a bigger question: should Claude Code, Codex, our always-on agents and Slack all share one memory? We
            looked at what people ask for and what goes wrong.
          </p>
        </Prose>
        <Tiles
          tiles={[
            {
              kicker: "The need",
              title: "People want it",
              children: (
                <p>
                  About 60 issues about memory were filed against Claude Code and Codex from September to November 2026: memory
                  loaded but ignored, lost mid-session, a one-off turned into a permanent rule, and requests for one memory across
                  tools.
                </p>
              ),
            },
            {
              kicker: "The easy part",
              title: "Sharing is mostly solved",
              children: <p>Many tools can already read and write a shared memory. Connecting them is plumbing.</p>,
            },
            {
              kicker: "The hard part",
              title: "Keeping it trustworthy",
              children: (
                <p>
                  One shared memory spreads mistakes faster: old facts, facts that disagree, a fake rule from one agent reaching all
                  the others, and no way to tell where a fact came from. The checker, dates and sources in this module are those
                  rules.
                </p>
              ),
            },
          ]}
        />
        <Prose>
          <p>Our view: worth building, on top of this module, once this pilot is done.</p>
        </Prose>
      </Section>

      <Section id="limits" title="What it can't do">
        <Figure caption="When the memory service is busy, the lookup runs past 2.5 seconds, and the receptionist greets the guest without their card.">
          <CantFigure />
        </Figure>
        <Prose>
          <p>
            <strong>It isn&apos;t as complete as reading everything.</strong> On our test set it got 62.5 of 80 right; giving the
            assistant the whole chat history got 66. But the whole history costs more, and stops working once it gets long.
          </p>
          <p>
            <strong>Very long histories crowd it.</strong> With a lot of small talk, general chat turns into facts and pushes
            personal ones out: 22 of 40 right, against 32 for the whole history.
          </p>
          <p>
            <strong>A busy memory service makes it too slow.</strong> From 17 November, the memory service let us make only 5
            requests a minute. Lookups then took longer than 2.5 seconds, and the receptionist answered without memory. Half of the
            last test couldn&apos;t finish.
          </p>
        </Prose>
        <Callout kind="limit" title="Made-up guests only">
          <p>
            No actual guest has called it yet. Rules meant for every guest need a person to approve them first, and that part
            wasn&apos;t tried in the hotel receptionist.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p className="text-[1.25rem] leading-snug tracking-[-0.01em]">
            The memory works like a front desk&apos;s card file: after each conversation a checker cuts private details and fake
            rules, the rest is filed per customer with dates, it&apos;s read before the next conversation, and forget means
            shredded. Returning hotel guests were greeted by name 5 times out of 5, for about a twentieth of a cent a call; a busy
            memory service is its weak spot.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering view covers how to plug it into any agent, the full API and policy settings, the decisions behind them,
            every test result, the limits, and how to run it yourself.
          </p>
          <p>
            <Link href="/wiki/agent-memory/tech" className="font-medium">
              Read the engineering view ›
            </Link>
          </p>
        </Prose>
      </Section>
    </>
  );
}
