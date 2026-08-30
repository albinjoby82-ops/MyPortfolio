import type { Spec } from "@/lib/projects";

/**
 * The bordered key/value panel. Used for "On the bench" on the home page
 * and "The numbers" on a project detail page — the README specifies these
 * as identical construction, so they share one component.
 */
export default function Panel({
  header,
  rows,
  rowGap = 14,
}: {
  header: string;
  rows: readonly Spec[];
  rowGap?: number;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border-2 border-ink">
      <div className="panel-header bg-ink px-4 py-[10px] text-paper">
        {header}
      </div>
      <div
        className="flex flex-col p-[18px] text-[14.5px] text-sub-text"
        style={{ gap: `${rowGap}px` }}
      >
        {rows.map((r) => (
          <div key={r.key} className="flex justify-between gap-4">
            <span className="text-muted">{r.key}</span>
            <span className="text-right font-bold">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
