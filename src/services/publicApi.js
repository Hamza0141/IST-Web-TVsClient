const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:4000/api/public";

export async function fetchDisplayData(screenCode) {
  const response = await fetch(`${API_BASE_URL}/display/${screenCode}`);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch display data");
  }

  return json.data;
}

export async function fetchDisplayScreens() {
  const response = await fetch(`${API_BASE_URL}/display-screens`);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch display screens");
  }

  return json.screens;
}