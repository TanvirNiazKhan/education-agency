"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const IMG_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

interface Country { id: string; name: string; iso_code: string; is_active: boolean; }
interface City { id: string; name: string; state: string; country_id: string; is_active: boolean; }
interface University {
  id: string; name: string; short_name: string; slug: string; university_type: string;
  website: string; logo: string; description: string; featured: boolean;
  country_id: string; city_id: string;
  country?: Country; city?: City;
  is_active: boolean;
}
interface Scholarship { id: string; name: string; percentage: number; type: string; university_id: string; }
interface UniImage { id: string; url: string; type: string; university_id: string; }
interface Course {
  id: string; name: string; course_code: string; tuition_fee: number; currency: string;
  duration_months: number; intake: string | null; ielts_requirement: number | null;
  overview: string | null; scholarship_available: boolean;
  faculty_id: string; degree_id: string;
  faculty?: { id: string; name: string; university_id: string; university?: University };
  degree?: { id: string; name: string };
  is_active: boolean;
}
interface Degree { id: string; name: string; is_active: boolean; }
interface Faculty { id: string; name: string; university_id: string; is_active: boolean; }

export default function SearchPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [scholarships, setScholarships] = useState<Record<string, Scholarship[]>>({});
  const [logoMap, setLogoMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewTab, setViewTab] = useState<"universities" | "courses">("universities");
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedDegreeId, setSelectedDegreeId] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [facultySearch, setFacultySearch] = useState("");

  // Load countries + degrees on mount
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/countries`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/degrees`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/faculties`).then((r) => r.json()).catch(() => []),
    ]).then(([countryData, degreeData, facultyData]: [Country[], Degree[], Faculty[]]) => {
      const active = countryData.filter((c) => c.is_active);
      setCountries(active);
      if (active.length > 0) setSelectedCountryId(active[0].id);
      setDegrees(degreeData.filter((d) => d.is_active));
      setFaculties(facultyData.filter((f) => f.is_active));
    }).finally(() => setLoading(false));
  }, []);

  // Load cities + universities when country changes
  useEffect(() => {
    if (!selectedCountryId) return;
    setSelectedCityId("");
    setCitySearch("");

    Promise.all([
      fetch(`${API_BASE}/cities?country_id=${selectedCountryId}`).then((r) => r.json()),
      fetch(`${API_BASE}/universities?country_id=${selectedCountryId}`).then((r) => r.json()),
    ]).then(([cityData, uniData]: [City[], University[]]) => {
      setCities(cityData.filter((c) => c.is_active));
      const activeUnis = uniData.filter((u) => u.is_active);
      setUniversities(activeUnis);

      // Fetch scholarships + logos for each university
      const schMap: Record<string, Scholarship[]> = {};
      const lgMap: Record<string, string> = {};

      const fetches = activeUnis.flatMap((u) => [
        fetch(`${API_BASE}/scholarships?university_id=${u.id}`)
          .then((r) => r.json())
          .then((s: Scholarship[]) => { schMap[u.id] = s; })
          .catch(() => {}),
        fetch(`${API_BASE}/university-images?university_id=${u.id}`)
          .then((r) => r.json())
          .then((imgs: UniImage[]) => {
            const logo = imgs.find((i) => i.type === "logo");
            if (logo) lgMap[u.id] = `${IMG_BASE}${logo.url}`;
          })
          .catch(() => {}),
      ]);

      Promise.all(fetches).then(() => {
        setScholarships({ ...schMap });
        setLogoMap({ ...lgMap });
      });
    }).catch(() => {});
  }, [selectedCountryId]);

  // Load courses when search query changes (debounced)
  useEffect(() => {
    if (viewTab !== "courses") return;
    const q = searchQuery.trim();
    const timer = setTimeout(() => {
      setCoursesLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const qs = params.toString();
      fetch(`${API_BASE}/courses${qs ? `?${qs}` : ""}`)
        .then((r) => r.json())
        .then((data: Course[]) => setCourses(data.filter((c) => c.is_active)))
        .catch(() => setCourses([]))
        .finally(() => setCoursesLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, viewTab]);

  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  // Filter universities
  let filtered = universities;
  if (selectedCityId) {
    filtered = filtered.filter((u) => u.city_id === selectedCityId);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.short_name?.toLowerCase().includes(q));
  }
  if (scholarshipOnly) {
    filtered = filtered.filter((u) => (scholarships[u.id]?.length || 0) > 0);
  }

  // Sort
  if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "featured") {
    filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  // Filter faculties shown in sidebar by search
  const displayedFaculties = facultySearch.trim()
    ? faculties.filter((f) => f.name.toLowerCase().includes(facultySearch.toLowerCase()))
    : faculties;

  // Filter courses by degree + faculty
  let filteredCourses = courses;
  if (selectedDegreeId) {
    filteredCourses = filteredCourses.filter((c) => c.degree_id === selectedDegreeId);
  }
  if (selectedFacultyId) {
    filteredCourses = filteredCourses.filter((c) => c.faculty_id === selectedFacultyId);
  }
  if (scholarshipOnly) {
    filteredCourses = filteredCourses.filter((c) => c.scholarship_available);
  }

  function getScholarshipSummary(uniId: string): string {
    const schs = scholarships[uniId] || [];
    if (schs.length === 0) return "—";
    const best = schs.reduce((b, s) => (s.percentage > (b?.percentage || 0) ? s : b), schs[0]);
    return best.percentage ? `Up to ${best.percentage}%` : best.name;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--color-muted)" }}>
        Loading...
      </div>
    );
  }

  return (
    <main className="px-4 lg:px-7 pb-[120px] md:pb-[90px]" style={{ maxWidth: 1240, margin: "0 auto", paddingTop: 30 }}>
      <h1
        className="text-xl lg:text-[28px]"
        style={{ fontWeight: 800, color: "var(--color-navy)", margin: "0 0 20px" }}
      >
        Explore programs
      </h1>

      {/* Search bar */}
      <div className="max-w-full lg:max-w-[760px]" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex", alignItems: "center", background: "var(--color-card)",
            borderRadius: 14, border: "1.5px solid var(--color-line)",
            padding: "0 6px 0 16px", height: 52, boxShadow: "var(--shadow-sm)",
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx={11} cy={11} r={7} stroke="var(--color-blue)" strokeWidth={2.2} />
            <path d="M16 16l4.5 4.5" stroke="var(--color-blue)" strokeWidth={2.2} strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={viewTab === "courses" ? "Search courses..." : "Search universities..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, border: "none", background: "transparent",
              fontSize: 14.5, color: "var(--color-ink)", padding: "0 14px", height: "100%",
            }}
          />
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13.5, fontWeight: 700, color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer", flexShrink: 0,
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
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}
      >
        <span style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600 }}>Your selection:</span>
        {selectedCountry && (
          <>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-blue)", background: "var(--color-blue-x)", padding: "5px 14px", borderRadius: 20 }}>
              {selectedCountry.name}
            </span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </>
        )}
        {selectedCityId && (
          <>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-blue)", background: "var(--color-blue-x)", padding: "5px 14px", borderRadius: 20 }}>
              {cities.find((c) => c.id === selectedCityId)?.name}
            </span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </>
        )}
      </div>

      {/* Mobile filter button */}
      <button
        className="lg:hidden"
        onClick={() => setFiltersOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700,
          color: "var(--color-blue)", background: "var(--color-blue-x)",
          border: "1.5px solid var(--color-blue)", borderRadius: 12,
          padding: "10px 20px", cursor: "pointer", marginBottom: 20,
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
        {/* Filter sidebar */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>Filters</span>
            <button
              onClick={() => {
                if (countries.length > 0) setSelectedCountryId(countries[0].id);
                setSelectedCityId("");
                setCitySearch("");
                setSearchQuery("");
                setScholarshipOnly(false);
                setSelectedDegreeId("");
                setSelectedFacultyId("");
                setFacultySearch("");
              }}
              style={{ fontSize: 13, fontWeight: 600, color: "var(--color-blue)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Reset
            </button>
          </div>

          {/* Step 1 - Country */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-blue)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                1
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>Country</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 36 }}>
              {countries.map((c) => {
                const sel = selectedCountryId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCountryId(c.id); setSelectedCityId(""); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 11,
                      border: sel ? "1.5px solid var(--color-blue)" : "1.5px solid var(--color-line)",
                      background: sel ? "var(--color-blue-x)" : "#fff",
                      cursor: "pointer", fontSize: 13.5, fontWeight: 700,
                      color: sel ? "var(--color-blue)" : "var(--color-ink)",
                      textAlign: "left", width: "100%",
                    }}
                  >
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connector line */}
          <div style={{ width: 2, height: 24, background: "var(--color-blue-2)", marginLeft: 12, marginTop: 4, marginBottom: 4 }} />

          {/* Step 2 - City */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-blue)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                2
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>City</span>
            </div>
            <div style={{ paddingLeft: 36 }}>
              {cities.length > 5 && (
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  style={{
                    width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 10,
                    border: "1.5px solid var(--color-line)", background: "#fff",
                    color: "var(--color-ink)", marginBottom: 10, outline: "none",
                  }}
                />
              )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cities.filter((c) => !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase())).map((city) => {
                const sel = selectedCityId === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCityId(sel ? "" : city.id)}
                    style={{
                      padding: "7px 16px", borderRadius: 20, border: "none",
                      background: sel ? "var(--color-blue)" : "var(--color-line-2)",
                      color: sel ? "#fff" : "var(--color-sub)",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {city.name}
                  </button>
                );
              })}
              {cities.filter((c) => !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                <span style={{ fontSize: 13, color: "var(--color-muted)" }}>No cities found</span>
              )}
            </div>
            </div>
          </div>

          {/* Refine section */}
          <div style={{ borderTop: "1px solid var(--color-line)", marginTop: 24, paddingTop: 22, display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Scholarship toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>Scholarship available</span>
              <button
                onClick={() => setScholarshipOnly(!scholarshipOnly)}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: "none",
                  background: scholarshipOnly ? "var(--color-blue)" : "var(--color-line)",
                  cursor: "pointer", position: "relative", transition: "background .2s", padding: 0,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,.15)", position: "absolute",
                  top: 3, left: scholarshipOnly ? 23 : 3, transition: "left .2s",
                }} />
              </button>
            </div>

            {/* Degree type filter */}
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", display: "block", marginBottom: 10 }}>Degree type</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  onClick={() => setSelectedDegreeId("")}
                  style={{
                    padding: "7px 14px", borderRadius: 20, border: "none",
                    background: !selectedDegreeId ? "var(--color-blue)" : "var(--color-line-2)",
                    color: !selectedDegreeId ? "#fff" : "var(--color-sub)",
                    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  All
                </button>
                {degrees.map((d) => {
                  const sel = selectedDegreeId === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDegreeId(sel ? "" : d.id)}
                      style={{
                        padding: "7px 14px", borderRadius: 20, border: "none",
                        background: sel ? "var(--color-blue)" : "var(--color-line-2)",
                        color: sel ? "#fff" : "var(--color-sub)",
                        fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faculty filter */}
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", display: "block", marginBottom: 10 }}>Faculty</span>
              {faculties.length > 5 && (
                <input
                  type="text"
                  placeholder="Search faculties..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  style={{
                    width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 10,
                    border: "1.5px solid var(--color-line)", background: "#fff",
                    color: "var(--color-ink)", marginBottom: 10, outline: "none",
                  }}
                />
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 160, overflowY: "auto" }}>
                <button
                  onClick={() => setSelectedFacultyId("")}
                  style={{
                    padding: "7px 14px", borderRadius: 20, border: "none",
                    background: !selectedFacultyId ? "var(--color-blue)" : "var(--color-line-2)",
                    color: !selectedFacultyId ? "#fff" : "var(--color-sub)",
                    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  All
                </button>
                {displayedFaculties.map((f) => {
                  const sel = selectedFacultyId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFacultyId(sel ? "" : f.id)}
                      style={{
                        padding: "7px 14px", borderRadius: 20, border: "none",
                        background: sel ? "var(--color-blue)" : "var(--color-line-2)",
                        color: sel ? "#fff" : "var(--color-sub)",
                        fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {f.name}
                    </button>
                  );
                })}
                {faculties.length === 0 && (
                  <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Search courses to see faculties</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div>
          {/* Tab toggle */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--color-line-2)", borderRadius: 12, padding: 4, width: "fit-content" }}>
            {(["universities", "courses"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setViewTab(tab)}
                style={{
                  fontSize: 13.5, fontWeight: 700, padding: "8px 20px", borderRadius: 10,
                  border: "none", cursor: "pointer",
                  background: viewTab === tab ? "#fff" : "transparent",
                  color: viewTab === tab ? "var(--color-blue)" : "var(--color-sub)",
                  boxShadow: viewTab === tab ? "var(--shadow-sm)" : "none",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {viewTab === "universities" && (
          <>
          {/* Count header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>
              {filtered.length} universit{filtered.length === 1 ? "y" : "ies"} in{" "}
              <span style={{ color: "var(--color-blue)" }}>{selectedCountry?.name || "—"}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: 13, fontWeight: 600, color: "var(--color-sub)",
                border: "1.5px solid var(--color-line)", borderRadius: 10,
                padding: "8px 14px", background: "#fff", cursor: "pointer",
              }}
            >
              <option value="name">Sort by: Name</option>
              <option value="featured">Sort by: Featured</option>
            </select>
          </div>

          {/* University cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[18px]">
            {filtered.map((u) => (
              <Link href={`/university/${u.slug}`} key={u.id} style={{ textDecoration: "none" }}>
                <div
                  className="card-hover"
                  style={{
                    background: "var(--color-card)", borderRadius: 18,
                    boxShadow: "var(--shadow-sm)", padding: "22px 22px 20px", cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    {logoMap[u.id] ? (
                      <img
                        src={logoMap[u.id]}
                        alt={u.name}
                        style={{ width: 48, height: 48, borderRadius: 13, objectFit: "contain", background: "#fff", padding: 3, flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: 48, height: 48, borderRadius: 13,
                        background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 17, fontWeight: 800, flexShrink: 0,
                      }}>
                        {u.name.charAt(0)}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                        {u.city?.name}{u.city?.name && u.country?.name ? ", " : ""}{u.country?.name}
                      </div>
                    </div>
                    {u.featured && (
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-green)", background: "var(--color-green-bg)", padding: "4px 10px", borderRadius: 20, flexShrink: 0 }}>
                        Featured
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Type</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {u.university_type || "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Location</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {u.city?.name || "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Scholarship</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {getScholarshipSummary(u.id)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Website</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-blue)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.website ? new URL(u.website.startsWith("http") ? u.website : `https://${u.website}`).hostname.replace("www.", "") : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)", fontSize: 14.5 }}>
              No universities found. Try adjusting your filters.
            </div>
          )}
          </>
          )}

          {viewTab === "courses" && (
          <>
          {/* Course count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-ink)" }}>
              {coursesLoading ? "Searching..." : `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"} found`}
            </span>
          </div>

          {/* Course cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[18px]">
            {filteredCourses.map((c) => (
              <Link href={`/course/${c.id}`} key={c.id} style={{ textDecoration: "none" }}>
                <div
                  className="card-hover"
                  style={{
                    background: "var(--color-card)", borderRadius: 18,
                    boxShadow: "var(--shadow-sm)", padding: "22px 22px 20px", cursor: "pointer",
                  }}
                >
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                      {c.faculty?.university?.name || c.faculty?.name || "—"}
                      {c.faculty?.university?.country?.name ? ` · ${c.faculty.university.country.name}` : ""}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Degree</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {c.degree?.name || "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Duration</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {c.duration_months ? `${c.duration_months} months` : "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>Tuition</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {c.tuition_fee ? `${c.currency} ${c.tuition_fee.toLocaleString()}` : "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 2 }}>IELTS</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                        {c.ielts_requirement || "—"}
                      </div>
                    </div>
                  </div>

                  {c.scholarship_available && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-green)", background: "var(--color-green-bg)", padding: "4px 10px", borderRadius: 20 }}>
                        Scholarship Available
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {!coursesLoading && filteredCourses.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)", fontSize: 14.5 }}>
              {searchQuery.trim() ? `No courses found for "${searchQuery}"` : "Type to search for courses"}
            </div>
          )}
          </>
          )}

          {/* AI suggestion banner */}
          <div
            style={{
              marginTop: 28, background: "linear-gradient(135deg,#0a1330,#16224e)",
              borderRadius: 18, padding: "26px 28px", color: "#fff", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.35),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>⭐</span>
              <span style={{ fontSize: 15, fontWeight: 800 }}>AI suggestion</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.88, margin: "0 0 18px" }}>
              Based on your filters, we found {filtered.length} universities. Want personalised recommendations?
            </p>
            <Link
              href="/chat"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13.5, fontWeight: 700, color: "var(--color-navy)",
                background: "#fff", padding: "9px 18px", borderRadius: 10, textDecoration: "none",
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
