const statusStyles: Record<string, { color: string; bg: string }> = {
  Open: { color: "#059669", bg: "#ecfdf3" },
  Closing: { color: "#b45309", bg: "#fffaeb" },
  Draft: { color: "#a1a1aa", bg: "#f4f4f5" },
  Closed: { color: "#dc2626", bg: "#fef3f2" },
  Lead: { color: "#52525b", bg: "#f4f4f5" },
  "Profile Complete": { color: "#2563eb", bg: "#eef4ff" },
  "Documents Pending": { color: "#b45309", bg: "#fffaeb" },
  "Ready for Review": { color: "#7c3aed", bg: "#f3e8ff" },
  Applied: { color: "#0369a1", bg: "#e0f2fe" },
  "Conditional Offer": { color: "#a16207", bg: "#fef9c3" },
  "Offer Received": { color: "#15803d", bg: "#dcfce7" },
  Visa: { color: "#c2410c", bg: "#ffedd5" },
  Completed: { color: "#059669", bg: "#ecfdf3" },
};

const defaultStyle = { color: "#52525b", bg: "#f4f4f5" };

export function StatusChip({ status }: { status: string }) {
  const style = statusStyles[status] || defaultStyle;
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: style.color,
        background: style.bg,
        padding: "2px 8px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
