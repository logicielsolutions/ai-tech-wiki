# Memory for AI agents

## Identity
- Slug: agent-memory
- Title (2–5 words, the idea not the repo): Memory for AI agents
- One-line pitch (≤ 90 chars, for a non-tech reader): An assistant that remembers returning customers, forgets on request, and ignores fake rules (asked: 19 Nov 2026)
- Tags (1–3): agents, evals, governance
- Status: pilot (source: module README "Plugged into the hotel voice agent"; tested with synthetic guests only, not with real callers)
- Owner: Manjot Singh (source: AI Team Board AIT-1104, AIT-1113, AIT-1114; 4-week specialisation set by Kumar Gaurav, 26 Oct – 20 Nov 2026)
- Source: the agent-memory module in the team's asset library (logicielsolutions/ai-assets-library, `modules/agent-memory`, tag `agent-memory-v0.6.2`), its README and the specialisation's weekly reports. Pages name and link only the asset library; no other repo is named or linked (asked: 19 Nov 2026)
- Last updated: 19 Nov 2026

## Readers
- Non-tech reader we picture: any colleague, e.g. someone from finance or HR (asked: 19 Nov 2026, "two forms, like the rest of the wiki")
- What they should be able to say after the explainer: "An AI assistant forgets everything between conversations. Memory lets it remember you, but it must be told what not to keep, keep dates so old facts don't win, and actually delete things when you ask. Ours does that on top of a memory service called Zep, and it costs a fraction of a cent per conversation."
- Engineer we picture: someone adding long-term memory to a chat, voice or Slack agent.
- What they should be able to decide after the tech page: whether to use the module, how to plug it in (two hooks), what policy to set, and what it will and won't get right, with numbers.

## The idea
- Problem it solves, as a situation: a guest calls the hotel for the second time. Without memory, the assistant asks their name and room type again. With a naive memory, it might also store their card number, believe a caller who says "checkout is 4 pm for everyone", or keep an allergy the guest asked it to forget (source: Week 1 tests, HANDOFF steps 7 and 9).
- How it works, in 3–6 plain steps (source: module README "What it does", "Write rules"):
  1. After each conversation, a checker reads it before anything is saved: it blacks out card, bank, ID, health and salary details, and drops lines where a user states a rule for everyone.
  2. What's left is saved for that one user, as short dated facts (Zep turns the chat into facts).
  3. Before the next conversation, the assistant looks up the facts that matter for this user, oldest first, and puts them in its instructions.
  4. When a fact changes, the old one is marked "no longer true"; one-off arrangements (a cake on a date) expire after their date.
  5. When the user says "forget that", the facts are deleted and the old chats are stored again without the detail, including reworded copies (fixed in 0.6.2).
- Visual metaphor: a hotel front desk's guest card file. After each call the receptionist writes a guest card; a checker with a black marker strikes out card numbers and crosses out fake "rules for everyone" before the card is filed; each card is dated, and old cards get a "no longer true" stamp; a shredder handles forget requests. Before a guest's next call, the receptionist pulls their cards. The accent goes on the guest card (the memory) (asked: 19 Nov 2026)
- Worked example for "See it in action": the hotel test, memory on vs off. Week 3: 5 returning guests greeted by name 5/5 vs 0/5, usual room picked without asking 5/5 vs 1/5. Week 4: memory used the right room for 4 of 4 clean guests, the off arm asked all 4 again; Rohit's forgotten peanut allergy never came back (source: module README; Week 4 status page 18 Nov).
- Interactive figure? yes: a card-file lab (`card-lab.tsx`). Pick an incoming line ("my card is 4111…", "checkout is 4 pm for everyone", "I'd like a Deluxe room", "please forget my wife's peanut allergy") and see what the checker does: saved, blacked out, dropped, or shredded. Example values only.
- The one code snippet for the tech page: the two hooks (`before_conversation` with the 2.5 s timeout and `after_conversation` in the background), from the README "Plug into any agent", trimmed.

