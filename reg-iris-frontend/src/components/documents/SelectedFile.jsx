
import { FileText, X } from 'lucide-react'

function SelectedFile({ file, onRemove, disabled = false }) {
  if (!file) return null

  const fileSize =
    file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`

  return (
    <div className="selected-file">
      <div className="selected-file-icon">
        <FileText size={22} />
      </div>

      <div className="selected-file-details">
        <strong title={file.name}>{file.name}</strong>
        <span>{fileSize}</span>
      </div>

      <button
        type="button"
        className="remove-file-button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        title="Remove selected file"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default SelectedFile
