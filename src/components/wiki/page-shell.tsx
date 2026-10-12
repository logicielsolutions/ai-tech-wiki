import type { ReactNode } from "react";

/** The page column: 20px gutter on mobile, 48px from md, figures may use the full 60rem. */
export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-[60rem] flex-1 px-5 md:px-12">{children}</main>;
}
