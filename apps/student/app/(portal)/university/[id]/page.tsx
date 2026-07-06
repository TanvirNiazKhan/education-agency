"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  uniById,
  COURSES,
  SCHOLARSHIPS,
  FAQS,
  REVIEWS,
} from "../../../lib/data";

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

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const uni = uniById(id);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const initials = uni.name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase() && w.length > 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  const uniCourses = COURSES.filter((c) => c.uniId === uni.id);

  /* ─── Hero ─── */
  const hero = (
    <div
      className="h-[200px] lg:h-[300px]"
      style={{
        background: uni.img,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.18) 0%, rgba(0,0,0,.62) 100%)",
        }}
      />

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
        {/* initials box */}
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
            color: uni.accent,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
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
                background: "rgba(255,255,255,.22)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              #{uni.rank} QS
            </span>
            <span style={{ color: "rgba(255,255,255,.82)", fontSize: 13.5 }}>
              {uni.city}, {uni.country}
            </span>
          </div>
          <h1
            className="text-[26px] lg:text-[38px]"
            style={{
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {uni.name}
          </h1>
        </div>
      </div>
    </div>
  );

  /* ─── Quick Stats ─── */
  const stats = [
    {
      label: "QS Ranking",
      value: `#${uni.rank}`,
      sub: "QS World Rankings",
      color: "var(--color-navy)",
    },
    {
      label: "Satisfaction",
      value: `${uni.sat}%`,
      sub: "Student satisfaction",
      color: "var(--color-green)",
    },
    {
      label: "Employment",
      value: `${uni.emp}%`,
      sub: "Graduate employment",
      color: "var(--color-navy)",
    },
    {
      label: "Match",
      value: `${uni.match}%`,
      sub: "Profile match score",
      color: "var(--color-blue)",
    },
  ];

  const quickStats = (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 px-4 lg:px-7"
      style={{
        maxWidth: 1160,
        margin: "-30px auto 0",
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
          About {uni.name}
        </h2>
        <p
          style={{
            fontSize: 14.5,
            color: "var(--color-sub)",
            lineHeight: 1.7,
            margin: "0 0 24px",
          }}
        >
          {uni.name} is a world-renowned institution ranked #{uni.rank} globally
          by QS World Rankings. Located in {uni.city}, {uni.country}, it offers
          exceptional academic programs, cutting-edge research facilities, and a
          vibrant international community. With a {uni.sat}% student
          satisfaction rate and {uni.emp}% graduate employment rate, it
          consistently delivers outstanding outcomes for international students.
        </p>

        {/* 2x2 info cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
        >
          {[
            {
              icon: "🎓",
              title: "Scholarships",
              desc: uni.schShort + " available for international students",
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
              <div style={{ fontSize: 13, color: "var(--color-sub)", lineHeight: 1.55 }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* match card */}
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
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--color-green)",
              marginBottom: 4,
            }}
          >
            Your match
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "var(--color-green)",
            }}
          >
            {uni.match}%
          </div>
          <div style={{ fontSize: 13.5, color: "var(--color-green)", marginTop: 2 }}>
            Strong fit
          </div>
        </div>

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
            { label: "IELTS", value: uni.ielts },
            { label: "PTE", value: uni.pte },
            { label: "Tuition/yr", value: uni.tuition },
            { label: "Scholarship", value: uni.schShort },
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
      </div>
    </div>
  );

  /* ─── Tab: Courses ─── */
  const coursesTab = (
    <div>
      {uniCourses.length === 0 ? (
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
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {uniCourses.map((c) => (
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
                  <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
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
      )}
    </div>
  );

  /* ─── Tab: Requirements ─── */
  const requirementsTab = (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* English proficiency */}
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
          English proficiency
        </h3>
        {[
          { test: "IELTS Academic", score: uni.ielts, note: "Minimum overall" },
          { test: "PTE Academic", score: uni.pte, note: "Minimum overall" },
          {
            test: "PTE / MOI",
            score: "Accepted",
            note: "Medium of instruction certificate",
          },
        ].map((r) => (
          <div
            key={r.test}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                }}
              >
                {r.test}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                {r.note}
              </div>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-blue)",
              }}
            >
              {r.score}
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
          "Updated CV / résumé",
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
      {SCHOLARSHIPS.map((s) => (
        <div
          key={s.name}
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
              {s.who} · Deadline: {s.deadline}
            </div>
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
            {s.amount}
          </div>
        </div>
      ))}
    </div>
  );

  /* ─── Tab: Accommodation ─── */
  const accommodationTab = (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]"
    >
      {[
        {
          title: "On-campus housing",
          sub: "Fully furnished, meal plan included",
          price: "৳9.5L/yr",
        },
        {
          title: "Shared apartment",
          sub: "2-3 bedroom, close to campus",
          price: "৳7.2L/yr",
        },
        {
          title: "Homestay",
          sub: "With local family, meals included",
          price: "৳8.0L/yr",
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
  const galleryTab = (
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
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]"
    >
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
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
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
          Ask about {uni.name}
        </h2>
        <p
          style={{
            fontSize: 14.5,
            color: "rgba(255,255,255,.65)",
            lineHeight: 1.65,
            margin: "0 0 28px",
          }}
        >
          Get instant answers about admission requirements, scholarships,
          campus life, and more — powered by AI trained on official university
          data.
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
    <div style={{ paddingBottom: 90 }}>
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
        <div className="hidden lg:block">
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {uni.name}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
            Tuition from {uni.tuition}/yr
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
