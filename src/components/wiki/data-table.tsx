import type { ReactNode } from "react";

/** A plain table: hairline rules, tabular numbers, scrolls sideways on narrow screens. */
export function DataTable({
  columns,
  rows,
  caption,
  numeric = [],
}: {
  columns: string[];
  rows: ReactNode[][];
  caption?: string;
  /** Column indexes to right-align as numbers. */
  numeric?: number[];
}) {
  return (
    <div className="overflow-x-auto">
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
}
