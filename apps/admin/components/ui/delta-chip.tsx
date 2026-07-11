export function DeltaChip({
  delta,
  up,
  type,
}: {
  delta: string;
  up?: boolean;
  type?: "info";
}) {
  const bg =
    type === "info"
      ? "var(--c-chip-info-bg)"
      : up
        ? "var(--c-chip-success-bg)"
        : "var(--c-chip-error-bg)";
  const color =
    type === "info"
      ? "var(--c-chip-info-text)"
      : up
        ? "var(--c-chip-success-text)"
        : "var(--c-chip-error-text)";

  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: "20px",
        background: bg,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {delta}
    </span>
  );
}
