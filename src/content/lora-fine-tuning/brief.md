# A lens, not a new camera

Brief for the LoRA fine-tuning entry (14 Oct 2026). Every fact cites a source file; judgement calls carry `(asked: 14 Oct 2026)`. Path prefixes: `FT/` = `~/Documents/Logiciel-Projects/fine-tuning`, `SPRINT/` = `~/Documents/Logiciel-Projects/finetuning-sprint`, `DL/` = Colab result exports in `~/Downloads` (not yet copied into a repo). Numbers come from raw result files (json/csv/jsonl), not prose; where a doc disagrees, the raw file wins. Known doc errors: `SPRINT/FINE_TUNING_LEARNINGS.md` swaps the LoRA and QLoRA rows for the SQL study (exec accuracy and eval loss); `FT/fine-tuning/sentiment/sentiment-BERT-v1/README.md` and `04-Sentiment-Classification.md` still say "expected ~69–71" where 69.17 was measured.

## Identity
- Slug: lora-fine-tuning
- Title: A lens, not a new camera (asked: 14 Oct 2026)
- One-line pitch: You don't rebuild the camera. You clip on a lens for the one shot you need. (77 chars, Luna-style "doesn't X. It Y.") (asked: 14 Oct 2026)
- Tags: llms, evals, plus a new tag `fine-tuning` added to `TAGS` (none of the existing six cover it). Proposed in the outline
- Status: experiment (source: AI-POD sprint work, `FT/plan.md` §1; nothing deployed for a client from these runs)
- Owner: Gurjeet Singh Saini (source: `FT/plan.md`; all commits by Gurjeet Singh). Wiki owner Kumar Gaurav
- Scope (asked: 14 Oct 2026): the whole fine-tuning program, but only the **how much you train** axis: full fine-tuning vs LoRA vs QLoRA, with real measured results. Post-training (DPO, GRPO/RLVR), distillation, speculative decoding, abliteration and unrun notebooks stay out
- Source: `FT/` (text-to-SQL LoRA vs QLoRA; sentiment BERT/RoBERTa full fine-tunes), `SPRINT/persona` (LoRA vs QLoRA), `SPRINT/finetuning-real-usecases/mac-actions` (full vs LoRA), `SPRINT/finetuning-real-usecases/spam-detection` (ModernBERT full), `SPRINT/model-merging` (roberta-base full ×7), `SPRINT/FINE_TUNING_PRINCIPLES.md`
- Last updated: 14 Oct 2026; source work 20 Jul – 21 Aug 2026

## Readers
- Non-tech reader: leadership and managers at Logiciel (asked: 14 Oct 2026)
- What they should be able to say after the explainer: (1) you can teach an existing AI one narrow job without rebuilding it, by training a small add-on (LoRA); (2) the compressed version (QLoRA) did the same job just as well with less than half the memory, on a free cloud graphics card; (3) small models can simply be retrained whole (full fine-tuning), and for one narrow job a small, fully trained model beat a bigger one with an add-on; (4) a trained specialist gets worse outside its job, and a big hosted model can beat it there, so fine-tune for narrow, repeated jobs and test it on unfamiliar cases first
- Engineer: a Logiciel AI engineer deciding whether and how to fine-tune for a client task
- What they should be able to decide: prompt a big hosted model vs fine-tune; full vs LoRA vs QLoRA by model size, memory and quality; a starting config; how to build an evaluation they can trust

## The idea
- Problem, as a situation: a general AI model is fair at many things but sloppy at the one repeated job a business needs (e.g. turning a plain-English question into a database query: the base model got about half right). Training a whole large model is costly in memory and hardware; you want it good at that one job cheaply (source: `FT/tune.md` §3; `FT/results/base.json` 516/1000)
- How it works (source: `FT/src/train.py`, `FT/src/evaluate.py`, `SPRINT/FINE_TUNING_PRINCIPLES.md`):
  1. Keep the camera: start from an existing open model and freeze it; its own settings never change
  2. Clip on a lens (LoRA): a small add-on attached to every layer learns the job; only the add-on trains
  3. Same lens on a compact camera (QLoRA): store the frozen model compressed (4-bit) to save memory; the lens is the same
  4. Or rebuild the camera (full fine-tuning): every part of the model learns; affordable when the model is small (110–270 million parts)
  5. Practise on worked examples, then test on ones it never saw, and on unfamiliar ones
  6. Ship: merge the lens into the camera as one file, or keep one camera with several lenses
