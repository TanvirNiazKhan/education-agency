"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check,
  Globe, Star, FlaskConical, BookOpen, ChevronRight,
} from "lucide-react";
import {
  universitiesApi, countriesApi, citiesApi, facultiesApi, coursesApi, degreesApi,
  type University, type Country, type City, type Faculty, type Course, type Degree,
  type CreateUniversityData, type CreateCourseData,
} from "@/lib/api";

/* ─── Shared styles ─── */
const inputStyle: React.CSSProperties = {
  width: "100%", height: "38px", padding: "0 12px", fontSize: "13px",
  border: "1px solid var(--c-border-input)", borderRadius: "9px",
  background: "var(--c-bg-elevated)", color: "var(--c-text-1)", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)",
  marginBottom: "5px", display: "block",
};
const textareaStyle: React.CSSProperties = {
  ...inputStyle, height: "80px", padding: "10px 12px", resize: "vertical" as const,
};

/* ─── Picker ─── */
function Picker({ label, value, options, onSelect, placeholder }: {
  label: string; value: string;
  options: { id: string; label: string; sub?: string }[];
  onSelect: (id: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between cursor-pointer"
          style={{ ...inputStyle, display: "flex" }}>
          <span style={{ color: selected ? "var(--c-text-1)" : "var(--c-text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} style={{ flexShrink: 0 }} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute z-50" style={{ top: "42px", left: 0, right: 0, maxHeight: "220px", overflowY: "auto", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "10px", boxShadow: "var(--c-shadow-heavy)", padding: "4px" }}>
              {options.map((o) => (
                <div key={o.id} onClick={() => { onSelect(o.id); setOpen(false); }}
                  className="flex items-center justify-between cursor-pointer hoverable"
                  style={{ padding: "8px 10px", borderRadius: "7px", background: value === o.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-text-1)" }}>{o.label}</div>
                    {o.sub && <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>{o.sub}</div>}
                  </div>
                  {value === o.id && <Check width={14} height={14} stroke="#2563eb" strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                </div>
              ))}
              {options.length === 0 && (
                <div style={{ padding: "12px 10px", fontSize: "13px", color: "var(--c-text-4)", textAlign: "center" }}>None available</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── University form ─── */
interface UniForm {
  name: string; short_name: string; slug: string; university_type: string;
  website: string; email: string; phone: string; address: string;
  postal_code: string; description: string; featured: boolean;
  country_id: string; city_id: string;
}
const emptyUniForm: UniForm = {
  name: "", short_name: "", slug: "", university_type: "", website: "",
  email: "", phone: "", address: "", postal_code: "", description: "",
  featured: false, country_id: "", city_id: "",
};
function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ─── Faculty form ─── */
interface FacForm { name: string; description: string; }
const emptyFacForm: FacForm = { name: "", description: "" };

/* ─── Course form ─── */
interface CourseForm {
  name: string; course_code: string; tuition_fee: string; currency: string;
  duration_months: string; faculty_id: string; degree_id: string; intake: string;
  ielts_requirement: string; pte_requirement: string; toefl_requirement: string;
  overview: string; scholarship_available: boolean;
}
const emptyCourseForm: CourseForm = {
  name: "", course_code: "", tuition_fee: "", currency: "AUD", duration_months: "",
  faculty_id: "", degree_id: "", intake: "", ielts_requirement: "",
  pte_requirement: "", toefl_requirement: "", overview: "", scholarship_available: false,
};

/* ─── Main page ─── */
export default function UniversitiesPage() {
  /* Reference data */
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  /* Selection & tabs */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "faculties" | "courses">("overview");

  /* University CRUD */
  const [uniDrawerOpen, setUniDrawerOpen] = useState(false);
  const [editingUniId, setEditingUniId] = useState<string | null>(null);
  const [uniForm, setUniForm] = useState<UniForm>(emptyUniForm);
  const [uniSaving, setUniSaving] = useState(false);

  /* Faculty state */
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facLoading, setFacLoading] = useState(false);
  const [facDrawerOpen, setFacDrawerOpen] = useState(false);
  const [editingFacId, setEditingFacId] = useState<string | null>(null);
  const [facForm, setFacForm] = useState<FacForm>(emptyFacForm);
  const [facSaving, setFacSaving] = useState(false);

  /* Course state */
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourseForm);
  const [courseSaving, setCourseSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ─── Loaders ─── */
  const loadUniversities = useCallback(async () => {
    try {
      setLoading(true);
      const [uniData, countryData, cityData, degreeData] = await Promise.all([
        universitiesApi.list(filterCountry || undefined),
        countriesApi.list(),
        citiesApi.list(),
        degreesApi.list(),
      ]);
      setUniversities(uniData);
      setCountries(countryData);
      setCities(cityData);
      setDegrees(degreeData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  }, [filterCountry]);

  const loadFacultiesAndCourses = useCallback(async (uniId: string) => {
    setFacLoading(true);
    setCourseLoading(true);
    try {
      const facData = await facultiesApi.list(uniId);
      setFaculties(facData);
      setFacLoading(false);
      if (facData.length > 0) {
        const all = await Promise.all(facData.map((f) => coursesApi.list(f.id)));
        setCourses(all.flat());
      } else {
        setCourses([]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load faculty/course data");
    } finally {
      setFacLoading(false);
      setCourseLoading(false);
    }
  }, []);

  useEffect(() => { loadUniversities(); }, [loadUniversities]);

  useEffect(() => {
    if (selectedId) loadFacultiesAndCourses(selectedId);
    else { setFaculties([]); setCourses([]); }
  }, [selectedId, loadFacultiesAndCourses]);

  const selectedUni = universities.find((u) => u.id === selectedId) ?? null;
  const filteredCities = uniForm.country_id ? cities.filter((c) => c.country_id === uniForm.country_id) : cities;
  const selectedFilterCountry = countries.find((c) => c.id === filterCountry);

  /* ─── University CRUD ─── */
  function openCreateUni() {
    setEditingUniId(null); setUniForm(emptyUniForm); setUniDrawerOpen(true);
  }
  function openEditUni(u: University) {
    setEditingUniId(u.id);
    setUniForm({
      name: u.name, short_name: u.short_name || "", slug: u.slug,
      university_type: u.university_type || "", website: u.website || "",
      email: u.email || "", phone: u.phone || "", address: u.address || "",
      postal_code: u.postal_code || "", description: u.description || "",
      featured: u.featured, country_id: u.country_id, city_id: u.city_id,
    });
    setUniDrawerOpen(true);
  }
  async function handleUniSave() {
    if (!uniForm.name || !uniForm.slug || !uniForm.country_id || !uniForm.city_id) return;
    setUniSaving(true);
    try {
      const data: CreateUniversityData = {
        name: uniForm.name, slug: uniForm.slug,
        country_id: uniForm.country_id, city_id: uniForm.city_id,
        ...(uniForm.short_name && { short_name: uniForm.short_name }),
        ...(uniForm.university_type && { university_type: uniForm.university_type }),
        ...(uniForm.website && { website: uniForm.website }),
        ...(uniForm.email && { email: uniForm.email }),
        ...(uniForm.phone && { phone: uniForm.phone }),
        ...(uniForm.address && { address: uniForm.address }),
        ...(uniForm.postal_code && { postal_code: uniForm.postal_code }),
        ...(uniForm.description && { description: uniForm.description }),
        featured: uniForm.featured,
      };
      if (editingUniId) await universitiesApi.update(editingUniId, data);
      else await universitiesApi.create(data);
      setUniDrawerOpen(false);
      await loadUniversities();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setUniSaving(false); }
  }
  async function handleUniDelete(id: string) {
    if (!confirm("Delete this university and all its faculties/courses?")) return;
    try {
      await universitiesApi.delete(id);
      if (selectedId === id) setSelectedId(null);
      await loadUniversities();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── Faculty CRUD ─── */
  function openCreateFac() {
    setEditingFacId(null); setFacForm(emptyFacForm); setFacDrawerOpen(true);
  }
  function openEditFac(f: Faculty) {
    setEditingFacId(f.id);
    setFacForm({ name: f.name, description: f.description || "" });
    setFacDrawerOpen(true);
  }
  async function handleFacSave() {
    if (!facForm.name || !selectedId) return;
    setFacSaving(true);
    try {
      const payload = { name: facForm.name, university_id: selectedId, ...(facForm.description ? { description: facForm.description } : {}) };
      if (editingFacId) await facultiesApi.update(editingFacId, payload);
      else await facultiesApi.create(payload);
      setFacDrawerOpen(false);
      await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setFacSaving(false); }
  }
  async function handleFacDelete(id: string) {
    if (!confirm("Delete this faculty and all its courses?")) return;
    try {
      await facultiesApi.delete(id);
      if (selectedId) await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── Course CRUD ─── */
  function openCreateCourse() {
    setEditingCourseId(null); setCourseForm(emptyCourseForm); setCourseDrawerOpen(true);
  }
  function openEditCourse(c: Course) {
    setEditingCourseId(c.id);
    setCourseForm({
      name: c.name, course_code: c.course_code, tuition_fee: String(c.tuition_fee),
      currency: c.currency, duration_months: String(c.duration_months),
      faculty_id: c.faculty_id, degree_id: c.degree_id, intake: c.intake || "",
      ielts_requirement: c.ielts_requirement != null ? String(c.ielts_requirement) : "",
      pte_requirement: c.pte_requirement != null ? String(c.pte_requirement) : "",
      toefl_requirement: c.toefl_requirement != null ? String(c.toefl_requirement) : "",
      overview: c.overview || "", scholarship_available: c.scholarship_available,
    });
    setCourseDrawerOpen(true);
  }
  async function handleCourseSave() {
    if (!courseForm.name || !courseForm.course_code || !courseForm.tuition_fee || !courseForm.faculty_id || !courseForm.degree_id || !courseForm.duration_months) return;
    setCourseSaving(true);
    try {
      const data: CreateCourseData = {
        name: courseForm.name, course_code: courseForm.course_code,
        tuition_fee: parseFloat(courseForm.tuition_fee),
        currency: courseForm.currency,
        duration_months: parseInt(courseForm.duration_months, 10),
        faculty_id: courseForm.faculty_id, degree_id: courseForm.degree_id,
        scholarship_available: courseForm.scholarship_available,
        ...(courseForm.intake && { intake: courseForm.intake }),
        ...(courseForm.ielts_requirement && { ielts_requirement: parseFloat(courseForm.ielts_requirement) }),
        ...(courseForm.pte_requirement && { pte_requirement: parseFloat(courseForm.pte_requirement) }),
        ...(courseForm.toefl_requirement && { toefl_requirement: parseFloat(courseForm.toefl_requirement) }),
        ...(courseForm.overview && { overview: courseForm.overview }),
      };
      if (editingCourseId) await coursesApi.update(editingCourseId, data);
      else await coursesApi.create(data);
      setCourseDrawerOpen(false);
      if (selectedId) await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setCourseSaving(false); }
  }
  async function handleCourseDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    try {
      await coursesApi.delete(id);
      if (selectedId) await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  function getCountryName(id: string) { return countries.find((c) => c.id === id)?.name || "—"; }
  function getCityName(id: string) { return cities.find((c) => c.id === id)?.name || "—"; }

  const facultyOptions = faculties.map((f) => ({ id: f.id, label: f.name }));
  const degreeOptions = degrees.map((d) => ({ id: d.id, label: d.name }));
  const canSaveCourse = courseForm.name && courseForm.course_code && courseForm.tuition_fee && courseForm.faculty_id && courseForm.degree_id && courseForm.duration_months;

  /* ─── Render ─── */
  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>Universities</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>Manage partner universities, faculties and courses</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Country filter */}
          <div className="relative">
            <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center cursor-pointer hoverable"
              style={{ height: "34px", gap: "7px", padding: "0 12px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "12.5px", fontWeight: 550, color: "var(--c-text-1)" }}>
              <Globe width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
              {selectedFilterCountry ? selectedFilterCountry.name : "All countries"}
              <ChevronDown width={13} height={13} stroke="var(--c-text-4)" strokeWidth={2} />
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                <div className="absolute z-50" style={{ top: "40px", right: 0, width: "220px", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px" }}>
                  <div onClick={() => { setFilterCountry(""); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                    style={{ padding: "8px 10px", borderRadius: "8px", background: !filterCountry ? "var(--c-nav-active-bg)" : "transparent" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>All countries</span>
                    {!filterCountry && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                  </div>
                  {countries.map((c) => (
                    <div key={c.id} onClick={() => { setFilterCountry(c.id); setFilterOpen(false); }} className="flex items-center justify-between cursor-pointer hoverable"
                      style={{ padding: "8px 10px", borderRadius: "8px", background: filterCountry === c.id ? "var(--c-nav-active-bg)" : "transparent" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>{c.name}</span>
                      {filterCountry === c.id && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={openCreateUni} className="flex items-center cursor-pointer"
            style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}>
            <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />Add university
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between" style={{ padding: "10px 14px", marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626" }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><X width={14} height={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}>
          <Loader2 width={24} height={24} className="animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 items-start">
          {/* ── LEFT LIST ── */}
          <div style={{ width: "272px", flexShrink: 0 }}>
            {universities.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                No universities yet.<br />Add your first one.
              </div>
            ) : (
              <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden" }}>
                {universities.map((u, i) => {
                  const isSelected = u.id === selectedId;
                  return (
                    <div key={u.id}
                      onClick={() => { setSelectedId(u.id); setTab("overview"); }}
                      className="flex items-center justify-between cursor-pointer group"
                      style={{
                        padding: "11px 14px",
                        borderBottom: i < universities.length - 1 ? "1px solid var(--c-border)" : "none",
                        background: isSelected ? "var(--c-nav-active-bg)" : "var(--c-bg-elevated)",
                        transition: "background 0.12s",
                      }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 550, color: isSelected ? "#2563eb" : "var(--c-text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.country?.name || getCountryName(u.country_id)}
                          {u.city ? ` · ${u.city.name}` : u.city_id ? ` · ${getCityName(u.city_id)}` : ""}
                        </div>
                      </div>
                      <ChevronRight width={14} height={14} stroke={isSelected ? "#2563eb" : "var(--c-text-5)"} strokeWidth={2} style={{ flexShrink: 0, marginLeft: "8px" }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT DETAIL ── */}
          <div className="flex-1" style={{ minWidth: 0 }}>
            {!selectedUni ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", color: "var(--c-text-4)", textAlign: "center" }}>
                <GraduationCapIcon />
                <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: 500 }}>Select a university</div>
                <div style={{ fontSize: "12.5px", marginTop: "4px" }}>Click any university from the list to view details, faculties, and courses</div>
              </div>
            ) : (
              <div style={{ border: "1px solid var(--c-border)", borderRadius: "14px", overflow: "hidden", background: "var(--c-bg-elevated)" }}>
                {/* University header */}
                <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--c-border)", background: "var(--c-bg-surface)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.02em" }}>{selectedUni.name}</h2>
                        {selectedUni.short_name && <span style={{ fontSize: "12px", color: "var(--c-text-4)", fontWeight: 500 }}>({selectedUni.short_name})</span>}
                        {selectedUni.featured && <Star width={14} height={14} fill="#f59e0b" stroke="#f59e0b" strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                      </div>
                      <div style={{ marginTop: "4px", fontSize: "12.5px", color: "var(--c-text-3)" }}>
                        {selectedUni.country?.name || getCountryName(selectedUni.country_id)}
                        {" · "}
                        {selectedUni.city?.name || getCityName(selectedUni.city_id)}
                        {selectedUni.university_type && ` · ${selectedUni.university_type}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
                      <button onClick={() => openEditUni(selectedUni)} className="flex items-center gap-1.5 cursor-pointer hoverable"
                        style={{ height: "30px", padding: "0 10px", border: "1px solid var(--c-border)", borderRadius: "7px", background: "none", fontSize: "12px", fontWeight: 550, color: "var(--c-text-2)" }}>
                        <Pencil width={12} height={12} stroke="currentColor" strokeWidth={2} />Edit
                      </button>
                      <button onClick={() => handleUniDelete(selectedUni.id)} className="cursor-pointer"
                        style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "7px" }}>
                        <Trash2 width={13} height={13} stroke="#dc2626" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex" style={{ borderBottom: "1px solid var(--c-border)", padding: "0 4px" }}>
                  {(["overview", "faculties", "courses"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className="cursor-pointer"
                      style={{
                        padding: "10px 16px", fontSize: "13px", fontWeight: tab === t ? 600 : 500,
                        color: tab === t ? "#2563eb" : "var(--c-text-3)",
                        border: "none", background: "none",
                        borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
                        marginBottom: "-1px", textTransform: "capitalize",
                      }}>
                      {t === "faculties" && <FlaskConical width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t === "courses" && <BookOpen width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {t === "faculties" && faculties.length > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 600, background: tab === t ? "#dbeafe" : "var(--c-bg-surface)", color: tab === t ? "#2563eb" : "var(--c-text-4)", padding: "1px 6px", borderRadius: "20px" }}>
                          {faculties.length}
                        </span>
                      )}
                      {t === "courses" && courses.length > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 600, background: tab === t ? "#dbeafe" : "var(--c-bg-surface)", color: tab === t ? "#2563eb" : "var(--c-text-4)", padding: "1px 6px", borderRadius: "20px" }}>
                          {courses.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ padding: "20px" }}>
                  {/* ── OVERVIEW TAB ── */}
                  {tab === "overview" && (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Website", value: selectedUni.website },
                        { label: "Email", value: selectedUni.email },
                        { label: "Phone", value: selectedUni.phone },
                        { label: "Postal Code", value: selectedUni.postal_code },
                        { label: "Address", value: selectedUni.address, full: true },
                        { label: "Description", value: selectedUni.description, full: true },
                      ].map(({ label, value, full }) => value ? (
                        <div key={label} style={full ? { gridColumn: "span 2" } : {}}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{label}</div>
                          <div style={{ fontSize: "13.5px", color: "var(--c-text-2)" }}>{value}</div>
                        </div>
                      ) : null)}
                      {!selectedUni.website && !selectedUni.email && !selectedUni.description && !selectedUni.phone && (
                        <div style={{ gridColumn: "span 2", color: "var(--c-text-4)", fontSize: "13px" }}>
                          No additional details. <button onClick={() => openEditUni(selectedUni)} className="cursor-pointer" style={{ color: "#2563eb", background: "none", border: "none", fontSize: "13px", padding: 0 }}>Edit university</button> to add website, contacts, and description.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── FACULTIES TAB ── */}
                  {tab === "faculties" && (
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                          {faculties.length} {faculties.length === 1 ? "faculty" : "faculties"}
                        </span>
                        <button onClick={openCreateFac} className="flex items-center gap-1.5 cursor-pointer"
                          style={{ height: "30px", padding: "0 11px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 550 }}>
                          <Plus width={13} height={13} stroke="#fff" strokeWidth={2.4} />Add faculty
                        </button>
                      </div>
                      {facLoading ? (
                        <div className="flex items-center justify-center" style={{ padding: "30px 0", color: "var(--c-text-4)" }}><Loader2 width={20} height={20} className="animate-spin" /></div>
                      ) : faculties.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                          No faculties yet. Add the first faculty for this university.
                        </div>
                      ) : (
                        <div style={{ border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                          {faculties.map((f, i) => (
                            <div key={f.id} className="group flex items-center justify-between"
                              style={{ padding: "12px 14px", borderBottom: i < faculties.length - 1 ? "1px solid var(--c-border)" : "none", background: "var(--c-bg-elevated)" }}>
                              <div>
                                <div style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{f.name}</div>
                                {f.description && <div style={{ fontSize: "12px", color: "var(--c-text-4)", marginTop: "2px" }}>{f.description}</div>}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s", flexShrink: 0 }}>
                                <button onClick={() => openEditFac(f)} className="cursor-pointer"
                                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                                  <Pencil width={12} height={12} stroke="var(--c-text-3)" strokeWidth={2} />
                                </button>
                                <button onClick={() => handleFacDelete(f.id)} className="cursor-pointer"
                                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px" }}>
                                  <Trash2 width={12} height={12} stroke="#dc2626" strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── COURSES TAB ── */}
                  {tab === "courses" && (
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                          {courses.length} {courses.length === 1 ? "course" : "courses"}
                        </span>
                        <button onClick={openCreateCourse} disabled={faculties.length === 0} className="flex items-center gap-1.5 cursor-pointer"
                          style={{ height: "30px", padding: "0 11px", background: faculties.length === 0 ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 550, cursor: faculties.length === 0 ? "not-allowed" : "pointer" }}>
                          <Plus width={13} height={13} stroke="#fff" strokeWidth={2.4} />Add course
                        </button>
                      </div>
                      {faculties.length === 0 && (
                        <div style={{ padding: "12px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", fontSize: "13px", color: "#92400e", marginBottom: "12px" }}>
                          Add at least one faculty before creating courses.
                        </div>
                      )}
                      {courseLoading ? (
                        <div className="flex items-center justify-center" style={{ padding: "30px 0", color: "var(--c-text-4)" }}><Loader2 width={20} height={20} className="animate-spin" /></div>
                      ) : courses.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                          No courses yet.
                        </div>
                      ) : (
                        <div style={{ border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-bg-surface)" }}>
                                  {["Course", "Degree", "Fee", "Duration", ""].map((h) => (
                                    <th key={h} style={{ padding: "9px 14px", fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {courses.map((c) => {
                                  const fac = faculties.find((f) => f.id === c.faculty_id);
                                  const deg = degrees.find((d) => d.id === c.degree_id);
                                  return (
                                    <tr key={c.id} className="group" style={{ borderBottom: "1px solid var(--c-border)", background: "var(--c-bg-elevated)" }}>
                                      <td style={{ padding: "11px 14px" }}>
                                        <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)" }}>{c.name}</div>
                                        <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginTop: "2px" }}>
                                          {fac?.name} · <span style={{ fontFamily: "monospace" }}>{c.course_code}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: "11px 14px" }}>
                                        <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--c-chip-ai-text)", background: "var(--c-chip-ai-bg)", padding: "3px 9px", borderRadius: "20px" }}>
                                          {deg?.name || "—"}
                                        </span>
                                      </td>
                                      <td style={{ padding: "11px 14px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.currency} {Number(c.tuition_fee).toLocaleString()}</span>
                                      </td>
                                      <td style={{ padding: "11px 14px" }}>
                                        <span style={{ fontSize: "13px", color: "var(--c-text-2)" }}>{c.duration_months}mo</span>
                                      </td>
                                      <td style={{ padding: "11px 14px", textAlign: "right" }}>
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                                          <button onClick={() => openEditCourse(c)} className="cursor-pointer" style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                                            <Pencil width={12} height={12} stroke="var(--c-text-3)" strokeWidth={2} />
                                          </button>
                                          <button onClick={() => handleCourseDelete(c.id)} className="cursor-pointer" style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px" }}>
                                            <Trash2 width={12} height={12} stroke="#dc2626" strokeWidth={2} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── UNIVERSITY DRAWER ── */}
      {uniDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setUniDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "440px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingUniId ? "Edit University" : "Add University"}</h2>
              <button onClick={() => setUniDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} placeholder="e.g. University of Sydney" value={uniForm.name}
                  onChange={(e) => { const name = e.target.value; setUniForm({ ...uniForm, name, ...(!editingUniId ? { slug: slugify(name) } : {}) }); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Short Name</label>
                  <input style={inputStyle} placeholder="USYD" value={uniForm.short_name} onChange={(e) => setUniForm({ ...uniForm, short_name: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Slug *</label>
                  <input style={inputStyle} placeholder="university-of-sydney" value={uniForm.slug} onChange={(e) => setUniForm({ ...uniForm, slug: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Type</label>
                <input style={inputStyle} placeholder="Public / Private" value={uniForm.university_type} onChange={(e) => setUniForm({ ...uniForm, university_type: e.target.value })} />
              </div>
              <Picker label="Country *" value={uniForm.country_id} options={countries.map((c) => ({ id: c.id, label: c.name }))}
                onSelect={(id) => setUniForm({ ...uniForm, country_id: id, city_id: "" })} placeholder="Select country" />
              <Picker label="City *" value={uniForm.city_id} options={filteredCities.map((c) => ({ id: c.id, label: c.name }))}
                onSelect={(id) => setUniForm({ ...uniForm, city_id: id })} placeholder={uniForm.country_id ? "Select city" : "Select country first"} />
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Website</label>
                  <input style={inputStyle} placeholder="https://..." value={uniForm.website} onChange={(e) => setUniForm({ ...uniForm, website: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} placeholder="info@uni.edu" value={uniForm.email} onChange={(e) => setUniForm({ ...uniForm, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} placeholder="+61..." value={uniForm.phone} onChange={(e) => setUniForm({ ...uniForm, phone: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Postal Code</label>
                  <input style={inputStyle} placeholder="2006" value={uniForm.postal_code} onChange={(e) => setUniForm({ ...uniForm, postal_code: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Address</label>
                <input style={inputStyle} placeholder="Street address" value={uniForm.address} onChange={(e) => setUniForm({ ...uniForm, address: e.target.value })} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Description</label>
                <textarea style={textareaStyle} placeholder="Brief description..." value={uniForm.description} onChange={(e) => setUniForm({ ...uniForm, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={uniForm.featured} onChange={(e) => setUniForm({ ...uniForm, featured: e.target.checked })} />
                <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Featured university</span>
              </label>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setUniDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleUniSave} disabled={uniSaving || !uniForm.name || !uniForm.slug || !uniForm.country_id || !uniForm.city_id}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: uniSaving || !uniForm.name || !uniForm.slug || !uniForm.country_id || !uniForm.city_id ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {uniSaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingUniId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── FACULTY DRAWER ── */}
      {facDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setFacDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "380px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingFacId ? "Edit Faculty" : "Add Faculty"}</h2>
              <button onClick={() => setFacDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ padding: "10px 12px", marginBottom: "16px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "12.5px", color: "var(--c-text-3)" }}>
                University: <strong style={{ color: "var(--c-text-1)" }}>{selectedUni?.name}</strong>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Faculty Name *</label>
                <input style={inputStyle} placeholder="e.g. Faculty of Engineering" value={facForm.name}
                  onChange={(e) => setFacForm({ ...facForm, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleFacSave()}
                  autoFocus />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Description</label>
                <textarea style={textareaStyle} placeholder="Brief description..." value={facForm.description}
                  onChange={(e) => setFacForm({ ...facForm, description: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setFacDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleFacSave} disabled={facSaving || !facForm.name} className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: facSaving || !facForm.name ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {facSaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingFacId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── COURSE DRAWER ── */}
      {courseDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setCourseDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "460px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingCourseId ? "Edit Course" : "Add Course"}</h2>
              <button onClick={() => setCourseDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Course Name *</label>
                <input style={inputStyle} placeholder="e.g. Software Engineering" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Code *</label>
                  <input style={inputStyle} placeholder="CS101" value={courseForm.course_code} onChange={(e) => setCourseForm({ ...courseForm, course_code: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Duration (months) *</label>
                  <input style={inputStyle} type="number" placeholder="24" value={courseForm.duration_months} onChange={(e) => setCourseForm({ ...courseForm, duration_months: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Tuition Fee *</label>
                  <input style={inputStyle} type="number" placeholder="35000" value={courseForm.tuition_fee} onChange={(e) => setCourseForm({ ...courseForm, tuition_fee: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Currency</label>
                  <input style={inputStyle} placeholder="AUD" value={courseForm.currency} onChange={(e) => setCourseForm({ ...courseForm, currency: e.target.value })} />
                </div>
              </div>
              <Picker label="Faculty *" value={courseForm.faculty_id} options={facultyOptions}
                onSelect={(id) => setCourseForm({ ...courseForm, faculty_id: id })} placeholder="Select faculty" />
              <Picker label="Degree *" value={courseForm.degree_id} options={degreeOptions}
                onSelect={(id) => setCourseForm({ ...courseForm, degree_id: id })} placeholder="Select degree" />
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Intake</label>
                <input style={inputStyle} placeholder="e.g. February, July" value={courseForm.intake} onChange={(e) => setCourseForm({ ...courseForm, intake: e.target.value })} />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>English Requirements</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ielts_requirement", "pte_requirement", "toefl_requirement"] as const).map((field, i) => (
                    <div key={field}>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "4px" }}>{["IELTS", "PTE", "TOEFL"][i]}</div>
                      <input style={inputStyle} type="number" step="0.5" placeholder={["6.5", "58", "79"][i]}
                        value={courseForm[field]} onChange={(e) => setCourseForm({ ...courseForm, [field]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                <label style={labelStyle}>Overview</label>
                <textarea style={textareaStyle} placeholder="Brief course description..." value={courseForm.overview} onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={courseForm.scholarship_available} onChange={(e) => setCourseForm({ ...courseForm, scholarship_available: e.target.checked })} />
                <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Scholarship available</span>
              </label>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setCourseDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleCourseSave} disabled={courseSaving || !canSaveCourse} className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: courseSaving || !canSaveCourse ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {courseSaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingCourseId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
