import { Avatar, avatarColors, PriorityChip, ProgressBar, getProgressColor } from "@/components/ui";
import { stageColors, kanbanData } from "../_data/constants";

export function TableView() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-8 sm:pb-10">
      <div className="overflow-x-auto" style={{ border: "1px solid var(--c-border)", borderRadius: "13px" }}>
        <div style={{ minWidth: "826px", overflow: "hidden", borderRadius: "13px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px,1.3fr) 150px 120px 96px 150px 130px",
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
            }}
          >
            <div>Student</div>
            <div>University</div>
            <div>Country</div>
            <div>Intake</div>
            <div>Stage</div>
            <div>Progress</div>
          </div>
          {kanbanData.flatMap((col) =>
            col.cards.map((c, ci) => {
              const color = avatarColors[ci % avatarColors.length];
              const stColor = stageColors[col.stage] || "#a1a1aa";
              const progColor = getProgressColor(c.progress);

              return (
                <div
                  key={`${col.stage}-${ci}`}
                  className="hoverable cursor-pointer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(180px,1.3fr) 150px 120px 96px 150px 130px",
                    alignItems: "center",
                    padding: "0 16px",
                    height: "54px",
                    borderBottom: "1px solid var(--c-border-light)",
                    background: "var(--c-bg-elevated)",
                  }}
                >
                  <div className="flex items-center min-w-0" style={{ gap: "11px" }}>
                    <Avatar name={c.name} color={color} size={32} />
                    <div className="min-w-0">
                      <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: "11px" }}>
                        <PriorityChip priority={c.priority} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.uni}</div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.country}</div>
                  <div style={{ fontSize: "12.5px", color: "var(--c-text-2)" }}>{c.intake}</div>
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11.5px",
                        fontWeight: 550,
                        padding: "2.5px 9px",
                        borderRadius: "20px",
                        background: stColor + "18",
                        color: stColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.stage}
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: "8px" }}>
                    <ProgressBar progress={c.progress} />
                    <span style={{ fontSize: "11px", color: "var(--c-text-4)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {c.progress}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
