"use client";

import Link from "next/link";
import { ApiUniversity, ApiImage, IMG_BASE } from "./types";

interface UniversityHeroProps {
  university: ApiUniversity;
  bannerImages: ApiImage[];
  logoImg: ApiImage | undefined;
  bannerIdx: number;
  setBannerIdx: (idx: number) => void;
  initials: string;
}

export default function UniversityHero({
  university,
  bannerImages,
  logoImg,
  bannerIdx,
  setBannerIdx,
  initials,
}: UniversityHeroProps) {
  const accent = "#2563eb";

  return (
    <div
      className="h-[220px] lg:h-[280px]"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* sliding banners */}
      {bannerImages.length > 0 ? (
        bannerImages.map((img, i) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMG_BASE}${img.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === bannerIdx ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
          }}
        />
      )}

      {/* dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.18) 0%, rgba(0,0,0,.62) 100%)",
        }}
      />

      {/* banner dots */}
      {bannerImages.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            gap: 6,
            zIndex: 10,
          }}
        >
          {bannerImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              style={{
                width: i === bannerIdx ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* back button */}
      <Link
        href="/search"
        className="left-4 lg:left-7"
        style={{
          position: "absolute",
          top: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,.16)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          padding: "7px 16px",
          borderRadius: 999,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,.22)",
          transition: "background .15s",
        }}
      >
        ← Back
      </Link>

      {/* bottom info */}
      <div
        className="left-4 right-4 lg:left-7 lg:right-7 gap-3 lg:gap-[18px]"
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* logo or initials box */}
        {logoImg ? (
          <img
            src={`${IMG_BASE}${logoImg.url}`}
            alt={logoImg.alt_text || university.name}
            className="w-[60px] h-[60px] lg:w-[84px] lg:h-[84px]"
            style={{
              borderRadius: 20,
              background: "#fff",
              objectFit: "contain",
              flexShrink: 0,
              padding: 4,
            }}
          />
        ) : (
          <div
            className="w-[60px] h-[60px] lg:w-[84px] lg:h-[84px]"
            style={{
              borderRadius: 20,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: accent,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            {university.university_type && (
              <span
                style={{
                  background: "rgba(255,255,255,.22)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {university.university_type}
              </span>
            )}
            <span style={{ color: "rgba(255,255,255,.82)", fontSize: 13.5 }}>
              {university.city?.name}
              {university.city?.name && university.country?.name ? ", " : ""}
              {university.country?.name}
            </span>
          </div>
          <h1
            className="text-[20px] lg:text-[38px]"
            style={{
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {university.name}
          </h1>
        </div>
      </div>
    </div>
  );
}
