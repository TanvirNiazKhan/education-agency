"use client";

import Link from "next/link";
import { CourseWithFaculty, COURSE_TINTS } from "../types";

interface CoursesTabProps {
  courses: CourseWithFaculty[];
}

export default function CoursesTab({ courses }: CoursesTabProps) {
  if (courses.length === 0) {
    return (
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
    );
  }

  return (
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
  );
}
