import { Check, Edit3, Search, Plus } from "lucide-react";
import type { UniversityItem } from "../_data/constants";
import { highlights, uniCourses, requirements, scholarships, intakes } from "../_data/constants";

export function OverviewTab({ active }: { active: UniversityItem }) {
  return (
    <div className="flex flex-col" style={{ gap: "18px", maxWidth: "720px" }}>
      <div className="flex items-center justify-between">
        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>University details</h4>
        <button
          className="flex items-center cursor-pointer"
          style={{ height: "30px", gap: "5px", padding: "0 10px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", color: "var(--c-text-2)", fontSize: "12.5px", fontWeight: 500 }}
        >
          <Edit3 width={13} height={13} strokeWidth={1.9} />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "12px" }}>
        {[
          { label: "QS Ranking", value: `#${active.qs}` },
          { label: "THE Ranking", value: `#${active.the}` },
          { label: "Courses", value: `${active.courses}` },
          { label: "Our applicants", value: `${active.apps}`, highlight: true },
        ].map((stat) => (
          <div key={stat.label} style={{ border: "1px solid var(--c-border)", borderRadius: "12px", padding: "14px 15px" }}>
            <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{stat.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: stat.highlight ? "#2563eb" : "var(--c-text-1)", marginTop: "3px" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>Overview</h4>
        <p style={{ margin: 0, fontSize: "13.5px", color: "var(--c-text-2b)", lineHeight: 1.65 }}>{active.desc}</p>
      </div>
      <div>
        <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>Highlights</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
          {highlights.map((h) => (
            <div key={h} className="flex items-center" style={{ gap: "9px", border: "1px solid var(--c-border)", borderRadius: "11px", padding: "11px 13px" }}>
              <Check width={16} height={16} stroke="#16a34a" strokeWidth={1.9} />
              <span style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CoursesTab() {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: "13px" }}>
        <div className="relative" style={{ width: "240px" }}>
          <Search className="absolute top-1/2 -translate-y-1/2" style={{ left: "10px" }} width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
          <input placeholder="Search courses\u2026" style={{ width: "100%", height: "32px", padding: "0 10px 0 30px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", fontSize: "12.5px" }} />
        </div>
        <button className="flex items-center cursor-pointer" style={{ height: "32px", gap: "6px", padding: "0 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 550 }}>
          <Plus width={14} height={14} stroke="#fff" strokeWidth={2.4} />
          Add course
        </button>
      </div>
      <div className="overflow-x-auto" style={{ border: "1px solid var(--c-border)", borderRadius: "12px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 100px 90px 120px 70px 110px", padding: "0 14px", height: "36px", alignItems: "center", background: "var(--c-bg-panel)", borderBottom: "1px solid var(--c-border)", fontSize: "10.5px", fontWeight: 600, color: "var(--c-text-label)", textTransform: "uppercase", letterSpacing: "0.03em" }}
        >
          <div>Course</div><div>Degree</div><div>Duration</div><div>Tuition</div><div>IELTS</div><div>Scholarship</div>
        </div>
        {uniCourses.map((c, i) => (
          <div
            key={i}
            className="hoverable"
            style={{ display: "grid", gridTemplateColumns: "2fr 100px 90px 120px 70px 110px", padding: "0 14px", height: "48px", alignItems: "center", borderBottom: "1px solid var(--c-border-light)", background: "var(--c-bg-elevated)" }}
          >
            <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
            <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.degree}</div>
            <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.duration}</div>
            <div style={{ fontSize: "12px", color: "var(--c-text-1)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{c.tuition}</div>
            <div style={{ fontSize: "12px", color: "var(--c-text-2)" }}>{c.ielts}</div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: c.scholarship ? "#059669" : "var(--c-text-4)", background: c.scholarship ? "#ecfdf3" : "var(--c-bg-surface)", padding: "2px 8px", borderRadius: "20px" }}>
                {c.scholarship ? "Available" : "\u2014"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RequirementsTab() {
  return (
    <div className="flex flex-col" style={{ gap: "8px", maxWidth: "720px" }}>
      {requirements.map((r) => (
        <div key={r.title} style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden" }}>
          <div className="flex items-center justify-between cursor-pointer hoverable" style={{ padding: "13px 16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>{r.title}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <div style={{ padding: "0 16px 15px", fontSize: "13px", color: "var(--c-text-2b)", lineHeight: 1.6 }}>{r.body}</div>
        </div>
      ))}
    </div>
  );
}

export function ScholarshipsTab() {
  return (
    <div>
      <div className="flex justify-end" style={{ marginBottom: "13px" }}>
        <button className="flex items-center cursor-pointer" style={{ height: "32px", gap: "6px", padding: "0 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 550 }}>
          <Plus width={14} height={14} stroke="#fff" strokeWidth={2.4} />
          Add scholarship
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "13px" }}>
        {scholarships.map((s) => (
          <div key={s.name} style={{ border: "1px solid var(--c-border)", borderRadius: "13px", padding: "16px 17px" }}>
            <h4 style={{ margin: "0 0 9px", fontSize: "13.5px", fontWeight: 600, color: "var(--c-text-1)", lineHeight: 1.35 }}>{s.name}</h4>
            <div style={{ display: "inline-flex", fontSize: "12px", fontWeight: 600, color: "#059669", background: "#ecfdf3", padding: "3px 10px", borderRadius: "20px", marginBottom: "11px" }}>
              {s.coverage}
            </div>
            <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--c-text-3)", lineHeight: 1.55 }}>{s.desc}</p>
            <div className="flex justify-between" style={{ borderTop: "1px solid var(--c-border-light)", paddingTop: "10px" }}>
              <div>
                <div style={{ fontSize: "10.5px", color: "var(--c-text-4)" }}>Eligibility</div>
                <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500 }}>{s.eligibility}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10.5px", color: "var(--c-text-4)" }}>Deadline</div>
                <div style={{ fontSize: "12px", color: "var(--c-text-2)", fontWeight: 500 }}>{s.deadline}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntakesTab() {
  return (
    <div style={{ maxWidth: "640px", paddingLeft: "8px" }}>
      {intakes.map((intake) => {
        const statusStyle = intake.status === "Open"
          ? { fontSize: "11px", fontWeight: 600, color: "#059669", background: "#ecfdf3", padding: "2px 9px", borderRadius: "20px" }
          : intake.status === "Closing"
          ? { fontSize: "11px", fontWeight: 600, color: "#b45309", background: "#fffaeb", padding: "2px 9px", borderRadius: "20px" }
          : { fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", background: "var(--c-bg-surface)", padding: "2px 9px", borderRadius: "20px" };
        return (
          <div key={intake.month} className="flex" style={{ gap: "16px", paddingBottom: "8px" }}>
            <div className="flex flex-col items-center">
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#2563eb", border: "2px solid var(--c-bg-elevated)", boxShadow: "0 0 0 1.5px var(--c-nav-active-border)" }} />
              <div style={{ width: "1.5px", flex: 1, background: "var(--c-border)", minHeight: "34px" }} />
            </div>
            <div className="flex-1 cursor-pointer hoverable" style={{ border: "1px solid var(--c-border)", borderRadius: "12px", padding: "13px 15px", marginBottom: "6px" }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{intake.month} 2026</span>
                <span style={statusStyle}>{intake.status}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--c-text-3)", marginTop: "5px" }}>{intake.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
