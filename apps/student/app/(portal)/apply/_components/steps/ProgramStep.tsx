"use client";

import { FormState, INPUT_STYLE, LABEL_STYLE } from "../types";
import { FieldInput, FieldSelect } from "../FormFields";
import { MONTHS } from "../../../../lib/data";

interface ProgramStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
  universities: { id: string; name: string }[];
  courses: { id: string; name: string; faculty?: { name: string } }[];
  presetUniversity: boolean;
  loadCoursesForUni: (uniId: string) => void;
}

export function ProgramStep({
  form,
  set,
  universities,
  courses,
  presetUniversity,
  loadCoursesForUni,
}: ProgramStepProps) {
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
                set("campus")("");
                const uni = universities.find((u) => u.name === v);
                if (uni) loadCoursesForUni(uni.id);
              }}
              options={universities.map((u) => u.name)}
            />
          )}
        </div>
        <div className="sm:col-span-2">
          <FieldSelect
            label="Course"
            value={form.course}
            onChange={(v) => {
              set("course")(v);
              const c = courses.find((c) => c.name === v);
              if (c?.faculty) set("campus")(c.faculty.name);
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
          label="Start month"
          value={form.commenceMonth}
          onChange={set("commenceMonth")}
          options={MONTHS}
        />
        <FieldSelect
          label="Start year"
          value={form.commenceYear}
          onChange={set("commenceYear")}
          options={["2026", "2027", "2028"]}
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
