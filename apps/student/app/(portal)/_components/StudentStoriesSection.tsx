import type { Story } from "../../lib/data";

interface StudentStoriesSectionProps {
  stories: Story[];
}

export default function StudentStoriesSection({ stories }: StudentStoriesSectionProps) {
  return (
    <section style={{ marginTop: 52 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "var(--color-navy)",
          marginBottom: 18,
        }}
      >
        Student success stories
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
      >
        {stories.map((s) => (
          <div
            key={s.name}
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid var(--color-line)",
              padding: "22px 22px 20px",
            }}
          >
            {/* Quote icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="var(--color-blue)"
              style={{ marginBottom: 10, opacity: 0.25 }}
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--color-sub)",
                margin: "0 0 14px",
              }}
            >
              {s.quote}
            </p>

            <div
              style={{
                height: 1,
                background: "var(--color-line)",
                margin: "0 0 14px",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: s.av,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {s.initials}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-navy)",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-muted)",
                  }}
                >
                  {s.dest}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
