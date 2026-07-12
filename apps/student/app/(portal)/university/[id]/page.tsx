"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FAQS,
  REVIEWS,
} from "../../../lib/data";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const IMG_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

const TABS = [
  "Overview",
  "Courses",
  "Requirements",
  "Scholarships",
  "Accommodation",
  "Gallery",
  "FAQ",
  "Reviews",
  "AI Assistant",
] as const;

type Tab = (typeof TABS)[number];

interface ApiUniversity {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  university_type: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  logo: string;
  banner: string;
  description: string;
  featured: boolean;
  country_id: number;
  city_id: number;
  country?: { name: string };
  city?: { name: string };
  faculties?: { id: number; name: string; description: string }[];
}

interface ApiImage {
  id: number;
  url: string;
  alt_text: string;
  type: "logo" | "banner" | "gallery";
  sort_order: number;
}

interface ApiScholarship {
  id: number;
  name: string;
  description: string;
  percentage: number;
  type: string;
  deadline: string;
  scopes?: { scope_type: string; scope_id: number }[];
}

interface ApiIntake {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  deadline: string;
  status: string;
}

interface ApiCourse {
  id: number;
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
  faculty_id: number;
  degree_id: number;
}

interface ApiDegree {
  id: number;
  name: string;
}

interface CourseWithFaculty extends ApiCourse {
  facultyName: string;
  degreeName: string;
}

