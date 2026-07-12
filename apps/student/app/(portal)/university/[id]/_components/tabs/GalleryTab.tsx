"use client";

import { ApiImage, IMG_BASE } from "../types";

interface GalleryTabProps {
  galleryImages: ApiImage[];
}

export default function GalleryTab({ galleryImages }: GalleryTabProps) {
  if (galleryImages.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "var(--color-muted)",
          fontSize: 14.5,
        }}
      >
        Gallery coming soon — campus photos and virtual tours.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-[18px]">
      {galleryImages
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => (
          <div
            key={img.id}
            className="group"
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--color-line)",
              background: "var(--color-card)",
              position: "relative",
              aspectRatio: "16/10",
              cursor: "pointer",
            }}
          >
            <img
              src={`${IMG_BASE}${img.url}`}
              alt={img.alt_text || "Campus photo"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease",
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(transparent 50%, rgba(0,0,0,0.55))",
                opacity: 0,
                transition: "opacity 0.25s ease",
                pointerEvents: "none",
              }}
              className="group-hover:!opacity-100"
            />
            {img.alt_text && (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                  right: 14,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  opacity: 0,
                  transition: "opacity 0.25s ease",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="group-hover:!opacity-100"
              >
                {img.alt_text}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
