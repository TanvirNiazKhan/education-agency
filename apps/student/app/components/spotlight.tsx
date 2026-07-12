"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
}

interface ResultItem {
  category: string;
  icon: string;
  tint: string;
  title: string;
  subtitle: string;
  kind: string;
  href: string;
}

export default function Spotlight({ open, onClose }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const encoded = encodeURIComponent(q);
      try {
        const [unis, courses, countries] = await Promise.all([
          fetch(`${API_BASE}/universities?q=${encoded}`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/courses?q=${encoded}`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/countries`).then((r) => r.json()).catch(() => []),
        ]);

        const items: ResultItem[] = [];

        // Universities
        for (const u of unis.slice(0, 5)) {
          items.push({
            category: "Universities",
            icon: "🏛",
            tint: "#f4efff",
            title: u.name,
            subtitle: `${u.city?.name || ""}${u.city?.name && u.country?.name ? ", " : ""}${u.country?.name || ""}`,
            kind: "University",
            href: `/university/${u.slug}`,
          });
        }

        // Courses
        for (const c of courses.slice(0, 5)) {
          items.push({
            category: "Courses",
            icon: "📘",
            tint: "#eff4ff",
            title: c.name,
            subtitle: `${c.faculty?.name || ""} · ${c.degree?.name || ""}`,
            kind: "Course",
            href: `/course/${c.id}`,
          });
        }

        // Countries (filter locally)
        const filteredCountries = countries
          .filter((c: { name: string; is_active: boolean }) => c.is_active && c.name.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 3);
        for (const c of filteredCountries) {
          items.push({
            category: "Countries",
            icon: "🌍",
            tint: "#fff1e9",
            title: c.name,
            subtitle: "Explore universities",
            kind: "Country",
            href: `/search`,
          });
        }

        setResults(items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        handleClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          handleClose();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  // Group by category
  const grouped = results.reduce<Record<string, ResultItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div
      className="animate-fadeIn pt-[60px] md:pt-[120px] px-0 md:px-4"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(10,19,48,.42)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full md:w-[640px] rounded-[10px] md:rounded-[20px]"
        style={{
          maxWidth: "calc(100% - 16px)",
          background: "#fff",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          animation: "pop .22s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        {/* Search input */}
        <div
          className="px-3 py-3 md:px-5 md:py-4"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <Search size={20} strokeWidth={2} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search universities, courses, countries…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--color-ink)",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
          <kbd
            onClick={handleClose}
            style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              padding: "3px 8px",
              borderRadius: 6,
              background: "var(--color-line-2)",
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              cursor: "pointer",
              lineHeight: "18px",
              flexShrink: 0,
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: "auto", padding: "8px 0" }}>
          {query.trim() && !loading && Object.keys(grouped).length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--color-muted)", fontSize: 14 }}>
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {loading && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--color-muted)", fontSize: 14 }}>
              Searching...
            </div>
          )}

          {!query.trim() && !loading && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--color-muted)", fontSize: 14 }}>
              Start typing to search universities, courses, and countries
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div
                style={{
                  padding: "10px 20px 6px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  color: "var(--color-muted)",
                }}
              >
                {category}
              </div>
              {items.map((item, i) => (
                <Link
                  key={`${category}-${i}`}
                  href={item.href}
                  onClick={handleClose}
                  className="spotrow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 20px",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "background .1s",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: item.tint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.subtitle}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 7, background: "var(--color-line-2)", color: "var(--color-sub)", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {item.kind}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: "1px solid var(--color-line)",
            fontSize: 12,
            color: "var(--color-muted)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd style={{ fontSize: 10, fontWeight: 700, fontFamily: "inherit", padding: "2px 6px", borderRadius: 5, background: "var(--color-line-2)", border: "1px solid var(--color-line)" }}>
                ↵
              </kbd>
              open
            </span>
            <span className="flex items-center gap-1.5">
              <kbd style={{ fontSize: 10, fontWeight: 700, fontFamily: "inherit", padding: "2px 6px", borderRadius: 5, background: "var(--color-line-2)", border: "1px solid var(--color-line)" }}>
                ↑↓
              </kbd>
              navigate
            </span>
          </div>
          <span style={{ fontWeight: 500 }}>Powered by Odyssey AI</span>
        </div>
      </div>
    </div>
  );
}
