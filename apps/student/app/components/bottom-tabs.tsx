"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutDashboard, GitCompareArrows, FileText, MessageCircle } from "lucide-react";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/search", icon: Search },
  { label: "Apply", href: "/apply", icon: FileText },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "AI Chat", href: "/chat", icon: MessageCircle },
];

export default function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-70 md:hidden"
      style={{
        background: "rgba(255,255,255,.92)",
        backdropFilter: "saturate(180%) blur(16px)",
        WebkitBackdropFilter: "saturate(180%) blur(16px)",
        borderTop: "1px solid var(--color-line)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: 56,
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 10,
                minWidth: 0,
                transition: "color .15s",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? "var(--color-blue-x)" : "transparent",
                  transition: "background .15s",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  style={{
                    color: isActive ? "var(--color-blue)" : "var(--color-muted)",
                    transition: "color .15s",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--color-blue)" : "var(--color-muted)",
                  letterSpacing: ".01em",
                  lineHeight: 1,
                  transition: "color .15s",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
