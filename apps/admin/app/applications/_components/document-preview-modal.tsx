"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_STATIC = API_BASE.replace(/\/api$/, "");

function getFileUrl(fileUrl: string) {
  if (fileUrl.startsWith("http")) return fileUrl;
  return `${API_STATIC}${fileUrl}`;
}

function getDownloadUrl(applicationId: string, docId: string) {
  return `${API_BASE}/admin/applications/${applicationId}/documents/${docId}/download`;
}

function detectType(fileName: string): "image" | "pdf" | "other" {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

interface Props {
  doc: {
    id: string;
    application_id: string;
    file_url: string;
    file_name: string;
    document_type: string;
  } | null;
  onClose: () => void;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  english_cert: "English Certificate",
  transcripts: "Academic Transcripts",
  financial_proof: "Financial Proof",
  cv: "CV / Resume",
  reference_letter: "Reference Letter",
  statement_of_purpose: "Statement of Purpose",
  nid: "National ID",
  work_permit: "Work Permit",
};

export function DocumentPreviewModal({ doc, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const open = !!doc;

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.5));
      if (e.key === "0") setZoom(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!doc) return null;

  const url = getFileUrl(doc.file_url);
  const downloadUrl = getDownloadUrl(doc.application_id, doc.id);
  const type = detectType(doc.file_name);
  const label = DOC_TYPE_LABELS[doc.document_type] || doc.document_type;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.85)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 20px",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.08)",
            cursor: "pointer",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 650, color: "#fff" }}>{label}</div>
          <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {doc.file_name}
          </div>
        </div>

        {type === "image" && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
              style={zoomBtnStyle}
              title="Zoom out (–)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", minWidth: "36px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
              style={zoomBtnStyle}
              title="Zoom in (+)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <button
              onClick={() => setZoom(1)}
              style={{ ...zoomBtnStyle, fontSize: "11px", fontWeight: 600, width: "auto", padding: "0 8px" }}
              title="Reset zoom (0)"
            >
              Reset
            </button>
          </div>
        )}

        <a
          href={downloadUrl}
          download={doc.file_name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 13px",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#fff",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
      </div>

      {/* Preview area */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          padding: "24px",
        }}
      >
        {type === "image" && (
          <img
            src={url}
            alt={doc.file_name}
            style={{
              maxWidth: "none",
              width: `${zoom * 100}%`,
              maxHeight: zoom === 1 ? "calc(100vh - 120px)" : "none",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              transition: "width 0.15s",
              cursor: zoom > 1 ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setZoom((z) => (z >= 2 ? 1 : z + 0.5))}
          />
        )}

        {type === "pdf" && (
          <iframe
            src={url}
            title={doc.file_name}
            style={{
              width: "min(900px, 100%)",
              height: "calc(100vh - 100px)",
              border: "none",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        )}

        {type === "other" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              padding: "48px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              Preview not available
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              {doc.file_name}
            </div>
            <a
              href={downloadUrl}
              download={doc.file_name}
              style={{
                padding: "9px 20px",
                fontSize: "13px",
                fontWeight: 650,
                color: "#fff",
                background: "#2563eb",
                borderRadius: "9px",
                textDecoration: "none",
              }}
            >
              Download file
            </a>
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      {type === "image" && (
        <div
          style={{
            textAlign: "center",
            padding: "8px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
            flexShrink: 0,
          }}
        >
          Click image to zoom · +/– keys · Esc to close
        </div>
      )}
    </div>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "7px",
  background: "rgba(255,255,255,0.08)",
  cursor: "pointer",
  color: "#fff",
};
