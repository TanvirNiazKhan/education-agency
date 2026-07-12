"use client";

import { FormState } from "../types";
import { FieldInput, FieldSelect } from "../FormFields";
import { YEARS_LIST } from "../../../../lib/data";

interface EducationStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function EducationStep({ form, set }: EducationStepProps) {
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
        Your education &amp; English
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Your academic background and English proficiency.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <FieldSelect
          label="Highest education"
          value={form.eduLevel}
          onChange={set("eduLevel")}
          options={[
            "Higher Secondary (HSC)",
            "Diploma",
            "Bachelor's degree",
            "Master's degree",
            "PhD",
          ]}
        />
        <FieldSelect
          label="Year completed"
          value={form.eduYear}
          onChange={set("eduYear")}
          options={YEARS_LIST}
        />
        <div className="sm:col-span-2">
          <FieldSelect
            label="English test"
            value={form.englishType}
            onChange={set("englishType")}
            options={[
              "IELTS Academic",
              "IELTS General",
              "PTE Academic",
              "TOEFL iBT",
              "None",
            ]}
            hint="Select the English proficiency test you have taken or plan to take."
          />
        </div>
        <div className="sm:col-span-2">
          <FieldInput
            label="Test date"
            value={form.englishDate}
            onChange={set("englishDate")}
            type="date"
          />
        </div>
        <FieldInput
          label="Overall score"
          value={form.engOverall}
          onChange={set("engOverall")}
        />
        <FieldInput
          label="Reading"
          value={form.engReading}
          onChange={set("engReading")}
        />
        <FieldInput
          label="Listening"
          value={form.engListening}
          onChange={set("engListening")}
        />
        <FieldInput
          label="Writing"
          value={form.engWriting}
          onChange={set("engWriting")}
        />
        <FieldInput
          label="Speaking"
          value={form.engSpeaking}
          onChange={set("engSpeaking")}
        />
      </div>
    </div>
  );
}