- Visual metaphor (asked: 14 Oct 2026): a camera and a clip-on lens. The base model is a camera you don't rebuild; LoRA is a small clip-on lens for one kind of shot (accent object); QLoRA is the same lens on a compact camera; full fine-tuning is opening the camera up and rebuilding it; a big hosted model is a rented studio camera; off-subject shots (unfamiliar data) come out worse with the specialist lens
- Worked example: the database-questions study, end to end (familiar → harder → unfamiliar → general knowledge), then the other jobs as a picker
- Interactive figure (asked: 14 Oct 2026): yes, a method + test picker on measured numbers baked into the page, labelled as our measured results, no API call. Pick a job (database questions, tweet mood, Mac commands, character voice); for database questions also pick a test (familiar, harder, unfamiliar real databases, general knowledge). Bars per method (untrained, full, LoRA, QLoRA) with a reference line for the rented studio camera where measured; memory and time underneath; "not run" where no result exists
- The one code snippet: the LoRA config in `FT/src/train.py` (`FastLanguageModel.from_pretrained(..., load_in_4bit=...)` + `get_peft_model(r=16, lora_alpha=32, target_modules=[7 projections])`), the one flag that separates LoRA from QLoRA

## The facts
- Stack: Unsloth (`FastLanguageModel`), TRL `SFTTrainer`, PEFT, bitsandbytes for the decoder runs (pins in `FT/results/run_summary.json`, `pip_freeze.txt`: transformers 5.5.0, trl 0.24.0, peft 0.19.1, bitsandbytes 0.49.2, torch 2.11.0+cu128); Hugging Face `Trainer` full fine-tunes for the encoders; free-tier Colab Tesla T4 (fp16, no bf16) for the SQL, persona and sentiment runs
- Measured results:

  **A. LoRA vs QLoRA, same model, same data, one flag (`load_in_4bit`)**
  | Study | Model | Metric | Untrained | LoRA | QLoRA | Source |
  |---|---|---|---|---|---|---|
  | Database questions, familiar (n=1000) | Llama-3.2-3B | exec accuracy | 51.6% | 77.2% | 77.8% | `FT/results/{base,lora,qlora}.json` |
  | Database questions, harder (n=200) | same | exec accuracy | 24.5% | 50.0% | 48.0% | `FT/results/hard_*.json` |
  | Unfamiliar real databases, BIRD Mini-Dev (n=500) | same | exec accuracy | 23.8% | 17.0% | 16.0% | `FT/results/bird_*.json`; large hosted model 3-shot 41.6% (`bird_frontier.json`) |
  | General knowledge, MMLU (n=500) | same | accuracy | 57.8% | 57.8% | 56.4% | `FT/results/mmlu.json` |
  | Training cost (T4) | same | peak VRAM alloc / reserved; time | — | 8.48 / 13.38 GB; 6,919.5 s | 3.56 / 8.37 GB; 6,954.0 s | `FT/results/comparison.csv` |
  | Character voice (12 probes ×2) | Llama-3.2-1B | blind pairwise judge wins | — | 13 of 24 | 11 of 24 | `DL/persona_sprint_results/eval_results/judge_pairwise_qlora_vs_lora.json` |
  | Training cost (T4, 300 steps) | same | peak VRAM alloc / reserved; time | — | 2.97 / 6.13 GB; 380.5 s | 1.73 / 4.88 GB; 438.4 s | `DL/.../lora_16bit_metrics.json`, `qlora_4bit_metrics.json` |
  - SQL: gains p<0.001 in-domain and hard; LoRA vs QLoRA +0.6 pp, p=0.47 (noise); merged 16-bit 77.9% (no merge drift); BIRD drops significant (LoRA −6.8 pp p=0.0007, QLoRA −7.8 pp p<0.0001). Per bucket, untrained → QLoRA: aggregate 20.0 → 86.0, join 42.5 → 71.5, nested 41.0 → 59.5 (`FT/results/run_summary_v1.md`). BIRD: logic errors dominate the drop (wrong rows 205 → 239), not SQL dialect (Fine-Tuning-Evaluation-Report.pdf §3h)
  - Config (SQL): r=16, α=32, dropout 0, 7 linear projections, LR 2e-4 cosine, warmup 0.03, adamw_8bit, batch 4×4, 1 epoch (~1,250 steps), seq 1024, completion-only loss, seed 3407, ~20k rows (`FT/src/train.py`, `FT/MANAGER_RESPONSE.md` §5). Persona: r=16, α=16, 300 steps, LR 2e-4, batch 2×4 (metrics json config)

  **B. Full fine-tuning (every weight trains), smaller encoder and small models**
  | Study | Model | Method | Result | Cost | Source |
  |---|---|---|---|---|---|
  | Tweet mood, 3 classes, TweetEval (test n=12,284) | bert-base-uncased (109M) | full, 3 epochs | macro-F1 16.7 untrained (prompted) → 69.17 | T4, 1,648.9 s, 3.85 GB | `DL/bert_ablation_sentiment.zip` → `results/bert_ablation_sentiment.json`; time/VRAM `FT/sentiment/sentiment-BERT-v1/models-final/.../metrics.json` |
  | same | roberta-base (125M) | full | macro-F1 71.23 | T4, 1,545.9 s, 3.49 GB | `DL/encoder_ablation_sentiment.zip`; recomputed from `FT/sentiment/sentiment-v1/results/predictions_sentiment.csv` |
  | same | twitter-roberta-base (125M, pre-trained on tweets) | full | macro-F1 71.89 (vs roberta-base p=0.096, not significant) | T4, 1,551.2 s, 3.49 GB | same |
  | Mac commands, 106 hand-written golden commands | FunctionGemma-270M | full, 2 epochs | 91.5% right tool, 82.1% exact; 2.0 s/command | — | `SPRINT/.../mac-actions/data/v1/golden_model_a.jsonl` |
  | same | Gemma-3-1B | LoRA r=16 α=32, merged | 79.2% right tool, 67.9% exact; 6.8 s/command | — | `.../golden_model_b.jsonl` |
  | Spam filter, public email collections | ModernBERT-base (149M) | full, 2 epochs, v1–v5 | in-set test F1 0.99; unseen collection catch 79.5% at 0.19% false alarms (v5 @0.5) | — | `SPRINT/.../spam-detection/models/v5/metrics.json` |
  | 7 language tasks (GLUE) | roberta-base ×7 | full | mean 87.1%; one merged model kept 78% (93% after retraining heads) | T4 | `SPRINT/model-merging/results-v2/individual.json`, `healing_report.json` |
  - Mac commands: different base models (purpose-built 270M vs general 1B), so method and model are mixed; the README says so
  - Model merging: the LoRA alternative (one frozen base + one small adapter per task, nothing lost) is argued in `FINDINGS.md`, not measured
