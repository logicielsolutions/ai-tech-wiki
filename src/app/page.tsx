const topics = [
  { title: "LLMs", description: "How large language models work and where they fit." },
  { title: "RAG", description: "Retrieval-augmented generation patterns and trade-offs." },
  { title: "Agents", description: "Tool use, planning loops, and multi-agent setups." },
  { title: "Evals", description: "Measuring model and prompt quality." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">AI Tech Wiki</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A placeholder home for notes on AI tooling and techniques.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li
            key={topic.title}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <h2 className="font-medium">{topic.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {topic.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
