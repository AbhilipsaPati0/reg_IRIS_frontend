
import { useRef, useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'

const ACCEPTED_FORMATS = '.pdf,.html,.htm,.txt'

function FileDropzone({ onFileSelect, disabled = false }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]

    if (file) {
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

  return (
    <div
      className={`file-dropzone ${isDragging ? 'dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()

        if (!disabled) {
          setIsDragging(true)
        }
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-disabled={disabled}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        hidden
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <div className="dropzone-icon">
        <UploadCloud size={30} />
      </div>

      <h3>Drag and drop your document here</h3>
      <p>Upload a regulation to add it to your repository</p>

      <button
        type="button"
        className="browse-button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <FileText size={17} />
        Browse files
      </button>

      <span className="file-format-hint">
        Supported formats: PDF, HTML and TXT
      </span>
    </div>
  )
}

export default FileDropzone
