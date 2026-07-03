const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/public";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

export async function fetchDisplayData(screenCode) {
  const json = await request(`/display/${screenCode}`);
  return json.data;
}

export async function fetchDisplayScreens() {
  const json = await request("/display-screens");
  return json.screens || [];
}