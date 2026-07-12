"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check, MapPin } from "lucide-react";
import { citiesApi, countriesApi, type City, type Country } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "38px",
  padding: "0 12px",
  fontSize: "13px",
  border: "1px solid var(--c-border-input)",
  borderRadius: "9px",
  background: "var(--c-bg-elevated)",
  color: "var(--c-text-1)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--c-text-3)",
  marginBottom: "5px",
  display: "block",
};

interface FormData {
  name: string;
  state: string;
  country_id: string;
}

const emptyForm: FormData = { name: "", state: "", country_id: "" };

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [citiesData, countriesData] = await Promise.all([
        citiesApi.list(filterCountry || undefined, search || undefined),
        countriesApi.list(),
      ]);
      setCities(citiesData);
      setCountries(countriesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [filterCountry, search]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedFilterCountry = countries.find((c) => c.id === filterCountry);
  const selectedFormCountry = countries.find((c) => c.id === form.country_id);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  }

  function openEdit(city: City) {
    setEditingId(city.id);
    setForm({ name: city.name, state: city.state || "", country_id: city.country_id });
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.country_id) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        country_id: form.country_id,
        ...(form.state ? { state: form.state } : {}),
      };
      if (editingId) {
        await citiesApi.update(editingId, payload);
      } else {
        await citiesApi.create(payload);
      }
      setDrawerOpen(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this city?")) return;
    try {
      await citiesApi.delete(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  function getCountryName(countryId: string) {
    return countries.find((c) => c.id === countryId)?.name || "—";
  }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>
            Cities
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>
            Manage cities across countries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities..."
            style={{
              height: "34px",
              padding: "0 12px",
              fontSize: "12.5px",
              border: "1px solid var(--c-border-input)",
              borderRadius: "9px",
              background: "var(--c-bg-elevated)",
              color: "var(--c-text-1)",
              outline: "none",
              width: "180px",
            }}
          />
          {/* Country filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center cursor-pointer hoverable"
              style={{
                height: "34px",
                gap: "7px",
                padding: "0 12px",
                border: "1px solid var(--c-border-input)",
                borderRadius: "9px",
                background: "var(--c-bg-elevated)",
                fontSize: "12.5px",
                fontWeight: 550,
                color: "var(--c-text-1)",
              }}
            >
              <MapPin width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
              {selectedFilterCountry ? selectedFilterCountry.name : "All countries"}
              <ChevronDown width={13} height={13} stroke="var(--c-text-4)" strokeWidth={2} />
            </button>
            {filterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                <div
                  className="absolute z-50"
                  style={{
                    top: "40px",
                    right: 0,
                    width: "220px",
                    background: "var(--c-dropdown-bg)",
                    border: "1px solid var(--c-border)",
                    borderRadius: "12px",
                    boxShadow: "var(--c-shadow-heavy)",
                    padding: "6px",
                  }}
                >
                  <div
                    onClick={() => { setFilterCountry(""); setFilterOpen(false); }}
                    className="flex items-center justify-between cursor-pointer hoverable"
                    style={{ padding: "8px 10px", borderRadius: "8px", background: !filterCountry ? "var(--c-nav-active-bg)" : "transparent" }}
                  >
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>All countries</span>
                    {!filterCountry && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                  </div>
                  {countries.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => { setFilterCountry(c.id); setFilterOpen(false); }}
                      className="flex items-center justify-between cursor-pointer hoverable"
                      style={{ padding: "8px 10px", borderRadius: "8px", background: filterCountry === c.id ? "var(--c-nav-active-bg)" : "transparent" }}
                    >
                      <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--c-text-1)" }}>{c.name}</span>
                      {filterCountry === c.id && <Check width={15} height={15} stroke="#2563eb" strokeWidth={2.4} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={openCreate}
            className="flex items-center cursor-pointer"
            style={{
              height: "34px",
              gap: "6px",
              padding: "0 13px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "9px",
              fontSize: "12.5px",
              fontWeight: 550,
              boxShadow: "0 1px 2px rgba(37,99,235,0.25)",
            }}
          >
            <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />
            Add city
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center justify-between"
          style={{ padding: "10px 14px", marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626" }}
        >
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>
            <X width={14} height={14} />
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}>
          <Loader2 width={24} height={24} className="animate-spin" />
        </div>
      ) : cities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>
          No cities found. {filterCountry ? "Try a different filter or add a city." : "Add your first city to get started."}
        </div>
      ) : (
        <div style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden", background: "var(--c-bg-elevated)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                {["City", "State / Province", "Country", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--c-text-4)",
                      textAlign: "left",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id} className="group hoverable" style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 550, color: "var(--c-text-1)" }}>{city.name}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "13px", color: "var(--c-text-2)" }}>{city.state || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "var(--c-chip-info-text)",
                        background: "var(--c-chip-info-bg)",
                        padding: "3px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {city.country?.name || getCountryName(city.country_id)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: city.is_active ? "#16a34a" : "var(--c-text-4)",
                        background: city.is_active ? "#f0fdf4" : "var(--c-bg-dim)",
                        padding: "3px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {city.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                      <button
                        onClick={() => openEdit(city)}
                        className="cursor-pointer"
                        style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "7px" }}
                      >
                        <Pencil width={13} height={13} stroke="var(--c-text-3)" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="cursor-pointer"
                        style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "7px" }}
                      >
                        <Trash2 width={13} height={13} stroke="#dc2626" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "380px",
              maxWidth: "100vw",
              background: "var(--c-bg-elevated)",
              borderLeft: "1px solid var(--c-border)",
              animation: "slideInRight 0.2s ease",
            }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>
                {editingId ? "Edit City" : "Add City"}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer"
                style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>City Name *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Sydney"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>State / Province</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. New South Wales"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Country *</label>
                <div className="relative">
                  <button
                    onClick={() => setCountryPickerOpen(!countryPickerOpen)}
                    className="flex items-center justify-between cursor-pointer"
                    style={{ ...inputStyle, display: "flex" }}
                  >
                    <span style={{ color: selectedFormCountry ? "var(--c-text-1)" : "var(--c-text-4)" }}>
                      {selectedFormCountry ? selectedFormCountry.name : "Select country"}
                    </span>
                    <ChevronDown width={14} height={14} stroke="var(--c-text-4)" strokeWidth={2} />
                  </button>
                  {countryPickerOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setCountryPickerOpen(false)} />
                      <div
                        className="absolute z-50"
                        style={{
                          top: "42px",
                          left: 0,
                          right: 0,
                          maxHeight: "200px",
                          overflowY: "auto",
                          background: "var(--c-dropdown-bg)",
                          border: "1px solid var(--c-border)",
                          borderRadius: "10px",
                          boxShadow: "var(--c-shadow-heavy)",
                          padding: "4px",
                        }}
                      >
                        {countries.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => { setForm({ ...form, country_id: c.id }); setCountryPickerOpen(false); }}
                            className="flex items-center justify-between cursor-pointer hoverable"
                            style={{ padding: "8px 10px", borderRadius: "7px", background: form.country_id === c.id ? "var(--c-nav-active-bg)" : "transparent" }}
                          >
                            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--c-text-1)" }}>{c.name}</span>
                            {form.country_id === c.id && <Check width={14} height={14} stroke="#2563eb" strokeWidth={2.4} />}
                          </div>
                        ))}
                        {countries.length === 0 && (
                          <div style={{ padding: "12px 10px", fontSize: "13px", color: "var(--c-text-4)", textAlign: "center" }}>
                            No countries. Create one first.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.country_id}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{
                  height: "38px",
                  border: "none",
                  borderRadius: "9px",
                  background: saving || !form.name || !form.country_id ? "#93c5fd" : "#2563eb",
                  fontSize: "13px",
                  fontWeight: 550,
                  color: "#fff",
                  gap: "6px",
                }}
              >
                {saving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
