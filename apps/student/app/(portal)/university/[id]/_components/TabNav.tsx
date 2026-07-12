"use client";

import { TABS, Tab } from "./types";

interface TabNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function TabNav({ activeTab, setActiveTab }: TabNavProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 66,
        zIndex: 40,
        background: "var(--color-card)",
        borderBottom: "1px solid var(--color-line)",
        marginTop: 24,
      }}
    >
      <div
        className="px-4 lg:px-7"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 600,
              color:
                activeTab === t ? "var(--color-blue)" : "var(--color-sub)",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === t
                  ? "2.5px solid var(--color-blue)"
                  : "2.5px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color .15s, border-color .15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