- Key decisions (source: `FT/tune.md`, `FT/refinements.md`, `FT/plan.md`, `SPRINT/model-merging/PLAN.md`, mac-actions README):
  - One-flag A/B for LoRA vs QLoRA: everything identical except `load_in_4bit`, both start from byte-identical fp16 weights (`use_exact_model_name=True`). Rejected: a different base model per arm (e.g. Qwen2.5-Coder)
  - Execution accuracy, not string match: untrained scored 26.5% exact but 51.6% exec
  - All 7 linear projections, α = 2r, r=16: attention-only leaves the MLP frozen; no rank sweep (kept simple)
  - Completion-only loss (`train_on_responses_only`)
  - Small encoders (BERT/RoBERTa/ModernBERT, 110–150M) fully fine-tuned: they fit a T4 whole; LoRA's memory saving isn't needed
  - Mac commands: a purpose-built 270M fully trained beat a 1B with LoRA and ran 3× faster
  - Model merging used full fine-tunes on purpose (low-rank would confound the merge study, `PLAN.md`)
  - Three review rounds of the SQL harness before trusting any number (detail off the page, asked: 14 Oct 2026)
- Limits and risks: specialists get worse off-distribution (BIRD); fine-tuning teaches format and style, not facts; single seed everywhere; character-voice judge n=12 probes; Mac commands compares different base models; full vs LoRA vs QLoRA on one model never run (structured-extraction notebooks built, not run); spam real-mailbox catch based on 33 spam emails; some raw results live only in Colab exports; Llama 3.2 licence obligations when handing weights to a client (`FT/LICENSES.md`)
- How to run (SQL study): `uv run python -m src.data --drop-unanswerable --stratify-train --test-cap-frac 0.5`; `python -m src.hardset ...`; `python -m src.birdset`; `python -m src.leakcheck data/train.jsonl data/test.jsonl --max-skeleton-pct 0.5`; `python -m src.evaluate --gold-ceiling --sanity`; Colab `./bundle_for_colab.sh` → `notebooks/02a_train.ipynb` (`run(load_in_4bit=False)` then `True`, restart between arms) → `02b_evaluate.ipynb`; `python -m src.evaluate --test data/test.jsonl --compare results/lora_preds.jsonl results/qlora_preds.jsonl`; `src/merge_export.py --adapter ... --gguf`
- Open questions / next steps (source: `FT/FINDINGS.md`, `SPRINT/FINE_TUNING_ROADMAP.md`): one model, three methods (structured extraction on Gemma 270M: full vs LoRA vs QLoRA, built, not run); multiple seeds; DoRA / rsLoRA / LoRA+; multi-adapter serving; score the GGUF Q4 export; copy the Colab result exports into the repos
- Sources: repo-relative paths (repos are local only, no remotes); external: Unsloth, PEFT, the LoRA (Hu et al. 2021) and QLoRA (Dettmers et al. 2023) papers, BIRD, TweetEval

