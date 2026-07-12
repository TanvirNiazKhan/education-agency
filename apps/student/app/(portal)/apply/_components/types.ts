import React from "react";

/* ────────────────────────── Form state shape ────────────────────────── */

export const INITIAL_FORM = {
  institution: "",
  course: "",
  campus: "",
  appType: "New application",
  commenceMonth: "",
  commenceYear: "2026",
  studyLocation: "Offshore (still in my home country)",
  studentType: "International",
  enrolType: "Full-time",
  travelPref: "",

  firstName: "Ayaan",
  lastName: "Rahman",
  gender: "Male",
  dob: "2003-05-14",
  maritalStatus: "Single",
  email: "ayaan.rahman@email.com",
  mobile: "+880 1712 345678",
  homePhone: "",
  skype: "",

  passportNo: "",
  nationality: "Bangladesh",
  passIssueDate: "",
  passExpiryDate: "",
  passIssuePlace: "",
  passBirthPlace: "",
  visaRefused: "No",

  curStreet: "",
  curApt: "",
  curCity: "Dhaka",
  curState: "Dhaka Division",
  curPostcode: "1207",
  curCountry: "Bangladesh",
  sameAsCurrent: true,
  permStreet: "",
  permApt: "",
  permCity: "",
  permState: "",
  permPostcode: "",
  permCountry: "",

  emRelationship: "Parent",
  emFirstName: "",
  emLastName: "Rahman",
  emMobile: "",
  emOtherPhone: "",
  emEmail: "",

  eduLevel: "Higher Secondary (HSC)",
  eduYear: "2021",
  englishType: "IELTS Academic",
  englishDate: "",
  engOverall: "",
  engReading: "",
  engListening: "",
  engWriting: "",
  engSpeaking: "",

  workedAfter: "No",
  employer: "",
  manager: "",
  workStart: "",
  workEnd: "",
  profMembership: "",

  submitted: false,
};

export type FormState = typeof INITIAL_FORM;

/* ────────────────────────── Style constants ────────────────────────── */

export const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  height: 46,
  padding: "0 16px",
  borderRadius: 11,
  border: "1px solid var(--color-line)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-ink)",
  background: "#fbfcfe",
  boxSizing: "border-box",
};

export const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  appearance: "none" as const,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238592ad' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 38,
};

export const LABEL_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "var(--color-sub)",
  display: "block",
  marginBottom: 8,
};
