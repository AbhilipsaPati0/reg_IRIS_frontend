
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

export async function searchRegulations({
  query,
  regulator = '',
  documentType = '',
  effectiveDate = '',
  page = 1,
}) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
  })

  if (regulator) {
    params.set('regulator', regulator)
  }

  if (documentType) {
    params.set('document_type', documentType)
  }

  if (effectiveDate) {
    params.set('effective_date', effectiveDate)
  }

  const response = await fetch(
    `${API_BASE_URL}/search?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(
      `Search failed (${response.status}). Check the backend search endpoint.`
    )
  }

  const data = await response.json()

  const results = Array.isArray(data)
    ? data
    : data.results ?? data.items ?? data.sources ?? []

  return {
    answer: Array.isArray(data)
      ? ''
      : data.answer ?? data.generated_answer ?? data.response ?? '',
    results,
    total: Array.isArray(data)
      ? results.length
      : data.total ?? data.total_results ?? results.length,
  }
}
