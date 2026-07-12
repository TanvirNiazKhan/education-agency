"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check,
  Globe, Star, FlaskConical, BookOpen, ChevronRight, ImageIcon, Upload, GraduationCap, CalendarDays,
} from "lucide-react";
import {
  universitiesApi, countriesApi, citiesApi, facultiesApi, coursesApi, degreesApi, universityImagesApi, scholarshipsApi, intakesApi,
  type University, type Country, type City, type Faculty, type Course, type Degree, type UniversityImage, type Scholarship, type Intake,
  type CreateUniversityData, type CreateCourseData, type CreateScholarshipData, type CreateIntakeData,
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
  ielts_requirement: string; ielts_speaking: string; ielts_writing: string; ielts_reading: string; ielts_listening: string;
  pte_requirement: string; pte_speaking: string; pte_writing: string; pte_reading: string; pte_listening: string;
  toefl_requirement: string; toefl_speaking: string; toefl_writing: string; toefl_reading: string; toefl_listening: string;
  overview: string; scholarship_available: boolean;
}
const emptyCourseForm: CourseForm = {
  name: "", course_code: "", tuition_fee: "", currency: "AUD", duration_months: "",
  faculty_id: "", degree_id: "", intake: "",
  ielts_requirement: "", ielts_speaking: "", ielts_writing: "", ielts_reading: "", ielts_listening: "",
  pte_requirement: "", pte_speaking: "", pte_writing: "", pte_reading: "", pte_listening: "",
  toefl_requirement: "", toefl_speaking: "", toefl_writing: "", toefl_reading: "", toefl_listening: "",
  overview: "", scholarship_available: false,
};

/* ─── Scholarship form ─── */
interface SchForm {
  name: string; description: string; percentage: string;
  type: string; deadline: string;
  scopes: { scope_type: string; scope_id: string }[];
}
const emptySchForm: SchForm = {
  name: "", description: "", percentage: "",
  type: "", deadline: "", scopes: [],
};

