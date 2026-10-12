export function Tag({ children }: { children: string }) {
  return <span className="rounded-full bg-fill px-2.5 py-0.5 text-xs font-medium text-muted">{children}</span>;
}
