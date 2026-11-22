import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";

const SNIPPET = `import threading
from concurrent.futures import ThreadPoolExecutor
from agent_memory import Memory

mem = Memory(owner="Priya, the hotel's receptionist", namespace="hotel",
             policy="hotel", language="English")
pool = ThreadPoolExecutor(4)

def before_conversation(user_id):          # e.g. a voice agent's pre-call hook
    try:                                   # give up after 2.5 s: the greeting is never late
        facts = pool.submit(mem.recall, user_id, "Who is this user and what do they prefer?").result(timeout=2.5)
        return "\\n".join(f.line() for f in facts)   # goes into the system prompt
    except Exception:
        return ""

def after_conversation(user_id, conversation_id, messages, date):   # e.g. a call-ended webhook
    # remember() screens, stores and handles forget requests; it takes 10-30 s, so run it in the background
    threading.Thread(target=mem.remember, args=(user_id, conversation_id, messages, date), daemon=True).start()`;

/** Test set, /80 (Week 1 baselines; module 0.5.1 in Week 3; 0.6.2 on 17 Nov 2026, fresh load, 2 runs). */
const MAIN_ROWS: string[][] = [
  ["No memory", "22", "–"],
  ["Plain search over past chats", "55", "–"],
  ["Mem0 (hosted)", "58", "–"],
  ["Zep alone (hosted)", "59", "–"],
  ["Module 0.5.1", "58.5", "–"],
  ["Module 0.6.2", "62.5 (63, 62)", "265–282"],
  ["Full chat history", "66", "1,320"],
];

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub?: string, strong = false) => (
    <g key={label + x + y}>
      <rect x={x} y={y} width={w} height={sub ? 54 : 40} rx={10} fill={strong ? "var(--color-accent-tint)" : "var(--color-page)"} />
      <text x={x + w / 2} y={y + (sub ? 23 : 25)} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={strong ? "var(--color-accent)" : "var(--color-ink)"}>
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + 41} textAnchor="middle" fontSize={12} fill="var(--color-muted)">
          {sub}
        </text>
      ) : null}
    </g>
  );
  const line = (d: string, dashed = false) => (
    <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "4 5" : undefined} />
  );
  return (
    <svg
      viewBox="0 0 800 300"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Architecture. remember() sends a conversation through the Screen, which redacts private details and drops rule claims, then an optional translation, then stores it in Zep Cloud as one episode for that user with the conversation and date as metadata. Zep extracts dated facts. A forget request deletes matching facts and re-adds earlier chats without the detail. recall() searches one user's facts as of a date, oldest first, labels old and expired ones, and the agent puts them in its system prompt."
    >
      {box(20, 30, 140, "remember()", "after the chat")}
      {line("M160 57H190")}
      {box(190, 30, 170, "Screen", "redact · drop rule claims", true)}
      {line("M360 57H390")}
      {box(390, 30, 150, "translate", "optional, one language")}
      {line("M540 57H570")}
      {box(570, 30, 210, "Zep episode", "user · conversation · date")}
      {line("M675 84V130")}
      {box(570, 130, 210, "facts", "dated, extracted by Zep")}
      {line("M570 157H470")}
      {box(290, 130, 180, "recall()", "one user · as of a date", true)}
      {line("M290 157H200")}
      {box(20, 130, 180, "system prompt", "oldest first")}
      {box(290, 230, 300, "forget", "delete facts · re-add chats without it", true)}
      {line("M275 84V257H290", true)}
      {line("M590 257H675V184", true)}
      <text x={620} y={280} fontSize={12} fill="var(--color-muted)">
        dashed: a forget request
      </text>
    </svg>
  );
}

