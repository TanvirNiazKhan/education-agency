"use client";

import { FormState, INPUT_STYLE, LABEL_STYLE } from "../types";
import { FieldInput, FieldSelect } from "../FormFields";
import type { UniOption, IntakeOption } from "../../page";

interface ProgramStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
  universities: UniOption[];
  courses: { id: string; name: string; faculty?: { name: string } }[];
  intakes: IntakeOption[];
  presetUniversity: boolean;
  loadCoursesForUni: (uniId: string) => void;
}

function UniInfoCard({ uni }: { uni: UniOption }) {
  const location = [uni.city?.name, uni.country?.name].filter(Boolean).join(", ");
  return (
    <div
      style={{
        marginTop: 10,
        padding: "12px 16px",
        background: "var(--color-blue-x)",
        border: "1px solid var(--color-line)",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px 18px",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--color-sub)",
      }}
    >
      {location && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </span>
      )}
      {uni.university_type && (
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 100,
            background: "var(--color-card)",
            border: "1px solid var(--color-line)",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-navy)",
          }}
        >
          {uni.university_type}
        </span>
      )}
      {uni.website && (
        <a
          href={uni.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--color-blue)",
            fontWeight: 700,
            textDecoration: "none",
            marginLeft: "auto",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          Visit website ↗
        </a>
      )}
    </div>
  );
}

export function ProgramStep({
  form,
  set,
  universities,
  courses,
  intakes,
  presetUniversity,
  loadCoursesForUni,
}: ProgramStepProps) {
  const selectedUni = universities.find((u) => u.id === form.institution_id);
  const openIntakes = intakes.filter((i) => i.status === "open");
  const intakeOptions = openIntakes.length > 0 ? openIntakes : intakes;
  const selectedIntake = intakes.find((i) => i.name === form.commenceMonth);
  const intakeHint = !form.institution_id
    ? "Select an institution first"
    : intakes.length === 0
      ? "No intakes listed for this university yet"
      : selectedIntake?.deadline
        ? `Application deadline: ${new Date(selectedIntake.deadline).toLocaleDateString()}`
        : undefined;
  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: "0 0 6px",
        }}
      >
        Let&apos;s start with your program
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Choose the institution, course, and intake you want to apply for.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <div className="sm:col-span-2">
          {presetUniversity ? (
            <div>
              <label style={LABEL_STYLE}>Institution</label>
              <div style={{ ...INPUT_STYLE, display: "flex", alignItems: "center", background: "var(--color-line-2)", color: "var(--color-ink)" }}>
                {form.institution}
              </div>
            </div>
          ) : (
            <FieldSelect
              label="Institution"
              value={form.institution}
              onChange={(v) => {
                set("institution")(v);
                set("course")("");
                set("course_id")("");
                set("campus")("");
                set("commenceMonth")("");
                set("commenceYear")("");
                const uni = universities.find((u) => u.name === v);
                if (uni) {
                  set("institution_id")(uni.id);
                  loadCoursesForUni(uni.id);
                }
              }}
              options={universities.map((u) => u.name)}
            />
          )}
          {selectedUni && <UniInfoCard uni={selectedUni} />}
        </div>
        <div className="sm:col-span-2">
          <FieldSelect
            label="Course"
            value={form.course}
            onChange={(v) => {
              set("course")(v);
              const c = courses.find((c) => c.name === v);
              if (c) {
                set("course_id")(c.id);
                if (c.faculty) set("campus")(c.faculty.name);
              }
            }}
            options={courses.map((c) => c.name)}
          />
        </div>
        <FieldInput
          label="Campus / Faculty"
          value={form.campus}
          onChange={set("campus")}
        />
        <FieldSelect
          label="Application type"
          value={form.appType}
          onChange={set("appType")}
          options={["New application", "Course transfer", "Package"]}
        />
        <FieldSelect
          label="Intake"
          value={form.commenceMonth}
          onChange={(v) => {
            set("commenceMonth")(v);
            const it = intakes.find((i) => i.name === v);
            set("commenceYear")(
              it?.start_date ? String(new Date(it.start_date).getFullYear()) : "",
            );
          }}
          options={intakeOptions.map((i) => i.name)}
          hint={intakeHint}
        />
        <FieldSelect
          label="Study load"
          value={form.enrolType}
          onChange={set("enrolType")}
          options={["Full-time", "Part-time"]}
        />
        <FieldInput
          label="Travelling preference"
          value={form.travelPref}
          onChange={set("travelPref")}
          optional
        />
      </div>
    </div>
  );
}
