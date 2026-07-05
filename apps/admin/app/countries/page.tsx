const countries = [
  { name: "Australia", c1: "#2563eb", c2: "#60a5fa", students: 412, unis: 14, tuition: "A$46k", visa: "92%", work: "2\u20134 yrs PSW" },
  { name: "United Kingdom", c1: "#7c3aed", c2: "#a78bfa", students: 356, unis: 12, tuition: "\u00a322k", visa: "89%", work: "2 yrs Graduate" },
  { name: "Canada", c1: "#dc2626", c2: "#f87171", students: 298, unis: 11, tuition: "C$34k", visa: "85%", work: "Up to 3 yrs" },
  { name: "United States", c1: "#0891b2", c2: "#22d3ee", students: 214, unis: 9, tuition: "US$41k", visa: "78%", work: "OPT 1\u20133 yrs" },
  { name: "Germany", c1: "#16a34a", c2: "#4ade80", students: 132, unis: 6, tuition: "\u20AC0\u20133k", visa: "94%", work: "18 mo seek" },
  { name: "Ireland", c1: "#ea580c", c2: "#fb923c", students: 96, unis: 5, tuition: "\u20AC18k", visa: "90%", work: "2 yrs stay-back" },
];

export default function CountriesPage() {
  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
          Countries
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>
          Destination markets and their live pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {countries.map((c) => (
          <div
            key={c.name}
            className="cursor-pointer hover:shadow-md"
            style={{
              border: "1px solid var(--c-border)",
              borderRadius: "14px",
              overflow: "hidden",
              transition: "box-shadow 0.15s",
              background: "var(--c-bg-elevated)",
            }}
          >
            {/* Banner */}
            <div style={{ height: "64px", background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }} />

            {/* Content */}
            <div style={{ padding: "15px 17px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.name}</h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--c-chip-info-text)",
                    background: "var(--c-chip-info-bg)",
                    padding: "2px 9px",
                    borderRadius: "20px",
                  }}
                >
                  {c.students} students
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "11px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Universities</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.unis}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Avg tuition</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.tuition}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Visa success</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#16a34a" }}>{c.visa}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Work rights</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-text-2)", marginTop: "2px" }}>{c.work}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
