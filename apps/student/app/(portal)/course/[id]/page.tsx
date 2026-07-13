"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const IMG_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

interface ApiCourse {
  id: string;
  name: string;
  course_code: string;
  tuition_fee: number;
  currency: string;
  duration_months: number;
  intake: string;
  ielts_requirement: number;
  ielts_speaking: number;
  ielts_writing: number;
  ielts_reading: number;
  ielts_listening: number;
  pte_requirement: number;
  pte_speaking: number;
  pte_writing: number;
  pte_reading: number;
  pte_listening: number;
  toefl_requirement: number;
  toefl_speaking: number;
  toefl_writing: number;
  toefl_reading: number;
  toefl_listening: number;
  overview: string;
  scholarship_available: boolean;
  faculty_id: string;
  degree_id: string;
  faculty?: { id: string; name: string; description: string; university_id: string; university?: ApiUniversity };
  degree?: { id: string; name: string };
  is_active: boolean;
}

interface ApiUniversity {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  university_type: string;
  website: string;
  logo: string;
  country?: { id: string; name: string };
  city?: { id: string; name: string };
}

interface ApiScholarship {
  id: string;
  name: string;
  description: string;
  percentage: number;
  type: string;
  deadline: string;
  university_id: string;
}

interface ApiImage {
  id: string;
  url: string;
  alt_text: string;
  type: string;
  sort_order: number;
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<ApiCourse[]>([]);
  const [scholarships, setScholarships] = useState<ApiScholarship[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/courses/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Course not found");
        return r.json();
      })
      .then(async (c: ApiCourse) => {
        // If faculty.university not loaded, fetch it
        const uniId = c.faculty?.university_id;
        if (uniId && !c.faculty?.university) {
          try {
            const uniRes = await fetch(`${API_BASE}/universities/${uniId}`);
            if (uniRes.ok) {
              const uni = await uniRes.json();
              c = { ...c, faculty: { ...c.faculty!, university: uni } };
            }
          } catch {}
        }
        setCourse(c);

        // Fetch related courses from same faculty
        const related = fetch(`${API_BASE}/courses?faculty_id=${c.faculty_id}`)
          .then((r) => r.json())
          .then((list: ApiCourse[]) => setRelatedCourses(list.filter((rc) => rc.id !== c.id).slice(0, 3)))
          .catch(() => {});
        if (uniId) {
          const schP = fetch(`${API_BASE}/scholarships?university_id=${uniId}`)
            .then((r) => r.json())
            .then((s: ApiScholarship[]) => setScholarships(s))
            .catch(() => {});

          const imgP = fetch(`${API_BASE}/university-images?university_id=${uniId}`)
            .then((r) => r.json())
            .then((imgs: ApiImage[]) => {
              const logo = imgs.find((i) => i.type === "logo");
              if (logo) setLogoUrl(`${IMG_BASE}${logo.url}`);
            })
            .catch(() => {});

          await Promise.all([related, schP, imgP]);
        } else {
          await related;
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--color-muted)" }}>
        Loading...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-navy)" }}>{error || "Course not found"}</div>
        <Link href="/search" style={{ fontSize: 14, color: "var(--color-blue)", textDecoration: "none" }}>← Back to search</Link>
      </div>
    );
  }

  const university = course.faculty?.university;
  const durationLabel = course.duration_months >= 12
    ? `${(course.duration_months / 12).toFixed(course.duration_months % 12 === 0 ? 0 : 1)} year${course.duration_months >= 24 ? "s" : ""}`
    : `${course.duration_months} months`;
  const degreeLevel = course.degree?.name || "";
  const tuitionDisplay = `${course.currency} ${Number(course.tuition_fee).toLocaleString()}`;
  const initials = (university?.short_name || university?.name || "U").slice(0, 2).toUpperCase();
  const bandFields = ["speaking", "writing", "reading", "listening"] as const;

  // Best scholarship for this course
  const bestSch = scholarships.length > 0
    ? scholarships.reduce((best, s) => (s.percentage > (best?.percentage || 0) ? s : best), scholarships[0])
    : null;

  const REQUIRED_DOCS = [
    "Academic transcripts",
    "Statement of purpose",
    "Passport copy",
    "2 recommendation letters",
    "CV / résumé",
    "English test score",
  ];

  return (
    <div className="pb-[120px] md:pb-[90px]">
      <div
        className="px-4 lg:px-7"
        style={{ maxWidth: 1080, margin: "0 auto", paddingTop: 26 }}
      >
        {/* Back link */}
        <Link
          href={university ? `/university/${university.slug}?tab=Courses` : "/search"}
          style={{ fontSize: 13.5, color: "var(--color-muted)", textDecoration: "none", display: "inline-block", marginBottom: 18, transition: "color .15s" }}
        >
          ← {university ? `Back to ${university.name}` : "Back to search"}
        </Link>

        {/* ─── Course header card ─── */}
        <div
          className="flex flex-col md:flex-row md:items-center gap-4 md:gap-[18px] p-5 md:p-6 lg:px-7"
          style={{ background: "var(--color-card)", borderRadius: 20, boxShadow: "var(--shadow-sm)", marginBottom: 24 }}
        >
          {/* Logo or initials */}
          {logoUrl ? (
            <img src={logoUrl} alt={university?.name || ""} style={{ width: 64, height: 64, borderRadius: 16, objectFit: "contain", background: "#fff", padding: 4, flexShrink: 0 }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--color-blue-x)", color: "var(--color-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0 }}>
              {initials}
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ background: "var(--color-blue-x)", color: "var(--color-blue)", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                {degreeLevel}{degreeLevel && " · "}{durationLabel}
              </span>
              <span style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>{course.course_code}</span>
            </div>
            <h1 className="text-2xl md:text-[32px]" style={{ fontWeight: 800, color: "var(--color-navy)", margin: "0 0 4px", lineHeight: 1.2 }}>
              {course.name}
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--color-sub)" }}>
              {university?.name}{course.faculty ? ` · ${course.faculty.name}` : ""}
            </div>
          </div>

          {/* Tuition */}
          <div className="md:text-right" style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--color-navy)" }}>{tuitionDisplay}</div>
            <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Tuition fee / year</div>
          </div>
        </div>

        {/* ─── Main grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Overview */}
            {course.overview && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 14px" }}>Overview</h2>
                <div style={{ background: "var(--color-card)", borderRadius: 16, padding: "20px 24px", border: "1px solid var(--color-line)", fontSize: 14, lineHeight: 1.7, color: "var(--color-ink)", whiteSpace: "pre-line" }}>
                  {course.overview}
                </div>
              </div>
            )}

            {/* Entry requirements — overall scores */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 14px" }}>Entry requirements</h2>
              <div className="grid grid-cols-3 gap-2.5 md:gap-3.5">
                {[
                  { test: "IELTS", score: course.ielts_requirement, tint: "var(--color-blue-x)", color: "var(--color-blue)" },
                  { test: "PTE", score: course.pte_requirement, tint: "var(--color-green-bg)", color: "var(--color-green)" },
                  { test: "TOEFL", score: course.toefl_requirement, tint: "#fff1e9", color: "#ea580c" },
                ].map((t) => (
                  <div key={t.test} style={{ background: "var(--color-card)", borderRadius: 14, padding: "20px 16px", border: "1px solid var(--color-line)", textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: t.tint, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: t.color, marginBottom: 10 }}>
                      {t.test[0]}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginBottom: 4 }}>{t.test}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy)" }}>
                      {t.score ? `${t.score}+` : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Band-wise breakdown */}
            {(course.ielts_speaking || course.pte_speaking || course.toefl_speaking) && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 14px" }}>Band-wise requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { test: "IELTS", prefix: "ielts", color: "var(--color-blue)", bg: "var(--color-blue-x)" },
                    { test: "PTE", prefix: "pte", color: "var(--color-green)", bg: "var(--color-green-bg)" },
                    { test: "TOEFL", prefix: "toefl", color: "#ea580c", bg: "#fff1e9" },
                  ].map((t) => {
                    const hasBands = bandFields.some((b) => course[`${t.prefix}_${b}` as keyof ApiCourse]);
                    if (!hasBands) return null;
                    return (
                      <div key={t.test} style={{ background: "var(--color-card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--color-line)" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: t.color, marginBottom: 10 }}>{t.test} Bands</div>
                        {bandFields.map((band) => {
                          const val = course[`${t.prefix}_${band}` as keyof ApiCourse] as number;
                          return (
                            <div key={band} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--color-line)", fontSize: 13.5 }}>
                              <span style={{ color: "var(--color-sub)", textTransform: "capitalize" }}>{band}</span>
                              <span style={{ fontWeight: 700, color: "var(--color-navy)" }}>{val ? `${val}+` : "—"}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Required documents */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 14px" }}>Required documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {REQUIRED_DOCS.map((d) => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--color-card)", borderRadius: 12, padding: "12px 16px", border: "1px solid var(--color-line)", fontSize: 13.5, color: "var(--color-ink)" }}>
                    <span style={{ color: "var(--color-green)", fontSize: 16, flexShrink: 0 }}>✓</span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Scholarship card */}
            {(course.scholarship_available || bestSch) && (
              <div style={{ background: "var(--color-green-bg)", borderRadius: 16, padding: 20, border: "1px solid rgba(15,157,88,.18)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-green)", marginBottom: 6 }}>
                  Scholarship
                </div>
                <div style={{ fontSize: 13.5, color: "var(--color-green)", lineHeight: 1.55 }}>
                  {bestSch
                    ? `${bestSch.name} — up to ${bestSch.percentage}% tuition`
                    : "Scholarship available — contact university"}
                </div>
              </div>
            )}

            {/* Details card */}
            <div style={{ background: "var(--color-card)", borderRadius: 16, padding: 20, border: "1px solid var(--color-line)" }}>
              {[
                { label: "Duration", value: durationLabel, color: "var(--color-navy)" },
                { label: "Intake", value: course.intake || "Contact university", color: "var(--color-navy)" },
                { label: "Course code", value: course.course_code, color: "var(--color-navy)" },
                { label: "Degree", value: degreeLevel || "—", color: "var(--color-navy)" },
                { label: "Faculty", value: course.faculty?.name || "—", color: "var(--color-navy)" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--color-line)", fontSize: 13.5 }}>
                  <span style={{ color: "var(--color-sub)" }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: r.color, textAlign: "right", maxWidth: "60%" }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* University card */}
            {university && (
              <Link href={`/university/${university.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--color-card)", borderRadius: 16, padding: 20, border: "1px solid var(--color-line)", cursor: "pointer", transition: "border-color .15s" }} className="hover:border-blue-300">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={university.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "contain", background: "#fff", padding: 2 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-blue-x)", color: "var(--color-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-navy)" }}>{university.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
                        {university.city?.name}{university.city?.name && university.country?.name ? ", " : ""}{university.country?.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--color-blue)", fontWeight: 600 }}>View university →</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* ─── Related courses ─── */}
        {relatedCourses.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 16px" }}>Related courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCourses.map((c) => (
                <Link key={c.id} href={`/course/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-hover" style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--color-line)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--color-blue-x)", color: "var(--color-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                      {c.course_code.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                        {c.degree?.name} · {c.duration_months >= 12 ? `${Math.round(c.duration_months / 12)} yr` : `${c.duration_months}m`} · {c.currency} {Number(c.tuition_fee).toLocaleString()}
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: "var(--color-muted)", flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Sticky bottom bar ─── */}
      <div
        className="px-4 lg:px-7 bottom-[56px] md:bottom-0"
        style={{ position: "fixed", left: 0, right: 0, zIndex: 55, background: "rgba(255,255,255,.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid var(--color-line)", paddingTop: 12, paddingBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div className="hidden md:block">
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy)" }}>{course.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{university?.name}</div>
        </div>
        <div className="flex items-center gap-2 lg:gap-2.5">
          <Link href="/chat" className="hidden md:inline-flex" style={{ padding: "9px 18px", borderRadius: 10, background: "var(--color-blue-x)", color: "var(--color-blue)", fontSize: 13.5, fontWeight: 600, textDecoration: "none", alignItems: "center", gap: 6 }}>
            Ask AI
          </Link>
          <Link
            href={`/apply?course_id=${course.id}${university ? `&university_id=${university.id}` : ""}`}
            style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "var(--color-blue)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}
          >
            Apply now
          </Link>
        </div>
      </div>
    </div>
  );
}
