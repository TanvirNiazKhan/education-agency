"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/auth-context";
import { getStudentProfile, upsertStudentProfile } from "../../lib/api";

const INPUT: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  fontSize: 14,
  border: "1.5px solid var(--color-line)",
  borderRadius: 10,
  background: "var(--color-card)",
  color: "var(--color-ink)",
};

const LABEL: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: "var(--color-sub)",
  display: "block",
  marginBottom: 6,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-card)",
        borderRadius: 18,
        border: "1px solid var(--color-line)",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--color-line)",
          fontSize: 14,
          fontWeight: 800,
          color: "var(--color-blue)",
          background: "var(--color-blue-x)",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div style={{ padding: "22px" }}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type={type}
        style={INPUT}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <select
        style={{
          ...INPUT,
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238592ad' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 38,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

interface ProfileForm {
  gender: string;
  date_of_birth: string;
  marital_status: string;
  mobile: string;
  home_phone: string;
  skype: string;
  nationality: string;
  passport_no: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  passport_issue_place: string;
  passport_birth_place: string;
  visa_refused: boolean;
  cur_street: string;
  cur_apt: string;
  cur_city: string;
  cur_state: string;
  cur_postcode: string;
  cur_country: string;
  perm_street: string;
  perm_apt: string;
  perm_city: string;
  perm_state: string;
  perm_postcode: string;
  perm_country: string;
  em_relationship: string;
  em_first_name: string;
  em_last_name: string;
  em_mobile: string;
  em_other_phone: string;
  em_email: string;
  edu_level: string;
  edu_year: string;
  english_test_type: string;
  english_test_date: string;
  score_overall: string;
  score_reading: string;
  score_listening: string;
  score_writing: string;
  score_speaking: string;
}

const EMPTY: ProfileForm = {
  gender: "", date_of_birth: "", marital_status: "", mobile: "", home_phone: "", skype: "",
  nationality: "", passport_no: "", passport_issue_date: "", passport_expiry_date: "",
  passport_issue_place: "", passport_birth_place: "", visa_refused: false,
  cur_street: "", cur_apt: "", cur_city: "", cur_state: "", cur_postcode: "", cur_country: "",
  perm_street: "", perm_apt: "", perm_city: "", perm_state: "", perm_postcode: "", perm_country: "",
  em_relationship: "", em_first_name: "", em_last_name: "", em_mobile: "", em_other_phone: "", em_email: "",
  edu_level: "", edu_year: "", english_test_type: "", english_test_date: "",
  score_overall: "", score_reading: "", score_listening: "", score_writing: "", score_speaking: "",
};

export default function ProfilePage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({ ...EMPTY });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!token) { router.push("/login"); return; }
    getStudentProfile(token)
      .then((profile: any) => {
        if (!profile) return;
        const addr = (type: string) => profile.addresses?.find((a: any) => a.type === type);
        const cur = addr("current");
        const perm = addr("permanent");
        const em = profile.emergency_contacts?.[0];
        const edu = profile.education?.[0];

        setForm({
          gender: profile.gender || "",
          date_of_birth: profile.date_of_birth || "",
          marital_status: profile.marital_status || "",
          mobile: profile.mobile || "",
          home_phone: profile.home_phone || "",
          skype: profile.skype || "",
          nationality: profile.nationality || "",
          passport_no: profile.passport_no || "",
          passport_issue_date: profile.passport_issue_date || "",
          passport_expiry_date: profile.passport_expiry_date || "",
          passport_issue_place: profile.passport_issue_place || "",
          passport_birth_place: profile.passport_birth_place || "",
          visa_refused: profile.visa_refused || false,
          cur_street: cur?.street || "",
          cur_apt: cur?.apt || "",
          cur_city: cur?.city || "",
          cur_state: cur?.state || "",
          cur_postcode: cur?.postcode || "",
          cur_country: cur?.country || "",
          perm_street: perm?.street || "",
          perm_apt: perm?.apt || "",
          perm_city: perm?.city || "",
          perm_state: perm?.state || "",
          perm_postcode: perm?.postcode || "",
          perm_country: perm?.country || "",
          em_relationship: em?.relationship || "",
          em_first_name: em?.first_name || "",
          em_last_name: em?.last_name || "",
          em_mobile: em?.mobile || "",
          em_other_phone: em?.other_phone || "",
          em_email: em?.email || "",
          edu_level: edu?.level || "",
          edu_year: edu?.completion_year || "",
          english_test_type: edu?.english_test_type || "",
          english_test_date: edu?.english_test_date || "",
          score_overall: edu?.score_overall?.toString() || "",
          score_reading: edu?.score_reading?.toString() || "",
          score_listening: edu?.score_listening?.toString() || "",
          score_writing: edu?.score_writing?.toString() || "",
          score_speaking: edu?.score_speaking?.toString() || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const set = (key: keyof ProfileForm) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await upsertStudentProfile(token, {
        personal: {
          gender: form.gender || undefined,
          date_of_birth: form.date_of_birth || undefined,
          marital_status: form.marital_status || undefined,
          mobile: form.mobile || undefined,
          home_phone: form.home_phone || undefined,
          skype: form.skype || undefined,
          nationality: form.nationality || undefined,
          passport_no: form.passport_no || undefined,
          passport_issue_date: form.passport_issue_date || undefined,
          passport_expiry_date: form.passport_expiry_date || undefined,
          passport_issue_place: form.passport_issue_place || undefined,
          passport_birth_place: form.passport_birth_place || undefined,
          visa_refused: form.visa_refused,
        },
        current_address: {
          street: form.cur_street || undefined,
          apt: form.cur_apt || undefined,
          city: form.cur_city || undefined,
          state: form.cur_state || undefined,
          postcode: form.cur_postcode || undefined,
          country: form.cur_country || undefined,
        },
        permanent_address: {
          street: form.perm_street || undefined,
          apt: form.perm_apt || undefined,
          city: form.perm_city || undefined,
          state: form.perm_state || undefined,
          postcode: form.perm_postcode || undefined,
          country: form.perm_country || undefined,
        },
        emergency_contact: {
          relationship: form.em_relationship || undefined,
          first_name: form.em_first_name || undefined,
          last_name: form.em_last_name || undefined,
          mobile: form.em_mobile || undefined,
          other_phone: form.em_other_phone || undefined,
          email: form.em_email || undefined,
        },
        education: {
          level: form.edu_level || undefined,
          completion_year: form.edu_year || undefined,
          english_test_type: form.english_test_type || undefined,
          english_test_date: form.english_test_date || undefined,
          score_overall: form.score_overall ? parseFloat(form.score_overall) : undefined,
          score_reading: form.score_reading ? parseFloat(form.score_reading) : undefined,
          score_listening: form.score_listening ? parseFloat(form.score_listening) : undefined,
          score_writing: form.score_writing ? parseFloat(form.score_writing) : undefined,
          score_speaking: form.score_speaking ? parseFloat(form.score_speaking) : undefined,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 16px", textAlign: "center", color: "var(--color-muted)" }}>
        Loading profile...
      </main>
    );
  }

  return (
    <main
      className="px-4 py-6 pb-[120px] md:pb-16 lg:px-7 lg:py-8"
      style={{ maxWidth: 760, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-navy)", margin: 0 }}>
            My profile
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "4px 0 0" }}>
            Pre-fill your details — reused across all applications.
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            height: 44,
            padding: "0 28px",
            borderRadius: 12,
            border: "none",
            background: saved
              ? "linear-gradient(135deg,#0f9d58,#16b364)"
              : "linear-gradient(135deg,#2563eb,#4f7bff)",
            color: "#fff",
            fontSize: 14.5,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "background .3s",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save profile"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--danger-bg-hover)", border: "1px solid #fecaca", color: "var(--color-red)", fontSize: 14, fontWeight: 500, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Name (from user account — read-only) */}
      <Section title="Account">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <div>
            <label style={LABEL}>First name</label>
            <div style={{ ...INPUT, display: "flex", alignItems: "center", background: "var(--color-line-2)", color: "var(--color-muted)", height: 44 }}>
              {user?.first_name}
            </div>
          </div>
          <div>
            <label style={LABEL}>Last name</label>
            <div style={{ ...INPUT, display: "flex", alignItems: "center", background: "var(--color-line-2)", color: "var(--color-muted)", height: 44 }}>
              {user?.last_name}
            </div>
          </div>
          <div>
            <label style={LABEL}>Email</label>
            <div style={{ ...INPUT, display: "flex", alignItems: "center", background: "var(--color-line-2)", color: "var(--color-muted)", height: 44 }}>
              {user?.email}
            </div>
          </div>
          <div>
            <label style={LABEL}>Phone</label>
            <div style={{ ...INPUT, display: "flex", alignItems: "center", background: "var(--color-line-2)", color: "var(--color-muted)", height: 44 }}>
              {user?.phone}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--color-muted)", margin: "12px 0 0" }}>
          Name, email and phone are managed in your account settings.
        </p>
      </Section>

      {/* Personal */}
      <Section title="Personal">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <Select label="Gender" value={form.gender} onChange={set("gender")} options={["Male", "Female", "Other", "Prefer not to say"]} />
          <Field label="Date of birth" value={form.date_of_birth} onChange={set("date_of_birth")} type="date" />
          <Select label="Marital status" value={form.marital_status} onChange={set("marital_status")} options={["Single", "Married", "Divorced", "Widowed"]} />
          <Field label="Mobile" value={form.mobile} onChange={set("mobile")} placeholder="+880..." />
          <Field label="Home phone" value={form.home_phone} onChange={set("home_phone")} placeholder="Optional" />
          <Field label="Skype ID" value={form.skype} onChange={set("skype")} placeholder="Optional" />
        </div>
      </Section>

      {/* Passport */}
      <Section title="Passport & Nationality">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <Field label="Nationality" value={form.nationality} onChange={set("nationality")} placeholder="Bangladesh" />
          <Field label="Passport number" value={form.passport_no} onChange={set("passport_no")} placeholder="AB1234567" />
          <Field label="Issue date" value={form.passport_issue_date} onChange={set("passport_issue_date")} type="date" />
          <Field label="Expiry date" value={form.passport_expiry_date} onChange={set("passport_expiry_date")} type="date" />
          <Field label="Issue place" value={form.passport_issue_place} onChange={set("passport_issue_place")} placeholder="Dhaka" />
          <Field label="Birth place" value={form.passport_birth_place} onChange={set("passport_birth_place")} placeholder="City" />
          <div className="sm:col-span-2" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              id="visa_refused"
              checked={form.visa_refused}
              onChange={(e) => setForm((f) => ({ ...f, visa_refused: e.target.checked }))}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <label htmlFor="visa_refused" style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)", cursor: "pointer" }}>
              I have been refused a visa previously
            </label>
          </div>
        </div>
      </Section>

      {/* Current address */}
      <Section title="Current Address">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <div className="sm:col-span-2">
            <Field label="Street" value={form.cur_street} onChange={set("cur_street")} placeholder="123 Main Street" />
          </div>
          <Field label="Apt / Unit" value={form.cur_apt} onChange={set("cur_apt")} placeholder="Apt 4B" />
          <Field label="City" value={form.cur_city} onChange={set("cur_city")} placeholder="Dhaka" />
          <Field label="State / Division" value={form.cur_state} onChange={set("cur_state")} placeholder="Dhaka Division" />
          <Field label="Postcode" value={form.cur_postcode} onChange={set("cur_postcode")} placeholder="1207" />
          <div className="sm:col-span-2">
            <Field label="Country" value={form.cur_country} onChange={set("cur_country")} placeholder="Bangladesh" />
          </div>
        </div>
      </Section>

      {/* Emergency contact */}
      <Section title="Emergency Contact">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <Select label="Relationship" value={form.em_relationship} onChange={set("em_relationship")} options={["Parent", "Spouse", "Sibling", "Guardian", "Friend", "Other"]} />
          <Field label="Email" value={form.em_email} onChange={set("em_email")} type="email" placeholder="contact@email.com" />
          <Field label="First name" value={form.em_first_name} onChange={set("em_first_name")} />
          <Field label="Last name" value={form.em_last_name} onChange={set("em_last_name")} />
          <Field label="Mobile" value={form.em_mobile} onChange={set("em_mobile")} placeholder="+880..." />
          <Field label="Other phone" value={form.em_other_phone} onChange={set("em_other_phone")} placeholder="Optional" />
        </div>
      </Section>

      {/* Education */}
      <Section title="Education & English">
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <Select label="Highest education" value={form.edu_level} onChange={set("edu_level")} options={["Higher Secondary (HSC)", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"]} />
          <Field label="Year completed" value={form.edu_year} onChange={set("edu_year")} placeholder="2021" />
          <Select label="English test" value={form.english_test_type} onChange={set("english_test_type")} options={["IELTS Academic", "IELTS General", "PTE Academic", "TOEFL iBT", "None"]} />
          <Field label="Test date" value={form.english_test_date} onChange={set("english_test_date")} type="date" />
          <Field label="Overall score" value={form.score_overall} onChange={set("score_overall")} placeholder="7.0" />
          <Field label="Reading" value={form.score_reading} onChange={set("score_reading")} placeholder="7.0" />
          <Field label="Listening" value={form.score_listening} onChange={set("score_listening")} placeholder="7.5" />
          <Field label="Writing" value={form.score_writing} onChange={set("score_writing")} placeholder="6.5" />
          <Field label="Speaking" value={form.score_speaking} onChange={set("score_speaking")} placeholder="7.0" />
        </div>
      </Section>

      {/* Sticky save footer on mobile */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 70,
          left: 0,
          right: 0,
          padding: "12px 16px",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--color-line)",
          zIndex: 40,
        }}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: saved ? "linear-gradient(135deg,#0f9d58,#16b364)" : "linear-gradient(135deg,#2563eb,#4f7bff)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save profile"}
        </button>
      </div>
    </main>
  );
}
