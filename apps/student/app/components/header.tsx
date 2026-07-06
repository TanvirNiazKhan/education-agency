"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { NAV_ITEMS } from "../lib/data";

interface HeaderProps {
  onSpotlightOpen: () => void;
}

export default function Header({ onSpotlightOpen }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "saturate(180%) blur(16px)",
        WebkitBackdropFilter: "saturate(180%) blur(16px)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div
        className="px-4 md:px-7"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          height: 66,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #4f7bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm0 12.27L5.47 12 12 8.72 18.53 12 12 15.27z"
                fill="#fff"
              />
            </svg>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 19,
              letterSpacing: "-.02em",
              color: "var(--color-navy)",
            }}
          >
            Odyssey
          </span>
        </Link>

        {/* Nav links - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="navlink"
                style={{
                  padding: "8px 13px",
                  borderRadius: 9,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: isActive ? "var(--color-blue-d)" : "var(--color-sub)",
                  background: isActive ? "var(--color-blue-x)" : "transparent",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search bar */}
        <button
          onClick={onSpotlightOpen}
          type="button"
          className="md:flex-1 md:max-w-[320px]"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 40,
            padding: "0 12px 0 14px",
            minWidth: 0,
            background: "var(--color-line-2)",
            border: "1px solid var(--color-line)",
            borderRadius: 11,
            cursor: "text",
            color: "var(--color-muted)",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        >
          <Search size={16} strokeWidth={2.2} style={{ flexShrink: 0, opacity: 0.7 }} />
          <span className="hidden md:block" style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Search anything
          </span>
          <kbd
            className="hidden md:inline"
            style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              padding: "2px 7px",
              borderRadius: 6,
              background: "#fff",
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              lineHeight: "18px",
              flexShrink: 0,
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* User avatar */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 no-underline"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          <div className="hidden md:block text-right" style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>Ayaan R.</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Applicant</div>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0f9d58, #16b364)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".02em",
              flexShrink: 0,
            }}
          >
            AR
          </div>
        </Link>
      </div>
    </header>
  );
}
