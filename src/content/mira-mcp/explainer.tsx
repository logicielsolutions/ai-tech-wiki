import Link from "next/link";
import { Analogy, Callout, Compare, Figure, Prose, Section, Step, Steps, Term } from "@/components/wiki";
import {
  ActionFigure,
  AddressFigure,
  ConsentFigure,
  ExpiringPassFigure,
  FourToolsFigure,
  HeroFigure,
  PassFigure,
  TurnedAwayFigure,
  WhyFigure,
} from "./figures";
import { VisibilityLab } from "./visibility-lab";

export default function Explainer() {
  return (
    <>
      <Section id="idea" title="One socket, every assistant">
        <Figure caption="Mira wired one socket. Claude Code, Claude Desktop and Cursor all plug into it unchanged — and what comes out is your calls.">
          <HeroFigure />
        </Figure>
        <Prose>
          <p>
            Mira sits in our meetings and writes them up: a summary, and a transcript that knows who said what. All of
            that has always lived in one place — the Mira website.
          </p>
          <p>
            This is a second way in. Add one address to the AI assistant you already use, approve it once in your
            browser, and from then on you can ask it about your meetings directly. No copying, no pasting, no files.
          </p>
          <p>
            The address is what engineers call an <strong>MCP server</strong>. MCP is a shared standard for how an AI
            assistant asks another system for information — so Mira had to build the socket only once, and every
            assistant that speaks the standard fits it.
          </p>
        </Prose>
      </Section>

      <Section id="why" title="The notes were shut in one window">
        <Prose>
          <p>
            Before this, using what Mira knew meant having Mira open. You found the call, opened it, selected the part
            you wanted, and pasted it across into your assistant. Once per call.
          </p>
          <p>
            That made the most useful question the most expensive one. <strong>&ldquo;What did we decide about the Acme
            migration?&rdquo;</strong> doesn&apos;t live in one meeting. It&apos;s spread across a kickoff in early October, a
            pricing conversation a week later, and whatever was said in passing at the sprint planning in between. Answering
            it by hand meant opening calls one at a time, hoping to recognise the one that mattered.
          </p>
        </Prose>
        <Analogy>
          <p>
            It was like a filing cabinet in a locked room. You could read anything in it, as long as you walked in,
            opened a drawer, and carried one folder out at a time. The socket puts a slot in the wall, so you can ask
            for what you need from where you already are.
          </p>
        </Analogy>
        <Figure caption="The old way: find the call, open it, copy the part you need, paste it across. Once per call.">
          <WhyFigure />
        </Figure>
      </Section>

      <Section id="how" title="How it works">
        <Steps>
          <Step n={1} title="You add one address" figure={<AddressFigure />}>
            <p>
              In your assistant&apos;s settings you paste a single web address. That&apos;s the whole setup. There is no key
              to generate, no password to store, nothing to install, and nothing for anyone at Mira to approve first.
            </p>
          </Step>
          <Step n={2} title="The assistant is turned away — politely" figure={<TurnedAwayFigure />}>
            <p>
              The first time your assistant knocks, it has nothing to prove who it is, so Mira refuses it. But the
              refusal is useful: it also says <strong>where to go and ask</strong>. That one detail is why nothing has to
              be set up in advance — an assistant that has never met Mira can find out what to do from the door itself.
            </p>
          </Step>
          <Step n={3} title="You sign in, and see who's asking" figure={<ConsentFigure />}>
            <p>
              Your browser opens on Mira. You sign in with the same Logiciel Google account you always use, and land on
              a screen that names the assistant asking for access — and shows its full address underneath.
            </p>
            <p>
              <strong>Read the address, not the name.</strong> Anything can call itself anything; the name on that screen
              is simply what the assistant claims. The address is the part that can&apos;t be faked.
            </p>
          </Step>
          <Step n={4} title="You get a pass that expires" figure={<PassFigure />}>
            <p>
              Approve, and your assistant is handed a pass. It is good for an hour at a time, it is renewed quietly in
              the background while you stay connected, and it fits <strong>only</strong> this one socket — the same pass
              opens nothing else at Mira.
            </p>
          </Step>
          <Step n={5} title="Now it can ask four things" figure={<FourToolsFigure />}>
            <p>
              Find calls. Read one call and its summary. Read a transcript. Search what was actually said. That is the
              entire list.
            </p>
            <p>
              All four <strong>read</strong>. There is nothing on it that can start a recording, rename, share, tag or
              delete anything — not as a precaution, but because no such tool was built.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="access" title="Who can see what">
        <Prose>
          <p>
            This is the part worth being sure about: <strong>your assistant sees exactly the calls you could already
            open yourself.</strong> Not your team&apos;s calls, not your project&apos;s calls — yours. Being on a project in
            Mira has never been enough to open its calls, and connecting an assistant doesn&apos;t change that.
          </p>
          <p>Switch between three made-up colleagues and watch the same four calls appear and disappear.</p>
        </Prose>
        <VisibilityLab />
        <Prose>
          <p>
            Notice what happens to a call someone can&apos;t see: it isn&apos;t listed with a lock on it. It is{" "}
            <strong>absent</strong>. Ask for it by name and the answer is &ldquo;that call doesn&apos;t exist, or you don&apos;t
            have access to it&rdquo; — deliberately the same sentence for both. Otherwise the difference between the two
            answers would quietly tell you which meetings your colleagues are having.
          </p>
        </Prose>
      </Section>

      <Section id="try" title="See it in action">
        <Prose>
          <p>
            Back to <strong>&ldquo;what did we decide about the Acme migration?&rdquo;</strong> — the question that used to
            mean opening calls one at a time.
          </p>
          <p>
            Now the assistant searches the words of every call you can see, all at once, and brings back the few moments
            that actually mention it: a line from the kickoff, a line from the pricing review, each with the date, the
            person who said it, and the point in the meeting it came from. You read three quotes instead of three
            transcripts.
          </p>
        </Prose>
        <Figure caption="One question, searched across months of calls at once, answered with short quotes — each one dated, attributed, and traceable back to the moment it was said.">
          <ActionFigure />
        </Figure>
        <Prose>
          <p>
            Because every quote carries where it came from, you can always go and listen to the original. The assistant
            is pointing at the meeting, not replacing it.
          </p>
        </Prose>
      </Section>

      <Section id="limits" title="What it can't do">
        <Compare
          left={{
            title: "It cannot change anything",
            children: (
              <>
                <p>
                  Four tools, all of them reading. Nothing can start Mira on a call, edit a summary, share a recording or
                  delete one.
                </p>
                <p>Writing was deliberately left out of this first version — it needs its own safeguards first.</p>
              </>
            ),
          }}
          right={{
            title: "It is Logiciel accounts only",
            children: (
              <>
                <p>
                  Connecting needs a <strong>logiciel.io</strong> sign-in. Clients and guests who have been sent a shared
                  recording still open it the way they always have.
                </p>
                <p>There is no version of this that works without someone signing in as themselves.</p>
              </>
            ),
          }}
        />
        <Figure caption="Disconnecting stops the next pass from being handed out. The one already in the assistant's hand runs out on its own, within the hour.">
          <ExpiringPassFigure />
        </Figure>
        <Prose>
          <p>
            Everything you have approved is listed in Mira&apos;s settings, with the date you approved it and when it was
            last used, and you can disconnect any of it at any time. One honest caveat: disconnecting stops any{" "}
            <em>new</em> pass being issued, but a pass already handed out keeps working until its hour is up. For a
            genuinely stolen one, that hour matters — which is why that is treated as an incident, not a button.
          </p>
          <p>
            And the familiar one: the assistant reading your transcripts is still an AI. It can misread a meeting the way
            it can misread anything else. The quotes are the thing to trust, and every answer comes with them attached so
            you can check.
          </p>
        </Prose>
        <Callout kind="warning" title="A person stays in charge">
          <p>
            Nothing here decides anything. It finds what was said and shows you where. What a meeting meant, and what to
            do about it, stays with the people who were in it.
          </p>
        </Callout>
      </Section>

      <Section id="summary" title="In one breath">
        <Prose>
          <p>
            Mira put one socket on the wall, and any AI assistant that speaks the common standard can plug into it. You
            approve it once in your browser, it gets a pass that expires every hour, and from then on it can find, read
            and search your meetings — only ever the ones you could already open, and only ever by reading them.
          </p>
        </Prose>
      </Section>

      <Section id="deeper" title="Going deeper">
        <Prose>
          <p>
            The engineering version — the two halves of the design, the four tools and their shapes, how a token is
            bound to one door, and what we would do differently —{" "}
            <Link href="/wiki/mira-mcp/tech">is on the tech page</Link>. It assumes you write software.
          </p>
          <p>
            One word you&apos;ll meet there:{" "}
            <Term def="A pass an assistant holds that proves who approved it and what it may reach. Mira's expire after an hour.">
              access token
            </Term>
            .
          </p>
        </Prose>
      </Section>
    </>
  );
}
