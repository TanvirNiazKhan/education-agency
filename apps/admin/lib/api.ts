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
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
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
  pte_requirement: number | null;
  toefl_requirement: number | null;
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
  list: (countryId?: string) =>
    api.get<City[]>(countryId ? `/cities?country_id=${countryId}` : "/cities"),
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
  list: (countryId?: string) =>
    api.get<University[]>(countryId ? `/universities?country_id=${countryId}` : "/universities"),
  get: (id: string) => api.get<University>(`/universities/${id}`),
  create: (data: CreateUniversityData) => api.post<University>("/universities", data),
  update: (id: string, data: Partial<CreateUniversityData>) =>
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
  list: (universityId?: string) =>
    api.get<Faculty[]>(universityId ? `/faculties?university_id=${universityId}` : "/faculties"),
  get: (id: string) => api.get<Faculty>(`/faculties/${id}`),
  create: (data: { name: string; description?: string; university_id: string }) =>
    api.post<Faculty>("/faculties", data),
  update: (id: string, data: Partial<{ name: string; description: string; university_id: string }>) =>
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
  pte_requirement?: number;
  toefl_requirement?: number;
  overview?: string;
  scholarship_available?: boolean;
};

export const coursesApi = {
  list: (facultyId?: string) =>
    api.get<Course[]>(facultyId ? `/courses?faculty_id=${facultyId}` : "/courses"),
  get: (id: string) => api.get<Course>(`/courses/${id}`),
  create: (data: CreateCourseData) => api.post<Course>("/courses", data),
  update: (id: string, data: Partial<CreateCourseData>) =>
    api.put<Course>(`/courses/${id}`, data),
  delete: (id: string) => api.delete<void>(`/courses/${id}`),
};
