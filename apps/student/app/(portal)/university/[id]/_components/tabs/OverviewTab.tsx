"use client";

import { ApiUniversity, ApiIntake, ApiScholarship, CourseWithFaculty } from "../types";

interface OverviewTabProps {
  university: ApiUniversity;
  courses: CourseWithFaculty[];
  scholarships: ApiScholarship[];
  intakes: ApiIntake[];
  minIelts: number | null;
  minPte: number | null;
  tuitionDisplay: string;
  schSummary: string;
}

export default function OverviewTab({
  university,
  courses,
  scholarships,
  intakes,
  minIelts,
  minPte,
  tuitionDisplay,
  schSummary,
}: OverviewTabProps) {
  const schCount = scholarships.length;

  return (
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
}
