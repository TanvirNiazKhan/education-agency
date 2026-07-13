"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { JOURNEY_STEPS } from "../../lib/data";
import { upsertStudentProfile, createApplication } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";

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

export interface UniOption {
  id: string;
  name: string;
  website?: string | null;
  university_type?: string | null;
  city?: { name: string };
  country?: { name: string };
  images?: { url: string; type: string; sort_order: number; is_active: boolean }[];
}

const IMG_BASE = API_BASE.replace(/\/api$/, "");

export interface IntakeOption {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  deadline: string | null;
}

export function getUniLogoUrl(uni?: UniOption): string | null {
  const logo = (uni?.images ?? [])
    .filter((img) => img.type === "logo" && img.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)[0];
  return logo ? `${IMG_BASE}${logo.url}` : null;
}

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
  const router = useRouter();
  const { token, user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM });
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [universities, setUniversities] = useState<UniOption[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string; faculty?: { name: string } }[]>([]);
  const [intakes, setIntakes] = useState<IntakeOption[]>([]);
  const [presetUniversity, setPresetUniversity] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftApplicationId, setDraftApplicationId] = useState<string | null>(null);

  const DRAFT_KEY = "odyssey_apply_draft";

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((f) => ({ ...f, ...parsed }));
      }
    } catch {}
  }, []);

  // Auto-save draft on form change
  useEffect(() => {
    if (!form.submitted) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch {}
    }
  }, [form]);

  // Pre-fill name/email from logged-in user
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        firstName: f.firstName || user.first_name,
        lastName: f.lastName || user.last_name,
        email: f.email || user.email,
        mobile: f.mobile || user.phone || "",
      }));
    }
  }, [user]);

  // Fetch universities list + pre-fill from query params
  useEffect(() => {
    fetch(`${API_BASE}/universities`).then((r) => r.json()).then((unis: UniOption[]) => {
      setUniversities(unis);

      const uniId = searchParams.get("university_id");
      const courseId = searchParams.get("course_id");

      if (uniId || courseId) setPresetUniversity(true);

      if (courseId) {
        fetch(`${API_BASE}/courses/${courseId}`).then((r) => r.json()).then((c: { name: string; faculty?: { name: string; university_id: string; university?: { name: string } } }) => {
          const uniId2 = c.faculty?.university_id || "";
          const uniName = c.faculty?.university?.name || unis.find((u) => u.id === uniId2)?.name || "";
          setForm((f) => ({ ...f, institution: uniName, institution_id: uniId2, course: c.name, course_id: courseId, campus: c.faculty?.name || "" }));
          if (uniId2) loadCoursesForUni(uniId2);
        }).catch(() => {});
      } else if (uniId) {
        const uni = unis.find((u) => u.id === uniId);
        if (uni) setForm((f) => ({ ...f, institution: uni.name, institution_id: uni.id }));
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
    // Fetch university intakes
    fetch(`${API_BASE}/intakes?university_id=${uniId}`)
      .then((r) => r.json())
      .then((its: IntakeOption[]) => setIntakes(Array.isArray(its) ? its : []))
      .catch(() => setIntakes([]));
  }

  const totalSteps = JOURNEY_STEPS.length; // 9
  const progress = ((step + 1) / totalSteps) * 100;

  const set = <K extends keyof FormState>(key: K) => (val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = async () => {
    const nextStep = Math.min(totalSteps - 1, step + 1);
    // Create draft application when entering Documents step (step 7)
    if (nextStep === 7 && !draftApplicationId && token && form.institution_id && form.course_id) {
      try {
        const app = await createApplication(token, {
          university_id: form.institution_id,
          course_id: form.course_id,
          campus: form.campus || undefined,
          application_type: form.appType,
          study_location: form.studyLocation,
          student_type: form.studentType,
          enrolment_type: form.enrolType,
          commence_month: form.commenceMonth || undefined,
          commence_year: form.commenceYear || undefined,
        }) as { id: string };
        setDraftApplicationId(app.id);
      } catch {
        // Non-blocking — upload button shows warning if no applicationId
      }
    }
    setStep(nextStep);
  };

  const toggleDoc = (name: string) => {
    setUploadedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  /* ── Submit handler ────────────────────────────────────────────── */
  async function handleSubmit() {
    if (!token) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      // 1. Save student profile
      await upsertStudentProfile(token, {
        personal: {
          gender: form.gender,
          date_of_birth: form.dob || undefined,
          marital_status: form.maritalStatus,
          mobile: form.mobile,
          home_phone: form.homePhone || undefined,
          skype: form.skype || undefined,
          nationality: form.nationality,
          passport_no: form.passportNo || undefined,
          passport_issue_date: form.passIssueDate || undefined,
          passport_expiry_date: form.passExpiryDate || undefined,
          passport_issue_place: form.passIssuePlace || undefined,
          passport_birth_place: form.passBirthPlace || undefined,
          visa_refused: form.visaRefused === "Yes",
        },
        current_address: {
          street: form.curStreet || undefined,
          apt: form.curApt || undefined,
          city: form.curCity || undefined,
          state: form.curState || undefined,
          postcode: form.curPostcode || undefined,
          country: form.curCountry || undefined,
        },
        permanent_address: form.sameAsCurrent
          ? {
              street: form.curStreet || undefined,
              apt: form.curApt || undefined,
              city: form.curCity || undefined,
              state: form.curState || undefined,
              postcode: form.curPostcode || undefined,
              country: form.curCountry || undefined,
            }
          : {
              street: form.permStreet || undefined,
              apt: form.permApt || undefined,
              city: form.permCity || undefined,
              state: form.permState || undefined,
              postcode: form.permPostcode || undefined,
              country: form.permCountry || undefined,
            },
        emergency_contact: {
          relationship: form.emRelationship || undefined,
          first_name: form.emFirstName || undefined,
          last_name: form.emLastName || undefined,
          mobile: form.emMobile || undefined,
          other_phone: form.emOtherPhone || undefined,
          email: form.emEmail || undefined,
        },
        education: {
          level: form.eduLevel || undefined,
          completion_year: form.eduYear || undefined,
          english_test_type: form.englishType || undefined,
          english_test_date: form.englishDate || undefined,
          score_overall: form.engOverall ? parseFloat(form.engOverall) : undefined,
          score_reading: form.engReading ? parseFloat(form.engReading) : undefined,
          score_listening: form.engListening ? parseFloat(form.engListening) : undefined,
          score_writing: form.engWriting ? parseFloat(form.engWriting) : undefined,
          score_speaking: form.engSpeaking ? parseFloat(form.engSpeaking) : undefined,
        },
        work_experience:
          form.workedAfter === "Yes"
            ? {
                employer: form.employer || undefined,
                manager: form.manager || undefined,
                start_date: form.workStart || undefined,
                end_date: form.workEnd || undefined,
                professional_membership: form.profMembership || undefined,
              }
            : undefined,
      });

      // 2. Create application (skip if draft already created at Documents step)
      if (!draftApplicationId) {
        await createApplication(token, {
          university_id: form.institution_id,
          course_id: form.course_id,
          campus: form.campus || undefined,
          application_type: form.appType,
          study_location: form.studyLocation,
          student_type: form.studentType,
          enrolment_type: form.enrolType,
          commence_month: form.commenceMonth || undefined,
          commence_year: form.commenceYear || undefined,
        });
      }

      setForm((f) => ({ ...f, submitted: true }));
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Review data for step 8 ────────────────────────────────────── */
  const reviewGroups = [
    {
      title: "Program",
      rows: [
        { label: "Institution", value: form.institution },
        { label: "Course", value: form.course },
        { label: "Campus", value: form.campus },
        { label: "Application type", value: form.appType },
        { label: "Intake", value: `${form.commenceMonth} ${form.commenceYear}`.trim() },
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

  const selectedUni = universities.find((u) => u.id === form.institution_id);
  const uniLogo = getUniLogoUrl(selectedUni);

  return (
    <main>
      {/* ── Progress bar ─────────────────────────────────────────── */}
      <ProgressBar
        step={step}
        totalSteps={totalSteps}
        progress={progress}
        institution={form.institution}
        subtitle={[
          [selectedUni?.city?.name, selectedUni?.country?.name].filter(Boolean).join(", "),
          form.course,
          form.campus,
          `${form.commenceMonth} ${form.commenceYear}`.trim(),
        ]
          .filter(Boolean)
          .join(" · ")}
        universityType={selectedUni?.university_type}
        website={selectedUni?.website}
        logoUrl={uniLogo}
      />

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
                intakes={intakes}
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
            {step === 7 && (
              <DocumentsStep
                uploadedDocs={uploadedDocs}
                toggleDoc={toggleDoc}
                applicationId={draftApplicationId || undefined}
              />
            )}
            {step === 8 && (
              <ReviewStep
                form={form}
                reviewGroups={reviewGroups}
                setForm={setForm}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            )}
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