const COURSE_TINTS = [
  { tint: "rgba(37,99,235,.10)", color: "#2563eb" },
  { tint: "rgba(15,157,88,.10)", color: "#0f9d58" },
  { tint: "rgba(234,88,12,.10)", color: "#ea580c" },
  { tint: "rgba(139,92,246,.10)", color: "#8b5cf6" },
  { tint: "rgba(236,72,153,.10)", color: "#ec4899" },
  { tint: "rgba(20,184,166,.10)", color: "#14b8a6" },
];

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "Overview";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [university, setUniversity] = useState<ApiUniversity | null>(null);
  const [images, setImages] = useState<ApiImage[]>([]);
  const [scholarships, setScholarships] = useState<ApiScholarship[]>([]);
  const [intakes, setIntakes] = useState<ApiIntake[]>([]);
  const [courses, setCourses] = useState<CourseWithFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch university by slug
        const uniRes = await fetch(`${API_BASE}/universities/slug/${id}`);
        if (!uniRes.ok) throw new Error("University not found");
        const uni: ApiUniversity = await uniRes.json();
        if (cancelled) return;
        setUniversity(uni);

        // 2. Parallel fetches for related data
        const [imgRes, schRes, intakeRes, degreeRes] = await Promise.all([
          fetch(`${API_BASE}/university-images?university_id=${uni.id}`),
          fetch(`${API_BASE}/scholarships?university_id=${uni.id}`),
          fetch(`${API_BASE}/intakes?university_id=${uni.id}`),
          fetch(`${API_BASE}/degrees`),
        ]);

        const imgData: ApiImage[] = imgRes.ok ? await imgRes.json() : [];
        const schData: ApiScholarship[] = schRes.ok ? await schRes.json() : [];
        const intakeData: ApiIntake[] = intakeRes.ok
          ? await intakeRes.json()
          : [];
        const degreeData: ApiDegree[] = degreeRes.ok
          ? await degreeRes.json()
          : [];

        if (cancelled) return;
        setImages(imgData);
        setScholarships(schData);
        setIntakes(intakeData);

        // 3. Fetch courses from all faculties
        const faculties = uni.faculties || [];
        const coursePromises = faculties.map(async (f) => {
          const res = await fetch(`${API_BASE}/courses?faculty_id=${f.id}`);
          if (!res.ok) return [];
          const data: ApiCourse[] = await res.json();
          return data.map((c) => ({
            ...c,
            facultyName: f.name,
            degreeName:
              degreeData.find((d) => d.id === c.degree_id)?.name || "",
          }));
        });

        const allCourses = (await Promise.all(coursePromises)).flat();
        if (cancelled) return;
        setCourses(allCourses);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load university"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ─── Banner auto-slide ─── */
  const bannerCount = images.filter((i) => i.type === "banner").length;
  const nextBanner = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % (bannerCount || 1));
  }, [bannerCount]);

  useEffect(() => {
    if (bannerCount <= 1) return;
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [bannerCount, nextBanner]);

  /* ─── Loading / Error states ─── */
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3.5px solid var(--color-line)",
            borderTopColor: "var(--color-blue)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 14.5, color: "var(--color-muted)" }}>
          Loading university...
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-navy)" }}>
          University not found
        </div>
        <div style={{ fontSize: 14, color: "var(--color-sub)" }}>
          {error || "The university you're looking for doesn't exist."}
        </div>
        <Link
          href="/search"
          style={{
            marginTop: 8,
            padding: "9px 20px",
            borderRadius: 10,
            background: "var(--color-blue)",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to search
        </Link>
      </div>
    );
  }

  /* ─── Derived data ─── */
  const accent = "#2563eb";
  const bannerImages = images.filter((i) => i.type === "banner").sort((a, b) => a.sort_order - b.sort_order);
  const logoImg = images.find((i) => i.type === "logo");
  const galleryImages = images.filter((i) => i.type === "gallery");

  const initials = university.name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase() && w.length > 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  // Derive tuition range from courses
  const tuitionFees = courses
    .map((c) => c.tuition_fee)
    .filter((f) => f > 0);
  const minTuition = tuitionFees.length > 0 ? Math.min(...tuitionFees) : null;
  const tuitionCurrency = courses.find((c) => c.tuition_fee > 0)?.currency || "AUD";
  const tuitionDisplay = minTuition
    ? `${tuitionCurrency} ${minTuition.toLocaleString()}`
    : "Contact university";

  // Derive IELTS/PTE ranges from courses
  const ieltsScores = courses
    .map((c) => c.ielts_requirement)
    .filter((s) => s > 0);
  const pteScores = courses
    .map((c) => c.pte_requirement)
    .filter((s) => s > 0);
  const minIelts = ieltsScores.length > 0 ? Math.min(...ieltsScores) : null;
  const minPte = pteScores.length > 0 ? Math.min(...pteScores) : null;

  // Scholarship summary
  const schCount = scholarships.length;
  const schSummary =
    schCount > 0
      ? `${schCount} scholarship${schCount > 1 ? "s" : ""}`
      : "No scholarships";

  /* ─── Hero ─── */
  const hero = (
    <div
      className="h-[220px] lg:h-[280px]"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* sliding banners */}
      {bannerImages.length > 0 ? (
        bannerImages.map((img, i) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG_BASE}${img.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === bannerIdx ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
          }}
        />
      )}

      {/* dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.18) 0%, rgba(0,0,0,.62) 100%)",
        }}
      />

      {/* banner dots */}
      {bannerImages.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            gap: 6,
            zIndex: 10,
          }}
        >
          {bannerImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              style={{
                width: i === bannerIdx ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* back button */}
      <Link
        href="/search"
        className="left-4 lg:left-7"
        style={{
          position: "absolute",
          top: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,.16)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          padding: "7px 16px",
          borderRadius: 999,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,.22)",
          transition: "background .15s",
        }}
      >
        ← Back
      </Link>

      {/* bottom info */}
      <div
        className="left-4 right-4 lg:left-7 lg:right-7 gap-3 lg:gap-[18px]"
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* logo or initials box */}
        {logoImg ? (
          <img
            src={`${IMG_BASE}${logoImg.url}`}
            alt={logoImg.alt_text || university.name}
            className="w-[60px] h-[60px] lg:w-[84px] lg:h-[84px]"
            style={{
              borderRadius: 20,
              background: "#fff",
              objectFit: "contain",
              flexShrink: 0,
              padding: 4,
            }}
          />
        ) : (
          <div
            className="w-[60px] h-[60px] lg:w-[84px] lg:h-[84px]"
            style={{
              borderRadius: 20,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: accent,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            {university.university_type && (
              <span
                style={{
                  background: "rgba(255,255,255,.22)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {university.university_type}
              </span>
            )}
            <span style={{ color: "rgba(255,255,255,.82)", fontSize: 13.5 }}>
              {university.city?.name}
              {university.city?.name && university.country?.name ? ", " : ""}
              {university.country?.name}
            </span>
          </div>
          <h1
            className="text-[20px] lg:text-[38px]"
            style={{
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {university.name}
          </h1>
        </div>
      </div>
    </div>
  );

  /* ─── Quick Stats ─── */
  const stats = [
    {
      label: "Courses",
      value: `${courses.length}`,
      sub: "Available programs",
      color: "var(--color-navy)",
    },
    {
      label: "Faculties",
      value: `${university.faculties?.length || 0}`,
      sub: "Academic departments",
      color: "var(--color-green)",
    },
    {
      label: "Scholarships",
      value: `${scholarships.length}`,
      sub: "Financial aid options",
      color: "var(--color-navy)",
    },
    {
      label: "Intakes",
      value: `${intakes.length}`,
      sub: "Upcoming sessions",
      color: "var(--color-blue)",
    },
  ];

  const quickStats = (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 px-4 lg:px-7"
      style={{
        maxWidth: 1160,
        margin: "-14px auto 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-muted)",
              marginBottom: 4,
            }}
          >
            {s.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>
            {s.value}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--color-sub)",
              marginTop: 2,
            }}
          >
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );

  /* ─── Tabs ─── */
  const tabs = (
    <div
      style={{
        position: "sticky",
        top: 66,
        zIndex: 40,
        background: "var(--color-card)",
        borderBottom: "1px solid var(--color-line)",
        marginTop: 24,
      }}
    >
      <div
        className="px-4 lg:px-7"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 600,
              color:
                activeTab === t ? "var(--color-blue)" : "var(--color-sub)",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === t
                  ? "2.5px solid var(--color-blue)"
                  : "2.5px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color .15s, border-color .15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  /* ─── Tab: Overview ─── */
  const overviewTab = (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-7">
      {/* Left */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 12px",
          }}
        >
          About {university.name}
        </h2>
        <p
          style={{
            fontSize: 14.5,
            color: "var(--color-sub)",
            lineHeight: 1.7,
            margin: "0 0 24px",
          }}
        >
          {university.description ||
            `${university.name} is located in ${university.city?.name || ""}, ${university.country?.name || ""}. It offers ${courses.length} programs across ${university.faculties?.length || 0} faculties with ${scholarships.length} scholarship opportunities for international students.`}
        </p>

        {/* 2x2 info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            {
              icon: "🎓",
              title: "Scholarships",
              desc:
                schCount > 0
                  ? `${schCount} scholarship${schCount > 1 ? "s" : ""} available for students`
                  : "Contact university for scholarship info",
            },
            {
              icon: "🏛️",
              title: "Campus",
              desc: "State-of-the-art facilities across multiple campuses",
            },
            {
              icon: "💼",
              title: "Work rights",
              desc: "Up to 48 hrs/fortnight during studies, unlimited during breaks",
            },
            {
              icon: "🌏",
              title: "Community",
              desc: "Students from 150+ countries, active cultural societies",
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "var(--color-card)",
                borderRadius: 14,
                padding: "16px 18px",
                border: "1px solid var(--color-line)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                  marginBottom: 4,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-sub)",
                  lineHeight: 1.55,
                }}
              >
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Intakes section */}
        {intakes.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "var(--color-navy)",
                margin: "0 0 14px",
              }}
            >
              Upcoming intakes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intakes.map((intake) => (
                <div
                  key={intake.id}
                  style={{
                    background: "var(--color-card)",
                    borderRadius: 14,
                    padding: "14px 18px",
                    border: "1px solid var(--color-line)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--color-navy)",
                      }}
                    >
                      {intake.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                      {new Date(intake.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(intake.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background:
                        intake.status === "open"
                          ? "rgba(15,157,88,.1)"
                          : "rgba(234,88,12,.1)",
                      color:
                        intake.status === "open" ? "var(--color-green)" : "#ea580c",
                    }}
                  >
                    {intake.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* at a glance */}
        <div
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-navy)",
              marginBottom: 14,
            }}
          >
            At a glance
          </div>
          {[
            {
              label: "IELTS",
              value: minIelts ? `${minIelts}+` : "Varies",
            },
            {
              label: "PTE",
              value: minPte ? `${minPte}+` : "Varies",
            },
            { label: "Tuition/yr", value: tuitionDisplay },
            { label: "Scholarships", value: schSummary },
          ].map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid var(--color-line)",
                fontSize: 13.5,
              }}
            >
              <span style={{ color: "var(--color-sub)" }}>{r.label}</span>
              <span style={{ fontWeight: 700, color: "var(--color-navy)" }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* contact info */}
        {(university.website || university.email || university.phone) && (
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 16,
              padding: "20px",
              border: "1px solid var(--color-line)",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-navy)",
                marginBottom: 14,
              }}
            >
              Contact
            </div>
            {university.website && (
              <div
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--color-line)",
                  fontSize: 13.5,
                }}
              >
                <div style={{ color: "var(--color-sub)", marginBottom: 2 }}>
                  Website
                </div>
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-blue)", fontWeight: 600 }}
                >
                  {university.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {university.email && (
              <div
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--color-line)",
                  fontSize: 13.5,
                }}
              >
                <div style={{ color: "var(--color-sub)", marginBottom: 2 }}>
                  Email
                </div>
                <span style={{ color: "var(--color-navy)", fontWeight: 600 }}>
                  {university.email}
                </span>
              </div>
            )}
            {university.phone && (
              <div style={{ padding: "8px 0", fontSize: 13.5 }}>
                <div style={{ color: "var(--color-sub)", marginBottom: 2 }}>
                  Phone
                </div>
                <span style={{ color: "var(--color-navy)", fontWeight: 600 }}>
                  {university.phone}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ─── Tab: Courses ─── */
  const coursesTab = (
    <div>
      {courses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--color-muted)",
            fontSize: 14.5,
          }}
        >
          No courses listed yet for this university.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c, idx) => {
            const tintSet = COURSE_TINTS[idx % COURSE_TINTS.length];
            const abbr = c.course_code
              ? c.course_code.slice(0, 3).toUpperCase()
              : c.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 3)
                  .toUpperCase();
            const durationYears =
              c.duration_months >= 12
                ? `${(c.duration_months / 12).toFixed(c.duration_months % 12 === 0 ? 0 : 1)} yr`
                : `${c.duration_months} mo`;

            return (
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
                      background: tintSet.tint,
                      color: tintSet.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {abbr}
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
                      {c.name}
                    </div>
                    <div
                      style={{ fontSize: 12.5, color: "var(--color-muted)" }}
                    >
                      {c.degreeName ? `${c.degreeName} · ` : ""}
                      {durationYears} ·{" "}
                      {c.tuition_fee > 0
                        ? `${c.currency} ${c.tuition_fee.toLocaleString()}/yr`
                        : "Contact for fees"}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--color-blue)",
                        marginTop: 2,
                      }}
                    >
                      {c.facultyName}
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
            );
          })}
        </div>
      )}
    </div>
  );

  /* ─── Derive band scores from courses ─── */
  const bandFields = ["speaking", "writing", "reading", "listening"] as const;
  const ieltsBands: Record<string, number | null> = {};
  const pteBands: Record<string, number | null> = {};
  for (const band of bandFields) {
    const ieltsVals = courses.map((c) => c[`ielts_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    ieltsBands[band] = ieltsVals.length > 0 ? Math.min(...ieltsVals) : null;
    const pteVals = courses.map((c) => c[`pte_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    pteBands[band] = pteVals.length > 0 ? Math.min(...pteVals) : null;
  }
  const hasIeltsBands = bandFields.some((b) => ieltsBands[b] != null);
  const toeflBands: Record<string, number | null> = {};
  for (const band of bandFields) {
    const toeflVals = courses.map((c) => c[`toefl_${band}` as keyof ApiCourse] as number).filter((v) => v > 0);
    toeflBands[band] = toeflVals.length > 0 ? Math.min(...toeflVals) : null;
  }
  const toeflScores = courses.map((c) => c.toefl_requirement).filter((s) => s > 0);
  const minToefl = toeflScores.length > 0 ? Math.min(...toeflScores) : null;
  const hasPteBands = bandFields.some((b) => pteBands[b] != null);
  const hasToeflBands = bandFields.some((b) => toeflBands[b] != null);

  /* ─── Tab: Requirements ─── */
  const requirementsTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* IELTS */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          IELTS Academic
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minIelts ? `${minIelts}+` : "Varies by course"}
          </div>
        </div>
        {hasIeltsBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {ieltsBands[band] != null ? `${ieltsBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* PTE */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          PTE Academic
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minPte ? `${minPte}+` : "Varies by course"}
          </div>
        </div>
        {hasPteBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {pteBands[band] != null ? `${pteBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* TOEFL */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          TOEFL iBT
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Overall</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
            {minToefl ? `${minToefl}+` : "Varies by course"}
          </div>
        </div>
        {hasToeflBands && bandFields.map((band) => (
          <div
            key={band}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", textTransform: "capitalize" }}>
              {band}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-blue)" }}>
              {toeflBands[band] != null ? `${toeflBands[band]}+` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Academic & documents */}
      <div
        style={{
          background: "var(--color-card)",
          borderRadius: 16,
          padding: "22px 24px",
          border: "1px solid var(--color-line)",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: "0 0 16px",
          }}
        >
          Academic &amp; documents
        </h3>
        {[
          "Bachelor's degree (min 3.0 GPA)",
          "Official academic transcripts",
          "Statement of purpose",
          "Two recommendation letters",
          "Updated CV / resume",
          "Valid passport copy",
        ].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--color-line)",
              fontSize: 14,
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
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Tab: Scholarships ─── */
  const scholarshipsTab = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {scholarships.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--color-muted)",
            fontSize: 14.5,
          }}
        >
          No scholarships listed yet for this university.
        </div>
      ) : (
        scholarships.map((s) => (
          <div
            key={s.id}
            style={{
              background: "var(--color-card)",
              borderRadius: 16,
              padding: "20px 24px",
              border: "1px solid var(--color-line)",
              borderLeft: "4px solid var(--color-green)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  marginBottom: 4,
                }}
              >
                {s.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-sub)" }}>
                {s.type}
                {s.deadline
                  ? ` · Deadline: ${new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : ""}
              </div>
              {s.description && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-muted)",
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {s.description}
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-green)",
                flexShrink: 0,
                marginLeft: 24,
              }}
            >
              {s.percentage}%
            </div>
          </div>
        ))
      )}
    </div>
  );

  /* ─── Tab: Accommodation ─── */
  const accommodationTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]">
      {[
        {
          title: "On-campus housing",
          sub: "Fully furnished, meal plan included",
          price: "Contact university",
        },
        {
          title: "Shared apartment",
          sub: "2-3 bedroom, close to campus",
          price: "Contact university",
        },
        {
          title: "Homestay",
          sub: "With local family, meals included",
          price: "Contact university",
        },
      ].map((a) => (
        <div
          key={a.title}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            border: "1px solid var(--color-line)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 120,
              background: "var(--color-line-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-muted)",
              fontSize: 28,
            }}
          >
            🏠
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-navy)",
                marginBottom: 4,
              }}
            >
              {a.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--color-sub)",
                marginBottom: 10,
              }}
            >
              {a.sub}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-blue)",
              }}
            >
              {a.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ─── Tab: Gallery ─── */
  const galleryTab =
    galleryImages.length === 0 ? (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "var(--color-muted)",
          fontSize: 14.5,
        }}
      >
        Gallery coming soon — campus photos and virtual tours.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-[18px]">
        {galleryImages
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => (
            <div
              key={img.id}
              className="group"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--color-line)",
                background: "var(--color-card)",
                position: "relative",
                aspectRatio: "16/10",
                cursor: "pointer",
              }}
            >
              <img
                src={`${IMG_BASE}${img.url}`}
                alt={img.alt_text || "Campus photo"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:scale-105"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(transparent 50%, rgba(0,0,0,0.55))",
                  opacity: 0,
                  transition: "opacity 0.25s ease",
                  pointerEvents: "none",
                }}
                className="group-hover:!opacity-100"
              />
              {img.alt_text && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 14,
                    right: 14,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#fff",
                    opacity: 0,
                    transition: "opacity 0.25s ease",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className="group-hover:!opacity-100"
                >
                  {img.alt_text}
                </div>
              )}
            </div>
          ))}
      </div>
    );

  /* ─── Tab: FAQ ─── */
  const faqTab = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {FAQS.map((f, i) => (
        <div
          key={i}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px 24px",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "var(--color-navy)",
              marginBottom: 8,
            }}
          >
            {f.q}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-sub)",
              lineHeight: 1.65,
            }}
          >
            {f.a}
          </div>
        </div>
      ))}
    </div>
  );

  /* ─── Tab: Reviews ─── */
  const reviewsTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]">
      {REVIEWS.map((r, i) => (
        <div
          key={i}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            padding: "20px",
            border: "1px solid var(--color-line)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* stars */}
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-sub)",
              lineHeight: 1.65,
              flex: 1,
            }}
          >
            {r.text}
          </div>
          <div
            style={{
              height: 1,
              background: "var(--color-line)",
              margin: "14px 0",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: r.av,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {r.initials}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                {r.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
                {r.prog} · {r.yr}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ─── Tab: AI Assistant ─── */
  const aiAssistantTab = (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          background: "var(--color-navy)",
          borderRadius: 20,
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          Ask about {university.name}
        </h2>
        <p
          style={{
            fontSize: 14.5,
            color: "rgba(255,255,255,.65)",
            lineHeight: 1.65,
            margin: "0 0 28px",
          }}
        >
          Get instant answers about admission requirements, scholarships, campus
          life, and more — powered by AI trained on official university data.
        </p>
        <Link
          href="/chat"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "var(--color-navy)",
            fontSize: 14.5,
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: 12,
            textDecoration: "none",
            transition: "opacity .15s",
          }}
        >
          Open AI chat
        </Link>
      </div>
    </div>
  );

  const tabContent: Record<Tab, React.ReactNode> = {
    Overview: overviewTab,
    Courses: coursesTab,
    Requirements: requirementsTab,
    Scholarships: scholarshipsTab,
    Accommodation: accommodationTab,
    Gallery: galleryTab,
    FAQ: faqTab,
    Reviews: reviewsTab,
    "AI Assistant": aiAssistantTab,
  };

  return (
    <div className="pb-[120px] md:pb-[90px]">
      {hero}
      {quickStats}
      {tabs}

      {/* Tab content */}
      <div
        className="px-4 lg:px-7 pt-5 lg:pt-7"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        {tabContent[activeTab]}
      </div>

      {/* ─── Sticky bottom bar ─── */}
      <div
        className="px-4 lg:px-7 bottom-[56px] md:bottom-0"
        style={{
          position: "fixed",
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
        <div className="hidden lg:block">
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {university.name}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
            Tuition from {tuitionDisplay}/yr
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-2.5 flex-wrap">
          <button
            className="hidden md:inline-flex"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "1.5px solid var(--color-line)",
              background: "transparent",
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--color-sub)",
              cursor: "pointer",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⇄ Compare
          </button>
          <Link
            href="/chat"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              background: "var(--color-blue-x)",
              color: "var(--color-blue)",
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ✦ Ask AI
          </Link>
          <Link
            href={`/apply?university_id=${university.id}`}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "var(--color-blue)",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Apply now
          </Link>
        </div>
      </div>
    </div>
  );
}
