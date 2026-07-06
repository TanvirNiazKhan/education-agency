"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { courseById, COURSES } from "../../../lib/data";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course = courseById(id);
  const relatedCourses = COURSES.filter((c) => c.id !== course.id);

  const SUBJECTS = [
    "Machine Learning",
    "Algorithms",
    "Data Structures",
    "Cloud Computing",
    "AI Ethics",
    "Software Engineering",
    "Databases",
    "Research Methods",
  ];

  const CAREERS = [
    { role: "Software Engineer", demand: "High demand", salary: "AUD 95k" },
    { role: "Data Scientist", demand: "High demand", salary: "AUD 105k" },
    { role: "ML Engineer", demand: "Very high demand", salary: "AUD 115k" },
    { role: "Tech Lead", demand: "High demand", salary: "AUD 130k" },
  ];

  const REQUIRED_DOCS = [
    "Academic transcripts",
    "SOP",
    "Passport copy",
    "2 recommendation letters",
    "CV/résumé",
    "English test score",
  ];

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Container */}
      <div
        className="px-4 lg:px-7"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          paddingTop: 26,
        }}
      >
        {/* Back link */}
        <Link
          href="/search"
          style={{
            fontSize: 13.5,
            color: "var(--color-muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 18,
            transition: "color .15s",
          }}
        >
          ← Back to search
        </Link>

        {/* ─── Course header card ─── */}
        <div
          className="flex flex-col md:flex-row md:items-center gap-4 md:gap-[18px] p-5 md:p-6 lg:px-7"
          style={{
            background: "var(--color-card)",
            borderRadius: 20,
            boxShadow: "var(--shadow-sm)",
            marginBottom: 24,
          }}
        >
          {/* Icon square */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: course.tint,
              color: course.icColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {course.abbr}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  background: "var(--color-blue-x)",
                  color: "var(--color-blue)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {course.level} · {course.duration}
              </span>
            </div>
            <h1
              className="text-2xl md:text-[32px]"
              style={{
                fontWeight: 800,
                color: "var(--color-navy)",
                margin: "0 0 4px",
                lineHeight: 1.2,
              }}
            >
              {course.title}
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--color-sub)" }}>
              {course.uni} · {course.faculty}
            </div>
          </div>

          {/* Tuition */}
          <div className="md:text-right" style={{ flexShrink: 0 }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--color-navy)",
              }}
            >
              {course.tuition}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
              Tuition fee
            </div>
          </div>
        </div>

        {/* ─── Main grid ─── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6"
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Entry requirements */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 14px",
                }}
              >
                Entry requirements
              </h2>
              <div
                className="grid grid-cols-3 gap-2.5 md:gap-3.5"
              >
                {[
                  {
                    test: "IELTS",
                    score: course.ielts,
                    tint: "#eff4ff",
                    color: "#2563eb",
                  },
                  {
                    test: "PTE",
                    score: course.pte,
                    tint: "#e9f9ef",
                    color: "#0f9d58",
                  },
                  {
                    test: "TOEFL",
                    score: course.toefl,
                    tint: "#fff1e9",
                    color: "#ea580c",
                  },
                ].map((t) => (
                  <div
                    key={t.test}
                    style={{
                      background: "var(--color-card)",
                      borderRadius: 14,
                      padding: "20px 16px",
                      border: "1px solid var(--color-line)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: t.tint,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        color: t.color,
                        marginBottom: 10,
                      }}
                    >
                      {t.test[0]}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--color-muted)",
                        marginBottom: 4,
                      }}
                    >
                      {t.test}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                      }}
                    >
                      {t.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you'll study */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 14px",
                }}
              >
                What you&apos;ll study
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUBJECTS.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 999,
                      background: "var(--color-blue-x)",
                      color: "var(--color-blue)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Career opportunities */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 14px",
                }}
              >
                Career opportunities
              </h2>
              <div
                className="overflow-x-auto"
                style={{
                  background: "var(--color-card)",
                  borderRadius: 16,
                  border: "1px solid var(--color-line)",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "12px 20px",
                    background: "var(--color-line-2)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  <span>Role</span>
                  <span>Demand</span>
                  <span style={{ textAlign: "right" }}>Avg. salary</span>
                </div>
                {CAREERS.map((c, i) => (
                  <div
                    key={c.role}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      padding: "14px 20px",
                      borderTop:
                        i > 0 ? "1px solid var(--color-line)" : "none",
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--color-navy)",
                      }}
                    >
                      {c.role}
                    </span>
                    <span style={{ color: "var(--color-green)", fontWeight: 600 }}>
                      {c.demand}
                    </span>
                    <span
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        color: "var(--color-navy)",
                      }}
                    >
                      {c.salary}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required documents */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 14px",
                }}
              >
                Required documents
              </h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-2.5"
              >
                {REQUIRED_DOCS.map((d) => (
                  <div
                    key={d}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "var(--color-card)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      border: "1px solid var(--color-line)",
                      fontSize: 13.5,
                      color: "var(--color-ink)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-green)",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Scholarship card */}
            <div
              style={{
                background: "var(--color-green-bg)",
                borderRadius: 16,
                padding: "20px",
                border: "1px solid rgba(15,157,88,.18)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-green)",
                  marginBottom: 6,
                }}
              >
                🎓 Scholarship
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "var(--color-green)",
                  lineHeight: 1.55,
                }}
              >
                Up to 50% tuition merit scholarship available
              </div>
            </div>

            {/* Details card */}
            <div
              style={{
                background: "var(--color-card)",
                borderRadius: 16,
                padding: "20px",
                border: "1px solid var(--color-line)",
              }}
            >
              {[
                {
                  label: "Duration",
                  value: course.duration,
                  color: "var(--color-navy)",
                },
                {
                  label: "Next intake",
                  value: course.intake,
                  color: "var(--color-navy)",
                },
                {
                  label: "Deadline",
                  value: course.deadline,
                  color: "var(--color-amber)",
                },
                {
                  label: "Median salary",
                  value: course.salary,
                  color: "var(--color-green)",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "11px 0",
                    borderBottom: "1px solid var(--color-line)",
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: "var(--color-sub)" }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: r.color }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Related courses ─── */}
        <div style={{ marginTop: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--color-navy)",
              margin: "0 0 16px",
            }}
          >
            Related courses
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {relatedCourses.map((c) => (
              <Link
                key={c.id}
                href={`/course/${c.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card-hover"
                  style={{
                    background: "var(--color-card)",
                    borderRadius: 16,
                    padding: "18px 20px",
                    border: "1px solid var(--color-line)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: c.tint,
                      color: c.icColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {c.abbr}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                        marginBottom: 3,
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{ fontSize: 12.5, color: "var(--color-muted)" }}
                    >
                      {c.level} · {c.duration} · {c.tuition}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      color: "var(--color-muted)",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Sticky bottom bar ─── */}
      <div
        className="px-4 lg:px-7"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 55,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--color-line)",
          paddingTop: 12,
          paddingBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="hidden md:block">
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-amber)",
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Deadline: {course.deadline}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {course.title}
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-2.5">
          <Link
            href="/chat"
            className="hidden md:inline-flex"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              background: "var(--color-blue-x)",
              color: "var(--color-blue)",
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
              alignItems: "center",
              gap: 6,
            }}
          >
            ✦ Ask AI
          </Link>
          <button
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "var(--color-blue)",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Apply now
          </button>
        </div>
      </div>
    </div>
  );
}
