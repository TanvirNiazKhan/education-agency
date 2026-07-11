"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, MapPin, ChevronRight } from "lucide-react";
import { countriesApi, citiesApi, type Country, type City } from "@/lib/api";

/* ─── Styles ─── */
const gradients = [
  ["#2563eb", "#60a5fa"],
  ["#7c3aed", "#a78bfa"],
  ["#dc2626", "#f87171"],
  ["#0891b2", "#22d3ee"],
  ["#16a34a", "#4ade80"],
  ["#ea580c", "#fb923c"],
  ["#d946ef", "#f0abfc"],
  ["#0d9488", "#5eead4"],
];
function getGradient(i: number) {
  const g = gradients[i % gradients.length];
  return `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: "38px", padding: "0 12px", fontSize: "13px",
  border: "1px solid var(--c-border-input)", borderRadius: "9px",
  background: "var(--c-bg-elevated)", color: "var(--c-text-1)", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)",
  marginBottom: "5px", display: "block",
};

/* ─── Forms ─── */
interface CountryForm { name: string; iso_code: string; currency: string; }
interface CityForm { name: string; state: string; }
const emptyCountryForm: CountryForm = { name: "", iso_code: "", currency: "" };
const emptyCityForm: CityForm = { name: "", state: "" };

export default function CountriesPage() {
  /* Countries */
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryDrawerOpen, setCountryDrawerOpen] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [countryForm, setCountryForm] = useState<CountryForm>(emptyCountryForm);
  const [countrySaving, setCountrySaving] = useState(false);

  /* Selection */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* Cities */
  const [cities, setCities] = useState<City[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityDrawerOpen, setCityDrawerOpen] = useState(false);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [cityForm, setCityForm] = useState<CityForm>(emptyCityForm);
  const [citySaving, setCitySaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ─── Loaders ─── */
  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      setCountries(await countriesApi.list());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally { setLoading(false); }
  }, []);

  const loadCities = useCallback(async (countryId: string) => {
    setCityLoading(true);
    try {
      setCities(await citiesApi.list(countryId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load cities");
    } finally { setCityLoading(false); }
  }, []);

  useEffect(() => { loadCountries(); }, [loadCountries]);
  useEffect(() => {
    if (selectedId) loadCities(selectedId);
    else setCities([]);
  }, [selectedId, loadCities]);

  const selectedCountry = countries.find((c) => c.id === selectedId) ?? null;

  /* ─── Country CRUD ─── */
  function openCreateCountry() {
    setEditingCountryId(null); setCountryForm(emptyCountryForm); setCountryDrawerOpen(true);
  }
  function openEditCountry(c: Country) {
    setEditingCountryId(c.id);
    setCountryForm({ name: c.name, iso_code: c.iso_code, currency: c.currency || "" });
    setCountryDrawerOpen(true);
  }
  async function handleCountrySave() {
    if (!countryForm.name || !countryForm.iso_code) return;
    setCountrySaving(true);
    try {
      if (editingCountryId) {
        await countriesApi.update(editingCountryId, {
          name: countryForm.name, iso_code: countryForm.iso_code,
          ...(countryForm.currency ? { currency: countryForm.currency } : {}),
        });
      } else {
        await countriesApi.create({
          name: countryForm.name, iso_code: countryForm.iso_code,
          ...(countryForm.currency ? { currency: countryForm.currency } : {}),
        });
      }
      setCountryDrawerOpen(false);
      await loadCountries();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setCountrySaving(false); }
  }
  async function handleCountryDelete(id: string) {
    if (!confirm("Delete this country? All associated cities will also be deleted.")) return;
    try {
      await countriesApi.delete(id);
      if (selectedId === id) setSelectedId(null);
      await loadCountries();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── City CRUD ─── */
  function openCreateCity() {
    setEditingCityId(null); setCityForm(emptyCityForm); setCityDrawerOpen(true);
  }
  function openEditCity(c: City) {
    setEditingCityId(c.id);
    setCityForm({ name: c.name, state: c.state || "" });
    setCityDrawerOpen(true);
  }
  async function handleCitySave() {
    if (!cityForm.name || !selectedId) return;
    setCitySaving(true);
    try {
      if (editingCityId) {
        await citiesApi.update(editingCityId, {
          name: cityForm.name, country_id: selectedId,
          ...(cityForm.state ? { state: cityForm.state } : {}),
        });
      } else {
        await citiesApi.create({
          name: cityForm.name, country_id: selectedId,
          ...(cityForm.state ? { state: cityForm.state } : {}),
        });
      }
      setCityDrawerOpen(false);
      await loadCities(selectedId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setCitySaving(false); }
  }
  async function handleCityDelete(id: string) {
    if (!confirm("Delete this city?")) return;
    try {
      await citiesApi.delete(id);
      if (selectedId) await loadCities(selectedId);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  }

  /* ─── Render ─── */
  return (
    <div className="px-4 sm:px-8 pt-6 pb-[60px]" style={{ animation: "fadeUp 0.28s ease" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--c-text-1)" }}>Countries</h1>
          <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--c-text-3)" }}>Manage destination countries and their cities</p>
        </div>
        <button onClick={openCreateCountry} className="flex items-center cursor-pointer"
          style={{ height: "34px", gap: "6px", padding: "0 13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "9px", fontSize: "12.5px", fontWeight: 550, boxShadow: "0 1px 2px rgba(37,99,235,0.25)" }}>
          <Plus width={15} height={15} stroke="#fff" strokeWidth={2.4} />Add country
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between" style={{ padding: "10px 14px", marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626" }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><X width={14} height={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center" style={{ padding: "60px 0", color: "var(--c-text-4)" }}>
          <Loader2 width={24} height={24} className="animate-spin" />
        </div>
      ) : countries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--c-text-4)", fontSize: "14px" }}>
          No countries yet. Add your first country to get started.
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* ── LEFT: Country cards ── */}
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {countries.map((c, i) => {
                const isSelected = c.id === selectedId;
                return (
                  <div key={c.id}
                    onClick={() => setSelectedId(isSelected ? null : c.id)}
                    className="cursor-pointer group"
                    style={{
                      border: isSelected ? "2px solid #2563eb" : "1px solid var(--c-border)",
                      borderRadius: "14px", overflow: "hidden",
                      background: "var(--c-bg-elevated)",
                      boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
                      transition: "box-shadow 0.15s, border-color 0.15s",
                    }}>
                    {/* Banner */}
                    <div style={{ height: "52px", background: getGradient(i), position: "relative" }}>
                      {isSelected && (
                        <div style={{ position: "absolute", top: "8px", right: "10px", background: "#2563eb", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600, color: "#fff" }}>
                          Selected
                        </div>
                      )}
                      <div
                        className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100"
                        style={{ transition: "opacity 0.15s", display: isSelected ? "none" : undefined }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => openEditCountry(c)} className="cursor-pointer"
                          style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "7px" }}>
                          <Pencil width={13} height={13} stroke="#374151" strokeWidth={2} />
                        </button>
                        <button onClick={() => handleCountryDelete(c.id)} className="cursor-pointer"
                          style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "7px" }}>
                          <Trash2 width={13} height={13} stroke="#dc2626" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ padding: "13px 15px" }}>
                      <div className="flex items-center justify-between">
                        <h3 style={{ margin: 0, fontSize: "14.5px", fontWeight: 600, color: isSelected ? "#2563eb" : "var(--c-text-1)" }}>{c.name}</h3>
                        <ChevronRight width={14} height={14} stroke={isSelected ? "#2563eb" : "var(--c-text-5)"} strokeWidth={2} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>ISO Code</div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.iso_code}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--c-text-4)" }}>Currency</div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{c.currency || "—"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Cities panel ── */}
          {selectedCountry && (
            <div style={{ width: "320px", flexShrink: 0, border: "1px solid var(--c-border)", borderRadius: "14px", overflow: "hidden", background: "var(--c-bg-elevated)" }}>
              {/* Panel header */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--c-border)", background: "var(--c-bg-surface)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin width={14} height={14} stroke="#2563eb" strokeWidth={2} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text-1)" }}>{selectedCountry.name}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--c-text-4)", marginTop: "2px" }}>
                      {selectedCountry.iso_code}{selectedCountry.currency ? ` · ${selectedCountry.currency}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEditCountry(selectedCountry)} className="cursor-pointer hoverable"
                      style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "7px" }}>
                      <Pencil width={12} height={12} stroke="var(--c-text-3)" strokeWidth={2} />
                    </button>
                    <button onClick={() => setSelectedId(null)} className="cursor-pointer hoverable"
                      style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                      <X width={16} height={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cities section */}
              <div style={{ padding: "14px 16px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cities</span>
                  <button onClick={openCreateCity} className="flex items-center gap-1 cursor-pointer"
                    style={{ height: "26px", padding: "0 9px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11.5px", fontWeight: 550 }}>
                    <Plus width={12} height={12} stroke="#fff" strokeWidth={2.5} />Add city
                  </button>
                </div>

                {cityLoading ? (
                  <div className="flex items-center justify-center" style={{ padding: "20px 0", color: "var(--c-text-4)" }}>
                    <Loader2 width={18} height={18} className="animate-spin" />
                  </div>
                ) : cities.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--c-text-4)", fontSize: "13px" }}>
                    No cities yet.<br />Add the first city for {selectedCountry.name}.
                  </div>
                ) : (
                  <div style={{ border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                    {cities.map((city, i) => (
                      <div key={city.id} className="group flex items-center justify-between"
                        style={{ padding: "10px 12px", borderBottom: i < cities.length - 1 ? "1px solid var(--c-border)" : "none", background: "var(--c-bg-elevated)" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 550, color: "var(--c-text-1)" }}>{city.name}</div>
                          {city.state && <div style={{ fontSize: "11.5px", color: "var(--c-text-4)", marginTop: "1px" }}>{city.state}</div>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.15s" }}>
                          <button onClick={() => openEditCity(city)} className="cursor-pointer"
                            style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--c-border)", borderRadius: "6px" }}>
                            <Pencil width={11} height={11} stroke="var(--c-text-3)" strokeWidth={2} />
                          </button>
                          <button onClick={() => handleCityDelete(city.id)} className="cursor-pointer"
                            style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid #fecaca", borderRadius: "6px" }}>
                            <Trash2 width={11} height={11} stroke="#dc2626" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COUNTRY DRAWER ── */}
      {countryDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setCountryDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "380px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingCountryId ? "Edit Country" : "Add Country"}</h2>
              <button onClick={() => setCountryDrawerOpen(false)} className="cursor-pointer"
                style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} placeholder="e.g. Australia" value={countryForm.name}
                  onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} autoFocus />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>ISO Code *</label>
                <input style={inputStyle} placeholder="AUS" maxLength={3} value={countryForm.iso_code}
                  onChange={(e) => setCountryForm({ ...countryForm, iso_code: e.target.value.toUpperCase() })} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Currency</label>
                <input style={inputStyle} placeholder="AUD" value={countryForm.currency}
                  onChange={(e) => setCountryForm({ ...countryForm, currency: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setCountryDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleCountrySave} disabled={countrySaving || !countryForm.name || !countryForm.iso_code}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: countrySaving || !countryForm.name || !countryForm.iso_code ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {countrySaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingCountryId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── CITY DRAWER ── */}
      {cityDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "var(--c-overlay)" }} onClick={() => setCityDrawerOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: "340px", maxWidth: "100vw", background: "var(--c-bg-elevated)", borderLeft: "1px solid var(--c-border)", animation: "slideInRight 0.2s ease" }}>
            <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-border)" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text-1)" }}>{editingCityId ? "Edit City" : "Add City"}</h2>
              <button onClick={() => setCityDrawerOpen(false)} className="cursor-pointer"
                style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "7px", color: "var(--c-text-4)" }}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto" style={{ padding: "20px" }}>
              <div style={{ padding: "10px 12px", marginBottom: "16px", background: "var(--c-bg-surface)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "12.5px", color: "var(--c-text-3)" }}>
                Country: <strong style={{ color: "var(--c-text-1)" }}>{selectedCountry?.name}</strong>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>City Name *</label>
                <input style={inputStyle} placeholder="e.g. Sydney" value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleCitySave()}
                  autoFocus />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>State / Province</label>
                <input style={inputStyle} placeholder="e.g. New South Wales" value={cityForm.state}
                  onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleCitySave()} />
              </div>
            </div>
            <div className="flex gap-2" style={{ padding: "16px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setCityDrawerOpen(false)} className="flex-1 cursor-pointer"
                style={{ height: "38px", border: "1px solid var(--c-border-input)", borderRadius: "9px", background: "var(--c-bg-elevated)", fontSize: "13px", fontWeight: 550, color: "var(--c-text-2)" }}>Cancel</button>
              <button onClick={handleCitySave} disabled={citySaving || !cityForm.name}
                className="flex-1 flex items-center justify-center cursor-pointer"
                style={{ height: "38px", border: "none", borderRadius: "9px", background: citySaving || !cityForm.name ? "#93c5fd" : "#2563eb", fontSize: "13px", fontWeight: 550, color: "#fff", gap: "6px" }}>
                {citySaving && <Loader2 width={14} height={14} className="animate-spin" />}
                {editingCityId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
