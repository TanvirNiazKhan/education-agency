const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    avatar_url: string | null;
  };
}

export interface UpsertProfilePayload {
  personal?: {
    gender?: string;
    date_of_birth?: string;
    marital_status?: string;
    mobile?: string;
    home_phone?: string;
    skype?: string;
    nationality?: string;
    passport_no?: string;
    passport_issue_date?: string;
    passport_expiry_date?: string;
    passport_issue_place?: string;
    passport_birth_place?: string;
    visa_refused?: boolean;
  };
  current_address?: {
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  permanent_address?: {
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  emergency_contact?: {
    relationship?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
    other_phone?: string;
    email?: string;
  };
  education?: {
    level?: string;
    completion_year?: string;
    english_test_type?: string;
    english_test_date?: string;
    score_overall?: number;
    score_reading?: number;
    score_listening?: number;
    score_writing?: number;
    score_speaking?: number;
  };
  work_experience?: {
    employer?: string;
    manager?: string;
    start_date?: string;
    end_date?: string;
    professional_membership?: string;
  };
}

export interface CreateApplicationPayload {
  university_id: string;
  course_id: string;
  campus?: string;
  application_type?: string;
  study_location?: string;
  student_type?: string;
  enrolment_type?: string;
  commence_month?: string;
  commence_year?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signup(payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

// ─── Student Profile ──────────────────────────────────────────────────────────

export async function getStudentProfile(token: string) {
  const res = await fetch(`${API_BASE}/students/profile`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function upsertStudentProfile(token: string, payload: UpsertProfilePayload) {
  const res = await fetch(`${API_BASE}/students/profile`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function getMyApplications(token: string) {
  const res = await fetch(`${API_BASE}/applications`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function createApplication(token: string, payload: CreateApplicationPayload) {
  const res = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getApplication(token: string, id: string) {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function uploadDocument(
  token: string,
  applicationId: string,
  docType: string,
  file: File,
): Promise<{ id: string; file_name: string; file_url: string; document_type: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("doc_type", docType);
  const res = await fetch(`${API_BASE}/applications/${applicationId}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteDocument(token: string, applicationId: string, docId: string) {
  const res = await fetch(`${API_BASE}/applications/${applicationId}/documents/${docId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).message || "Delete failed");
  }
}

export async function getDocuments(token: string, applicationId: string) {
  const res = await fetch(`${API_BASE}/applications/${applicationId}/documents`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function uploadAvatar(token: string, file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/students/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function changePassword(
  token: string,
  current_password: string,
  new_password: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ current_password, new_password }),
  });
  return handleResponse(res);
}

export async function updateProfile(
  token: string,
  data: { first_name?: string; last_name?: string; phone?: string },
) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
