const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export interface Country {
  id: string;
  name: string;
  iso_code: string;
  currency: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string | null;
  country_id: string;
  country?: Country;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  university_type: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  logo: string | null;
  banner: string | null;
  description: string | null;
  featured: boolean;
  country_id: string;
  city_id: string;
  country?: Country;
  city?: City;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Education level types: Bachelor, Master, PhD, Pre-school, Diploma etc.
export interface Degree {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Belongs to university (not degree)
export interface Faculty {
  id: string;
  name: string;
  description: string | null;
  university_id: string;
  university?: University;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Links faculty + degree
export interface Course {
  id: string;
  name: string;
  course_code: string;
  tuition_fee: number;
  currency: string;
  duration_months: number;
  intake: string | null;
  ielts_requirement: number | null;
  ielts_speaking: number | null;
  ielts_writing: number | null;
  ielts_reading: number | null;
  ielts_listening: number | null;
  pte_requirement: number | null;
  pte_speaking: number | null;
  pte_writing: number | null;
  pte_reading: number | null;
  pte_listening: number | null;
  toefl_requirement: number | null;
  toefl_speaking: number | null;
  toefl_writing: number | null;
  toefl_reading: number | null;
  toefl_listening: number | null;
  overview: string | null;
  scholarship_available: boolean;
  faculty_id: string;
  faculty?: Faculty;
  degree_id: string;
  degree?: Degree;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const countriesApi = {
  list: () => api.get<Country[]>("/countries"),
  get: (id: string) => api.get<Country>(`/countries/${id}`),
  create: (data: { name: string; iso_code: string; currency?: string }) =>
    api.post<Country>("/countries", data),
  update: (id: string, data: Partial<{ name: string; iso_code: string; currency: string }>) =>
    api.put<Country>(`/countries/${id}`, data),
  delete: (id: string) => api.delete<void>(`/countries/${id}`),
};

export const citiesApi = {
  list: (countryId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (countryId) params.set("country_id", countryId);
    if (search) params.set("q", search);
    const qs = params.toString();
    return api.get<City[]>(qs ? `/cities?${qs}` : "/cities");
  },
  get: (id: string) => api.get<City>(`/cities/${id}`),
  create: (data: { name: string; state?: string; country_id: string }) =>
    api.post<City>("/cities", data),
  update: (id: string, data: Partial<{ name: string; state: string; country_id: string }>) =>
    api.put<City>(`/cities/${id}`, data),
  delete: (id: string) => api.delete<void>(`/cities/${id}`),
};

export type CreateUniversityData = {
  name: string;
  slug: string;
  country_id: string;
  city_id: string;
  short_name?: string;
  university_type?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  logo?: string;
  banner?: string;
  description?: string;
  featured?: boolean;
};

export const universitiesApi = {
  list: (countryId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (countryId) params.set("country_id", countryId);
    if (search) params.set("q", search);
    params.set("include_inactive", "true");
    const qs = params.toString();
    return api.get<University[]>(`/universities?${qs}`);
  },
  get: (id: string) => api.get<University>(`/universities/${id}`),
  create: (data: CreateUniversityData) => api.post<University>("/universities", data),
  update: (id: string, data: Partial<CreateUniversityData> & { is_active?: boolean }) =>
    api.put<University>(`/universities/${id}`, data),
  delete: (id: string) => api.delete<void>(`/universities/${id}`),
};

export const degreesApi = {
  list: () => api.get<Degree[]>("/degrees"),
  get: (id: string) => api.get<Degree>(`/degrees/${id}`),
  create: (data: { name: string }) => api.post<Degree>("/degrees", data),
  update: (id: string, data: { name: string }) => api.put<Degree>(`/degrees/${id}`, data),
  delete: (id: string) => api.delete<void>(`/degrees/${id}`),
};

export const facultiesApi = {
  list: (universityId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (universityId) params.set("university_id", universityId);
    if (search) params.set("q", search);
    params.set("include_inactive", "true");
    const qs = params.toString();
    return api.get<Faculty[]>(`/faculties?${qs}`);
  },
  get: (id: string) => api.get<Faculty>(`/faculties/${id}`),
  create: (data: { name: string; description?: string; university_id: string }) =>
    api.post<Faculty>("/faculties", data),
  update: (id: string, data: Partial<{ name: string; description: string; university_id: string }> & { is_active?: boolean }) =>
    api.put<Faculty>(`/faculties/${id}`, data),
  delete: (id: string) => api.delete<void>(`/faculties/${id}`),
};

export type CreateCourseData = {
  name: string;
  course_code: string;
  tuition_fee: number;
  currency: string;
  duration_months: number;
  faculty_id: string;
  degree_id: string;
  intake?: string;
  ielts_requirement?: number;
  ielts_speaking?: number;
  ielts_writing?: number;
  ielts_reading?: number;
  ielts_listening?: number;
  pte_requirement?: number;
  pte_speaking?: number;
  pte_writing?: number;
  pte_reading?: number;
  pte_listening?: number;
  toefl_requirement?: number;
  toefl_speaking?: number;
  toefl_writing?: number;
  toefl_reading?: number;
  toefl_listening?: number;
  overview?: string;
  scholarship_available?: boolean;
};

export const coursesApi = {
  list: (facultyId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (facultyId) params.set("faculty_id", facultyId);
    if (search) params.set("q", search);
    params.set("include_inactive", "true");
    const qs = params.toString();
    return api.get<Course[]>(`/courses?${qs}`);
  },
  get: (id: string) => api.get<Course>(`/courses/${id}`),
  create: (data: CreateCourseData) => api.post<Course>("/courses", data),
  update: (id: string, data: Partial<CreateCourseData> & { is_active?: boolean }) =>
    api.put<Course>(`/courses/${id}`, data),
  delete: (id: string) => api.delete<void>(`/courses/${id}`),
};

export interface UniversityImage {
  id: string;
  url: string;
  alt_text: string | null;
  type: string | null;
  sort_order: number;
  university_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipScope {
  id: string;
  scope_type: string;
  scope_id: string;
  scholarship_id: string;
  created_at: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string | null;
  percentage: number | null;
  type: string | null;
  deadline: string | null;
  university_id: string;
  scopes: ScholarshipScope[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateScholarshipData = {
  name: string;
  university_id: string;
  description?: string;
  percentage?: number;
  type?: string;
  deadline?: string;
  scopes?: { scope_type: string; scope_id: string }[];
};

export const scholarshipsApi = {
  list: (universityId: string) =>
    api.get<Scholarship[]>(`/scholarships?university_id=${universityId}`),
  get: (id: string) => api.get<Scholarship>(`/scholarships/${id}`),
  create: (data: CreateScholarshipData) => api.post<Scholarship>("/scholarships", data),
  update: (id: string, data: Partial<CreateScholarshipData>) =>
    api.put<Scholarship>(`/scholarships/${id}`, data),
  delete: (id: string) => api.delete<void>(`/scholarships/${id}`),
};

export interface Intake {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  status: string | null;
  university_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateIntakeData = {
  name: string;
  university_id: string;
  start_date?: string;
  end_date?: string;
  deadline?: string;
  status?: string;
};

export const intakesApi = {
  list: (universityId: string) =>
    api.get<Intake[]>(`/intakes?university_id=${universityId}`),
  get: (id: string) => api.get<Intake>(`/intakes/${id}`),
  create: (data: CreateIntakeData) => api.post<Intake>("/intakes", data),
  update: (id: string, data: Partial<CreateIntakeData>) =>
    api.put<Intake>(`/intakes/${id}`, data),
  delete: (id: string) => api.delete<void>(`/intakes/${id}`),
};

export interface AdminApplication {
  id: string;
  status: string;
  commence_month: string | null;
  commence_year: string | null;
  campus: string | null;
  application_type: string | null;
  study_location: string | null;
  student_type: string | null;
  enrolment_type: string | null;
  submitted_at: string | null;
  notes: string | null;
  created_at: string;
  student: {
    id: string;
    nationality: string | null;
    passport_no: string | null;
    passport_expiry_date: string | null;
    passport_issue_date: string | null;
    passport_issue_place: string | null;
    passport_birth_place: string | null;
    gender: string | null;
    date_of_birth: string | null;
    marital_status: string | null;
    mobile: string | null;
    skype: string | null;
    visa_refused: boolean;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    addresses: {
      id: string;
      type: string;
      street: string | null;
      apt: string | null;
      city: string | null;
      state: string | null;
      postcode: string | null;
      country: string | null;
    }[];
    emergency_contacts: {
      id: string;
      relationship: string | null;
      first_name: string | null;
      last_name: string | null;
      mobile: string | null;
      other_phone: string | null;
      email: string | null;
    }[];
    education: {
      id: string;
      level: string | null;
      completion_year: string | null;
      english_test_type: string | null;
      english_test_date: string | null;
      score_overall: number | null;
      score_reading: number | null;
      score_listening: number | null;
      score_writing: number | null;
      score_speaking: number | null;
    }[];
    work_experience: {
      id: string;
      employer: string | null;
      manager: string | null;
      start_date: string | null;
      end_date: string | null;
      professional_membership: string | null;
    }[];
  };
  university: {
    id: string;
    name: string;
    short_name: string | null;
    country?: { id: string; name: string; iso_code: string };
  };
  course: {
    id: string;
    name: string;
    course_code: string;
    faculty?: { id: string; name: string };
  };
  documents: {
    id: string;
    application_id: string;
    document_type: string;
    file_name: string;
    file_url: string;
    status: string;
    created_at: string;
  }[];
  status_history?: {
    id: string;
    from_status: string | null;
    to_status: string;
    comment: string | null;
    created_at: string;
  }[];
}

export type UpdateApplicationData = {
  campus?: string;
  application_type?: string;
  study_location?: string;
  student_type?: string;
  enrolment_type?: string;
  commence_month?: string;
  commence_year?: string;
  notes?: string;
};

export const APPLICATION_STATUSES = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'documents_requested', label: 'Documents Requested' },
  { value: 'conditional_offer', label: 'Conditional Offer' },
  { value: 'unconditional_offer', label: 'Unconditional Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
] as const;

export const applicationsApi = {
  listAll: () => api.get<AdminApplication[]>('/admin/applications'),
  getById: (id: string) => api.get<AdminApplication>(`/admin/applications/${id}`),
  update: (id: string, data: UpdateApplicationData) =>
    api.patch<AdminApplication>(`/admin/applications/${id}`, data),
  changeStatus: (id: string, status: string, comment?: string) =>
    api.patch<AdminApplication>(`/admin/applications/${id}/status`, { status, comment }),
};

export interface DashboardStats {
  totalStudents: number;
  totalApplications: number;
  statusCounts: Record<string, number>;
  countryBreakdown: { name: string; count: number }[];
  universityBreakdown: { name: string; shortName: string | null; count: number }[];
  intakeBreakdown: { name: string; count: number }[];
}

export const dashboardApi = {
  stats: () => api.get<DashboardStats>('/admin/applications/dashboard/stats'),
};

export const universityImagesApi = {
  list: (universityId: string) =>
    api.get<UniversityImage[]>(`/university-images?university_id=${universityId}`),
  upload: async (universityId: string, files: File[], type?: string) => {
    const formData = new FormData();
    formData.append("university_id", universityId);
    if (type) formData.append("type", type);
    files.forEach((f) => formData.append("images", f));
    const res = await fetch(`${API_BASE}/university-images`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Upload failed ${res.status}`);
    }
    return res.json() as Promise<UniversityImage[]>;
  },
  delete: (id: string) => api.delete<void>(`/university-images/${id}`),
};
