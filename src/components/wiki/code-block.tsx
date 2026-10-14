/** Code, shown not run. Tech view only. */
export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl bg-surface">
      {title ? (
        <figcaption className="border-b border-rule px-4 py-2 font-mono text-xs text-muted">{title}</figcaption>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/**
 * An inline code token: an API name, env var or path. Long unbroken tokens (file paths, URLs, CLI
 * lines) must be allowed to break mid-token, or they push the page past 375px — see the brand's
 * no-horizontal-scroll rule.
 */
export function Code({ children }: { children: string }) {
  return (
    <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.875em] [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}
