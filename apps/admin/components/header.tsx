"use client";

import { Search, Plus, Bell, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "../lib/theme";
import { useSidebar } from "../lib/sidebar";
import { useAuth } from "../lib/auth";

export function Header() {
  const { theme, toggle } = useTheme();
  const { toggle: toggleSidebar } = useSidebar();
  const { user } = useAuth();

  return (
    <header
      className="flex h-[52px] md:h-[56px] shrink-0 items-center gap-[10px] md:gap-[14px] px-[14px] md:px-[22px]"
      style={{
        borderBottom: "1px solid var(--c-border-alt)",
        background: "var(--c-header-bg)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Hamburger - mobile only */}
      <button
        onClick={toggleSidebar}
        className="flex md:hidden h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[9px]"
        style={{
          border: "1px solid var(--c-border-input)",
          background: "var(--c-bg-elevated)",
          flexShrink: 0,
        }}
      >
        <Menu width={18} height={18} stroke="var(--c-text-2b)" strokeWidth={1.8} />
      </button>

      {/* Search bar */}
      <div className="relative max-w-[440px] flex-1 min-w-0">
        <Search
          className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2"
          width={15}
          height={15}
          stroke="var(--c-text-4)"
        />
        <input
          type="text"
          placeholder="Search students, universities, applications\u2026"
          className="h-[34px] w-full rounded-[9px] pr-[10px] md:pr-[66px] pl-[34px] text-[13px] outline-none"
          style={{
            border: "1px solid var(--c-border-input)",
            background: "var(--c-bg-input)",
            color: "var(--c-text-1)",
          }}
        />
        <div className="pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 hidden md:block">
          <kbd
            className="rounded-[5px] px-[5px] py-[1px] text-[11px]"
            style={{
              border: "1px solid var(--c-border-input)",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-4b)",
            }}
          >
            /
          </kbd>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Quick Add button - hide label on mobile */}
      <button
        className="flex h-[34px] cursor-pointer items-center gap-[7px] rounded-[9px] border-none bg-[#2563eb] px-[10px] md:px-[13px] text-[13px] font-[550] text-white"
        style={{ flexShrink: 0 }}
      >
        <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />
        <span className="hidden sm:inline">Quick Add</span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[9px]"
        style={{
          border: "1px solid var(--c-border-input)",
          background: "var(--c-bg-elevated)",
          flexShrink: 0,
        }}
      >
        {theme === "dark" ? (
          <Sun width={16} height={16} stroke="var(--c-text-2b)" strokeWidth={1.8} />
        ) : (
          <Moon width={16} height={16} stroke="var(--c-text-2b)" strokeWidth={1.8} />
        )}
      </button>

      {/* Notification bell */}
      <button
        className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[9px]"
        style={{
          border: "1px solid var(--c-border-input)",
          background: "var(--c-bg-elevated)",
          flexShrink: 0,
        }}
      >
        <Bell width={16} height={16} stroke="var(--c-text-2b)" strokeWidth={1.8} />
        <span
          className="absolute right-[8px] top-[7px] h-[7px] w-[7px] rounded-full bg-[#ef4444]"
          style={{ border: "1.5px solid var(--c-bg)" }}
        />
      </button>

      {/* Divider - hide on mobile */}
      <div className="hidden sm:block h-[22px] w-px" style={{ background: "var(--c-border-alt)" }} />

      {/* Profile avatar - hide on mobile */}
      <button
        className="hidden sm:flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[8px] border-none text-[12px] font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
      >
        {user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
      </button>
    </header>
  );
}
