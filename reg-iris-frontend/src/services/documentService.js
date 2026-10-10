
import { apiRequest } from './api'

export function uploadDocument(file) {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest('/api/documents/upload', {
    method: 'POST',
    body: formData,
  })
}
