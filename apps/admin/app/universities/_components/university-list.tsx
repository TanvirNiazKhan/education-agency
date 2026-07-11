"use client";

import { Search, Plus } from "lucide-react";
import { universities, type UniversityItem } from "../_data/constants";

export function UniversityList({
  search,
  setSearch,
  activeId,
  onSelect,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const filtered = universities.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col overflow-hidden max-h-[40vh] md:max-h-none" style={{ borderRight: "1px solid var(--c-border)" }}>
      <div style={{ padding: "18px 16px 12px", flexShrink: 0 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
          <h1 style={{ margin: 0, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
            Universities
          </h1>
          <button
            className="flex items-center justify-center cursor-pointer"
            style={{ width: "28px", height: "28px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-elevated)", color: "var(--c-text-2b)" }}
          >
            <Plus width={15} height={15} strokeWidth={2.2} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2" style={{ left: "10px" }} width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities\u2026"
            style={{ width: "100%", height: "32px", padding: "0 10px 0 30px", border: "1px solid var(--c-border-input)", borderRadius: "8px", background: "var(--c-bg-panel)", fontSize: "12.5px" }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 10px 16px", gap: "2px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "26px 12px", textAlign: "center", color: "var(--c-text-4)", fontSize: "12.5px" }}>
            No universities match your search.
          </div>
        )}
        {filtered.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelect(u.id)}
            className="flex items-center cursor-pointer hoverable"
            style={{
              gap: "11px",
              padding: "9px 11px",
              borderRadius: "10px",
              background: u.id === activeId ? "var(--c-nav-active-bg)" : "transparent",
              border: u.id === activeId ? "1px solid var(--c-nav-active-border)" : "1px solid transparent",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ width: "34px", height: "34px", borderRadius: "9px", background: u.color + "18", color: u.color, fontSize: "11px", fontWeight: 700, flexShrink: 0 }}
            >
              {u.init}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "12.5px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {u.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>
                {u.city}, {u.country}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
