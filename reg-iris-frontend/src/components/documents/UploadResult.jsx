
import { CheckCircle2, AlertCircle, Info, FileText } from 'lucide-react'

function UploadResult({ result, error }) {
  if (!result && !error) return null

  if (error) {
    return (
      <div className="upload-result upload-result-error" role="alert">
        <AlertCircle size={21} />

        <div className="upload-result-content">
          <strong>Upload failed</strong>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const status = String(result.status || '').toLowerCase()
  const isProcessing =
    status === 'processing' || status === 'pending' || status === 'queued'

  const Icon = isProcessing
    ? Info
    : CheckCircle2

  return (
    <div
      className={`upload-result ${
        isProcessing ? 'upload-result-info' : 'upload-result-success'
      }`}
      role="status"
    >
      <Icon size={21} />

      <div className="upload-result-content">
        <strong>
          {isProcessing ? 'Document received' : 'Upload successful'}
        </strong>

        <p>
          {result.message ||
            (isProcessing
              ? 'Your document is awaiting processing.'
              : 'The backend accepted your document.')}
        </p>

        {result.document_id && (
          <p>
            <FileText size={14} />
            Document ID: {result.document_id}
          </p>
        )}

        {result.status && <p>Status: {result.status}</p>}
      </div>
    </div>
  )
}

export default UploadResult
