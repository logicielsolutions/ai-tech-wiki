import type { ReactNode } from "react";

type Tile = { title: string; kicker?: string; children: ReactNode };

/** Two to four options side by side (three across from lg); stacks on mobile. For "which one to pick" comparisons. */
export function Tiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.title} className="flex flex-col gap-2 rounded-[20px] bg-surface px-6 py-5">
          {tile.kicker ? <p className="text-sm font-semibold text-accent">{tile.kicker}</p> : null}
          <h3 className="text-[1.0625rem] tracking-[-0.01em]">{tile.title}</h3>
          <div className="flex flex-col gap-3 text-muted">{tile.children}</div>
        </div>
      ))}
    </div>
  );
}
