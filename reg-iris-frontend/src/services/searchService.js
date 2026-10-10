
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function searchRegulations({
  query,
  regulator = "",
  page = 1,
}) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
  });

  if (regulator) {
    params.set("regulator", regulator);
  }

  const response = await fetch(
    `${API_BASE_URL}/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }

  const data = await response.json();

  // Normalize common API response formats.
  const results = Array.isArray(data)
    ? data
    : data.results ?? data.items ?? [];

  return {
    results,
    total: data.total ?? results.length,
  };
}
