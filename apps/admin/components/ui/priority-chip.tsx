const priorityStyles: Record<string, { bg: string; color: string }> = {
  High: { bg: "#fef3f2", color: "#dc2626" },
  Medium: { bg: "#fffaeb", color: "#d97706" },
  Low: { bg: "#f4f4f5", color: "#71717a" },
};

export function PriorityChip({ priority }: { priority: string }) {
  const style = priorityStyles[priority] || priorityStyles.Low;
  return (
    <span
      style={{
        fontSize: "10.5px",
        fontWeight: 600,
        padding: "1px 7px",
        borderRadius: "20px",
        background: style.bg,
        color: style.color,
      }}
    >
      {priority}
    </span>
  );
}
