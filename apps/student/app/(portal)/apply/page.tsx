"use client";

import { useState } from "react";
import {
  JOURNEY_STEPS,
  DOCS_REQUIRED,
  DOCS_OPTIONAL,
  INSTITUTIONS,
  CAMPUSES,
  COURSE_LIST,
  ALL_COUNTRIES,
  MONTHS,
  YEARS_LIST,
} from "../../lib/data";

/* ────────────────────────── Form state shape ────────────────────────── */

const INITIAL_FORM = {
  institution: "CQUniversity Australia",
  course: "Bachelor of Information Technology",
  campus: "Sydney",
  appType: "New application",
  commenceMonth: "February",
  commenceYear: "2026",
  studyLocation: "Offshore (still in my home country)",
  studentType: "International",
  enrolType: "Full-time",
  travelPref: "",

  firstName: "Ayaan",
  lastName: "Rahman",
  gender: "Male",
  dob: "2003-05-14",
  maritalStatus: "Single",
  email: "ayaan.rahman@email.com",
  mobile: "+880 1712 345678",
  homePhone: "",
  skype: "",

  passportNo: "",
  nationality: "Bangladesh",
  passIssueDate: "",
  passExpiryDate: "",
  passIssuePlace: "",
  passBirthPlace: "",
  visaRefused: "No",

  curStreet: "",
  curApt: "",
  curCity: "Dhaka",
  curState: "Dhaka Division",
  curPostcode: "1207",
  curCountry: "Bangladesh",
  sameAsCurrent: true,
  permStreet: "",
  permApt: "",
  permCity: "",
  permState: "",
  permPostcode: "",
  permCountry: "",

  emRelationship: "Parent",
  emFirstName: "",
  emLastName: "Rahman",
  emMobile: "",
  emOtherPhone: "",
  emEmail: "",

  eduLevel: "Higher Secondary (HSC)",
  eduYear: "2021",
  englishType: "IELTS Academic",
  englishDate: "",
  engOverall: "",
  engReading: "",
  engListening: "",
  engWriting: "",
  engSpeaking: "",

  workedAfter: "No",
  employer: "",
  manager: "",
  workStart: "",
  workEnd: "",
  profMembership: "",

  submitted: false,
};

type FormState = typeof INITIAL_FORM;

/* ────────────────────────── Style constants ────────────────────────── */

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  height: 46,
  padding: "0 16px",
  borderRadius: 11,
  border: "1px solid var(--color-line)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-ink)",
  background: "#fbfcfe",
  boxSizing: "border-box",
};

const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  appearance: "none" as const,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238592ad' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 38,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "var(--color-sub)",
  display: "block",
  marginBottom: 8,
};

