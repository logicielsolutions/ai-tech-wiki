import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, KeyNumber, KeyNumbers, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";

const SNIPPET = `# src/train.py: the whole LoRA vs QLoRA experiment is this one flag
LORA_R, LORA_ALPHA, LORA_DROPOUT = 16, 32, 0          # α = 2r
TARGET_MODULES = ["q_proj", "k_proj", "v_proj", "o_proj",
                  "gate_proj", "up_proj", "down_proj"]   # all 7 linear layers

model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/Llama-3.2-3B-Instruct",
    revision=MODEL_REVISION,        # pinned repo snapshot
    use_exact_model_name=True,      # QLoRA quantizes the SAME fp16 weights on the fly,
                                    # not a separately built 4-bit repo
    max_seq_length=1024,
    dtype=None,                     # fp16 on a T4 (no bf16)
    load_in_4bit=load_in_4bit,      # False = LoRA, True = QLoRA (NF4)
)
model = FastLanguageModel.get_peft_model(
    model,
    r=LORA_R, lora_alpha=LORA_ALPHA, lora_dropout=LORA_DROPOUT, bias="none",
    target_modules=TARGET_MODULES,
    use_gradient_checkpointing="unsloth", random_state=3407,
)`;

function PipelineDiagram() {
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
  const line = (d: string) => <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <svg
      viewBox="0 0 800 330"
      className="h-auto w-full min-w-[640px]"
      role="img"
      aria-label="Pipeline. Data builders produce the easy, hard and BIRD sets; a leak check gates them. train.py trains two arms on Colab that differ only in load_in_4bit. A frozen evaluation harness scores base, LoRA, QLoRA and merged models by executing SQL. merge_export.py produces a merged 16-bit model and a GGUF file; serve.py guards generated SQL."
    >
      {box(20, 20, 170, "src.data", "easy: sql-create-context")}
      {box(20, 90, 170, "src.hardset", "hard: Gretel synthetic")}
      {box(20, 160, 170, "src.birdset", "BIRD Mini-Dev (eval)")}
      {box(230, 90, 140, "src.leakcheck", "train ∩ test gate")}
      {line("M190 47C210 47 210 117 230 117")}
      {line("M190 117H230")}
      {line("M190 187C210 187 210 117 230 117")}
      {box(410, 30, 170, "train.py", "load_in_4bit=False", true)}
      {box(410, 110, 170, "train.py", "load_in_4bit=True", true)}
      {line("M370 117C390 117 390 57 410 57")}
      {line("M370 117C390 117 390 137 410 137")}
      {box(620, 70, 160, "src.evaluate", "frozen harness")}
      {line("M580 57C600 57 600 97 620 97")}
      {line("M580 137C600 137 600 97 620 97")}
      {box(410, 210, 170, "merge_export.py", "merged 16-bit · GGUF")}
      {line("M495 164V210")}
      {box(620, 210, 160, "serve.py", "SQL safety gate")}
      {line("M580 237H620")}
      {line("M700 124V160C700 180 660 180 600 180C560 180 560 196 540 210")}
      <text x={20} y={262} fontSize={12} fill="var(--color-muted)">
        evaluate scores: exec match on populated SQLite,
      </text>
      <text x={20} y={280} fontSize={12} fill="var(--color-muted)">
        exact match (sqlglot-normalised), valid %, format %,
      </text>
      <text x={20} y={298} fontSize={12} fill="var(--color-muted)">
        gold ceiling, Wilson CI, McNemar exact + bootstrap
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
          { id: "mechanism", title: "Core mechanism" },
          { id: "decisions", title: "Key decisions and trade-offs" },
          {
            id: "evaluation",
            title: "Evaluation",
            children: [
              { id: "sql", title: "LoRA vs QLoRA: text-to-SQL (Llama-3.2-3B)" },
              { id: "voice", title: "LoRA vs QLoRA: character voice (Llama-3.2-1B)" },
              { id: "full", title: "Full fine-tuning" },
              { id: "failures", title: "Failure modes" },
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
            ["What", "Full fine-tuning vs LoRA vs QLoRA, measured on five jobs plus a merging study, 20 Jul – 21 Aug 2026. Scope: how much of the model trains, not the objective (no DPO/GRPO here)"],
            ["Core study", <span key="c">Text-to-SQL, <Code>unsloth/Llama-3.2-3B-Instruct</Code> (revision pinned), LoRA vs QLoRA as a one-flag A/B</span>],
            ["Other studies", "Llama-3.2-1B character voice (LoRA vs QLoRA); BERT / RoBERTa / Twitter-RoBERTa on TweetEval (full); FunctionGemma-270M full vs Gemma-3-1B LoRA (Mac actions); ModernBERT-base (full, spam); roberta-base ×7 (full, GLUE merging)"],
            ["Stack", <span key="s">Unsloth, TRL <Code>SFTTrainer</Code>, PEFT 0.19.1, bitsandbytes 0.49.2, transformers 5.5.0, torch 2.11.0+cu128; Hugging Face <Code>Trainer</Code> for the encoders</span>],
            ["Hardware", "Free-tier Colab Tesla T4 (fp16, no bf16) for SQL, character voice and sentiment; BIRD scored on a laptop CPU"],
            ["Status", "Experiment. Nothing from these runs is deployed"],
            ["Owner", "Gurjeet Singh Saini, AI Practice"],
            ["Source", <span key="src">the <Code>fine-tuning</Code> and <Code>finetuning-sprint</Code> repos (internal, local only, no remotes; ask the AI Practice for access)</span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="The text-to-SQL study. The two training arms are identical except for load_in_4bit; everything downstream is shared.">
          <PipelineDiagram />
        </Figure>
        <Prose>
          <p>
            Data: about 20k blended training rows. Easy: <Code>b-mc2/sql-create-context</Code> → 10k train / 500 val / 1k test,
            the test set stratified 200 per bucket (simple, aggregate, group_by, join, nested). Hard:{" "}
            <Code>gretelai/synthetic_text_to_sql</Code> → 10k train / 500 val / 200 test (window functions, joins, subqueries,
            set operations), kept only where the gold query executes (all but one of the 200 hard questions). External: BIRD Mini-Dev, 500 questions over 11 real
            SQLite databases. Forgetting: 500 MMLU questions. The SQL dataset revisions are pinned; the MMLU slice is not.
          </p>
          <p>
            Training ran in Colab from a bundled copy of the repo (<Code>bundle_for_colab.sh</Code> →{" "}
            <Code>notebooks/02a_train.ipynb</Code>), restarting the runtime between arms. Scoring used{" "}
            <Code>02b_evaluate.ipynb</Code> and <Code>src.evaluate</Code>, frozen before training; BIRD predictions were
            generated on Colab and executed locally against the real databases.
          </p>
        </Prose>
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <Prose>
          <p>
            <strong>LoRA</strong> freezes each target weight matrix <Code>W</Code> and learns a low-rank update:{" "}
            <Code>W + (α/r)·B·A</Code>, with <Code>A</Code> of shape r × k and <Code>B</Code> d × r, <Code>B</Code> initialised
            to zero so training starts from the base model. Only <Code>A</Code> and <Code>B</Code> get gradients and optimizer
            state. <strong>QLoRA</strong> stores the frozen base in 4-bit NF4 (bitsandbytes), dequantises it on the fly for each
            matmul and keeps the adapters in 16-bit. <strong>Full fine-tuning</strong> updates every weight, so gradients and
            optimizer state scale with the whole model. That is affordable for 110–270M-parameter models on one GPU.
          </p>
          <p>
            An adapter is not a model until it is merged or served next to its exact base. Merging the SQL adapter into a 16-bit
            model scored 77.9% against QLoRA&apos;s 77.8% (p = 1.0), so the merge doesn&apos;t drift.
          </p>
        </Prose>
        <DataTable
          caption="Text-to-SQL config, identical for both arms (src/train.py)"
          columns={["Setting", "Value"]}
          rows={[
            ["Rank / alpha / dropout", "r = 16, α = 32 (α = 2r), 0"],
            ["Target modules", <span key="t">all 7 linear: <Code>q_proj k_proj v_proj o_proj gate_proj up_proj down_proj</Code></span>],
            ["Learning rate / schedule", "2e-4, cosine, warmup 0.03"],
            ["Optimizer / weight decay", <span key="o"><Code>adamw_8bit</Code>, 0.01</span>],
            ["Batch", "4 × grad-accum 4 = 16"],
            ["Epochs / steps", "1 epoch, about 1,250 steps"],
            ["Sequence length", "1024 (longest observed prompt 326 tokens)"],
            ["Loss", <span key="l">completion-only (<Code>train_on_responses_only</Code>)</span>],
            ["Gradient checkpointing / seed", <span key="g"><Code>&quot;unsloth&quot;</Code> / 3407</span>],
          ]}
        />
        <CodeBlock title="The one flag: src/train.py (trimmed)" code={SNIPPET} />
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Reason", "Rejected"]}
          rows={[
            ["One-flag A/B: arms differ only in load_in_4bit, both from byte-identical fp16 weights", "Any other difference would confound the LoRA vs QLoRA comparison", "A separate pre-quantised 4-bit repo; a different base model per arm (e.g. Qwen2.5-Coder, which also had licence concerns)"],
            ["Llama-3.2-3B as the base", "Its weak SQL baseline was chosen on purpose to give a clear before/after, so part of the gain is a baseline effect", "Phi-3.5-mini-instruct (stronger start, smaller gain; expected from the literature, not run)"],
            ["Text-to-SQL as the task", "Canonical Unsloth example, the base model fails visibly, scoring is deterministic", "Function calling, SQuAD2 abstention, PII redaction, Hindi intent, Hinglish TOP, DialogSum, En→Hi translation"],
            ["Execution match as the headline metric", "String match hides correct queries: base 26.5% exact vs 51.6% exec", "Exact match only"],
            ["All 7 linear projections, α = 2r, r = 16", "Attention-only leaves the MLP frozen; r = 16 was enough here", "Attention-only targets; a rank or epoch sweep (kept simple)"],
            ["Completion-only loss", "Gradient only on the SQL, not on the schema and question", "Loss on the whole prompt"],
            ["BIRD as an external test, plus a 3-shot hosted commercial model (gpt-4o-mini, a deliberately weak floor, not a frontier model)", "Held-out is not out-of-distribution; only unseen databases test generalisation", "Reporting the in-distribution sets alone"],
            ["Full fine-tuning for the small encoders (BERT, RoBERTa, ModernBERT)", "110–150M parameters train whole on one GPU, so LoRA's memory saving isn't needed", "LoRA on the encoders"],
            ["Full fine-tunes for the merging study", "Low-rank updates would confound what merging loses (model-merging PLAN.md)", "LoRA fine-tunes"],
            ["Three review rounds of the harness before trusting any number", "Bad gold and harness bugs cap or inflate scores", "Trusting the first run"],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <KeyNumbers>
          <KeyNumber value="+26.2 pp" label="QLoRA exec gain in-domain, p < 0.001" />
          <KeyNumber value="p = 0.47" label="QLoRA vs LoRA in-domain: noise" />
          <KeyNumber value="−58%" label="Peak allocated VRAM, QLoRA vs LoRA" />
          <KeyNumber value="−7.8 pp" label="QLoRA on BIRD vs base, p < 0.0001" />
        </KeyNumbers>

        <SubHeading id="sql">LoRA vs QLoRA: text-to-SQL (Llama-3.2-3B)</SubHeading>
        <Prose>
          <p>
            Greedy decoding at temperature 0. Exec = same result rows as the gold query on a populated SQLite database. 95%
            Wilson CIs; paired McNemar exact and bootstrap against base. Ceiling = share of gold queries that execute.
          </p>
        </Prose>
        <DataTable
          columns={["Test set", "n", "Base", "LoRA", "QLoRA", "Hosted, 3-shot", "Ceiling"]}
          numeric={[1, 2, 3, 4, 5, 6]}
          rows={[
            ["Easy, in-domain (exec)", "1000", "51.6%", "77.2%", "77.8%", "–", "95.6%"],
            ["Easy, in-domain (exact)", "1000", "26.5%", "60.8%", "61.2%", "–", "–"],
            ["Hard, in-distribution (exec)", "200", "24.5%", "50.0%", "48.0%", "–", "99.5%"],
            ["BIRD Mini-Dev, unseen DBs (exec)", "500", "23.8%", "17.0%", "16.0%", "41.6%", "99.6%"],
            ["MMLU (forgetting)", "500", "57.8%", "57.8%", "56.4%", "–", "–"],
          ]}
        />
        <DataTable
          caption="Paired tests on exec accuracy (diff = A − B)"
          columns={["Comparison", "Diff", "95% CI", "McNemar p"]}
          numeric={[1, 2, 3]}
          rows={[
            ["Easy: LoRA vs base", "+25.6", "[+22.7, +28.6]", "< 0.001"],
            ["Easy: QLoRA vs base", "+26.2", "[+23.2, +29.2]", "< 0.001"],
            ["Easy: QLoRA vs LoRA", "+0.6", "[−0.7, +1.9]", "0.47"],
            ["Easy: merged 16-bit vs QLoRA", "+0.1", "[−1.1, +1.4]", "1.0"],
            ["Hard: LoRA vs base", "+25.5", "[+18.0, +33.0]", "< 0.001"],
            ["Hard: QLoRA vs base", "+23.5", "[+16.5, +31.0]", "< 0.001"],
            ["BIRD: LoRA vs base", "−6.8", "[−10.6, −3.2]", "0.0007"],
            ["BIRD: QLoRA vs base", "−7.8", "[−11.6, −4.2]", "< 0.0001"],
          ]}
        />
        <DataTable
          caption="Training on one Tesla T4, 1 epoch"
          columns={["Arm", "Peak VRAM alloc", "Peak VRAM reserved", "Wall clock", "Tokens/s", "Final eval loss"]}
          numeric={[1, 2, 3, 4, 5]}
          rows={[
            ["LoRA", "8.48 GB", "13.38 GB", "6,919.5 s", "558.7", "0.1657"],
            ["QLoRA", "3.56 GB", "8.37 GB", "6,954.0 s", "556.0", "0.1673"],
          ]}
        />
        <DataTable
          caption="Exec accuracy per bucket"
          columns={["Set / bucket", "n", "Base", "LoRA", "QLoRA"]}
          numeric={[1, 2, 3, 4]}
          rows={[
            ["Easy / simple", "200", "86.5%", "93.5%", "94.5%"],
            ["Easy / aggregate", "200", "20.0%", "85.0%", "86.0%"],
            ["Easy / group_by", "200", "68.0%", "76.5%", "77.5%"],
            ["Easy / join", "200", "42.5%", "69.5%", "71.5%"],
            ["Easy / nested", "200", "41.0%", "61.5%", "59.5%"],
            ["Hard / window functions", "41", "0.0%", "36.6%", "26.8%"],
            ["Hard / set operations", "34", "11.8%", "38.2%", "32.4%"],
            ["Hard / multiple joins", "43", "30.2%", "55.8%", "55.8%"],
            ["BIRD / simple", "148", "35.8%", "31.8%", "27.0%"],
            ["BIRD / moderate", "250", "24.4%", "12.0%", "13.6%"],
            ["BIRD / challenging", "102", "4.9%", "7.8%", "5.9%"],
          ]}
        />

        <SubHeading id="voice">LoRA vs QLoRA: character voice (Llama-3.2-1B)</SubHeading>
        <Prose>
          <p>
            r = 16, α = 16, 300 steps, LR 2e-4, batch 2 × 4, on a T4. No ground truth exists for a voice, so quality was judged by
            a separate LLM, blind and position-swapped, over 12 probes asked with and without the system prompt.
          </p>
        </Prose>
        <DataTable
          columns={["Arm", "Peak VRAM alloc", "Peak VRAM reserved", "Wall clock", "Blind pairwise wins"]}
          numeric={[1, 2, 3, 4]}
          rows={[
            ["LoRA", "2.97 GB", "6.13 GB", "380.5 s", "13 / 24"],
            ["QLoRA", "1.73 GB", "4.88 GB", "438.4 s", "11 / 24"],
          ]}
        />

        <SubHeading id="full">Full fine-tuning</SubHeading>
        <DataTable
          stack
          columns={["Job", "Model", "Method", "Result", "Training"]}
          rows={[
            ["Tweet sentiment, TweetEval 3-class, test n = 12,284", "bert-base-uncased (109M)", "Full, 3 epochs, LR 2e-5, batch 32, len 128", "Macro-F1 69.17 (acc 69.31); prompted via the MLM head with no training: 16.7 (below chance: it labels almost everything positive)", "T4, 1,648.9 s, 3.85 GB"],
            ["Same", "roberta-base (125M)", "Full, same recipe", "Macro-F1 71.23", "T4, 1,545.9 s, 3.49 GB"],
            ["Same", "twitter-roberta-base (125M)", "Full, same recipe", "Macro-F1 71.89; vs roberta-base McNemar p = 0.096 (not significant)", "T4, 1,551.2 s, 3.49 GB"],
            ["Mac actions, 106 hand-written golden commands, 56 tools", "FunctionGemma-270M", "Full, 2 epochs, LR 5e-5", "Tool name 91.5%, exact call 82.1%; 2,026 ms/command (laptop, MPS)", "Not recorded"],
            ["Same", "Gemma-3-1B-it", "LoRA r = 16, α = 32, merged, 1 epoch, LR 1e-4", "Tool name 79.2%, exact call 67.9%; 6,779 ms/command", "Not recorded"],
            ["Spam vs ham, public corpora", "ModernBERT-base (149M), v5", "Full, two-stage, 2 epochs", "In-set test F1 0.991; held-out corpus: 79.5% caught at 0.19% false positives (threshold 0.5); real mailbox: 27% caught (9 of 33 spam), AUC 0.77", "Not recorded"],
            ["7 GLUE tasks", "roberta-base ×7", "Full, LR 2e-5", "Mean acc 0.871; one TIES-merged model 0.682 (78.2% retained), 0.812 after retraining the heads (93.2%)", "Not recorded"],
          ]}
        />

        <SubHeading id="failures">Failure modes</SubHeading>
        <Prose>
          <BulletList>
            <li>
              <strong>BIRD regression.</strong> Both tuned arms fall below base on the simple and moderate bands. The later
              evaluation report breaks the base → QLoRA failures down as logic or wrong rows 205 → 239, schema errors 139 → 115,
              invalid output 16 → 31, and dialect only 10 → 6. Dialect is a small share of failures; the cause of the drop was not
              tested, and overfitting to the training distribution is the likely explanation.
            </li>
            <li>
              <strong>Window functions.</strong> The one bucket with a large LoRA/QLoRA gap: 36.6% vs 26.8% (n = 41, single
              seed).
            </li>
            <li>
              <strong>Mac actions mixes model and method.</strong> The 270M full fine-tune beat the 1B LoRA on 17 commands where
              the 1B was wrong, against 4 the other way (tool name). The base models differ, so this doesn&apos;t isolate the
              method.
            </li>
            <li>
              <strong>Merging needs recalibration.</strong> 69% of the merge loss was head miscalibration, fixed in 7 minutes by
              retraining the heads. Separate LoRA adapters on one frozen base would avoid merging altogether; that is argued in
              the study, not measured.
            </li>
          </BulletList>
        </Prose>
        <Callout kind="limit" title="How far to trust these numbers">
          <p>
            Every run is a single seed. The character-voice judge (one AI model) scored 12 prompts, each asked two ways; the spam real-mailbox check had 33 spam emails.
            Full fine-tuning, LoRA and QLoRA have never been run on the same model (the structured-extraction notebooks for
            Gemma-3-270M are built but not run). The sentiment and character-voice results exist only as Colab exports, not yet
            in a repo (copies sit on the author&apos;s machine). The QLoRA-vs-LoRA score differences on the smaller tests were not separable from noise, so read them as &ldquo;no measurable difference&rdquo;, not &ldquo;identical&rdquo;.
          </p>
        </Callout>
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <BulletList>
            <li><strong>Off-distribution.</strong> A fine-tune is a specialist; test on unseen data before trusting it, and compare against prompting a hosted commercial model.</li>
            <li><strong>Knowledge.</strong> Fine-tuning teaches format, style and task patterns, not facts. Use retrieval for facts.</li>
            <li><strong>Adapter coupling.</strong> An adapter works only with its exact base revision; pin it (the SQL study pins the repo revision).</li>
            <li><strong>T4 limits.</strong> No bf16, so fp16 training. LoRA on the 3B model reserved 13.4 of the T4&apos;s 14.6 GB; QLoRA reserved 8.4 GB, leaving room for longer sequences or a bigger model.</li>
            <li><strong>Unscored artefacts.</strong> The GGUF Q4_K_M export was never scored; serving latency and cost weren&apos;t measured.</li>
            <li><strong>SQL safety.</strong> Generated SQL should run only behind <Code>serve.py</Code>&apos;s safety gate (<Code>--selftest</Code> runs its attack cases).</li>
            <li><strong>Licence.</strong> Llama 3.2 licence terms apply when handing weights to a client (<Code>LICENSES.md</Code>).</li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>
            In <Code>fine-tuning/</Code>: Python with <Code>uv</Code>; training needs a CUDA GPU (a Colab T4 is enough). Build
            the data locally, then train and evaluate on Colab.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["Command", "Does"]}
          rows={[
            [<Code key="1">uv run python -m src.data --drop-unanswerable --stratify-train --test-cap-frac 0.5</Code>, "Easy train/val/test, stratified"],
            [<Code key="2">python -m src.hardset --n 200 --require-executes --out data/hard_test.jsonl</Code>, "Hard test set (plus a --split train call for hard_train/hard_val)"],
            [<Code key="3">python -m src.birdset</Code>, "BIRD Mini-Dev evaluation set"],
            [<Code key="4">python -m src.leakcheck data/train.jsonl data/test.jsonl --max-skeleton-pct 0.5</Code>, "Fail on train/test overlap"],
            [<Code key="5">python -m src.evaluate --gold-ceiling --sanity</Code>, "Check the harness and the gold ceiling before training"],
            [<Code key="6">./bundle_for_colab.sh</Code>, "Bundle the repo for Colab; then notebooks/02a_train.ipynb"],
            [<Code key="7">from src.train import run; run(load_in_4bit=False)</Code>, "LoRA arm; restart the runtime, then True for QLoRA"],
            [<Code key="8">python -m src.evaluate --test data/test.jsonl --compare results/lora_preds.jsonl results/qlora_preds.jsonl</Code>, "Score and compare arms with paired tests"],
            [<Code key="9">python src/merge_export.py --adapter … --gguf</Code>, "Merge to 16-bit and export GGUF"],
          ]}
        />
      </Section>

      <Section id="next" title="Open questions and next steps">
        <Prose>
          <BulletList>
            <li>Run full vs LoRA vs QLoRA on one model: the structured-extraction notebooks (Gemma-3-270M, JSON extraction) are ready.</li>
            <li>Multiple seeds for the LoRA vs QLoRA gap, especially window functions.</li>
            <li>Try DoRA, rsLoRA and LoRA+; serve several adapters on one base.</li>
            <li>Ablate the 50/50 easy/hard blend; add abstention for unanswerable questions.</li>
            <li>Score the GGUF export; measure serving latency.</li>
            <li>Copy the sentiment and character-voice Colab exports into their repos.</li>
          </BulletList>
        </Prose>
      </Section>
    </>
  );
}
