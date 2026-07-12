import {
  UNIS,
  COURSES,
  DESTINATIONS,
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

export default function HomePage() {
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
        <RecommendedUnisSection unis={UNIS.slice(0, 3)} />
        <PopularDestinationsSection destinations={DESTINATIONS} />
        <PopularCoursesSection courses={COURSES} />
        <IntakesScholarshipsSection intakes={INTAKES} scholarships={SCHOLARSHIPS} />
        <StudentStoriesSection stories={STORIES} />
        <VisaApprovalsSection visas={VISAS} />
      </div>
    </>
  );
}
