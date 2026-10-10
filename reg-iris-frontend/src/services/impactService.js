
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function runImpactAnalysis(payload = {}) {
  const response = await fetch(`${API_BASE_URL}/impact-matrix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Impact analysis failed: ${response.status}`);
  }

  const data = await response.json();
  const items = Array.isArray(data)
    ? data
    : data.items ?? data.results ?? [];

  return {
    items,
    total: data.total ?? items.length,
  };
}