## Off the page (asked: 14 Oct 2026)
- Internal ₹/$ costs and cost plans: say only "a free cloud graphics card, about 2 hours"
- Review/audit details: say only "three review rounds"
- The hosted model's name: say "a large hosted model"
- By rule: AWS account ID, role ARN, bucket and IAM names; `key.txt`, `.env`; the Confidential Cycle 5 briefing; spam client context, volumes and pricing; personal mailbox data; teammate names in the Mac commands golden set; private dataset names; the judge model's name; the TV character's name (say "a TV character's voice"); Drive paths

## Outline
Cast for every figure: the **camera** (the frozen base model, `fill`), the **clip-on lens** (LoRA, the one accent object), the **compact camera** (QLoRA, a smaller camera body with the same lens), the **open camera** (full fine-tuning, the body with its panel off and parts highlighted), the **studio camera** (the large hosted model, outlined only), **photos** (answers; good = `good` tick), and a **scene** (familiar vs unfamiliar).

### Explainer (reader: leadership and managers)
1. **A lens, not a new camera**: hero: a camera with the accent lens clipped on, photos coming out sharp; the compact camera with the same lens beside it; pitch underneath. Prose: what fine-tuning means in one paragraph, and the three ways we tried it
2. **Why it matters**: "A general AI is fair at everything and sloppy at your one job." Situation: database questions, the untrained model got about half right. Analogy: a good camera with the wrong lens. Figure: the camera's photos half blurry
3. **How it works** (Steps, each with a figure):
   1. Keep the camera: the model stays frozen
   2. Clip on a lens: only the small add-on learns (LoRA)
   3. Same lens, compact camera: compressed model, same add-on, less than half the memory (QLoRA)
   4. Or rebuild a small camera: every part learns (full fine-tuning), affordable for small models
   5. Test on new and unfamiliar shots: familiar, harder, unfamiliar, general knowledge
4. **What we measured** (interactive picker): jobs × methods, bars, memory and time; key numbers above it: "about half → about 8 in 10", "less than half the memory", "2 hours on a free cloud graphics card", "worse on unfamiliar databases"
5. **Which one to pick**: a Compare of three tiles (rebuild / lens / compact + lens) with when each won, from our runs
6. **What it can't do**: off-subject shots get worse (BIRD; the rented studio camera wins there), it teaches style and format, not facts, small tests and one try each, a person checks before any client use
7. **In one breath**
8. **Going deeper**: link to the tech view

### Tech (reader: AI engineers)
0. **On this page**: `PageIndex` at the top, linking At a glance and every section, with the four Evaluation sub-sections (added 14 Oct 2026 with the skill change)
1. **At a glance**: DataTable: what, methods compared, models, stack, hardware, status, owner, sources
2. **Architecture**: diagram: data build → leak check → train (one flag) → frozen eval harness → merge/export → guarded serve; walkthrough
3. **Core mechanism**: LoRA in two sentences (W + BA, rank r, α scaling), QLoRA (NF4 base, double-quant, adapters in 16-bit), full fine-tuning; the config table; the one code snippet
4. **Key decisions and trade-offs**: DataTable decision / reason / rejected
5. **Evaluation**: KeyNumbers; table A (LoRA vs QLoRA: SQL × 4 sets + training cost; persona); table B (full fine-tunes: sentiment ×3, Mac commands, spam, merging); per-bucket SQL; failure modes (BIRD logic errors, window functions); "how far to trust these numbers" callout
6. **Limits and risks**
7. **Run it yourself**: commands table
8. **Open questions and next steps**
9. **Sources**: repo files, Colab exports, papers
