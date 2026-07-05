import { currentUser } from "../lib/mock-data";

const kpis = [
  { label: "Total Students", value: "2,847", delta: "+12.4%", sub: "324 new this month", up: true },
  { label: "Active Applications", value: "1,204", delta: "+8.1%", sub: "across 46 universities", up: true },
  { label: "Pending Review", value: "86", delta: "+23", sub: "18 flagged urgent", up: false },
  { label: "Offer Letters", value: "342", delta: "+18.9%", sub: "112 conditional", up: true },
  { label: "Visa Processing", value: "128", delta: "\u22123.2%", sub: "9 interviews scheduled", up: false },
  { label: "Upcoming Intakes", value: "6", delta: "Sep", sub: "Sep 2026 opens soon", type: "info" as const },
];

const countryData = [
  { name: "Australia", value: 412, color: "#2563eb" },
  { name: "UK", value: 356, color: "#3b82f6" },
  { name: "Canada", value: 298, color: "#60a5fa" },
  { name: "US", value: 214, color: "#93c5fd" },
  { name: "Germany", value: 132, color: "#bfdbfe" },
  { name: "Ireland", value: 96, color: "#dbeafe" },
];
const countryMax = 412;

const intakeData = [
  { name: "Jan", value: 280 },
  { name: "May", value: 190 },
  { name: "Sep", value: 520 },
  { name: "Nov", value: 214 },
];
const intakeMax = 520;

const topUnis = [
  { name: "University of Melbourne", initials: "UM", value: 186, color: "#2563eb" },
  { name: "University of Toronto", initials: "UT", value: 164, color: "#7c3aed" },
  { name: "University College London", initials: "UCL", value: 142, color: "#0891b2" },
  { name: "University of Sydney", initials: "US", value: 118, color: "#ea580c" },
  { name: "TU Munich", initials: "TUM", value: 94, color: "#16a34a" },
];
const uniMax = 186;

const pipelineData = [
  { name: "Lead", value: 480 },
  { name: "Profile Complete", value: 356 },
  { name: "Docs Pending", value: 298 },
  { name: "Ready for Review", value: 214 },
  { name: "Applied", value: 176 },
  { name: "Conditional Offer", value: 132 },
  { name: "Offer Received", value: 98 },
  { name: "Visa", value: 64 },
  { name: "Completed", value: 42 },
];
const pipelineMax = 480;

const activities = [
  { initials: "AK", who: "Arjun Kapoor", action: "moved", target: "to Offer Received", time: "12 minutes ago", color: "#2563eb" },
  { initials: "MC", who: "Mei Chen", action: "uploaded transcript for", target: "Sydney application", time: "38 minutes ago", color: "#7c3aed" },
  { initials: "SY", who: "Sofia Yilmaz", action: "requested changes on", target: "SOP draft", time: "1 hour ago", color: "#ea580c" },
  { initials: "DN", who: "David Nkemelu", action: "submitted application to", target: "UCL", time: "2 hours ago", color: "#0891b2" },
  { initials: "PR", who: "You", action: "assigned", target: "Fatima Al-Sayed to Neha", time: "3 hours ago", color: "#16a34a" },
];

const tasks = [
  { title: "Review Fatima Al-Sayed\u2019s visa documents", priority: "High", due: "Due today", prioColor: "#dc2626", prioBg: "#fef3f2" },
  { title: "Follow up on Melbourne conditional offer", priority: "High", due: "Due today", prioColor: "#dc2626", prioBg: "#fef3f2" },
  { title: "Verify IELTS scores \u2014 3 students", priority: "Medium", due: "Tomorrow", prioColor: "#d97706", prioBg: "#fffaeb" },
  { title: "Prepare Sep intake shortlist for UCL", priority: "Medium", due: "Jul 5", prioColor: "#d97706", prioBg: "#fffaeb" },
  { title: "Update scholarship deadlines for Canada", priority: "Low", due: "Jul 8", prioColor: "#71717a", prioBg: "#f4f4f5" },
];

