"use client";

import { useState } from "react";
import Link from "next/link";
import { UNIS, COUNTRIES_FILTER, FIELDS_FILTER } from "../../lib/data";

export default function SearchPage() {
  const [selectedCountry, setSelectedCountry] = useState("Australia");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedField, setSelectedField] = useState("Computer Science");
  const [degree, setDegree] = useState("Master");
  const [maxTuition, setMaxTuition] = useState(45);
  const [englishReq, setEnglishReq] = useState("Any");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [top100Only, setTop100Only] = useState(false);
  const [sortBy, setSortBy] = useState("match");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const countryData = COUNTRIES_FILTER.find((c) => c.key === selectedCountry);
  const filteredUnis = UNIS.filter((u) => u.country === selectedCountry);

  const engOptions = ["Any", "IELTS 6.0", "IELTS 6.5", "IELTS 7.0", "PTE 58"];

  return (
    <main className="px-4 lg:px-7 pb-[120px] md:pb-[90px]" style={{ maxWidth: 1240, margin: "0 auto", paddingTop: 30 }}>
      <h1
        className="text-xl lg:text-[28px]"
        style={{
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: "0 0 20px",
        }}
      >
        Explore programs
      </h1>

      {/* Search bar */}
      <div className="max-w-full lg:max-w-[760px]" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--color-card)",
            borderRadius: 14,
            border: "1.5px solid var(--color-line)",
            padding: "0 6px 0 16px",
            height: 52,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <circle cx={11} cy={11} r={7} stroke="var(--color-blue)" strokeWidth={2.2} />
            <path
              d="M16 16l4.5 4.5"
              stroke="var(--color-blue)"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search universities, programs, or countries..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14.5,
              color: "var(--color-ink)",
              padding: "0 14px",
              height: "100%",
            }}
          />
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              padding: "9px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
            className="lift-hover"
          >
            ✦ Ask AI
          </button>
        </div>
      </div>

      {/* Funnel breadcrumb */}
      <div
        className="overflow-x-auto lg:flex-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 28,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600 }}>
          Your selection:
        </span>
        {selectedCountry && (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-blue)",
              background: "var(--color-blue-x)",
              padding: "5px 14px",
              borderRadius: 20,
            }}
          >
            {selectedCountry}
          </span>
        )}
        {selectedCountry && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="var(--color-muted)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        )}
        {selectedCity && (
          <>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--color-blue)",
                background: "var(--color-blue-x)",
                padding: "5px 14px",
                borderRadius: 20,
              }}
            >
              {selectedCity}
            </span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="var(--color-muted)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </>
        )}
        {selectedField && (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-blue)",
              background: "var(--color-blue-x)",
              padding: "5px 14px",
              borderRadius: 20,
            }}
          >
            {selectedField}
          </span>
        )}
      </div>

      {/* Mobile filter button */}
      <button
        className="lg:hidden"
        onClick={() => setFiltersOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-blue)",
          background: "var(--color-blue-x)",
          border: "1.5px solid var(--color-blue)",
          borderRadius: 12,
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M7 12h10M10 18h4" stroke="var(--color-blue)" strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        Filters
      </button>

      {/* Mobile filter backdrop */}
      {filtersOpen && (
        <div
          className="lg:hidden"
          onClick={() => setFiltersOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,.4)" }}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5 lg:gap-7">
        {/* Filter sidebar - fixed overlay on mobile when open, sticky sidebar on desktop */}
        <div
          className={filtersOpen ? "block" : "hidden lg:block"}
          style={{
            ...(filtersOpen
              ? { position: "fixed", inset: 0, zIndex: 51, overflow: "auto" }
              : { position: "sticky", top: 90, alignSelf: "start" }),
            background: "var(--color-card)",
            borderRadius: filtersOpen ? 0 : 18,
            boxShadow: filtersOpen ? "none" : "var(--shadow-sm)",
            padding: "24px 22px",
          }}
        >
          {/* Mobile close button */}
          {filtersOpen && (
            <div className="lg:hidden" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-ink)" }}>Filters</span>
              <button
                onClick={() => setFiltersOpen(false)}
                style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", color: "var(--color-ink)", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
          )}
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>
              Filters
            </span>
            <button
              onClick={() => {
                setSelectedCountry("Australia");
                setSelectedCity("");
                setSelectedField("Computer Science");
                setDegree("Master");
                setMaxTuition(45);
                setEnglishReq("Any");
                setScholarshipOnly(false);
                setTop100Only(false);
              }}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-blue)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Reset
            </button>
          </div>

          {/* Step 1 - Country */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--color-blue)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                Country
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 36 }}>
              {COUNTRIES_FILTER.map((c) => {
                const sel = selectedCountry === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      setSelectedCountry(c.key);
                      setSelectedCity("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 11,
                      border: sel
                        ? "1.5px solid var(--color-blue)"
                        : "1.5px solid var(--color-line)",
                      background: sel ? "var(--color-blue-x)" : "#fff",
                      cursor: "pointer",
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: sel ? "var(--color-blue)" : "var(--color-ink)",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span>{c.label}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: sel ? "var(--color-blue)" : "var(--color-muted)",
                      }}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connector line */}
          <div
            style={{
              width: 2,
              height: 24,
              background: "var(--color-blue-2)",
              marginLeft: 12,
              marginTop: 4,
              marginBottom: 4,
            }}
          />

          {/* Step 2 - City */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--color-blue)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                City
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 36 }}>
              {(countryData?.cities || []).map((city) => {
                const sel = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(sel ? "" : city)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 20,
                      border: "none",
                      background: sel ? "var(--color-blue)" : "var(--color-line-2)",
                      color: sel ? "#fff" : "var(--color-sub)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connector line */}
          <div
            style={{
              width: 2,
              height: 24,
              background: "var(--color-blue-2)",
              marginLeft: 12,
              marginTop: 4,
              marginBottom: 4,
            }}
          />

          {/* Step 3 - Field */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--color-blue)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                Field of study
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 36 }}>
              {FIELDS_FILTER.map((f) => {
                const sel = selectedField === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedField(f)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 20,
                      border: sel
                        ? "1.5px solid var(--color-blue)"
                        : "1.5px solid var(--color-line)",
                      background: sel ? "var(--color-blue-x)" : "#fff",
                      color: sel ? "var(--color-blue)" : "var(--color-sub)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Refine section */}
          <div
            style={{
              borderTop: "1px solid var(--color-line)",
              marginTop: 24,
              paddingTop: 22,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {/* Degree */}
            <div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                Degree level
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {["Master", "Bachelor", "PhD"].map((d) => {
                  const sel = degree === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDegree(d)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: 10,
                        border: sel
                          ? "1.5px solid var(--color-blue)"
                          : "1.5px solid var(--color-line)",
                        background: sel ? "var(--color-blue)" : "#fff",
                        color: sel ? "#fff" : "var(--color-sub)",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max tuition slider */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}
                >
                  Max tuition
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-blue)",
                  }}
                >
                  ৳{maxTuition}L/yr
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                value={maxTuition}
                onChange={(e) => setMaxTuition(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "var(--color-blue)",
                  height: 6,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                <span>৳15L</span>
                <span>৳60L</span>
              </div>
            </div>

            {/* English requirement */}
            <div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                English requirement
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {engOptions.map((opt) => {
                  const sel = englishReq === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setEnglishReq(opt)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: sel
                          ? "1.5px solid var(--color-blue)"
                          : "1.5px solid var(--color-line)",
                        background: sel ? "var(--color-blue-x)" : "#fff",
                        color: sel ? "var(--color-blue)" : "var(--color-sub)",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scholarship toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}
              >
                Scholarship available
              </span>
              <button
                onClick={() => setScholarshipOnly(!scholarshipOnly)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  background: scholarshipOnly
                    ? "var(--color-blue)"
                    : "var(--color-line)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background .2s",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,.15)",
                    position: "absolute",
                    top: 3,
                    left: scholarshipOnly ? 23 : 3,
                    transition: "left .2s",
                  }}
                />
              </button>
            </div>

            {/* Top 100 toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}
              >
                Top 100 ranked
              </span>
              <button
                onClick={() => setTop100Only(!top100Only)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  background: top100Only
                    ? "var(--color-blue)"
                    : "var(--color-line)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background .2s",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,.15)",
                    position: "absolute",
                    top: 3,
                    left: top100Only ? 23 : 3,
                    transition: "left .2s",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div>
          {/* Count header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>
              {filteredUnis.length} universities in{" "}
              <span style={{ color: "var(--color-blue)" }}>{selectedCountry}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-sub)",
                border: "1.5px solid var(--color-line)",
                borderRadius: 10,
                padding: "8px 14px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="match">Sort by: Best match</option>
              <option value="rank">Sort by: Ranking</option>
              <option value="tuition">Sort by: Tuition</option>
            </select>
          </div>

          {/* University cards grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[18px]"
          >
            {filteredUnis.map((u) => (
              <Link
                href={`/university/${u.id}`}
                key={u.id}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card-hover"
                  style={{
                    background: "var(--color-card)",
                    borderRadius: 18,
                    boxShadow: "var(--shadow-sm)",
                    padding: "22px 22px 20px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 13,
                        background: u.img,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 17,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "var(--color-ink)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {u.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                        {u.city}, {u.country}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "var(--color-green)",
                        background: "var(--color-green-bg)",
                        padding: "4px 10px",
                        borderRadius: 20,
                        flexShrink: 0,
                      }}
                    >
                      {u.match}%
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          marginBottom: 2,
                        }}
                      >
                        Ranking
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--color-ink)",
                        }}
                      >
                        #{u.rank}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          marginBottom: 2,
                        }}
                      >
                        Tuition
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--color-ink)",
                        }}
                      >
                        {u.tuition}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          marginBottom: 2,
                        }}
                      >
                        Scholarship
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--color-ink)",
                        }}
                      >
                        {u.schShort}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          marginBottom: 2,
                        }}
                      >
                        IELTS / PTE
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--color-ink)",
                        }}
                      >
                        {u.ielts} / {u.pte}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* AI suggestion banner */}
          <div
            style={{
              marginTop: 28,
              background: "linear-gradient(135deg,#0a1330,#16224e)",
              borderRadius: 18,
              padding: "26px 28px",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(37,99,235,.35),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>⭐</span>
              <span style={{ fontSize: 15, fontWeight: 800 }}>
                AI suggestion
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                opacity: 0.88,
                margin: "0 0 18px",
              }}
            >
              Based on your filters, we found 3 universities with strong
              scholarship options for your CGPA. Want personalised
              recommendations?
            </p>
            <Link
              href="/chat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--color-navy)",
                background: "#fff",
                padding: "9px 18px",
                borderRadius: 10,
                textDecoration: "none",
              }}
              className="lift-hover"
            >
              Ask AI counsellor &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
