
import { useRef, useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'

const DEFAULT_ACCEPTED_FORMATS = '.pdf,.html,.htm,.txt'

function FileDropzone({
  onFileSelect,
  disabled = false,
  accept = DEFAULT_ACCEPTED_FORMATS,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]

    if (file && !disabled) {
      onFileSelect(file)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    if (!disabled) {
      handleFiles(event.dataTransfer.files)
    }
  }

  function handleDragOver(event) {
    event.preventDefault()

    if (!disabled) {
      setIsDragging(true)
    }
  }

  function handleDragLeave(event) {
    // Avoid flickering when moving between children inside the dropzone.
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false)
    }
  }

  function openFilePicker() {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const acceptedLabel = accept
    .split(',')
    .map((extension) => extension.trim().replace('.', '').toUpperCase())
    .join(', ')

  return (
    <div
      className={`file-dropzone ${isDragging ? 'dragging' : ''} ${
        disabled ? 'dropzone-disabled' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={disabled}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)

          // Allow selecting the same file again.
          event.target.value = ''
        }}
      />

      <div className="dropzone-icon">
        <UploadCloud size={30} />
      </div>

      <h3>Drag and drop your document here</h3>

      <p>
        Upload a regulation to add it to your repository.
      </p>

      <button
        type="button"
        className="browse-button"
        disabled={disabled}
        onClick={openFilePicker}
      >
        <FileText size={17} />
        Browse files
      </button>

      <span className="file-format-hint">
        Accepted formats: {acceptedLabel}
      </span>
    </div>
  )
}

export default FileDropzone
