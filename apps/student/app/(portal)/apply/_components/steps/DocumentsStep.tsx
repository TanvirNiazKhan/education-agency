"use client";

import { useRef, useState } from "react";
import { DOCS_REQUIRED, DOCS_OPTIONAL } from "../../../../lib/data";
import { uploadDocument, deleteDocument } from "../../../../lib/api";
import { useAuth } from "../../../../contexts/auth-context";

interface UploadedDoc {
  id: string;
  file_name: string;
  file_url: string;
  document_type: string;
}

interface DocumentsStepProps {
  uploadedDocs: Set<string>;
  toggleDoc: (name: string) => void;
  applicationId?: string;
}

export function DocumentsStep({ uploadedDocs, toggleDoc, applicationId }: DocumentsStepProps) {
  const { token } = useAuth();
  const [uploadedMap, setUploadedMap] = useState<Record<string, UploadedDoc>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function handleFileSelect(docType: string, docName: string, file: File) {
    if (!token || !applicationId) return;
    setUploading((p) => ({ ...p, [docType]: true }));
    setErrors((p) => ({ ...p, [docType]: "" }));
    try {
      const result = await uploadDocument(token, applicationId, docType, file);
      setUploadedMap((p) => ({ ...p, [docType]: result }));
      if (!uploadedDocs.has(docName)) toggleDoc(docName);
    } catch (err: any) {
      setErrors((p) => ({ ...p, [docType]: err.message || "Upload failed" }));
    } finally {
      setUploading((p) => ({ ...p, [docType]: false }));
    }
  }

  async function handleRemove(docType: string, docName: string) {
    if (!token || !applicationId) return;
    const doc = uploadedMap[docType];
    if (!doc) return;
    try {
      await deleteDocument(token, applicationId, doc.id);
      setUploadedMap((p) => { const n = { ...p }; delete n[docType]; return n; });
      if (uploadedDocs.has(docName)) toggleDoc(docName);
    } catch (err: any) {
      setErrors((p) => ({ ...p, [docType]: err.message || "Delete failed" }));
    }
  }

  function renderDocRow(d: { name: string; hint: string; doc_type: string }, required: boolean) {
    const uploaded = !!uploadedMap[d.doc_type];
    const isUploading = uploading[d.doc_type];
    const error = errors[d.doc_type];
    const doc = uploadedMap[d.doc_type];

    return (
      <div
        key={d.doc_type}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 18px",
          borderRadius: 14,
          border: `1px solid ${uploaded ? "var(--color-line)" : "var(--color-line)"}`,
          background: required ? "var(--color-card)" : uploaded ? "var(--color-card)" : "var(--color-line-2)",
          flexWrap: "wrap",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: uploaded ? "var(--color-green-bg)" : required ? "var(--color-blue-x)" : "var(--color-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {uploaded ? (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="var(--color-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={required ? "var(--color-blue)" : "var(--color-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6" stroke={required ? "var(--color-blue)" : "var(--color-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{d.name}</div>
          {doc ? (
            <div style={{ fontSize: 12.5, color: "var(--color-green)", marginTop: 2, fontWeight: 600 }}>
              {doc.file_name}
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 2 }}>{d.hint}</div>
          )}
          {error && (
            <div style={{ fontSize: 12, color: "var(--color-red)", marginTop: 2 }}>{error}</div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          style={{ display: "none" }}
          ref={(el) => { inputRefs.current[d.doc_type] = el; }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(d.doc_type, d.name, file);
            e.target.value = "";
          }}
        />

        {/* Action button */}
        {uploaded ? (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => inputRefs.current[d.doc_type]?.click()}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-blue)",
                background: "var(--color-blue-x)",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Replace
            </button>
            <button
              onClick={() => handleRemove(d.doc_type, d.name)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-red)",
                background: "var(--danger-bg-hover)",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (applicationId) {
                inputRefs.current[d.doc_type]?.click();
              }
            }}
            disabled={isUploading || !applicationId}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: required ? "var(--color-blue)" : "var(--color-muted)",
              background: required ? "var(--color-blue-x)" : "var(--color-card)",
              border: required ? "none" : "1px solid var(--color-line)",
              borderRadius: 10,
              padding: "8px 16px",
              cursor: isUploading || !applicationId ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>
    );
  }

  const noApplication = !applicationId;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 6px" }}>
        Upload your documents
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Please upload the required documents for your application.
      </p>

      {noApplication && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "var(--color-amber-bg)",
            border: "1px solid #f5d49a",
            color: "var(--color-amber)",
            fontSize: 13.5,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Complete the Program step first to enable document uploads.
        </div>
      )}

      {/* Required */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>Required documents</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--color-blue)", borderRadius: 10, padding: "2px 10px" }}>
          {DOCS_REQUIRED.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {DOCS_REQUIRED.map((d) => renderDocRow(d, true))}
      </div>

      {/* Optional */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>Optional documents</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", background: "var(--color-line-2)", borderRadius: 10, padding: "2px 10px" }}>
          If applicable
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DOCS_OPTIONAL.map((d) => renderDocRow(d, false))}
      </div>
    </div>
  );
}