/* ─── Intake form ─── */
interface IntakeForm {
  name: string; start_date: string; end_date: string; deadline: string; status: string;
}
const emptyIntakeForm: IntakeForm = {
  name: "", start_date: "", end_date: "", deadline: "", status: "upcoming",
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
  const [tab, setTab] = useState<"overview" | "faculties" | "courses" | "intakes" | "scholarships" | "images">("overview");

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

  /* Intake state */
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [intLoading, setIntLoading] = useState(false);
  const [intDrawerOpen, setIntDrawerOpen] = useState(false);
  const [editingIntId, setEditingIntId] = useState<string | null>(null);
  const [intForm, setIntForm] = useState<IntakeForm>(emptyIntakeForm);
  const [intSaving, setIntSaving] = useState(false);

  /* Scholarship state */
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [schLoading, setSchLoading] = useState(false);
  const [schDrawerOpen, setSchDrawerOpen] = useState(false);
  const [editingSchId, setEditingSchId] = useState<string | null>(null);
  const [schForm, setSchForm] = useState<SchForm>(emptySchForm);
  const [schSaving, setSchSaving] = useState(false);

  /* Image state */
  const [images, setImages] = useState<UniversityImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgType, setImgType] = useState<string>("gallery");

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

  const loadIntakes = useCallback(async (uniId: string) => {
    setIntLoading(true);
    try {
      const data = await intakesApi.list(uniId);
      setIntakes(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load intakes");
    } finally { setIntLoading(false); }
  }, []);

  const loadScholarships = useCallback(async (uniId: string) => {
    setSchLoading(true);
    try {
      const data = await scholarshipsApi.list(uniId);
      setScholarships(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load scholarships");
    } finally { setSchLoading(false); }
  }, []);

  const loadImages = useCallback(async (uniId: string) => {
    setImgLoading(true);
    try {
      const data = await universityImagesApi.list(uniId);
      setImages(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load images");
    } finally { setImgLoading(false); }
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadFacultiesAndCourses(selectedId);
      loadIntakes(selectedId);
      loadScholarships(selectedId);
      loadImages(selectedId);
    } else { setFaculties([]); setCourses([]); setIntakes([]); setScholarships([]); setImages([]); }
  }, [selectedId, loadFacultiesAndCourses, loadIntakes, loadScholarships, loadImages]);

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

  async function handleToggleActive(uni: University) {
    try {
      await universitiesApi.update(uni.id, { is_active: !uni.is_active });
      await loadUniversities();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update status"); }
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
  async function handleFacToggleActive(f: Faculty) {
    try {
      await facultiesApi.update(f.id, { is_active: !f.is_active });
      if (selectedId) await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update status"); }
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
      ielts_speaking: c.ielts_speaking != null ? String(c.ielts_speaking) : "",
      ielts_writing: c.ielts_writing != null ? String(c.ielts_writing) : "",
      ielts_reading: c.ielts_reading != null ? String(c.ielts_reading) : "",
      ielts_listening: c.ielts_listening != null ? String(c.ielts_listening) : "",
      pte_requirement: c.pte_requirement != null ? String(c.pte_requirement) : "",
      pte_speaking: c.pte_speaking != null ? String(c.pte_speaking) : "",
      pte_writing: c.pte_writing != null ? String(c.pte_writing) : "",
      pte_reading: c.pte_reading != null ? String(c.pte_reading) : "",
      pte_listening: c.pte_listening != null ? String(c.pte_listening) : "",
      toefl_requirement: c.toefl_requirement != null ? String(c.toefl_requirement) : "",
      toefl_speaking: c.toefl_speaking != null ? String(c.toefl_speaking) : "",
      toefl_writing: c.toefl_writing != null ? String(c.toefl_writing) : "",
      toefl_reading: c.toefl_reading != null ? String(c.toefl_reading) : "",
      toefl_listening: c.toefl_listening != null ? String(c.toefl_listening) : "",
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
        ...(courseForm.ielts_speaking && { ielts_speaking: parseFloat(courseForm.ielts_speaking) }),
        ...(courseForm.ielts_writing && { ielts_writing: parseFloat(courseForm.ielts_writing) }),
        ...(courseForm.ielts_reading && { ielts_reading: parseFloat(courseForm.ielts_reading) }),
        ...(courseForm.ielts_listening && { ielts_listening: parseFloat(courseForm.ielts_listening) }),
        ...(courseForm.pte_requirement && { pte_requirement: parseFloat(courseForm.pte_requirement) }),
        ...(courseForm.pte_speaking && { pte_speaking: parseFloat(courseForm.pte_speaking) }),
        ...(courseForm.pte_writing && { pte_writing: parseFloat(courseForm.pte_writing) }),
        ...(courseForm.pte_reading && { pte_reading: parseFloat(courseForm.pte_reading) }),
        ...(courseForm.pte_listening && { pte_listening: parseFloat(courseForm.pte_listening) }),
        ...(courseForm.toefl_requirement && { toefl_requirement: parseFloat(courseForm.toefl_requirement) }),
        ...(courseForm.toefl_speaking && { toefl_speaking: parseFloat(courseForm.toefl_speaking) }),
        ...(courseForm.toefl_writing && { toefl_writing: parseFloat(courseForm.toefl_writing) }),
        ...(courseForm.toefl_reading && { toefl_reading: parseFloat(courseForm.toefl_reading) }),
        ...(courseForm.toefl_listening && { toefl_listening: parseFloat(courseForm.toefl_listening) }),
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
  async function handleCourseToggleActive(c: Course) {
    try {
      await coursesApi.update(c.id, { is_active: !c.is_active });
      if (selectedId) await loadFacultiesAndCourses(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update status"); }
  }

  /* ─── Image handlers ─── */
  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0 || !selectedId) return;
    setImgUploading(true);
    try {
      await universityImagesApi.upload(selectedId, Array.from(files), imgType);
      await loadImages(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to upload");
    } finally { setImgUploading(false); }
  }
  async function handleImageDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      await universityImagesApi.delete(id);
      if (selectedId) await loadImages(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── Intake CRUD ─── */
  function openCreateInt() {
    setEditingIntId(null); setIntForm(emptyIntakeForm); setIntDrawerOpen(true);
  }
  function openEditInt(i: Intake) {
    setEditingIntId(i.id);
    setIntForm({
      name: i.name, start_date: i.start_date || "", end_date: i.end_date || "",
      deadline: i.deadline || "", status: i.status || "upcoming",
    });
    setIntDrawerOpen(true);
  }
  async function handleIntSave() {
    if (!intForm.name || !selectedId) return;
    setIntSaving(true);
    try {
      const data: CreateIntakeData = {
        name: intForm.name, university_id: selectedId,
        ...(intForm.start_date && { start_date: intForm.start_date }),
        ...(intForm.end_date && { end_date: intForm.end_date }),
        ...(intForm.deadline && { deadline: intForm.deadline }),
        ...(intForm.status && { status: intForm.status }),
      };
      if (editingIntId) await intakesApi.update(editingIntId, data);
      else await intakesApi.create(data);
      setIntDrawerOpen(false);
      await loadIntakes(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setIntSaving(false); }
  }
  async function handleIntDelete(id: string) {
    if (!confirm("Delete this intake?")) return;
    try {
      await intakesApi.delete(id);
      if (selectedId) await loadIntakes(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── Scholarship CRUD ─── */
  function openCreateSch() {
    setEditingSchId(null); setSchForm(emptySchForm); setSchDrawerOpen(true);
  }
  function openEditSch(s: Scholarship) {
    setEditingSchId(s.id);
    setSchForm({
      name: s.name, description: s.description || "",
      percentage: s.percentage != null ? String(s.percentage) : "",
      type: s.type || "", deadline: s.deadline || "",
      scopes: s.scopes?.map((sc) => ({ scope_type: sc.scope_type, scope_id: sc.scope_id })) || [],
    });
    setSchDrawerOpen(true);
  }
  async function handleSchSave() {
    if (!schForm.name || !selectedId) return;
    setSchSaving(true);
    try {
      const data: CreateScholarshipData = {
        name: schForm.name, university_id: selectedId,
        ...(schForm.description && { description: schForm.description }),
        ...(schForm.percentage && { percentage: parseFloat(schForm.percentage) }),
        ...(schForm.type && { type: schForm.type }),
        ...(schForm.deadline && { deadline: schForm.deadline }),
        scopes: schForm.scopes,
      };
      if (editingSchId) await scholarshipsApi.update(editingSchId, data);
      else await scholarshipsApi.create(data);
      setSchDrawerOpen(false);
      await loadScholarships(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSchSaving(false); }
  }
  async function handleSchDelete(id: string) {
    if (!confirm("Delete this scholarship?")) return;
    try {
      await scholarshipsApi.delete(id);
      if (selectedId) await loadScholarships(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }
  function addScope() {
    setSchForm({ ...schForm, scopes: [...schForm.scopes, { scope_type: "course", scope_id: "" }] });
  }
  function removeScope(idx: number) {
    setSchForm({ ...schForm, scopes: schForm.scopes.filter((_, i) => i !== idx) });
  }
  function updateScope(idx: number, field: "scope_type" | "scope_id", value: string) {
    const scopes = [...schForm.scopes];
    scopes[idx] = { ...scopes[idx], [field]: value };
    setSchForm({ ...schForm, scopes });
  }

  function getScopeName(type: string, id: string): string {
    if (type === "faculty") return faculties.find((f) => f.id === id)?.name || id.slice(0, 8);
    if (type === "course") return courses.find((c) => c.id === id)?.name || id.slice(0, 8);
    if (type === "degree") return degrees.find((d) => d.id === id)?.name || id.slice(0, 8);
    return id.slice(0, 8);
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
                <div className="absolute z-50 left-0 sm:left-auto sm:right-0" style={{ top: "40px", width: "220px", maxWidth: "calc(100vw - 32px)", background: "var(--c-dropdown-bg)", border: "1px solid var(--c-border)", borderRadius: "12px", boxShadow: "var(--c-shadow-heavy)", padding: "6px" }}>
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
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* ── LEFT LIST ── */}
          <div className={`w-full lg:w-[272px] ${selectedId ? "hidden lg:block" : ""}`} style={{ flexShrink: 0 }}>
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
                        <div className="flex items-center gap-1.5" style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 550, color: isSelected ? "#2563eb" : u.is_active ? "var(--c-text-1)" : "var(--c-text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.name}
                          {!u.is_active && <span style={{ fontSize: "10px", fontWeight: 600, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", padding: "0 5px", borderRadius: "4px", flexShrink: 0 }}>Inactive</span>}
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
          <div className={`flex-1 w-full ${!selectedId ? "hidden lg:block" : ""}`} style={{ minWidth: 0 }}>
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
                  <button onClick={() => setSelectedId(null)} className="lg:hidden flex items-center gap-1 cursor-pointer"
                    style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--c-text-3)", background: "none", border: "none", padding: 0, marginBottom: "12px" }}>
                    <ChevronRight width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} style={{ transform: "rotate(180deg)" }} />
                    Back to list
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                      {(() => {
                        const logoImg = images.find((i) => i.type === "logo");
                        const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";
                        return logoImg ? (
                          <img src={`${apiBase}${logoImg.url}`} alt="Logo"
                            style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--c-border)", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ImageIcon width={18} height={18} stroke="var(--c-text-5)" strokeWidth={1.5} />
                          </div>
                        );
                      })()}
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
                    </div>
                    <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
                      <button onClick={() => handleToggleActive(selectedUni)} className="flex items-center gap-1.5 cursor-pointer hoverable"
                        style={{
                          height: "30px", padding: "0 10px",
                          border: `1px solid ${selectedUni.is_active ? "#bbf7d0" : "#fde68a"}`,
                          borderRadius: "7px",
                          background: selectedUni.is_active ? "#f0fdf4" : "#fffbeb",
                          fontSize: "12px", fontWeight: 550,
                          color: selectedUni.is_active ? "#16a34a" : "#d97706",
                        }}>
                        {selectedUni.is_active ? "Active" : "Inactive"}
                      </button>
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
                <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid var(--c-border)", padding: "0 4px", WebkitOverflowScrolling: "touch" }}>
                  {(["overview", "faculties", "courses", "intakes", "scholarships", "images"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className="cursor-pointer"
                      style={{
                        padding: "10px 16px", fontSize: "13px", fontWeight: tab === t ? 600 : 500, whiteSpace: "nowrap",
                        color: tab === t ? "#2563eb" : "var(--c-text-3)",
                        border: "none", background: "none",
                        borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
                        marginBottom: "-1px", textTransform: "capitalize",
                      }}>
                      {t === "faculties" && <FlaskConical width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t === "courses" && <BookOpen width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t === "intakes" && <CalendarDays width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t === "scholarships" && <GraduationCap width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
                      {t === "images" && <ImageIcon width={13} height={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />}
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
                      {t === "intakes" && intakes.length > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 600, background: tab === t ? "#dbeafe" : "var(--c-bg-surface)", color: tab === t ? "#2563eb" : "var(--c-text-4)", padding: "1px 6px", borderRadius: "20px" }}>
                          {intakes.length}
                        </span>
                      )}
                      {t === "scholarships" && scholarships.length > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 600, background: tab === t ? "#dbeafe" : "var(--c-bg-surface)", color: tab === t ? "#2563eb" : "var(--c-text-4)", padding: "1px 6px", borderRadius: "20px" }}>
                          {scholarships.length}
                        </span>
                      )}
                      {t === "images" && images.length > 0 && (
                        <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 600, background: tab === t ? "#dbeafe" : "var(--c-bg-surface)", color: tab === t ? "#2563eb" : "var(--c-text-4)", padding: "1px 6px", borderRadius: "20px" }}>
                          {images.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ padding: "20px" }}>
                  {/* ── OVERVIEW TAB ── */}
                  {tab === "overview" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Website", value: selectedUni.website },
                        { label: "Email", value: selectedUni.email },
                        { label: "Phone", value: selectedUni.phone },
                        { label: "Postal Code", value: selectedUni.postal_code },
                        { label: "Address", value: selectedUni.address, full: true },
                        { label: "Description", value: selectedUni.description, full: true },
                      ].map(({ label, value, full }) => value ? (
                        <div key={label} className={full ? "sm:col-span-2" : ""}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--c-text-4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{label}</div>
                          <div style={{ fontSize: "13.5px", color: "var(--c-text-2)" }}>{value}</div>
                        </div>
                      ) : null)}
                      {!selectedUni.website && !selectedUni.email && !selectedUni.description && !selectedUni.phone && (
                        <div className="sm:col-span-2" style={{ color: "var(--c-text-4)", fontSize: "13px" }}>
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
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5" style={{ fontSize: "13.5px", fontWeight: 550, color: f.is_active ? "var(--c-text-1)" : "var(--c-text-4)" }}>
                                    {f.name}
                                    {!f.is_active && <span style={{ fontSize: "10px", fontWeight: 600, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", padding: "0 5px", borderRadius: "4px" }}>Inactive</span>}
                                  </div>
                                  {f.description && <div style={{ fontSize: "12px", color: "var(--c-text-4)", marginTop: "2px" }}>{f.description}</div>}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s", flexShrink: 0 }}>
                                <button onClick={() => handleFacToggleActive(f)} className="cursor-pointer"
                                  style={{ height: "28px", padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px solid ${f.is_active ? "#bbf7d0" : "#fde68a"}`, borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: f.is_active ? "#16a34a" : "#d97706" }}>
                                  {f.is_active ? "Active" : "Inactive"}
                                </button>
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
                                  {["Course", "Degree", "Fee", "Duration", "Status", ""].map((h) => (
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
                                      <td style={{ padding: "11px 14px" }}>
                                        <button onClick={() => handleCourseToggleActive(c)} className="cursor-pointer"
                                          style={{ height: "24px", padding: "0 8px", background: "none", border: `1px solid ${c.is_active ? "#bbf7d0" : "#fde68a"}`, borderRadius: "5px", fontSize: "11px", fontWeight: 600, color: c.is_active ? "#16a34a" : "#d97706" }}>
                                          {c.is_active ? "Active" : "Inactive"}
                                        </button>
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

                  {/* ── INTAKES TAB ── */}
                  {tab === "intakes" && (
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                          {intakes.length} {intakes.length === 1 ? "intake" : "intakes"}
                        </span>
                        <button onClick={openCreateInt} className="flex items-center gap-1.5 cursor-pointer"
                          style={{ height: "30px", padding: "0 11px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 550 }}>
                          <Plus width={13} height={13} stroke="#fff" strokeWidth={2.4} />Add intake
                        </button>
                      </div>
                      {intLoading ? (
                        <div className="flex items-center justify-center" style={{ padding: "30px 0", color: "var(--c-text-4)" }}><Loader2 width={20} height={20} className="animate-spin" /></div>
                      ) : intakes.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                          No intakes yet. Add the first intake for this university.
                        </div>
                      ) : (
                        <div style={{ border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                          {intakes.map((i, idx) => (
                            <div key={i.id} className="group flex items-center justify-between"
                              style={{ padding: "12px 14px", borderBottom: idx < intakes.length - 1 ? "1px solid var(--c-border)" : "none", background: "var(--c-bg-elevated)" }}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{i.name}</span>
                                  {i.status && (
                                    <span style={{ fontSize: "10.5px", fontWeight: 600, textTransform: "uppercase", padding: "2px 7px", borderRadius: "20px",
                                      background: i.status === "open" ? "#dcfce7" : i.status === "closed" ? "#fee2e2" : "#dbeafe",
                                      color: i.status === "open" ? "#166534" : i.status === "closed" ? "#991b1b" : "#1e40af",
                                    }}>
                                      {i.status}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3" style={{ marginTop: "4px", fontSize: "12px", color: "var(--c-text-4)" }}>
                                  {i.start_date && <span>Start: {i.start_date}</span>}
                                  {i.end_date && <span>End: {i.end_date}</span>}
                                  {i.deadline && <span>Deadline: {i.deadline}</span>}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s", flexShrink: 0 }}>
                                <button onClick={() => openEditInt(i)} className="cursor-pointer"
                                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                                  <Pencil width={12} height={12} stroke="var(--c-text-3)" strokeWidth={2} />
                                </button>
                                <button onClick={() => handleIntDelete(i.id)} className="cursor-pointer"
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

                  {/* ── SCHOLARSHIPS TAB ── */}
                  {tab === "scholarships" && (
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                          {scholarships.length} {scholarships.length === 1 ? "scholarship" : "scholarships"}
                        </span>
                        <button onClick={openCreateSch} className="flex items-center gap-1.5 cursor-pointer"
                          style={{ height: "30px", padding: "0 11px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 550 }}>
                          <Plus width={13} height={13} stroke="#fff" strokeWidth={2.4} />Add scholarship
                        </button>
                      </div>
                      {schLoading ? (
                        <div className="flex items-center justify-center" style={{ padding: "30px 0", color: "var(--c-text-4)" }}><Loader2 width={20} height={20} className="animate-spin" /></div>
                      ) : scholarships.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                          No scholarships yet. Add the first scholarship for this university.
                        </div>
                      ) : (
                        <div style={{ border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                          {scholarships.map((s, i) => (
                            <div key={s.id} className="group"
                              style={{ padding: "14px 16px", borderBottom: i < scholarships.length - 1 ? "1px solid var(--c-border)" : "none", background: "var(--c-bg-elevated)" }}>
                              <div className="flex items-start justify-between gap-3">
                                <div style={{ minWidth: 0 }}>
                                  <div className="flex items-center gap-2">
                                    <span style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{s.name}</span>
                                    {s.type && (
                                      <span style={{ fontSize: "10.5px", fontWeight: 600, textTransform: "uppercase", padding: "2px 7px", borderRadius: "20px",
                                        background: s.type === "full" ? "#dcfce7" : s.type === "partial" ? "#dbeafe" : "#fef9c3",
                                        color: s.type === "full" ? "#166534" : s.type === "partial" ? "#1e40af" : "#854d0e",
                                      }}>
                                        {s.type}
                                      </span>
                                    )}
                                  </div>
                                  {s.description && <div style={{ fontSize: "12.5px", color: "var(--c-text-3)", marginTop: "4px", lineHeight: "1.4" }}>{s.description}</div>}
                                  <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: "6px" }}>
                                    {s.percentage != null && (
                                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-1)" }}>
                                        {Number(s.percentage)}%
                                      </span>
                                    )}
                                    {s.deadline && (
                                      <span style={{ fontSize: "11.5px", color: "var(--c-text-4)" }}>
                                        Deadline: {s.deadline}
                                      </span>
                                    )}
                                  </div>
                                  {s.scopes && s.scopes.length > 0 && (
                                    <div className="flex items-center gap-1.5 flex-wrap" style={{ marginTop: "6px" }}>
                                      {s.scopes.map((sc) => (
                                        <span key={sc.id} style={{ fontSize: "11px", fontWeight: 550, padding: "2px 8px", borderRadius: "20px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", color: "var(--c-text-3)" }}>
                                          {sc.scope_type}: {getScopeName(sc.scope_type, sc.scope_id)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {(!s.scopes || s.scopes.length === 0) && (
                                    <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--c-text-4)", fontStyle: "italic" }}>University-wide</div>
                                  )}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s", flexShrink: 0 }}>
                                  <button onClick={() => openEditSch(s)} className="cursor-pointer"
                                    style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                                    <Pencil width={12} height={12} stroke="var(--c-text-3)" strokeWidth={2} />
                                  </button>
                                  <button onClick={() => handleSchDelete(s.id)} className="cursor-pointer"
                                    style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px" }}>
                                    <Trash2 width={12} height={12} stroke="#dc2626" strokeWidth={2} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── IMAGES TAB ── */}
                  {tab === "images" && (
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>
                          {images.length} {images.length === 1 ? "image" : "images"}
                        </span>
                        <div className="flex items-center gap-2">
                          <select value={imgType} onChange={(e) => setImgType(e.target.value)}
                            style={{ height: "30px", padding: "0 8px", fontSize: "12px", fontWeight: 550, border: "1px solid var(--c-border-input)", borderRadius: "7px", background: "var(--c-bg-elevated)", color: "var(--c-text-1)", cursor: "pointer" }}>
                            <option value="logo">Logo</option>
                            <option value="banner">Banner</option>
                            <option value="gallery">Gallery</option>
                          </select>
                          <label className="flex items-center gap-1.5 cursor-pointer"
                            style={{ height: "30px", padding: "0 11px", background: imgUploading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 550 }}>
                            {imgUploading ? <Loader2 width={13} height={13} className="animate-spin" /> : <Upload width={13} height={13} stroke="#fff" strokeWidth={2.4} />}
                            {imgUploading ? "Uploading..." : "Upload images"}
                            <input type="file" multiple accept="image/*" style={{ display: "none" }}
                              onChange={(e) => handleImageUpload(e.target.files)}
                              disabled={imgUploading} />
                          </label>
                        </div>
                      </div>
                      {imgLoading ? (
                        <div className="flex items-center justify-center" style={{ padding: "30px 0", color: "var(--c-text-4)" }}><Loader2 width={20} height={20} className="animate-spin" /></div>
                      ) : images.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--c-text-4)" }}>
                          <ImageIcon width={32} height={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontSize: "13px" }}>No images yet. Upload photos of the campus, facilities, or events.</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {images.map((img) => (
                            <div key={img.id} className="group relative" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid var(--c-border)", aspectRatio: "4/3" }}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001"}${img.url}`}
                                alt={img.alt_text || "University image"}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              />
                              {img.type && (
                                <span className="absolute" style={{ top: "8px", left: "8px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 7px", borderRadius: "5px", background: img.type === "banner" ? "rgba(37,99,235,0.85)" : img.type === "logo" ? "rgba(234,88,12,0.85)" : "rgba(0,0,0,0.55)", color: "#fff" }}>
                                  {img.type}
                                </span>
                              )}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.5))", transition: "opacity 0.15s" }}>
                                <button onClick={() => handleImageDelete(img.id)} className="absolute cursor-pointer"
                                  style={{ bottom: "8px", right: "8px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(220,38,38,0.9)", border: "none", borderRadius: "6px" }}>
                                  <Trash2 width={13} height={13} stroke="#fff" strokeWidth={2} />
                                </button>
                              </div>
                              {img.alt_text && (
                                <div className="absolute opacity-0 group-hover:opacity-100" style={{ bottom: "8px", left: "8px", fontSize: "11px", color: "#fff", fontWeight: 500, maxWidth: "calc(100% - 48px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "opacity 0.15s" }}>
                                  {img.alt_text}
                                </div>
                              )}
                            </div>
                          ))}
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
                <label style={labelStyle}>IELTS Requirements</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(["ielts_requirement", "ielts_speaking", "ielts_writing", "ielts_reading", "ielts_listening"] as const).map((field, i) => (
                    <div key={field}>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "4px" }}>{["Overall", "Speaking", "Writing", "Reading", "Listening"][i]}</div>
                      <input style={inputStyle} type="number" step="0.5" placeholder="6.5"
                        value={courseForm[field]} onChange={(e) => setCourseForm({ ...courseForm, [field]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>PTE Requirements</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(["pte_requirement", "pte_speaking", "pte_writing", "pte_reading", "pte_listening"] as const).map((field, i) => (
                    <div key={field}>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "4px" }}>{["Overall", "Speaking", "Writing", "Reading", "Listening"][i]}</div>
                      <input style={inputStyle} type="number" step="1" placeholder="58"
                        value={courseForm[field]} onChange={(e) => setCourseForm({ ...courseForm, [field]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>TOEFL Requirements</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(["toefl_requirement", "toefl_speaking", "toefl_writing", "toefl_reading", "toefl_listening"] as const).map((field, i) => (
                    <div key={field}>
                      <div style={{ fontSize: "11px", color: "var(--c-text-4)", marginBottom: "4px" }}>{["Overall", "Speaking", "Writing", "Reading", "Listening"][i]}</div>
                      <input style={inputStyle} type="number" step="1" placeholder="79"
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

      {/* ── INTAKE DRAWER ── */}
      {intDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setIntDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "400px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingIntId ? "Edit Intake" : "Add Intake"}</h2>
              <button onClick={() => setIntDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ padding: "10px 12px", marginBottom: "16px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "12.5px", color: "var(--c-text-3)" }}>
                University: <strong style={{ color: "var(--c-text-1)" }}>{selectedUni?.name}</strong>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} placeholder="e.g. February 2026" value={intForm.name}
                  onChange={(e) => setIntForm({ ...intForm, name: e.target.value })} autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Start Date</label>
                  <input style={inputStyle} type="date" value={intForm.start_date}
                    onChange={(e) => setIntForm({ ...intForm, start_date: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>End Date</label>
                  <input style={inputStyle} type="date" value={intForm.end_date}
                    onChange={(e) => setIntForm({ ...intForm, end_date: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Application Deadline</label>
                  <input style={inputStyle} type="date" value={intForm.deadline}
                    onChange={(e) => setIntForm({ ...intForm, deadline: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={intForm.status} onChange={(e) => setIntForm({ ...intForm, status: e.target.value })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setIntDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleIntSave} disabled={intSaving || !intForm.name}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: intSaving || !intForm.name ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {intSaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingIntId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── SCHOLARSHIP DRAWER ── */}
      {schDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setSchDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "460px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingSchId ? "Edit Scholarship" : "Add Scholarship"}</h2>
              <button onClick={() => setSchDrawerOpen(false)} className="cursor-pointer" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ padding: "10px 12px", marginBottom: "16px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "12.5px", color: "var(--c-text-3)" }}>
                University: <strong style={{ color: "var(--c-text-1)" }}>{selectedUni?.name}</strong>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} placeholder="e.g. Engineering Excellence Award" value={schForm.name}
                  onChange={(e) => setSchForm({ ...schForm, name: e.target.value })} autoFocus />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Description</label>
                <textarea style={textareaStyle} placeholder="Scholarship details, eligibility criteria..." value={schForm.description}
                  onChange={(e) => setSchForm({ ...schForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Percentage</label>
                  <input style={inputStyle} type="number" min="0" max="100" placeholder="25" value={schForm.percentage}
                    onChange={(e) => setSchForm({ ...schForm, percentage: e.target.value })} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Type</label>
                  <select style={inputStyle} value={schForm.type} onChange={(e) => setSchForm({ ...schForm, type: e.target.value })}>
                    <option value="">Select type</option>
                    <option value="full">Full</option>
                    <option value="partial">Partial</option>
                    <option value="tuition-waiver">Tuition Waiver</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Deadline</label>
                  <input style={inputStyle} type="date" value={schForm.deadline}
                    onChange={(e) => setSchForm({ ...schForm, deadline: e.target.value })} />
                </div>
              </div>

              {/* Scopes */}
              <div style={{ marginBottom: "16px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Applies to</label>
                  <button onClick={addScope} className="flex items-center gap-1 cursor-pointer"
                    style={{ fontSize: "11.5px", fontWeight: 550, color: "#2563eb", background: "none", border: "none", padding: 0 }}>
                    <Plus width={12} height={12} stroke="#2563eb" strokeWidth={2.4} />Add scope
                  </button>
                </div>
                {schForm.scopes.length === 0 && (
                  <div style={{ padding: "10px 12px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "12px", color: "var(--c-text-4)" }}>
                    No scopes — applies university-wide. Add a scope to target specific faculties, courses, or degrees.
                  </div>
                )}
                {schForm.scopes.map((scope, idx) => (
                  <div key={idx} className="flex items-center gap-2" style={{ marginBottom: "8px" }}>
                    <select value={scope.scope_type} onChange={(e) => updateScope(idx, "scope_type", e.target.value)}
                      style={{ ...inputStyle, width: "120px", flexShrink: 0 }}>
                      <option value="course">Course</option>
                      <option value="faculty">Faculty</option>
                      <option value="degree">Degree</option>
                    </select>
                    <select value={scope.scope_id} onChange={(e) => updateScope(idx, "scope_id", e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}>
                      <option value="">Select...</option>
                      {scope.scope_type === "faculty" && faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                      {scope.scope_type === "course" && courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      {scope.scope_type === "degree" && degrees.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <button onClick={() => removeScope(idx)} className="cursor-pointer"
                      style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px", flexShrink: 0 }}>
                      <X width={12} height={12} stroke="#dc2626" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setSchDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleSchSave} disabled={schSaving || !schForm.name}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: schSaving || !schForm.name ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {schSaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingSchId ? "Update" : "Create"}
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
