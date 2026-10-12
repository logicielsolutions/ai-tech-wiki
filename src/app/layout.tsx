import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI Tech Wiki", template: "%s · AI Tech Wiki" },
  description: "AI experiments and projects, explained for everyone and for engineers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <header className="material-bar sticky top-0 z-20 border-b border-rule/70">
          <nav className="mx-auto flex h-12 w-full max-w-[60rem] items-center px-5 md:px-12">
            <Link href="/" className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
              AI Tech Wiki
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
