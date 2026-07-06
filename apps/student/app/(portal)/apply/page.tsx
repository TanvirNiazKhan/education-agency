"use client";

import { useState } from "react";
import Link from "next/link";
import { UNIS, JOURNEY_STEPS, DOCS } from "../../lib/data";

const uni = UNIS[0]; // Melbourne

export default function ApplyPage() {
  const [step, setStep] = useState(0);

  const progress = ((step + 1) / 7) * 100;

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(6, s + 1));

  return (
    <main>
      {/* Progress bar - sticky below header */}
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
          className="px-4 lg:px-7 gap-3 lg:gap-4"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            paddingTop: 14,
            paddingBottom: 14,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: uni.img,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {uni.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-ink)",
              }}
            >
              Step {step + 1} of 7 &middot; {JOURNEY_STEPS[step]}
            </div>
            {/* Progress bar */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-green)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-muted)",
              }}
            >
              Auto-saved
            </span>
          </div>
        </div>
      </div>

      {/* Context banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0a1330,#16224e)",
          color: "#fff",
        }}
      >
        <div
          className="px-4 lg:px-7 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            paddingTop: 22,
            paddingBottom: 22,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: uni.img,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {uni.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.65,
                marginBottom: 2,
              }}
            >
              Your application
            </div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{uni.name}</div>
            <div style={{ fontSize: 13, opacity: 0.78, marginTop: 2 }}>
              Master of Computer Science &middot; {uni.city}
            </div>
          </div>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "#fbbf24",
              background: "rgba(251,191,36,.15)",
              padding: "5px 14px",
              borderRadius: 20,
              flexShrink: 0,
            }}
          >
            Deadline: 31 Oct 2025
          </span>
          <button
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 10,
              padding: "8px 18px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Change
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div
        className="px-4 lg:px-7 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          paddingTop: 32,
          paddingBottom: 90,
        }}
      >
        {/* Step rail */}
        <div className="hidden lg:block" style={{ position: "sticky", top: 160, alignSelf: "start" }}>
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
                    {completed ? (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 5"
                          stroke="#fff"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
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

        {/* Form area */}
        <div>
          <div
            className="p-5 lg:p-9 lg:pb-10"
            style={{
              background: "var(--color-card)",
              borderRadius: 20,
              boxShadow: "var(--shadow-sm)",
              minHeight: 400,
            }}
          >
            {/* Step 0 - Create profile */}
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
                  Create your profile
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Tell us about yourself so we can match you to the right programs.
                </p>
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                >
                  <FieldInput label="Full name" value="Ayaan Rahman" />
                  <FieldInput label="Phone" value="+880 1712-345678" />
                  <FieldInput
                    label="Email address"
                    value="ayaan.r@email.com"
                    full
                  />
                </div>
              </div>
            )}

            {/* Step 1 - Academic info */}
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
                  Academic information
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Your academic background helps us find the best-fit programs.
                </p>
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                >
                  <FieldInput label="Highest degree" value="Bachelor of Science" />
                  <FieldInput label="Institution" value="University of Dhaka" />
                  <FieldInput label="CGPA" value="3.2 / 4.0" />
                  <FieldInput label="Graduation year" value="2024" />
                </div>
              </div>
            )}

            {/* Step 2 - English proficiency */}
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
                  English proficiency
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Select your English test and provide your score.
                </p>
                <div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7"
                >
                  {["IELTS", "PTE", "TOEFL", "None"].map((t) => (
                    <button
                      key={t}
                      style={{
                        padding: "14px 0",
                        borderRadius: 12,
                        border:
                          t === "PTE"
                            ? "2px solid var(--color-blue)"
                            : "1.5px solid var(--color-line)",
                        background:
                          t === "PTE" ? "var(--color-blue-x)" : "#fff",
                        color:
                          t === "PTE"
                            ? "var(--color-blue)"
                            : "var(--color-sub)",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{ maxWidth: 340 }}>
                  <FieldInput label="PTE Academic score" value="62" />
                </div>
              </div>
            )}

            {/* Step 3 - Preferred countries */}
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
                  Preferred countries
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Select the countries you are interested in studying.
                </p>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-3.5"
                >
                  {[
                    { name: "Australia", checked: true },
                    { name: "Canada", checked: true },
                    { name: "United Kingdom", checked: false },
                    { name: "United States", checked: false },
                    { name: "Germany", checked: false },
                    { name: "Malaysia", checked: false },
                  ].map((c) => (
                    <label
                      key={c.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 18px",
                        borderRadius: 14,
                        border: c.checked
                          ? "2px solid var(--color-blue)"
                          : "1.5px solid var(--color-line)",
                        background: c.checked
                          ? "var(--color-blue-x)"
                          : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: c.checked
                            ? "none"
                            : "2px solid var(--color-line)",
                          background: c.checked
                            ? "var(--color-blue)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {c.checked && (
                          <svg
                            width={13}
                            height={13}
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M3.5 8.5L6.5 11.5L12.5 5"
                              stroke="#fff"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: c.checked
                            ? "var(--color-blue)"
                            : "var(--color-ink)",
                        }}
                      >
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 - Upload documents */}
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
                  Upload documents
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Upload the required documents for your application.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {DOCS.map((d, i) => (
                    <div
                      key={i}
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
                          background: d.tint,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 800,
                          color: d.color,
                          flexShrink: 0,
                        }}
                      >
                        {d.ic}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                          }}
                        >
                          {d.name}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: d.color,
                          background: d.bg,
                          padding: "4px 12px",
                          borderRadius: 20,
                          flexShrink: 0,
                        }}
                      >
                        {d.status}
                      </span>
                      {d.status === "Missing" && (
                        <button
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--color-blue)",
                            background: "var(--color-blue-x)",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 16px",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 - Review */}
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
                  Review your application
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                  }}
                >
                  Please verify all information before submitting.
                </p>
                <div
                  style={{
                    border: "1px solid var(--color-line)",
                    borderRadius: 14,
                    overflow: "hidden",
                    overflowX: "auto",
                  }}
                >
                  {[
                    { label: "Full name", value: "Ayaan Rahman" },
                    { label: "Email", value: "ayaan.r@email.com" },
                    { label: "Phone", value: "+880 1712-345678" },
                    { label: "Degree", value: "Bachelor of Science" },
                    { label: "Institution", value: "University of Dhaka" },
                    { label: "CGPA", value: "3.2 / 4.0" },
                    { label: "Graduation year", value: "2024" },
                    { label: "English test", value: "PTE Academic - 62" },
                    {
                      label: "Preferred countries",
                      value: "Australia, Canada",
                    },
                    { label: "University", value: uni.name },
                    {
                      label: "Program",
                      value: "Master of Computer Science",
                    },
                  ].map((row, i) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-1 sm:grid-cols-[200px_1fr]"
                      style={{
                        borderBottom:
                          i < 10
                            ? "1px solid var(--color-line)"
                            : "none",
                        background:
                          i % 2 === 0
                            ? "transparent"
                            : "var(--color-line-2)",
                      }}
                    >
                      <div
                        style={{
                          padding: "13px 20px",
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "var(--color-sub)",
                        }}
                      >
                        {row.label}
                      </div>
                      <div
                        style={{
                          padding: "13px 20px",
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
            )}

            {/* Step 6 - Submit */}
            {step === 6 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                {/* AI pre-check banner */}
                <div
                  style={{
                    background: "var(--color-blue-x)",
                    borderRadius: 16,
                    padding: "24px 28px",
                    marginBottom: 32,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>✦</span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--color-blue)",
                      }}
                    >
                      AI pre-check passed
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--color-sub)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    Your application looks complete. We checked your documents,
                    eligibility, and program requirements. You&apos;re ready to
                    submit!
                  </p>
                </div>

                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 8px",
                  }}
                >
                  Ready to submit!
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-sub)",
                    margin: "0 0 28px",
                    maxWidth: 400,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Your application for Master of Computer Science at{" "}
                  {uni.name} is complete and ready for submission.
                </p>
                <button
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                    background: "linear-gradient(135deg,#0f9d58,#16b364)",
                    border: "none",
                    borderRadius: 14,
                    padding: "16px 48px",
                    cursor: "pointer",
                  }}
                  className="lift-hover"
                >
                  Submit application
                </button>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <button
              onClick={back}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color:
                  step === 0 ? "var(--color-muted)" : "var(--color-sub)",
                background: "transparent",
                border: step === 0 ? "none" : "1.5px solid var(--color-line)",
                borderRadius: 12,
                padding: "12px 24px",
                cursor: step === 0 ? "default" : "pointer",
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
              &larr; Back
            </button>
            <Link
              href="/chat"
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--color-blue)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✦ Draft with AI
            </Link>
            {step < 6 ? (
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
                className="lift-hover"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(135deg,#0f9d58,#16b364)",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 32px",
                  cursor: "pointer",
                }}
                className="lift-hover"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* Reusable field input */
function FieldInput({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--color-sub)",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type="text"
        defaultValue={value}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1.5px solid var(--color-line)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-ink)",
          background: "#fff",
        }}
      />
    </div>
  );
}
