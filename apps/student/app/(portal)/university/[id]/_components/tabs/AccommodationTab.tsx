"use client";

export default function AccommodationTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-[18px]">
      {[
        {
          title: "On-campus housing",
          sub: "Fully furnished, meal plan included",
          price: "Contact university",
        },
        {
          title: "Shared apartment",
          sub: "2-3 bedroom, close to campus",
          price: "Contact university",
        },
        {
          title: "Homestay",
          sub: "With local family, meals included",
          price: "Contact university",
        },
      ].map((a) => (
        <div
          key={a.title}
          style={{
            background: "var(--color-card)",
            borderRadius: 16,
            border: "1px solid var(--color-line)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 120,
              background: "var(--color-line-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-muted)",
              fontSize: 28,
            }}
          >
            🏠
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-navy)",
                marginBottom: 4,
              }}
            >
              {a.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--color-sub)",
                marginBottom: 10,
              }}
            >
              {a.sub}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-blue)",
              }}
            >
              {a.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