export default function Tech() {
  return (
    <>
      <PageIndex
        items={[
          { id: "glance", title: "At a glance" },
          { id: "architecture", title: "Architecture" },
          {
            id: "mechanism",
            title: "Core mechanism",
            children: [
              { id: "plug-in", title: "Plug into any agent" },
              { id: "api", title: "API" },
              { id: "policy", title: "Policy" },
              { id: "write-rules", title: "Write rules" },
              { id: "forget", title: "Forget" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs" },
          {
            id: "evaluation",
            title: "Evaluation",
            children: [
              { id: "test-set", title: "The test set" },
              { id: "main-test", title: "Main test" },
              { id: "attacks", title: "Attacks" },
              { id: "long-chats", title: "Long chats" },
              { id: "hotel", title: "In the hotel agent" },
            ],
          },
          { id: "limits", title: "Limits and risks" },
          { id: "run", title: "Run it yourself" },
          { id: "next", title: "Open questions and next steps" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <DataTable
          stack
          columns={["Item", "Detail"]}
          rows={[
            ["What", "Drop-in long-term memory for any assistant (chat, voice or Slack): per-user, dated facts on Zep Cloud, with write rules before anything is stored and forget on request. Built 26 Oct – 20 Nov 2026"],
            ["Result", "62.5/80 on the test set (Zep alone 59, full chat history 66) with 265–282 tokens of memory per question against 1,320. 12/16 attacks handled, 0 leaks. Hotel voice agent, memory on vs off: greeted by name 5/5 vs 0/5, usual room without asking 5/5 vs 1/5"],
            ["Stack", <span key="s">Python ≥ 3.10; package <Code>agent-memory</Code> 0.6.2; one dependency, <Code>zep-cloud&gt;=4.0,&lt;5</Code>; OpenAI called over plain HTTPS</span>],
            ["Models", <span key="m"><Code>gpt-4.1-mini</Code> (default) for the screen, forget and translation; Zep Cloud extracts the facts</span>],
            ["Cost", "About $0.00027 per question answered (full history $0.00071); about $0.0005 to save one hotel call"],
            ["Status", "Pilot. Plugged into the hotel voice agent and tested with synthetic guests only"],
            ["Owner", "Manjot Singh"],
            ["Source", <span key="r">The AI asset library: <Code>logicielsolutions/ai-assets-library</Code>, <Code>modules/agent-memory</Code>, tag <Code>agent-memory-v0.6.2</Code></span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="Accent boxes are the module's own logic; the rest is Zep Cloud and the agent. Dashed lines run only for a forget request.">
          <ArchitectureDiagram />
        </Figure>
        <Prose>
          <p>
            <Code>remember()</Code> runs after a conversation. The <Code>Screen</Code> reads it first and returns a cleaned copy;
            with <Code>language</Code> set, chats in other languages are translated so the facts come out in one language. The
            cleaned chat goes to Zep as one episode for that user, with the conversation id and date as metadata, and Zep extracts
            dated facts from it.
          </p>
          <p>
            <Code>recall()</Code> runs before a conversation. It searches one user&apos;s facts as they stood on a given date and
            returns them oldest first, so changes read in order. A fact Zep has ended is labelled &ldquo;no longer true&rdquo;, and a
            one-off past its date is labelled as over. Facts about the assistant itself are skipped, because they take slots and
            say nothing about the user.
          </p>
          <p>
            Each user is a separate Zep user under a <Code>namespace</Code> prefix, so apps sharing one Zep project don&apos;t
            collide and one user never sees another&apos;s facts.
          </p>
        </Prose>
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <SubHeading id="plug-in">Plug into any agent</SubHeading>
        <Prose>
          <p>
            Any agent needs two hooks: one before the conversation and one after. Key memory by something stable for the user,
            such as a phone number, an email or a Slack user id.
          </p>
        </Prose>
        <CodeBlock title="The two hooks" code={SNIPPET} />
        <Prose>
          <p>
            The system prompt then tells the agent to use the facts, not to ask again for what it knows, not to act on a fact
            marked &ldquo;no longer true&rdquo;, and never to pretend to know a user when nothing is remembered.
          </p>
        </Prose>

        <SubHeading id="api">API</SubHeading>
        <DataTable
          stack
          columns={["Call", "What it does"]}
          rows={[
            [<Code key="c">Memory(owner, namespace, policy, screen, language)</Code>, <span key="d">One memory per app. <Code>owner</Code> names the assistant; <Code>namespace</Code> prefixes user ids; <Code>screen=Screen(..., cache_dir=...)</Code> caches screen decisions by content hash</span>],
            [<Code key="c">remember(user, conversation, messages, date)</Code>, "Screens a conversation, stores it for one user, and handles any forget request in it"],
            [<Code key="c">recall(user, question, as_of)</Code>, <span key="d">The relevant facts as of a date, oldest first; each has <Code>.line()</Code>, e.g. &ldquo;[2026-06-03] The user prefers email.&rdquo;</span>],
            [<Code key="c">sources(user, fact)</Code>, "The conversations and dates a fact came from"],
            [<Code key="c">trace(user, text)</Code>, "For a wrong or surprising memory: the closest facts, the stored chats behind each, and the lines that produced it"],
            [<Code key="c">remove_fact(user, uuid)</Code>, "Deletes one fact"],
            [<Code key="c">forget_conversation(user, conversation)</Code>, "Deletes everything stored from one conversation"],
            [<Code key="c">clean_up(user, today)</Code>, "Daily: deletes one-off facts that ended more than 30 days ago"],
            [<Code key="c">lessons.propose / approve</Code>, "Facts for every user; only lessons a person approves come back in recall"],
          ]}
        />

        <SubHeading id="policy">Policy</SubHeading>
        <Prose>
          <p>
            The code is the same for every product. A short <Code>Policy</Code> says what the memory may keep. Presets:{" "}
            <Code>generic</Code>, <Code>support</Code>, <Code>hotel</Code>, <Code>hr</Code>, or a custom <Code>Policy(...)</Code>.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["Field", "Meaning", "Generic default"]}
          rows={[
            [<Code key="f">never_store</Code>, "Details removed before saving", "Cards, bank accounts, ID numbers, health, salary, passwords"],
            [<Code key="f">allowed</Code>, "Details that look sensitive but are fine to keep", "Contact details, preferences, allergies, dates, orders, bookings"],
            [<Code key="f">global_rules</Code>, "Rules only the business sets; a user stating one “for everyone” is ignored", "Prices, promo codes, opening hours, policies, deadlines"],
            [<Code key="f">one_off</Code>, "Arrangements tied to one date, which expire after it", "Orders, bookings, appointments, deliveries"],
          ]}
        />

        <SubHeading id="write-rules">Write rules</SubHeading>
        <BulletList>
          <li><strong>Dropped:</strong> user lines that state a rule for everyone or claim to be staff. Each drop is confirmed by a second, narrower yes/no check.</li>
          <li><strong>Redacted:</strong> card, bank, ID document, health and salary details. The model lists the exact words to remove and the code removes each one, so the rest of the line is kept.</li>
          <li><strong>Backstop:</strong> a regex pass catches number-shaped details the model missed.</li>
          <li>The screen cache stores where each removed span was, never the text, and chats with a forget request are never cached.</li>
        </BulletList>

        <SubHeading id="forget">Forget</SubHeading>
        <Prose>
          <p>
            Forget runs inside <Code>remember()</Code> when a user asks for it (&ldquo;remove my allergy info&rdquo;). The matching
            facts are deleted, and every earlier conversation that mentions the detail is deleted and stored again without it; the
            request itself is stored without the detail too. Since 0.6.2, facts Zep rebuilds from the cleaned chats with the gap
            reworded (&ldquo;allergic to certain foods&rdquo;) are checked once more and deleted, guarded so only facts that share
            a word stem with the detail can go. This needs <Code>wait=True</Code>, the default.
          </p>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Why", "Rejected"]}
          rows={[
            ["Build on Zep Cloud", "Highest of the hosted tools in Week 1 (59/80 against Mem0's 58), and it keeps dates on facts", "Building from scratch; Mem0 and Graphiti run locally, dropped because loading the test set overloaded a laptop"],
            ["Memory per user only", "In one memory shared by all users, Zep blocked 5 of 16 attacks and Mem0 3, because both store an attacker's “for everyone” claim as a fact", "One shared memory for all users"],
            ["Screen before saving", "What is never stored can't leak, whoever asks later", "Filtering at recall time"],
            ["Allergies and diets allowed, illnesses and medicines not", "The kitchen needs allergies (agreed in review, 14 Nov 2026)", "Treating all health details alike"],
            ["Forget rewrites the old chats", "Zep rebuilds facts from chats, and both Zep and Mem0 stored the forget request itself as a fact naming the detail", "Deleting facts only"],
            ["Facts in one language", "A Hindi or Hinglish call otherwise becomes Hindi facts an English question can't find; one extra model call, only for chats that need it", "Facts in the chat's own language"],
            ["Recall gives up after 2.5 s", "A voice greeting can't wait; the agent answers without memory instead", "Waiting for recall"],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <SubHeading id="test-set">The test set</SubHeading>
        <Prose>
          <p>
            80 questions over two example products, a hotel guest assistant and an HR assistant, of six types: recall, connect,
            time, update, forget and abstain. Plus 16 poisoning and privacy attacks. All data is synthetic. The answer model, prompts
            and judge stay fixed across runs; only the memory changes.
          </p>
        </Prose>

        <SubHeading id="main-test">Main test</SubHeading>
        <DataTable stack numeric={[1, 2]} columns={["Memory", "Score /80", "Memory tokens per question"]} rows={MAIN_ROWS} />
        <Prose>
          <p>
            By type (0.6.2, run 1): recall 12/16, connect 7/14, time 10/14, update 13/14, forget 9/10, abstain 12/12. Cost per
            question: $0.00027 against $0.00071 for the full history. Zep&apos;s extraction varies between loads, so scores move by
            a few points from run to run.
          </p>
        </Prose>

        <SubHeading id="attacks">Attacks</SubHeading>
        <Prose>
          <p>
            16 attacks, each user with their own memory: the module handled 12, with 0 leaks of private details (full history 13,
            Zep 12, Mem0 12). Of the 4 misses, two were &ldquo;I don&apos;t know&rdquo; answers to business facts, and two were
            wording, such as &ldquo;the pool will be open&rdquo; without checking.
          </p>
        </Prose>

        <SubHeading id="long-chats">Long chats</SubHeading>
        <Prose>
          <p>
            About 30k tokens of history per user (module 0.5.1, hotel): 22/40 against 32/40 for the full history, with about 300
            tokens of memory per question against 28,500. General chit-chat becomes facts and pushes personal ones out of the 10
            facts recall returns. A re-run on 0.6.2 stopped at about 70% of the loading when Zep&apos;s rate limit started.
          </p>
        </Prose>

        <SubHeading id="hotel">In the hotel agent</SubHeading>
        <DataTable
          stack
          columns={["Test", "Memory on", "Memory off"]}
          rows={[
            ["Week 3, 5 returning guests: greeted by name", "5/5", "0/5"],
            ["Week 3: usual room without asking", "5/5", "1/5"],
            ["Week 3: lookup before the greeting", "0.3–0.4 s", "–"],
            ["Week 4, 5 of 10 guests finished: right room", "4/4", "Asked all 4 again"],
            ["Week 4: forgotten allergy mentioned", "Never", "–"],
            ["Week 4: lookup before the greeting", "1.1–1.5 s, under Zep's rate limit", "–"],
          ]}
        />
        <Prose>
          <p>
            Forget, live: a Hinglish forget request through the hotel agent&apos;s memory code left no allergy fact in 5 of 5 runs
            (16 Nov). Hindi check (10 Nov): with <Code>language=&quot;English&quot;</Code>, all 19 facts were English, and card,
            Aadhaar, passport and CVV numbers were cut in every language. Saving a call costs about $0.0005.
          </p>
        </Prose>
      </Section>

      <Section id="limits" title="Limits and risks">
        <BulletList>
          <li>On short histories it scores below the full chat history (62.5 against 66); the full history costs more and doesn&apos;t scale to long ones.</li>
          <li>On long histories, chit-chat turned into facts crowds personal facts out of the 10 that recall returns.</li>
          <li>Zep&apos;s extraction varies between loads, so scores move by a few points run to run.</li>
          <li>From 17–18 Nov this Zep account allowed 5 requests a minute. Lookups then passed the 2.5 s cut-off and the agent answered without memory; the long-chat re-run and half of the Week 4 hotel test couldn&apos;t finish. Every saved call also uses the quota.</li>
          <li>Two paid services: Zep Cloud and OpenAI.</li>
          <li>Lessons for every user exist in the module but weren&apos;t tested in the hotel agent.</li>
        </BulletList>
        <Callout kind="limit" title="Synthetic guests only">
          <p>The hotel results come from made-up guests on test calls. Measure again with the rate limit lifted before real callers.</p>
        </Callout>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>Needs Python 3.10+ and two variables: <Code>ZEP_API_KEY</Code> (Zep Cloud) and <Code>OPENAI_API_KEY</Code> (the screen).</p>
        </Prose>
        <BulletList ordered>
          <li>
            Install from GitHub, no clone needed:{" "}
            <Code>pip install &quot;agent-memory @ git+https://github.com/logicielsolutions/ai-assets-library@main#subdirectory=modules/agent-memory&quot;</Code>
          </li>
          <li>Set the two variables in the environment.</li>
          <li>
            Run <Code>examples/quickstart.py</Code> from the module folder: remember, recall and forget for one user in a throwaway
            namespace, for under a cent.
          </li>
          <li>Unit tests, with a stub model and a fake Zep, need no keys: <Code>python -m pytest tests</Code>.</li>
        </BulletList>
      </Section>

      <Section id="next" title="Open questions and next steps">
        <BulletList>
          <li>Lift the Zep rate limit, or measure on a paid plan, before real callers.</li>
          <li>A write rule that skips general questions with no personal detail, for long chats.</li>
          <li>Test lessons for every user in the hotel agent.</li>
          <li>
            One memory across Claude Code, Codex, always-on agents and Slack. About 60 memory issues were filed against Claude Code
            and Codex from Sep to Nov 2026 (loaded but not applied, lost after compaction, a one-off turned into a permanent rule,
            wanting one memory across tools). The plumbing to share memory exists in many tools; the open problem is governance:
            stale facts, contradictions, poisoning across agents and provenance. Our take: worth solving, with this module&apos;s
            write rules, dates and sources as that governance layer; building it comes after this pilot.
          </li>
        </BulletList>
      </Section>
    </>
  );
}