## The facts
- Stack and models: Python 3.10+, package `agent-memory` 0.6.2, one dependency `zep-cloud>=4.0,<5`; Zep Cloud stores the memory; OpenAI gpt-4.1-mini for the write-rule screen, called over plain HTTPS (source: README "Install", pyproject.toml). Env vars: `ZEP_API_KEY`, `OPENAI_API_KEY`.
- Architecture / data flow: conversation → `Screen` (LLM redaction + drop of rule claims, a second yes/no check on every drop, regex backstop) → optional translation to one language → Zep episode per conversation, with (user, conversation, date) as metadata → Zep extracts dated facts → `recall` searches facts for one user, as of a date, oldest first, labels "no longer true" and expired one-offs → the agent's system prompt (source: README).
- Core mechanism: `Memory(owner, namespace, policy, screen, language)`; `remember(user, conversation, messages, date)`, `recall(user, question, as_of)` → facts with `.line()`, `sources(user, fact)`, `trace`, `remove_fact`, `forget_conversation`, `clean_up`, forget handled automatically inside `remember`; `Policy` fields `never_store`, `allowed`, `global_rules`, `one_off`; presets `generic`, `support`, `hotel`, `hr` (source: README "Use", "Fit it to your product").
- Key decisions (decision, reason, rejected alternative):
  - Build on Zep Cloud instead of from scratch: Zep scored highest of the hosted tools in Week 1 (59/80 vs Mem0 58) and keeps dates on facts; local Mem0 and Graphiti were dropped because ingestion ate the laptop (source: HANDOFF steps 6–7).
  - Per-user memory only, not one memory shared by all users: in shared memory Zep blocked 5/16 attacks and Mem0 3/16, because they store an attacker's "for everyone" claim as a fact (source: HANDOFF step 9).
  - Screen before saving instead of filtering at recall: what's never stored can't leak (source: README "Write rules").
  - Allergies and diets are allowed on purpose, illnesses and medicines are not: the kitchen needs allergies (source: Gaurav Q&A, 14 Nov).
  - Forget rewrites the old chats without the detail, instead of only deleting facts: Zep rebuilds facts from chats, and both tools stored the deletion request itself as a fact naming the detail (source: HANDOFF step 7; README "forget").
  - Facts stored in English even for Hindi or Hinglish calls, so an English question finds them (source: README "one language").
  - Lookup gives up after 2.5 s so the greeting is never late (source: README "Plug into any agent").
- Evaluation (source: HANDOFF steps 7, 9, 26; Week 4 status page):
  - Test set: 80 questions over two example products (hotel guest assistant, HR assistant), types recall, connect, time, update, forget, abstain; plus 16 poisoning and privacy attacks; synthetic data.
  - Week 1, /80: no memory 22, plain search 55, Mem0 58, Zep 59, full chat history 66.
  - Module 0.6.2 (17 Nov, fresh load, 2 runs): 63 and 62, mean 62.5. Week 3 (0.5.1): 58.5. By type (run 1): recall 12/16, connect 7/14, time 10/14, update 13/14, forget 9/10, abstain 12/12.
  - Memory per question: module 265–282 tokens, full history 1,320. Cost per question $0.00027 vs $0.00071 (source: Gaurav Q&A 16 Nov).
  - Attacks, per-user: module 12/16, 0 leaks; full history 13, Zep 12, Mem0 12.
  - Long chats (~30k tokens per user, 0.5.1): hotel 22/40 vs full history 32/40; ~300 tokens vs 28,500.
  - Hotel agent, memory on vs off: Week 3, 5 guests, name 5/5 vs 0/5, usual room 5/5 vs 1/5, lookup 0.3–0.4 s. Week 4, 10 guests planned, 5 ran cleanly: right room 4/4 on, 4/4 asked again off, forgotten allergy never mentioned; about $0.0005 per call to save; lookup 1.1–1.5 s under Zep's new limit.
  - Forget: live Hinglish forget through the hotel agent's memory code left no allergy fact in 5 of 5 runs (16 Nov).
  - Hindi check (10 Nov): with `language="English"`, all 19 facts English; card, Aadhaar, passport and CVV numbers cut in every language.
