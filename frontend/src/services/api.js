const jsonHeaders = {
  "Content-Type": "application/json"
};
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export async function submitAdmission(formData) {
  const response = await fetch(apiUrl("/api/admissions"), {
    method: "POST",
    credentials: "include",
    body: formData
  });
  return parseResponse(response);
}

export async function loginAdmin(credentials) {
  const response = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify(credentials)
  });
  return parseResponse(response);
}

export async function getAdmissions() {
  const response = await fetch(apiUrl("/api/admin/admissions"), {
    credentials: "include"
  });
  return parseResponse(response);
}

export async function getAdminSession() {
  return parseResponse(await fetch(apiUrl("/api/admin/session"), { credentials: "include" }));
}

export async function markAdmissionsSeen() {
  return parseResponse(await fetch(apiUrl("/api/admin/admissions/seen"), { method: "POST", credentials: "include" }));
}

export async function updateAdmissionStatus(id, status) {
  return parseResponse(await fetch(apiUrl(`/api/admin/admissions/${id}`), {
    method: "PATCH",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({ status })
  }));
}

export async function logoutAdmin() {
  const response = await fetch(apiUrl("/api/admin/logout"), {
    method: "POST",
    credentials: "include"
  });
  return parseResponse(response);
}

export async function getGalleryEvents() {
  return parseResponse(await fetch(apiUrl("/api/gallery/events")));
}

export async function createGalleryEvent(formData) {
  return parseResponse(await fetch(apiUrl("/api/gallery/events"), { method: "POST", credentials: "include", body: formData }));
}

export async function updateGalleryEvent(id, formData) {
  return parseResponse(await fetch(apiUrl(`/api/gallery/events/${id}`), { method: "PATCH", credentials: "include", body: formData }));
}

export async function deleteGalleryEvent(id) {
  return parseResponse(await fetch(apiUrl(`/api/gallery/events/${id}`), { method: "DELETE", credentials: "include" }));
}
