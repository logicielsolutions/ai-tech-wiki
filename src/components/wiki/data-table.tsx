import type { ReactNode } from "react";

/** A plain table: hairline rules, tabular numbers, scrolls sideways on narrow screens. */
export function DataTable({
  columns,
  rows,
  caption,
  numeric = [],
  stack = false,
}: {
  columns: string[];
  rows: ReactNode[][];
  caption?: string;
  /** Column indexes to right-align as numbers. */
  numeric?: number[];
  /** Below md, show each row as a stacked card instead of a sideways-scrolling table. For wide, wordy tables. */
  stack?: boolean;
}) {
  const table = (
    <div className={`overflow-x-auto ${stack ? "hidden md:block" : ""}`}>
      <table className="w-full border-collapse text-left text-[0.9375rem]">
        {caption ? <caption className="mb-2 text-left text-sm text-muted">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-rule">
            {columns.map((column, i) => (
              <th
                key={i}
                scope="col"
                className={`px-3 py-2 text-sm font-semibold text-muted first:pl-0 ${numeric.includes(i) ? "text-right" : ""}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-rule/60 align-top">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`px-3 py-2.5 first:pl-0 ${numeric.includes(i) ? "text-right font-mono text-[0.875rem]" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (!stack) return table;
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {caption ? <p className="text-sm text-muted">{caption}</p> : null}
        {rows.map((row, r) => (
          <dl key={r} className="flex flex-col gap-2 rounded-[20px] bg-surface px-5 py-4 text-[0.9375rem]">
            {row.map((cell, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <dt className="text-xs font-semibold text-muted">{columns[i]}</dt>
                <dd className={i === 0 ? "font-semibold" : ""}>{cell}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
      {table}
    </>
  );
}
