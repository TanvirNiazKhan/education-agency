"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Sun, Moon } from "lucide-react";
import { NAV_ITEMS } from "../lib/data";
import { useAuth } from "../contexts/auth-context";
import { useTheme } from "../contexts/theme-context";

const API_STATIC = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "");

interface HeaderProps {
  onSpotlightOpen: () => void;
}

export default function Header({ onSpotlightOpen }: HeaderProps) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "var(--header-bg)",
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
              background: "var(--color-card)",
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              lineHeight: "18px",
              flexShrink: 0,
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          type="button"
          aria-label="Toggle theme"
          style={{
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-line-2)",
            border: "1px solid var(--color-line)",
            borderRadius: 11,
            cursor: "pointer",
            color: "var(--color-sub)",
            flexShrink: 0,
          }}
        >
          {theme === "dark" ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
        </button>

        {/* User avatar / Auth links */}
        {!isLoading && (
          user ? (
            <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div className="hidden md:block text-right" style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                    {user.first_name} {user.last_name.charAt(0)}.
                  </div>
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
                    overflow: "hidden",
                    boxShadow: menuOpen ? "0 0 0 3px rgba(37,99,235,0.25)" : "none",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url.startsWith("http") ? user.avatar_url : `${API_STATIC}${user.avatar_url}`}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</>
                  )}
                </div>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 220,
                    background: "var(--color-card)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 14,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--color-line)" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                      {user.first_name} {user.last_name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "var(--color-ink)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-line-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-muted)", flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      Settings
                    </Link>
                    <div style={{ height: 1, background: "var(--color-line)", margin: "4px 0" }} />
                    <button
                      onClick={() => { setMenuOpen(false); logout(); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-bg-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <Link
                href="/login"
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-blue-d)",
                  textDecoration: "none",
                  borderRadius: 9,
                }}
                className="navlink"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(135deg, #2563eb, #4f7bff)",
                  textDecoration: "none",
                  borderRadius: 9,
                }}
              >
                Sign up
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
}
