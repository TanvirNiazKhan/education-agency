export const avatarColors = [
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#16a34a",
  "#db2777",
  "#d97706",
  "#6366f1",
  "#0d9488",
  "#e11d48",
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  name,
  color,
  size = 32,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const fontSize = size <= 24 ? "9.5px" : size <= 28 ? "10.5px" : "11.5px";
  return (
    <div
      className="flex items-center justify-center text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        fontSize,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export function InitialsBox({
  initials,
  color,
  size = 34,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  const fontSize = size <= 28 ? "9.5px" : size <= 34 ? "11px" : "17px";
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: size <= 28 ? "7px" : "9px",
        background: color + "18",
        color,
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