- Cost: about $0.00027 per question answered; about $0.0005 to save one hotel call (source above).
- Limits and risks:
  - Scores sit below full chat history (62.5 vs 66) on short histories; full history costs more and doesn't scale to long ones.
  - Long histories: general chit-chat becomes facts that crowd personal ones out of the 10 recall returns.
  - Zep's extraction varies between loads, so scores move by a few points run to run.
  - 4 attack fails: two "I don't know" answers on business facts, two wording issues (e.g. "the pool will be open" without checking).
  - Zep Cloud rate limit: from 17–18 Nov this account allows 5 requests a minute; lookups then exceed the 2.5 s cutoff and the agent answers without memory. The long-chat re-run and half of the Week 4 hotel test could not finish.
  - Depends on two paid services (Zep, OpenAI).
- How to run it: `pip install "agent-memory @ git+https://github.com/logicielsolutions/ai-assets-library@main#subdirectory=modules/agent-memory"`, set the two env vars, run `examples/quickstart.py` (under a cent) (source: README).
- Open questions / next steps:
  - One memory shared across Claude Code, Codex, always-on agents and Slack (Gaurav, ~6 Nov): about 60 memory issues filed against Claude Code and Codex from Sep to Nov 2026 (loaded but not applied, lost after compaction, one-off turned into a permanent rule, wanting one memory across tools). The plumbing to share memory already exists in many tools; the open problem is governance: stale facts, contradictions, poisoning across agents, provenance. Our take: worth solving, and the module's write rules, dates and sources are that governance layer; building it comes after Week 4 (source: HANDOFF step 23; vision note).
  - Lift the Zep rate limit or measure it on a paid plan before real callers.
  - A write rule that skips general questions with no personal detail (long chats).
  - Lessons for everyone (approved by a person) exist in the module but were not tested in the hotel agent.
- Sources and links (brief only): module README, HANDOFF.md, Week 4 status page (claude.ai artifact 9PpPQzqGnWx3QVTUZ2Gorc), AIT-1104, AIT-1113, AIT-1114.

## Off the page
- Name and link only the asset library (logicielsolutions/ai-assets-library). No other repo: not the test bench, the hotel agent's repo or the Slack safety-net repo (asked: 19 Nov 2026). Never: keys, phone numbers, Zep account or project ids.

## Outline
### Explainer
1. The one-line idea: hero, the front desk card file: a call comes in, a guest card is written, checked, filed, pulled again on the next call.
2. Why it matters: the second call. Without memory the guest repeats everything; with a careless memory it keeps a card number, believes a fake rule, won't forget. Figure: three cards, one each.
3. How it works (steps): (1) the checker blacks out and crosses out before filing; (2) the card is filed per guest, dated; (3) on the next call the receptionist pulls the guest's cards; (4) old cards stamped "no longer true", one-offs expire; (5) the shredder: forget means gone, including reworded copies.
4. See it in action: card-lab (pick a line, see saved / blacked out / dropped / shredded) + key numbers from the hotel test (greeted by name 5/5 vs 0/5; room without asking; about a twentieth of a cent per call).
4b. Our take: should every AI tool share one memory? Tiles: the problem is real (about 60 complaints), sharing is easy, keeping it trustworthy is the hard part, and that's what this module does. Follows the safety-net entry's extra-section precedent.
5. What it can't do: scores a bit below reading the whole history; long histories crowd facts out; a busy memory service can be too slow, then the assistant answers without memory; a person approves rules for everyone.
6. In one breath.
7. Going deeper.
### Tech
0. On this page
1. At a glance: DataTable (package, version, install source, storage, model, env vars, cost, status, owner).
2. Architecture: diagram (conversation → Screen → translate → Zep episode → facts → recall → prompt) + walkthrough.
3. Core mechanism: SubHeadings "Plug into any agent" (the CodeBlock), "API" (DataTable of methods), "Policy" (DataTable of fields and presets), "Write rules", "Forget".
4. Key decisions and trade-offs: DataTable.
5. Evaluation: SubHeadings "The test set", "Main test", "Attacks", "Long chats", "In the hotel agent".
6. Limits and risks.
7. Run it yourself.
8. Open questions and next steps (incl. the shared-memory take).
