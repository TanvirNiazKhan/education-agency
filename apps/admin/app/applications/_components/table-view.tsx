"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, avatarColors, ProgressBar } from "@/components/ui";
import { stageColors, STATUS_LABELS, STAGE_ORDER, AppCard } from "../_data/constants";

interface TableViewProps {
  columns: { stage: string; cards: AppCard[] }[];
  onCardClick: (id: string) => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

function StatusDropdown({
  cardId,
  current,
  onChange,
  onClose,
}: {
  cardId: string;
  current: string;
  onChange: (id: string, status: string) => Promise<void>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [onClose]);

  async function handleSelect(status: string) {
    if (status === current || saving) return;
    setSaving(status);
    try {
      await onChange(cardId, status);
      onClose();
    } finally {
      setSaving(null);
    }
  }

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        zIndex: 50,
        background: "var(--c-bg-elevated)",
        border: "1px solid var(--c-border)",
        borderRadius: "11px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
        minWidth: "190px",
        overflow: "hidden",
        padding: "4px",
      }}
    >
      {STAGE_ORDER.map((s) => {
        const color = stageColors[s] || "#a1a1aa";
        const isCurrent = s === current;
        const isSaving = saving === s;
        return (
          <div
            key={s}
            onClick={(e) => { e.stopPropagation(); handleSelect(s); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "8px 10px",
              borderRadius: "7px",
              cursor: isCurrent ? "default" : "pointer",
              background: isCurrent ? color + "14" : "transparent",
              opacity: saving && !isSaving ? 0.5 : 1,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "var(--c-bg-panel)";
            }}
            onMouseLeave={(e) => {
              if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "12.5px", fontWeight: isCurrent ? 650 : 500, color: isCurrent ? color : "var(--c-text-1)", flex: 1 }}>
              {STATUS_LABELS[s] || s}
            </span>
            {isCurrent && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {isSaving && (
              <span style={{ fontSize: "10px", color: "var(--c-text-4)" }}>…</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TableView({ columns, onCardClick, onStatusChange }: TableViewProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const allCards = columns.flatMap((col) =>
    col.cards.map((c) => ({ ...c, stage: col.stage }))
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-8 sm:pb-10">
      <div className="overflow-x-auto" style={{ border: "1px solid var(--c-border)", borderRadius: "13px" }}>
        <div style={{ minWidth: "860px", overflow: "visible", borderRadius: "13px" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px,1.3fr) 160px 110px 90px 190px 120px",
              alignItems: "center",
              padding: "0 16px",
              height: "38px",
              background: "var(--c-bg-panel)",
              borderBottom: "1px solid var(--c-border)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--c-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              borderRadius: "13px 13px 0 0",
            }}
          >
            <div>Student</div>
            <div>University</div>
            <div>Country</div>
            <div>Intake</div>
            <div>Status</div>
            <div>Progress</div>
          </div>

          {/* Rows */}
          {allCards.map((c, ci) => {
            const color = avatarColors[ci % avatarColors.length];
            const stColor = stageColors[c.stage] || "#a1a1aa";
            const label = STATUS_LABELS[c.stage] || c.stage;
            const isLast = ci === allCards.length - 1;

            return (
              <div
                key={c.id}
                onClick={() => onCardClick(c.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px,1.3fr) 160px 110px 90px 190px 120px",
                  alignItems: "center",
                  padding: "0 16px",
                  height: "54px",
                  borderBottom: isLast ? "none" : "1px solid var(--c-border-light)",
                  background: "var(--c-bg-elevated)",
                  cursor: "pointer",
                  transition: "background 0.1s",
                  borderRadius: isLast ? "0 0 13px 13px" : undefined,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--c-bg-panel)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--c-bg-elevated)"; }}
              >
                {/* Student */}
                <div className="flex items-center min-w-0" style={{ gap: "11px" }}>
                  <Avatar name={c.name} color={color} size={32} />
                  <div className="min-w-0">
                    <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>
                      {c.docsUploaded} doc{c.docsUploaded !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* University */}
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.uni}
                </div>

                {/* Country */}
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.country || "—"}</div>

                {/* Intake */}
                <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.intake || "—"}</div>

                {/* Status — clickable, stops row click propagation */}
                <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      padding: "4px 10px 4px 9px",
                      borderRadius: "20px",
                      background: stColor + "18",
                      color: stColor,
                      border: `1px solid ${stColor}30`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: stColor, flexShrink: 0 }} />
                    {label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "2px", opacity: 0.6 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openDropdown === c.id && (
                    <StatusDropdown
                      cardId={c.id}
                      current={c.stage}
                      onChange={onStatusChange}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>

                {/* Progress */}
                <div className="flex items-center" style={{ gap: "8px" }}>
                  <ProgressBar progress={c.progress} />
                  <span style={{ fontSize: "11px", color: "var(--c-text-4)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {c.progress}%
                  </span>
                </div>
              </div>
            );
          })}

          {allCards.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", fontSize: "13px", color: "var(--c-text-4)", background: "var(--c-bg-elevated)", borderRadius: "0 0 13px 13px" }}>
              No applications yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
