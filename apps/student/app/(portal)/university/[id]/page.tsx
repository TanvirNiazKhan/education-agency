"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ApiUniversity,
  ApiImage,
  ApiScholarship,
  ApiIntake,
  ApiCourse,
  ApiDegree,
  CourseWithFaculty,
  Tab,
  API_BASE,
} from "./_components/types";
import UniversityHero from "./_components/UniversityHero";
import QuickStats from "./_components/QuickStats";
import TabNav from "./_components/TabNav";
import OverviewTab from "./_components/tabs/OverviewTab";
import CoursesTab from "./_components/tabs/CoursesTab";
import RequirementsTab from "./_components/tabs/RequirementsTab";
import ScholarshipsTab from "./_components/tabs/ScholarshipsTab";
import AccommodationTab from "./_components/tabs/AccommodationTab";
import GalleryTab from "./_components/tabs/GalleryTab";
import FaqTab from "./_components/tabs/FaqTab";
import ReviewsTab from "./_components/tabs/ReviewsTab";
import AiAssistantTab from "./_components/tabs/AiAssistantTab";
import ActionBar from "./_components/ActionBar";

function UniversityDetailPageInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "Overview";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [university, setUniversity] = useState<ApiUniversity | null>(null);
  const [images, setImages] = useState<ApiImage[]>([]);
  const [scholarships, setScholarships] = useState<ApiScholarship[]>([]);
  const [intakes, setIntakes] = useState<ApiIntake[]>([]);
  const [courses, setCourses] = useState<CourseWithFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch university by slug
        const uniRes = await fetch(`${API_BASE}/universities/slug/${id}`);
        if (!uniRes.ok) throw new Error("University not found");
        const uni: ApiUniversity = await uniRes.json();
        if (cancelled) return;
        setUniversity(uni);

        // 2. Parallel fetches for related data
        const [imgRes, schRes, intakeRes, degreeRes] = await Promise.all([
          fetch(`${API_BASE}/university-images?university_id=${uni.id}`),
          fetch(`${API_BASE}/scholarships?university_id=${uni.id}`),
          fetch(`${API_BASE}/intakes?university_id=${uni.id}`),
          fetch(`${API_BASE}/degrees`),
        ]);

        const imgData: ApiImage[] = imgRes.ok ? await imgRes.json() : [];
        const schData: ApiScholarship[] = schRes.ok ? await schRes.json() : [];
        const intakeData: ApiIntake[] = intakeRes.ok
          ? await intakeRes.json()
          : [];
        const degreeData: ApiDegree[] = degreeRes.ok
          ? await degreeRes.json()
          : [];

        if (cancelled) return;
        setImages(imgData);
        setScholarships(schData);
        setIntakes(intakeData);

        // 3. Fetch courses from all faculties
        const faculties = uni.faculties || [];
        const coursePromises = faculties.map(async (f) => {
          const res = await fetch(`${API_BASE}/courses?faculty_id=${f.id}`);
          if (!res.ok) return [];
          const data: ApiCourse[] = await res.json();
          return data.map((c) => ({
            ...c,
            facultyName: f.name,
            degreeName:
              degreeData.find((d) => d.id === c.degree_id)?.name || "",
          }));
        });

        const allCourses = (await Promise.all(coursePromises)).flat();
        if (cancelled) return;
        setCourses(allCourses);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load university"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ─── Banner auto-slide ─── */
  const bannerCount = images.filter((i) => i.type === "banner").length;
  const nextBanner = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % (bannerCount || 1));
  }, [bannerCount]);

  useEffect(() => {
    if (bannerCount <= 1) return;
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [bannerCount, nextBanner]);

  /* ─── Loading / Error states ─── */
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3.5px solid var(--color-line)",
            borderTopColor: "var(--color-blue)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 14.5, color: "var(--color-muted)" }}>
          Loading university...
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-navy)" }}>
          University not found
        </div>
        <div style={{ fontSize: 14, color: "var(--color-sub)" }}>
          {error || "The university you're looking for doesn't exist."}
        </div>
        <Link
          href="/search"
          style={{
            marginTop: 8,
            padding: "9px 20px",
            borderRadius: 10,
            background: "var(--color-blue)",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to search
        </Link>
      </div>
    );
  }

  /* ─── Derived data ─── */
  const bannerImages = images.filter((i) => i.type === "banner").sort((a, b) => a.sort_order - b.sort_order);
  const logoImg = images.find((i) => i.type === "logo");
  const galleryImages = images.filter((i) => i.type === "gallery");

  const initials = university.name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase() && w.length > 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  // Derive tuition range from courses
  const tuitionFees = courses
    .map((c) => c.tuition_fee)
    .filter((f) => f > 0);
  const minTuition = tuitionFees.length > 0 ? Math.min(...tuitionFees) : null;
  const tuitionCurrency = courses.find((c) => c.tuition_fee > 0)?.currency || "AUD";
  const tuitionDisplay = minTuition
    ? `${tuitionCurrency} ${minTuition.toLocaleString()}`
    : "Contact university";

  // Derive IELTS/PTE ranges from courses
  const ieltsScores = courses
    .map((c) => c.ielts_requirement)
    .filter((s) => s > 0);
  const pteScores = courses
    .map((c) => c.pte_requirement)
    .filter((s) => s > 0);
  const minIelts = ieltsScores.length > 0 ? Math.min(...ieltsScores) : null;
  const minPte = pteScores.length > 0 ? Math.min(...pteScores) : null;

  // Scholarship summary
  const schCount = scholarships.length;
  const schSummary =
    schCount > 0
      ? `${schCount} scholarship${schCount > 1 ? "s" : ""}`
      : "No scholarships";

  const tabContent: Record<Tab, React.ReactNode> = {
    Overview: (
      <OverviewTab
        university={university}
        courses={courses}
        scholarships={scholarships}
        intakes={intakes}
        minIelts={minIelts}
        minPte={minPte}
        tuitionDisplay={tuitionDisplay}
        schSummary={schSummary}
      />
    ),
    Courses: <CoursesTab courses={courses} />,
    Requirements: <RequirementsTab courses={courses} />,
    Scholarships: <ScholarshipsTab scholarships={scholarships} />,
    Accommodation: <AccommodationTab />,
    Gallery: <GalleryTab galleryImages={galleryImages} />,
    FAQ: <FaqTab />,
    Reviews: <ReviewsTab />,
    "AI Assistant": <AiAssistantTab universityName={university.name} />,
  };

  return (
    <div className="pb-[120px] md:pb-[90px]">
      <UniversityHero
        university={university}
        bannerImages={bannerImages}
        logoImg={logoImg}
        bannerIdx={bannerIdx}
        setBannerIdx={setBannerIdx}
        initials={initials}
      />
      <QuickStats
        coursesCount={courses.length}
        facultiesCount={university.faculties?.length || 0}
        scholarshipsCount={scholarships.length}
        intakesCount={intakes.length}
      />
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab content */}
      <div
        className="px-4 lg:px-7 pt-5 lg:pt-7"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        {tabContent[activeTab]}
      </div>

      <ActionBar university={university} tuitionDisplay={tuitionDisplay} />
    </div>
  );
}

export default function UniversityDetailPage() {
  return (
    <Suspense>
      <UniversityDetailPageInner />
    </Suspense>
  );
}
