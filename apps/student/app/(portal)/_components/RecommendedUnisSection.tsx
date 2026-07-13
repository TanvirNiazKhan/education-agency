"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";

interface UniCard {
  id: string;
  name: string;
  city: string;
  country: string;
  img: string;
  match?: number;
  rank?: number;
  tuition?: string;
  schShort?: string;
}

interface RecommendedUnisSectionProps {
  unis: UniCard[];
}

export default function RecommendedUnisSection({ unis }: RecommendedUnisSectionProps) {
  const { user } = useAuth();
  return (
    <section style={{ marginTop: 44 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              background: "var(--color-blue-x)",
              borderRadius: 100,
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-blue)",
              marginBottom: 10,
            }}
          >
            ✦ {user ? `For you, ${user.first_name}` : "For you"}
          </span>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--color-navy)",
              margin: "0 0 4px",
            }}
          >
            Recommended for your profile
          </h2>
          <p
            style={{
              fontSize: 14.5,
              color: "var(--color-sub)",
              margin: 0,
            }}
          >
            Based on your CGPA 3.45, budget ৳40L, and preferred destinations
          </p>
        </div>
        <Link
          href="/chat"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-blue)",
            textDecoration: "none",
          }}
        >
          Refine with AI &rarr;
        </Link>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px]"
      >
        {unis.map((u) => (
          <Link
            key={u.id}
            href={`/university/${u.id}`}
            className="card-hover"
            style={{
              background: "var(--color-card)",
              borderRadius: 18,
              border: "1px solid var(--color-line)",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {/* Card header */}
            <div
              style={{
                height: 120,
                background: u.img,
                position: "relative",
                padding: 14,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {u.match != null && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "var(--color-green)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {u.match}% match
                </span>
              )}
              {u.rank != null && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,.45)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  #{u.rank}
                </span>
              )}
            </div>

            {/* Card body */}
            <div style={{ padding: "16px 18px 18px" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-muted)",
                  marginBottom: 4,
                }}
              >
                {u.city}, {u.country}
              </div>
              <div
                style={{
                  fontSize: 16.5,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                }}
              >
                {u.name}
              </div>
              <div
                style={{
                  height: 1,
                  background: "var(--color-line)",
                  margin: "14px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {u.tuition && (
                  <div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--color-muted)",
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                        marginBottom: 2,
                      }}
                    >
                      Tuition / year
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--color-navy)",
                      }}
                    >
                      {u.tuition}
                    </div>
                  </div>
                )}
                {u.schShort && (
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 8,
                      background: "var(--color-green-bg)",
                      color: "var(--color-green)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {u.schShort}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