/* ────────────────────────── Reusable helpers ─────────────────────── */

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  optional,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>
        {label}
        {optional && (
          <span style={{ fontWeight: 500, color: "var(--color-muted)", marginLeft: 4 }}>
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={INPUT_STYLE}
      />
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
  optional,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>
        {label}
        {optional && (
          <span style={{ fontWeight: 500, color: "var(--color-muted)", marginLeft: 4 }}>
            (optional)
          </span>
        )}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={SELECT_STYLE}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

function RadioPills({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  hint?: string;
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const selected = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              style={{
                padding: "10px 20px",
                borderRadius: 11,
                border: selected ? "1.5px solid var(--color-blue)" : "1px solid var(--color-line)",
                background: selected ? "var(--color-blue)" : "#fbfcfe",
                color: selected ? "#fff" : "var(--color-sub)",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "6px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 15,
        fontWeight: 800,
        color: "var(--color-navy)",
        margin: "28px 0 16px",
        paddingBottom: 10,
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      {children}
    </h3>
  );
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────── Main page ────────────────────────────── */

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM });
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());

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
        { label: "Study location", value: form.studyLocation },
        { label: "Student type", value: form.studentType },
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
      <div
        style={{
          position: "sticky",
          top: 66,
          zIndex: 40,
          background: "var(--color-card)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <div
          className="px-4 lg:px-7"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            paddingTop: 14,
            paddingBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* University badge */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg,#0e7490,#06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {form.institution.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                Step {step + 1} of {totalSteps} &middot; {JOURNEY_STEPS[step]}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--color-green)",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)" }}>
                  Auto-saved
                </span>
              </div>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--color-line)",
                borderRadius: 3,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
                  borderRadius: 3,
                  transition: "width .3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

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
        <div className="hidden lg:block" style={{ position: "sticky", top: 150, alignSelf: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {JOURNEY_STEPS.map((s, i) => {
              const completed = i < step;
              const current = i === step;
              return (
                <button
                  key={s}
                  onClick={() => setStep(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "none",
                    background: current ? "var(--color-blue-x)" : "transparent",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12.5,
                      fontWeight: 800,
                      flexShrink: 0,
                      ...(completed
                        ? { background: "var(--color-green)", color: "#fff" }
                        : current
                          ? { background: "var(--color-blue)", color: "#fff" }
                          : {
                              background: "transparent",
                              border: "2px solid var(--color-line)",
                              color: "var(--color-muted)",
                            }),
                    }}
                  >
                    {completed ? <CheckIcon /> : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: current ? 800 : 600,
                      color: completed
                        ? "var(--color-green)"
                        : current
                          ? "var(--color-blue)"
                          : "var(--color-muted)",
                    }}
                  >
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
            {/* ─── Step 0 — Your program ──────────────────────────── */}
            {step === 0 && (
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
                    <FieldSelect
                      label="Institution"
                      value={form.institution}
                      onChange={set("institution")}
                      options={INSTITUTIONS}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldSelect
                      label="Course"
                      value={form.course}
                      onChange={set("course")}
                      options={COURSE_LIST}
                    />
                  </div>
                  <FieldSelect
                    label="Campus"
                    value={form.campus}
                    onChange={set("campus")}
                    options={CAMPUSES}
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
                  <div className="sm:col-span-2">
                    <RadioPills
                      label="Study location"
                      value={form.studyLocation}
                      onChange={set("studyLocation")}
                      options={["Onshore", "Offshore (still in my home country)"]}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <RadioPills
                      label="Student type"
                      value={form.studentType}
                      onChange={set("studentType")}
                      options={["International", "Domestic"]}
                    />
                  </div>
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
            )}

            {/* ─── Step 1 — About you ─────────────────────────────── */}
            {step === 1 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  A little about you
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  Your personal details for the application.
                </p>

                {/* Scan passport CTA */}
                <div
                  style={{
                    border: "2px dashed var(--color-blue)",
                    background: "var(--color-blue-x)",
                    borderRadius: 14,
                    padding: "20px 24px",
                    marginBottom: 28,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#2563eb" strokeWidth="1.8" />
                    <circle cx="12" cy="11" r="3" stroke="#2563eb" strokeWidth="1.8" />
                    <path d="M7 17c0-2.21 2.24-4 5-4s5 1.79 5 4" stroke="#2563eb" strokeWidth="1.8" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-blue)" }}>
                      Save time — scan your passport
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-sub)", marginTop: 2 }}>
                      We&apos;ll auto-fill your personal details from your passport photo.
                    </div>
                  </div>
                  <button
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      background: "var(--color-blue)",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 20px",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    Scan passport
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <FieldInput label="First name" value={form.firstName} onChange={set("firstName")} />
                  <FieldInput label="Last name" value={form.lastName} onChange={set("lastName")} />
                  <div className="sm:col-span-2">
                    <RadioPills
                      label="Gender"
                      value={form.gender}
                      onChange={set("gender")}
                      options={["Male", "Female"]}
                    />
                  </div>
                  <FieldInput
                    label="Date of birth"
                    value={form.dob}
                    onChange={set("dob")}
                    type="date"
                  />
                  <FieldSelect
                    label="Marital status"
                    value={form.maritalStatus}
                    onChange={set("maritalStatus")}
                    options={["Single", "Married", "Divorced", "Widowed"]}
                  />
                  <div className="sm:col-span-2">
                    <FieldInput label="Email" value={form.email} onChange={set("email")} />
                  </div>
                  <FieldInput label="Mobile" value={form.mobile} onChange={set("mobile")} />
                  <FieldInput
                    label="Home phone"
                    value={form.homePhone}
                    onChange={set("homePhone")}
                    optional
                  />
                  <div className="sm:col-span-2">
                    <FieldInput
                      label="Skype"
                      value={form.skype}
                      onChange={set("skype")}
                      optional
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2 — Passport ──────────────────────────────── */}
            {step === 2 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  Your passport details
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  We need these details to verify your identity.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <FieldInput
                    label="Passport number"
                    value={form.passportNo}
                    onChange={set("passportNo")}
                  />
                  <FieldSelect
                    label="Nationality"
                    value={form.nationality}
                    onChange={set("nationality")}
                    options={ALL_COUNTRIES}
                  />
                  <FieldInput
                    label="Date of issue"
                    value={form.passIssueDate}
                    onChange={set("passIssueDate")}
                    type="date"
                  />
                  <FieldInput
                    label="Date of expiry"
                    value={form.passExpiryDate}
                    onChange={set("passExpiryDate")}
                    type="date"
                  />
                  <FieldInput
                    label="Place of issue"
                    value={form.passIssuePlace}
                    onChange={set("passIssuePlace")}
                  />
                  <FieldInput
                    label="Place of birth"
                    value={form.passBirthPlace}
                    onChange={set("passBirthPlace")}
                  />
                  <div className="sm:col-span-2">
                    <RadioPills
                      label="Previous visa refused?"
                      value={form.visaRefused}
                      onChange={set("visaRefused")}
                      options={["No", "Yes"]}
                      hint="If yes, please provide details in the documents step."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 3 — Address ───────────────────────────────── */}
            {step === 3 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  Where do you live?
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  Your current and permanent address details.
                </p>

                <SectionHeader>Current address</SectionHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <div className="sm:col-span-2">
                    <FieldInput
                      label="Street address"
                      value={form.curStreet}
                      onChange={set("curStreet")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldInput
                      label="Apartment / suite / unit"
                      value={form.curApt}
                      onChange={set("curApt")}
                      optional
                    />
                  </div>
                  <FieldInput label="City" value={form.curCity} onChange={set("curCity")} />
                  <FieldInput label="State" value={form.curState} onChange={set("curState")} />
                  <FieldInput
                    label="Postcode"
                    value={form.curPostcode}
                    onChange={set("curPostcode")}
                  />
                  <FieldSelect
                    label="Country"
                    value={form.curCountry}
                    onChange={set("curCountry")}
                    options={ALL_COUNTRIES}
                  />
                </div>

                {/* Same-as checkbox */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 28,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: form.sameAsCurrent ? "none" : "2px solid var(--color-line)",
                      background: form.sameAsCurrent ? "var(--color-blue)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    onClick={() => set("sameAsCurrent")(!form.sameAsCurrent)}
                  >
                    {form.sameAsCurrent && <CheckIcon />}
                  </div>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}
                    onClick={() => set("sameAsCurrent")(!form.sameAsCurrent)}
                  >
                    My permanent address is the same as my current address
                  </span>
                </label>

                {form.sameAsCurrent ? (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "var(--color-green-bg)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke="var(--color-green)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-green)" }}>
                      Permanent address will be copied from your current address.
                    </span>
                  </div>
                ) : (
                  <>
                    <SectionHeader>Permanent address</SectionHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                      <div className="sm:col-span-2">
                        <FieldInput
                          label="Street address"
                          value={form.permStreet}
                          onChange={set("permStreet")}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FieldInput
                          label="Apartment / suite / unit"
                          value={form.permApt}
                          onChange={set("permApt")}
                          optional
                        />
                      </div>
                      <FieldInput
                        label="City"
                        value={form.permCity}
                        onChange={set("permCity")}
                      />
                      <FieldInput
                        label="State"
                        value={form.permState}
                        onChange={set("permState")}
                      />
                      <FieldInput
                        label="Postcode"
                        value={form.permPostcode}
                        onChange={set("permPostcode")}
                      />
                      <FieldSelect
                        label="Country"
                        value={form.permCountry}
                        onChange={set("permCountry")}
                        options={ALL_COUNTRIES}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ─── Step 4 — Emergency contact ─────────────────────── */}
            {step === 4 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  Who should we contact in an emergency?
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  A family member or close friend we can reach if needed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <FieldSelect
                    label="Relationship"
                    value={form.emRelationship}
                    onChange={set("emRelationship")}
                    options={["Parent", "Sibling", "Spouse", "Friend", "Other"]}
                  />
                  <FieldInput
                    label="First name"
                    value={form.emFirstName}
                    onChange={set("emFirstName")}
                  />
                  <FieldInput
                    label="Last name"
                    value={form.emLastName}
                    onChange={set("emLastName")}
                  />
                  <FieldInput label="Mobile" value={form.emMobile} onChange={set("emMobile")} />
                  <FieldInput
                    label="Other phone"
                    value={form.emOtherPhone}
                    onChange={set("emOtherPhone")}
                    optional
                  />
                  <FieldInput
                    label="Email"
                    value={form.emEmail}
                    onChange={set("emEmail")}
                    optional
                  />
                </div>
              </div>
            )}

            {/* ─── Step 5 — Education & English ───────────────────── */}
            {step === 5 && (
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
            )}

            {/* ─── Step 6 — Work experience ───────────────────────── */}
            {step === 6 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  Any work experience?
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  Let us know if you have any professional experience after your studies.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <div className="sm:col-span-2">
                    <RadioPills
                      label="Have you worked after completing your studies?"
                      value={form.workedAfter}
                      onChange={set("workedAfter")}
                      options={["No", "Yes"]}
                    />
                  </div>
                  {form.workedAfter === "Yes" && (
                    <>
                      <FieldInput
                        label="Employer"
                        value={form.employer}
                        onChange={set("employer")}
                      />
                      <FieldInput
                        label="Manager"
                        value={form.manager}
                        onChange={set("manager")}
                      />
                      <FieldInput
                        label="Start date"
                        value={form.workStart}
                        onChange={set("workStart")}
                        type="date"
                      />
                      <FieldInput
                        label="End date"
                        value={form.workEnd}
                        onChange={set("workEnd")}
                        type="date"
                      />
                      <div className="sm:col-span-2">
                        <FieldInput
                          label="Professional membership"
                          value={form.profMembership}
                          onChange={set("profMembership")}
                          optional
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ─── Step 7 — Documents ─────────────────────────────── */}
            {step === 7 && (
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 6px",
                  }}
                >
                  Upload your documents
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                  Please upload the required documents for your application.
                </p>

                {/* Required */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
                    Required documents
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      background: "var(--color-blue)",
                      borderRadius: 10,
                      padding: "2px 10px",
                    }}
                  >
                    {DOCS_REQUIRED.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {DOCS_REQUIRED.map((d) => {
                    const uploaded = uploadedDocs.has(d.name);
                    return (
                      <div
                        key={d.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "16px 18px",
                          borderRadius: 14,
                          border: "1px solid var(--color-line)",
                          background: "#fff",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: uploaded ? "var(--color-green-bg)" : "var(--color-blue-x)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                            <path
                              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                              stroke={uploaded ? "var(--color-green)" : "var(--color-blue)"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 2v6h6"
                              stroke={uploaded ? "var(--color-green)" : "var(--color-blue)"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                            {d.name}
                          </div>
                          <div
                            style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}
                          >
                            {d.hint}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleDoc(d.name)}
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: uploaded ? "var(--color-green)" : "var(--color-blue)",
                            background: uploaded ? "var(--color-green-bg)" : "var(--color-blue-x)",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 16px",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          {uploaded ? "Uploaded" : "Upload"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Optional */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
                    Optional documents
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--color-muted)",
                      background: "var(--color-line-2)",
                      borderRadius: 10,
                      padding: "2px 10px",
                    }}
                  >
                    If applicable
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {DOCS_OPTIONAL.map((d) => {
                    const uploaded = uploadedDocs.has(d.name);
                    return (
                      <div
                        key={d.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "16px 18px",
                          borderRadius: 14,
                          border: "1px solid var(--color-line)",
                          background: uploaded ? "#fff" : "var(--color-line-2)",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: uploaded ? "var(--color-green-bg)" : "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                            <path
                              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                              stroke={uploaded ? "var(--color-green)" : "var(--color-muted)"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 2v6h6"
                              stroke={uploaded ? "var(--color-green)" : "var(--color-muted)"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                            {d.name}
                          </div>
                          <div
                            style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}
                          >
                            {d.hint}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleDoc(d.name)}
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: uploaded ? "var(--color-green)" : "var(--color-muted)",
                            background: uploaded ? "var(--color-green-bg)" : "#fff",
                            border: uploaded ? "none" : "1px solid var(--color-line)",
                            borderRadius: 10,
                            padding: "8px 16px",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          {uploaded ? "Uploaded" : "Upload"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── Step 8 — Review & submit ───────────────────────── */}
            {step === 8 && (
              <div>
                {!form.submitted ? (
                  <>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                        margin: "0 0 6px",
                      }}
                    >
                      Review &amp; submit
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
                      Please review all the information before submitting your application.
                    </p>

                    {reviewGroups.map((g) => (
                      <div key={g.title} style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "var(--color-blue)",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            padding: "10px 20px",
                            background: "var(--color-blue-x)",
                            borderRadius: "12px 12px 0 0",
                            border: "1px solid var(--color-line)",
                            borderBottom: "none",
                          }}
                        >
                          {g.title}
                        </div>
                        <div
                          style={{
                            border: "1px solid var(--color-line)",
                            borderRadius: "0 0 12px 12px",
                            overflow: "hidden",
                          }}
                        >
                          {g.rows.map((row, i) => (
                            <div
                              key={row.label}
                              className="grid grid-cols-1 sm:grid-cols-[180px_1fr]"
                              style={{
                                borderBottom:
                                  i < g.rows.length - 1
                                    ? "1px solid var(--color-line)"
                                    : "none",
                                background: i % 2 === 0 ? "transparent" : "var(--color-line-2)",
                              }}
                            >
                              <div
                                style={{
                                  padding: "12px 20px",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "var(--color-sub)",
                                }}
                              >
                                {row.label}
                              </div>
                              <div
                                style={{
                                  padding: "12px 20px",
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "var(--color-ink)",
                                }}
                              >
                                {row.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Info box */}
                    <div
                      style={{
                        background: "var(--color-blue-x)",
                        border: "1px solid var(--color-blue-2)",
                        borderRadius: 14,
                        padding: "18px 22px",
                        marginBottom: 28,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      >
                        <circle cx="10" cy="10" r="9" stroke="#2563eb" strokeWidth="1.8" />
                        <path d="M10 9v5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="10" cy="6.5" r="0.8" fill="#2563eb" />
                      </svg>
                      <p style={{ fontSize: 13.5, color: "var(--color-sub)", margin: 0, lineHeight: 1.6 }}>
                        You can update anything later from your application dashboard. Our
                        counsellors will also review your application before it&apos;s sent to the
                        university.
                      </p>
                    </div>

                    {/* Submit button */}
                    <button
                      onClick={() => setForm((f) => ({ ...f, submitted: true }))}
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#fff",
                        background: "linear-gradient(135deg,#0f9d58,#16b364)",
                        border: "none",
                        borderRadius: 14,
                        padding: "16px 48px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Submit application
                    </button>
                  </>
                ) : (
                  /* ── Submitted state ────────────────────────────── */
                  <div style={{ textAlign: "center", padding: "50px 0 30px" }}>
                    {/* Success animation */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "var(--color-green-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                      }}
                    >
                      <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
                        <path
                          d="M10 18L16 24L26 13"
                          stroke="var(--color-green)"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                        margin: "0 0 8px",
                      }}
                    >
                      Application submitted!
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--color-sub)",
                        margin: "0 0 32px",
                        maxWidth: 420,
                        marginLeft: "auto",
                        marginRight: "auto",
                        lineHeight: 1.6,
                      }}
                    >
                      Your application for {form.course} at {form.institution} has been submitted
                      successfully. Our counsellors will review it and get back to you shortly.
                    </p>
                    <button
                      onClick={() => {
                        /* navigate to dashboard */
                      }}
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#fff",
                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                        border: "none",
                        borderRadius: 12,
                        padding: "14px 36px",
                        cursor: "pointer",
                      }}
                    >
                      Track my application &rarr;
                    </button>
                  </div>
                )}
              </div>
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
