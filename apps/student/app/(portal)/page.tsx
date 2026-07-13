"use client";

import { useEffect, useState } from "react";
import {
  getUniversities,
  getCourses,
  getCountries,
  ApiUniversity,
  ApiCourse,
  ApiCountry,
} from "../lib/api";
import {
  INTAKES,
  SCHOLARSHIPS,
  STORIES,
  VISAS,
  SUGGEST_CHIPS,
  AI_PROMPTS,
} from "../lib/data";

import HeroSection from "./_components/HeroSection";
import AiCounsellorSection from "./_components/AiCounsellorSection";
import RecommendedUnisSection from "./_components/RecommendedUnisSection";
import PopularDestinationsSection from "./_components/PopularDestinationsSection";
import PopularCoursesSection from "./_components/PopularCoursesSection";
import IntakesScholarshipsSection from "./_components/IntakesScholarshipsSection";
import StudentStoriesSection from "./_components/StudentStoriesSection";
import VisaApprovalsSection from "./_components/VisaApprovalsSection";

/* ── Gradient palette for cards without images ── */
const UNI_GRADIENTS = [
  "linear-gradient(135deg,#1e3a8a,#3b82f6)",
  "linear-gradient(135deg,#7c2d12,#ea580c)",
  "linear-gradient(135deg,#4c1d95,#7c3aed)",
  "linear-gradient(135deg,#0e7490,#06b6d4)",
  "linear-gradient(135deg,#831843,#db2777)",
  "linear-gradient(135deg,#065f46,#10b981)",
];

const COUNTRY_GRADIENTS: Record<string, string> = {
  Australia: "linear-gradient(135deg,#0e7490,#22d3ee)",
  Canada: "linear-gradient(135deg,#b91c1c,#f87171)",
  "United Kingdom": "linear-gradient(135deg,#1e3a8a,#60a5fa)",
  "United States": "linear-gradient(135deg,#3730a3,#818cf8)",
  Germany: "linear-gradient(135deg,#4c1d95,#7c3aed)",
  Ireland: "linear-gradient(135deg,#065f46,#10b981)",
  "New Zealand": "linear-gradient(135deg,#0e7490,#06b6d4)",
};

const COURSE_COLORS = [
  { tint: "#eff4ff", icColor: "#2563eb" },
  { tint: "#fff1e9", icColor: "#ea580c" },
  { tint: "#f4efff", icColor: "#7c3aed" },
  { tint: "#e9f9ef", icColor: "#0f9d58" },
  { tint: "#fdf3e6", icColor: "#e08a1e" },
  { tint: "#eef2ff", icColor: "#4f46e5" },
];

function mapUniversities(unis: ApiUniversity[]) {
  return unis.map((u, i) => ({
    id: u.id,
    name: u.name,
    city: u.city?.name || "",
    country: u.country?.name || "",
    img: UNI_GRADIENTS[i % UNI_GRADIENTS.length],
  }));
}

function mapCourses(courses: ApiCourse[]) {
  return courses.slice(0, 6).map((c, i) => {
    const colors = COURSE_COLORS[i % COURSE_COLORS.length];
    const words = c.name.split(/\s+/);
    const abbr = words.length >= 2
      ? words.map((w) => w[0]).filter((ch) => ch === ch.toUpperCase()).join("").slice(0, 3)
      : c.name.slice(0, 2).toUpperCase();

    return {
      id: c.id,
      title: c.name,
      uni: c.faculty?.university?.name || "",
      level: c.degree?.name || "",
      duration: c.duration_months >= 12
        ? `${Math.round(c.duration_months / 12 * 10) / 10} year${c.duration_months > 12 ? "s" : ""}`
        : `${c.duration_months} months`,
      tuition: `${c.currency} ${c.tuition_fee.toLocaleString()}/yr`,
      intake: c.intake || "TBA",
      abbr,
      ...colors,
    };
  });
}

function mapCountries(countries: ApiCountry[]) {
  return countries.map((c) => ({
    id: c.id,
    name: c.name,
    img: COUNTRY_GRADIENTS[c.name] || "linear-gradient(135deg,#374151,#6b7280)",
  }));
}

export default function HomePage() {
  const [unis, setUnis] = useState<ApiUniversity[]>([]);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getUniversities().catch(() => []),
      getCourses().catch(() => []),
      getCountries().catch(() => []),
    ]).then(([u, c, co]) => {
      setUnis(u);
      setCourses(c);
      setCountries(co);
      setLoaded(true);
    });
  }, []);

  const mappedUnis = mapUniversities(unis.slice(0, 3));
  const mappedCourses = mapCourses(courses);
  const mappedCountries = mapCountries(countries);

  return (
    <>
      {/* ───── HERO ───── */}
      <HeroSection suggestChips={SUGGEST_CHIPS}>
        <AiCounsellorSection prompts={AI_PROMPTS} />
      </HeroSection>

      {/* ───── CONTENT SECTIONS ───── */}
      <div
        className="px-4 md:px-7 pb-[120px] md:pb-[90px]"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          paddingTop: 8,
        }}
      >
        {loaded && mappedUnis.length > 0 && (
          <RecommendedUnisSection unis={mappedUnis} />
        )}
        {loaded && mappedCountries.length > 0 && (
          <PopularDestinationsSection destinations={mappedCountries} />
        )}
        {loaded && mappedCourses.length > 0 && (
          <PopularCoursesSection courses={mappedCourses} />
        )}
        <IntakesScholarshipsSection intakes={INTAKES} scholarships={SCHOLARSHIPS} />
        <StudentStoriesSection stories={STORIES} />
        <VisaApprovalsSection visas={VISAS} />
      </div>
    </>
  );
}
