import Link from "next/link";
import type { Destination } from "../../lib/data";

interface PopularDestinationsSectionProps {
  destinations: Destination[];
}

export default function PopularDestinationsSection({ destinations }: PopularDestinationsSectionProps) {
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
        Popular destinations
      </h2>
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {destinations.map((d) => (
          <Link
            key={d.id}
            href="/search"
            className="card-hover"
            style={{
              height: 150,
              borderRadius: 18,
              background: d.img,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 18,
              textDecoration: "none",
            }}
          >
            {/* dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}
              >
                {d.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "rgba(255,255,255,.7)",
                  marginTop: 2,
                }}
              >
                {d.unis} universities &middot; {d.courses} courses
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
