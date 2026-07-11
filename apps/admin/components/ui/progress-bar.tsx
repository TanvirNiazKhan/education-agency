export function getProgressColor(progress: number) {
  if (progress >= 80) return "#16a34a";
  if (progress >= 50) return "#2563eb";
  if (progress >= 25) return "#d97706";
  return "#a1a1aa";
}

export function ProgressBar({
  progress,
  height = 6,
}: {
  progress: number;
  height?: number;
}) {
  return (
    <div
      style={{
        flex: 1,
        height: `${height}px`,
        background: "var(--c-bg-progress-track)",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: getProgressColor(progress),
          borderRadius: "5px",
        }}
      />
    </div>
  );
}
