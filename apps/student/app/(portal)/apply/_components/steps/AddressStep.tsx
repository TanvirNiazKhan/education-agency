"use client";

import { FormState } from "../types";
import { FieldInput, FieldSelect, SectionHeader, CheckIcon } from "../FormFields";
import { ALL_COUNTRIES } from "../../../../lib/data";

interface AddressStepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K) => (val: FormState[K]) => void;
}

export function AddressStep({ form, set }: AddressStepProps) {
  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "var(--color-navy)",
          margin: "0 0 6px",
        }}
      >
        Where do you live?
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-sub)", margin: "0 0 28px" }}>
        Your current and permanent address details.
      </p>

      <SectionHeader>Current address</SectionHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
        <div className="sm:col-span-2">
          <FieldInput
            label="Street address"
            value={form.curStreet}
            onChange={set("curStreet")}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldInput
            label="Apartment / suite / unit"
            value={form.curApt}
            onChange={set("curApt")}
            optional
          />
        </div>
        <FieldInput label="City" value={form.curCity} onChange={set("curCity")} />
        <FieldInput label="State" value={form.curState} onChange={set("curState")} />
        <FieldInput
          label="Postcode"
          value={form.curPostcode}
          onChange={set("curPostcode")}
        />
        <FieldSelect
          label="Country"
          value={form.curCountry}
          onChange={set("curCountry")}
          options={ALL_COUNTRIES}
        />
      </div>

      {/* Same-as checkbox */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 28,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: form.sameAsCurrent ? "none" : "2px solid var(--color-line)",
            background: form.sameAsCurrent ? "var(--color-blue)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onClick={() => set("sameAsCurrent")(!form.sameAsCurrent)}
        >
          {form.sameAsCurrent && <CheckIcon />}
        </div>
        <span
          style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}
          onClick={() => set("sameAsCurrent")(!form.sameAsCurrent)}
        >
          My permanent address is the same as my current address
        </span>
      </label>

      {form.sameAsCurrent ? (
        <div
          style={{
            marginTop: 16,
            padding: "14px 18px",
            borderRadius: 12,
            background: "var(--color-green-bg)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 8.5L6.5 11.5L12.5 5"
              stroke="var(--color-green)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-green)" }}>
            Permanent address will be copied from your current address.
          </span>
        </div>
      ) : (
        <>
          <SectionHeader>Permanent address</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
            <div className="sm:col-span-2">
              <FieldInput
                label="Street address"
                value={form.permStreet}
                onChange={set("permStreet")}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldInput
                label="Apartment / suite / unit"
                value={form.permApt}
                onChange={set("permApt")}
                optional
              />
            </div>
            <FieldInput
              label="City"
              value={form.permCity}
              onChange={set("permCity")}
            />
            <FieldInput
              label="State"
              value={form.permState}
              onChange={set("permState")}
            />
            <FieldInput
              label="Postcode"
              value={form.permPostcode}
              onChange={set("permPostcode")}
            />
            <FieldSelect
              label="Country"
              value={form.permCountry}
              onChange={set("permCountry")}
              options={ALL_COUNTRIES}
            />
          </div>
        </>
      )}
    </div>
  );
}
