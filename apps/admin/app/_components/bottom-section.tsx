import { activities, tasks, messages } from "../_data/dashboard";

export function BottomSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
      {/* Recent Activity */}
      <div style={{ background: "var(--c-bg-elevated)", border: "1px solid var(--c-border)", borderRadius: "14px", padding: "18px 20px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>
          Recent Activity
        </h3>
        <div className="flex flex-col" style={{ marginTop: "12px" }}>
          {activities.map((a, i) => (
            <div key={i} className="flex" style={{ gap: "11px", padding: "9px 0", borderBottom: "1px solid var(--c-border-light)" }}>
              <div
                className="flex items-center justify-center text-white"
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: a.color, fontSize: "10.5px", fontWeight: 600, flexShrink: 0 }}
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
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#d97706", background: "#fffaeb", padding: "2px 8px", borderRadius: "20px" }}>
            12 open
          </span>
        </div>
        <div className="flex flex-col" style={{ marginTop: "10px" }}>
          {tasks.map((t, i) => (
            <div key={i} className="flex items-start" style={{ gap: "10px", padding: "9px 0", borderBottom: "1px solid var(--c-border-light)" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "5px", border: "1.7px solid #d4d4d8", marginTop: "1px", flexShrink: 0, cursor: "pointer" }} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "12.5px", color: "var(--c-text-soft)", lineHeight: 1.4 }}>{t.title}</div>
                <div className="flex items-center" style={{ gap: "7px", marginTop: "4px" }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 600, padding: "1px 7px", borderRadius: "20px", background: t.prioBg, color: t.prioColor }}>
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
            <div key={i} className="flex items-start" style={{ gap: "11px", padding: "10px 0", borderBottom: "1px solid var(--c-border-light)" }}>
              <div
                className="flex items-center justify-center text-white"
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.color, fontSize: "10.5px", fontWeight: 600, flexShrink: 0 }}
              >
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between" style={{ gap: "8px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-1)" }}>{m.name}</span>
                  <span style={{ fontSize: "10.5px", color: "var(--c-text-4)", flexShrink: 0 }}>{m.time}</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--c-text-3)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.preview}
                </div>
              </div>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.unread ? "#2563eb" : "transparent", flexShrink: 0, marginTop: "5px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
