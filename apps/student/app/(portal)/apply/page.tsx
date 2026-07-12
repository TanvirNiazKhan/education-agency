"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JOURNEY_STEPS } from "../../lib/data";

import { INITIAL_FORM, FormState } from "./_components/types";
import { ProgressBar } from "./_components/ProgressBar";
import { StepRail } from "./_components/StepRail";
import { ProgramStep } from "./_components/steps/ProgramStep";
import { PersonalStep } from "./_components/steps/PersonalStep";
import { PassportStep } from "./_components/steps/PassportStep";
import { AddressStep } from "./_components/steps/AddressStep";
import { EmergencyStep } from "./_components/steps/EmergencyStep";
import { EducationStep } from "./_components/steps/EducationStep";
import { WorkStep } from "./_components/steps/WorkStep";
import { DocumentsStep } from "./_components/steps/DocumentsStep";
import { ReviewStep } from "./_components/steps/ReviewStep";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/* ────────────────────────── Main page ────────────────────────────── */

export default function ApplyPage() {
  return (
    <Suspense>
      <ApplyPageInner />
    </Suspense>
  );
}

function ApplyPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM });
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string; faculty?: { name: string } }[]>([]);
  const [presetUniversity, setPresetUniversity] = useState(false);

  // Fetch universities list + pre-fill from query params
  useEffect(() => {
    fetch(`${API_BASE}/universities`).then((r) => r.json()).then((unis: { id: string; name: string; slug: string }[]) => {
      setUniversities(unis);

      const uniId = searchParams.get("university_id");
      const courseId = searchParams.get("course_id");

      if (uniId || courseId) setPresetUniversity(true);

      if (courseId) {
        fetch(`${API_BASE}/courses/${courseId}`).then((r) => r.json()).then((c: { name: string; faculty?: { name: string; university_id: string; university?: { name: string } } }) => {
          const uniName = c.faculty?.university?.name || unis.find((u) => u.id === c.faculty?.university_id)?.name || "";
          setForm((f) => ({ ...f, institution: uniName, course: c.name, campus: c.faculty?.name || "" }));
          // Load courses for that university
          if (c.faculty?.university_id) {
            loadCoursesForUni(c.faculty.university_id);
          }
        }).catch(() => {});
      } else if (uniId) {
        const uni = unis.find((u) => u.id === uniId);
        if (uni) setForm((f) => ({ ...f, institution: uni.name }));
        loadCoursesForUni(uniId);
      }
    }).catch(() => {});
  }, []);

  function loadCoursesForUni(uniId: string) {
    // Fetch faculties then courses for each
    fetch(`${API_BASE}/faculties?university_id=${uniId}`).then((r) => r.json()).then((faculties: { id: string; name: string }[]) => {
      const fetches = faculties.map((f) =>
        fetch(`${API_BASE}/courses?faculty_id=${f.id}`).then((r) => r.json()).then((cs: { id: string; name: string }[]) =>
          cs.map((c) => ({ ...c, faculty: f }))
        )
      );
      Promise.all(fetches).then((results) => setCourses(results.flat()));
    }).catch(() => {});
  }

  const totalSteps = JOURNEY_STEPS.length; // 9
  const progress = ((step + 1) / totalSteps) * 100;

  const set = <K extends keyof FormState>(key: K) => (val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(totalSteps - 1, s + 1));

  const toggleDoc = (name: string) => {
    setUploadedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  /* ── Review data for step 8 ────────────────────────────────────── */
  const reviewGroups = [
    {
      title: "Program",
      rows: [
        { label: "Institution", value: form.institution },
        { label: "Course", value: form.course },
        { label: "Campus", value: form.campus },
        { label: "Application type", value: form.appType },
        { label: "Start", value: `${form.commenceMonth} ${form.commenceYear}` },
        { label: "Study load", value: form.enrolType },
      ],
    },
    {
      title: "About you",
      rows: [
        { label: "Name", value: `${form.firstName} ${form.lastName}` },
        { label: "Gender", value: form.gender },
        { label: "Date of birth", value: form.dob },
        { label: "Marital status", value: form.maritalStatus },
        { label: "Email", value: form.email },
        { label: "Mobile", value: form.mobile },
      ],
    },
    {
      title: "Passport",
      rows: [
        { label: "Passport number", value: form.passportNo || "—" },
        { label: "Nationality", value: form.nationality },
        { label: "Date of issue", value: form.passIssueDate || "—" },
        { label: "Date of expiry", value: form.passExpiryDate || "—" },
        { label: "Visa refused?", value: form.visaRefused },
      ],
    },
    {
      title: "Address",
      rows: [
        { label: "City", value: form.curCity },
        { label: "State", value: form.curState },
        { label: "Postcode", value: form.curPostcode },
        { label: "Country", value: form.curCountry },
      ],
    },
    {
      title: "Emergency contact",
      rows: [
        { label: "Relationship", value: form.emRelationship },
        { label: "Name", value: `${form.emFirstName} ${form.emLastName}`.trim() },
        { label: "Mobile", value: form.emMobile || "—" },
      ],
    },
    {
      title: "Education",
      rows: [
        { label: "Highest education", value: form.eduLevel },
        { label: "Year completed", value: form.eduYear },
        { label: "English test", value: form.englishType },
        { label: "Overall score", value: form.engOverall || "—" },
      ],
    },
    {
      title: "Work experience",
      rows: [
        { label: "Worked after studies?", value: form.workedAfter },
        ...(form.workedAfter === "Yes"
          ? [
              { label: "Employer", value: form.employer || "—" },
              { label: "Period", value: `${form.workStart} — ${form.workEnd}` },
            ]
          : []),
      ],
    },
    {
      title: "Documents",
      rows: [
        {
          label: "Uploaded",
          value: uploadedDocs.size > 0 ? Array.from(uploadedDocs).join(", ") : "None yet",
        },
      ],
    },
  ];

  /* ───────────────────────── Render ──────────────────────────────── */

  return (
    <main>
      {/* ── Progress bar ─────────────────────────────────────────── */}
      <ProgressBar
        step={step}
        totalSteps={totalSteps}
        progress={progress}
        institutionInitial={form.institution.charAt(0)}
      />

      {/* ── Context banner ───────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#0a1330,#16224e)", color: "#fff" }}>
        <div
          className="px-4 lg:px-7"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            paddingTop: 22,
            paddingBottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg,#0e7490,#06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {form.institution.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{form.institution}</div>
            <div style={{ fontSize: 13, opacity: 0.78, marginTop: 2 }}>
              {form.course} &middot; {form.campus} &middot; {form.commenceMonth}{" "}
              {form.commenceYear}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <div
        className="px-4 lg:px-7 pb-[120px] md:pb-[90px] grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8"
        style={{ maxWidth: 1160, margin: "0 auto", paddingTop: 32 }}
      >
        {/* ── Step rail ──────────────────────────────────────────── */}
        <StepRail step={step} setStep={setStep} />

        {/* ── Form area ──────────────────────────────────────────── */}
        <div>
          <div
            style={{
              background: "var(--color-card)",
              borderRadius: 20,
              border: "1px solid var(--color-line)",
              padding: 30,
              minHeight: 400,
            }}
          >
            {step === 0 && (
              <ProgramStep
                form={form}
                set={set}
                universities={universities}
                courses={courses}
                presetUniversity={presetUniversity}
                loadCoursesForUni={loadCoursesForUni}
              />
            )}
            {step === 1 && <PersonalStep form={form} set={set} />}
            {step === 2 && <PassportStep form={form} set={set} />}
            {step === 3 && <AddressStep form={form} set={set} />}
            {step === 4 && <EmergencyStep form={form} set={set} />}
            {step === 5 && <EducationStep form={form} set={set} />}
            {step === 6 && <WorkStep form={form} set={set} />}
            {step === 7 && <DocumentsStep uploadedDocs={uploadedDocs} toggleDoc={toggleDoc} />}
            {step === 8 && <ReviewStep form={form} reviewGroups={reviewGroups} setForm={setForm} />}
          </div>

          {/* ── Nav buttons ───────────────────────────────────────── */}
          {!(step === 8 && form.submitted) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
              }}
            >
              {step > 0 ? (
                <button
                  onClick={back}
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-sub)",
                    background: "transparent",
                    border: "1.5px solid var(--color-line)",
                    borderRadius: 12,
                    padding: "12px 24px",
                    cursor: "pointer",
                  }}
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}
              {step < 8 && (
                <button
                  onClick={next}
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 32px",
                    cursor: "pointer",
                  }}
                >
                  {step === 7 ? "Review application" : "Continue"} &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