const messages = [
  { initials: "MC", name: "Mei Chen", preview: "Thank you! When should I expect the offer?", time: "9:42", color: "#7c3aed", unread: true },
  { initials: "AK", name: "Arjun Kapoor", preview: "I\u2019ve uploaded my updated passport scan.", time: "9:10", color: "#2563eb", unread: true },
  { initials: "DN", name: "David Nkemelu", preview: "Is the January intake still open for CS?", time: "Yesterday", color: "#0891b2", unread: false },
  { initials: "SY", name: "Sofia Yilmaz", preview: "Got it, I\u2019ll revise the SOP tonight.", time: "Yesterday", color: "#ea580c", unread: false },
];

function DeltaChip({ delta, up, type }: { delta: string; up?: boolean; type?: "info" }) {
  const bg = type === "info" ? "var(--c-chip-info-bg)" : up ? "var(--c-chip-success-bg)" : "var(--c-chip-error-bg)";
  const color = type === "info" ? "var(--c-chip-info-text)" : up ? "var(--c-chip-success-text)" : "var(--c-chip-error-text)";
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

export default function Dashboard() {
  return (
    <div
      className="px-4 md:px-8 py-5 md:py-[26px] pb-10 md:pb-[60px]"
      style={{
        maxWidth: "1360px",
        margin: "0 auto",
        animation: "fadeUp 0.35s ease",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" style={{ marginBottom: "22px" }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "var(--c-text-1)",
            }}
          >
            Good morning, {currentUser.name.split(" ")[0]}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--c-text-3)" }}>
            Here&apos;s what&apos;s happening across your agency today.
          </p>
        </div>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <div className="flex" style={{ background: "var(--c-bg-surface)", borderRadius: "9px", padding: "3px" }}>
            <button
              style={{
                border: "none",
                background: "var(--c-bg-elevated)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                color: "var(--c-text-1)",
                fontSize: "12.5px",
                fontWeight: 550,
                padding: "5px 12px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              This month
            </button>
            <button
              style={{
                border: "none",
                background: "transparent",
                color: "var(--c-text-3)",
                fontSize: "12.5px",
                fontWeight: 500,
                padding: "5px 12px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              Quarter
            </button>
            <button
              style={{
                border: "none",
                background: "transparent",
                color: "var(--c-text-3)",
                fontSize: "12.5px",
                fontWeight: 500,
                padding: "5px 12px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              Year
            </button>
          </div>
          <button
            className="flex items-center cursor-pointer"
            style={{
              height: "32px",
              gap: "6px",
              padding: "0 12px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "9px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-2)",
              fontSize: "12.5px",
              fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3.5"
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              background: "var(--c-bg-elevated)",
              border: "1px solid var(--c-border)",
              borderRadius: "14px",
              padding: "15px 15px 14px",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--c-text-3)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                {k.label}
              </span>
              <DeltaChip delta={k.delta} up={k.up} type={k.type} />
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--c-text-1)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "6px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5"
      >
        {/* Applications by Country */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
              Applications by Country
            </h3>
            <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>1,204 total</span>
          </div>
          <div className="flex flex-col" style={{ gap: "13px" }}>
            {countryData.map((c) => (
              <div key={c.name} className="flex items-center" style={{ gap: "12px" }}>
                <span style={{ width: "74px", fontSize: "12.5px", color: "var(--c-text-2)", fontWeight: 500, flexShrink: 0 }}>
                  {c.name}
                </span>
                <div style={{ flex: 1, height: "8px", background: "var(--c-bg-bar-track)", borderRadius: "5px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.round((c.value / countryMax) * 100)}%`,
                      height: "100%",
                      background: c.color,
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: "38px",
                    textAlign: "right",
                    fontSize: "12.5px",
                    color: "var(--c-text-1)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications by Intake */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
              Applications by Intake
            </h3>
            <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>2026 cycle</span>
          </div>
          <div
            className="flex items-end justify-around"
            style={{ gap: "16px", height: "172px", paddingTop: "8px" }}
          >
            {intakeData.map((i) => (
              <div
                key={i.name}
                className="flex flex-col items-center"
                style={{ flex: 1, gap: "8px", height: "100%", justifyContent: "flex-end" }}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-1)", fontVariantNumeric: "tabular-nums" }}>
                  {i.value}
                </span>
                <div
                  style={{
                    width: "70%",
                    maxWidth: "46px",
                    height: `${Math.round((i.value / intakeMax) * 140)}px`,
                    background: i.name === "Sep" ? "#2563eb" : "#c7dbff",
                    borderRadius: "7px 7px 4px 4px",
                  }}
                />
                <span style={{ fontSize: "12px", color: "var(--c-text-3)", fontWeight: 500 }}>{i.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Universities */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
              Top Universities
            </h3>
            <span style={{ fontSize: "11.5px", color: "#2563eb", fontWeight: 500, cursor: "pointer" }}>View all</span>
          </div>
          <div className="flex flex-col" style={{ gap: "11px" }}>
            {topUnis.map((u) => (
              <div key={u.name} className="flex items-center" style={{ gap: "11px" }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: u.color + "18",
                    color: u.color,
                    fontSize: "10.5px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {u.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: "var(--c-text-1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.name}
                  </div>
                  <div
                    style={{
                      height: "5px",
                      background: "var(--c-bg-bar-track)",
                      borderRadius: "4px",
                      marginTop: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round((u.value / uniMax) * 100)}%`,
                        height: "100%",
                        background: u.color,
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: "var(--c-text-1)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {u.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Pipeline */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.01em" }}>
              Student Pipeline
            </h3>
            <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>conversion 8.7%</span>
          </div>
          <div className="flex flex-col" style={{ gap: "7px" }}>
            {pipelineData.map((p, idx) => (
              <div key={p.name} className="flex items-center" style={{ gap: "10px" }}>
                <span style={{ width: "118px", fontSize: "11.5px", color: "var(--c-text-2b)", flexShrink: 0 }}>
                  {p.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "16px",
                    background: "var(--c-bg-bar-track)",
                    borderRadius: "5px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(6, Math.round((p.value / pipelineMax) * 100))}%`,
                      height: "100%",
                      background: `hsl(${222 - idx * 4} 83% ${58 + idx * 3}%)`,
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: "32px",
                    textAlign: "right",
                    fontSize: "11.5px",
                    color: "var(--c-text-1)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-3.5"
      >
        {/* Recent Activity */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>
            Recent Activity
          </h3>
          <div className="flex flex-col" style={{ marginTop: "12px" }}>
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex"
                style={{ gap: "11px", padding: "9px 0", borderBottom: "1px solid var(--c-border-light)" }}
              >
                <div
                  className="flex items-center justify-center text-white"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: a.color,
                    fontSize: "10.5px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)", lineHeight: 1.45 }}>
                    <strong style={{ color: "var(--c-text-1)", fontWeight: 600 }}>{a.who}</strong>{" "}
                    {a.action}{" "}
                    <strong style={{ color: "var(--c-text-1)", fontWeight: 600 }}>{a.target}</strong>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "2px" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <div className="flex items-center justify-between">
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>Pending Tasks</h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#d97706",
                background: "#fffaeb",
                padding: "2px 8px",
                borderRadius: "20px",
              }}
            >
              12 open
            </span>
          </div>
          <div className="flex flex-col" style={{ marginTop: "10px" }}>
            {tasks.map((t, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{ gap: "10px", padding: "9px 0", borderBottom: "1px solid var(--c-border-light)" }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "5px",
                    border: "1.7px solid #d4d4d8",
                    marginTop: "1px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-soft)", lineHeight: 1.4 }}>{t.title}</div>
                  <div className="flex items-center" style={{ gap: "7px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        padding: "1px 7px",
                        borderRadius: "20px",
                        background: t.prioBg,
                        color: t.prioColor,
                      }}
                    >
                      {t.priority}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{t.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>
            Recent Messages
          </h3>
          <div className="flex flex-col" style={{ marginTop: "10px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{ gap: "11px", padding: "10px 0", borderBottom: "1px solid var(--c-border-light)" }}
              >
                <div
                  className="flex items-center justify-center text-white"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: m.color,
                    fontSize: "10.5px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between" style={{ gap: "8px" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-1)" }}>{m.name}</span>
                    <span style={{ fontSize: "10.5px", color: "var(--c-text-4)", flexShrink: 0 }}>{m.time}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--c-text-3)",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.preview}
                  </div>
                </div>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: m.unread ? "#2563eb" : "transparent",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
