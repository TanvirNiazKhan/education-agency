import Link from "next/link";

interface CourseCard {
  id: string;
  title: string;
  uni: string;
  level: string;
  duration: string;
  tuition: string;
  intake: string;
  abbr: string;
  tint: string;
  icColor: string;
}

interface PopularCoursesSectionProps {
  courses: CourseCard[];
}

export default function PopularCoursesSection({ courses }: PopularCoursesSectionProps) {
  return (
    <section style={{ marginTop: 52 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--color-navy)",
            margin: 0,
          }}
        >
          Popular courses
        </h2>
        <Link
          href="/search"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-blue)",
            textDecoration: "none",
          }}
        >
          Browse all &rarr;
        </Link>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
      >
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/course/${c.id}`}
            className="card-hover"
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              border: "1px solid var(--color-line)",
              padding: "20px 20px 18px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {/* Top row: icon + level */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: c.tint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: c.icColor,
                  flexShrink: 0,
                }}
              >
                {c.abbr}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--color-muted)",
                }}
              >
                {c.level} &middot; {c.duration}
              </div>
            </div>

            {/* Title + uni */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-navy)",
                marginBottom: 4,
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--color-sub)",
              }}
            >
              {c.uni}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--color-line)",
                margin: "14px 0",
              }}
            />

            {/* Tuition + intake */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                }}
              >
                {c.tuition}
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: "var(--color-blue-x)",
                  color: "var(--color-blue)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {c.intake}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
