
import { useState } from 'react'
import './UploadDocuments.css'
import {
  Upload,
  ShieldCheck,
  FileText,
  GitMerge,
  Replace,
} from 'lucide-react'

import PageHeader from '../components/common/PageHeader'
import LoadingButton from '../components/common/LoadingButton'
import FileDropzone from '../components/documents/FileDropzone'
import SelectedFile from '../components/documents/SelectedFile'
import UploadResult from '../components/documents/UploadResult'

import { uploadDocument } from '../services/documentService'

const ALLOWED_EXTENSIONS = ['pdf', 'html', 'htm', 'txt']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

const FILE_ACCEPT_TYPES = {
  all: '.pdf,.html,.htm,.txt',
  pdf: '.pdf',
  html: '.html,.htm',
  txt: '.txt',
}

function UploadDocuments() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState('all')
  const [importMode, setImportMode] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleFileTypeChange(event) {
    const nextType = event.target.value

    setFileType(nextType)
    setError('')
    setResult(null)

    // Clear a selected file if it doesn't match the new filter.
    if (selectedFile && nextType !== 'all') {
      const extension = selectedFile.name.split('.').pop().toLowerCase()

      const matches =
        nextType === 'pdf'
          ? extension === 'pdf'
          : nextType === 'html'
            ? ['html', 'htm'].includes(extension)
            : extension === 'txt'

      if (!matches) {
        setSelectedFile(null)
      }
    }
  }

  function handleFileSelect(file) {
    setError('')
    setResult(null)

    if (!file) return

    const extension = file.name.split('.').pop().toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setSelectedFile(null)
      setError('Please select a PDF, HTML, HTM, or TXT document.')
      return
    }

    const matchesFilter =
      fileType === 'all' ||
      (fileType === 'pdf' && extension === 'pdf') ||
      (fileType === 'html' && ['html', 'htm'].includes(extension)) ||
      (fileType === 'txt' && extension === 'txt')

    if (!matchesFilter) {
      setSelectedFile(null)
      setError(`Please select a file matching the ${fileType.toUpperCase()} filter.`)
      return
    }

    if (file.size === 0) {
      setSelectedFile(null)
      setError('The selected file is empty. Please choose another file.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null)
      setError('The maximum allowed file size is 10 MB.')
      return
    }

    setSelectedFile(file)
  }

  function handleRemoveFile() {
    if (uploading) return

    setSelectedFile(null)
    setResult(null)
    setError('')
  }

  async function handleUpload() {
    if (!selectedFile || uploading) return

    if (!importMode) {
      setError('Please select Concatenate or Override before uploading.')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      // The service must send importMode to the backend.
      const response = await uploadDocument(selectedFile, importMode)
      setResult(response)
    } catch (err) {
      setError(
        err.message ||
          'Unable to upload the document. Please check your connection.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-page">
      <PageHeader
        eyebrow="DOCUMENT MANAGEMENT"
        title="Upload Regulations"
        description="Add regulatory documents to your repository for search, version tracking, and compliance analysis."
      />

      <section className="upload-card">
        <div className="upload-card-heading">
          <div className="upload-card-icon">
            <Upload size={21} />
          </div>

          <div>
            <h2>Upload regulatory documents</h2>
            <p>Choose your file type and import method before uploading.</p>
          </div>
        </div>

        <div className="upload-filter">
          <label htmlFor="upload-file-type">Filter file type</label>

          <select
            id="upload-file-type"
            value={fileType}
            onChange={handleFileTypeChange}
            disabled={uploading}
          >
            <option value="all">All supported files</option>
            <option value="pdf">PDF documents (.pdf)</option>
            <option value="html">HTML documents (.html, .htm)</option>
            <option value="txt">Text documents (.txt)</option>
          </select>
        </div>

        <FileDropzone
          key={fileType}
          onFileSelect={handleFileSelect}
          disabled={uploading}
          accept={FILE_ACCEPT_TYPES[fileType]}
        />

        <SelectedFile
          file={selectedFile}
          onRemove={handleRemoveFile}
          disabled={uploading}
        />

        <div className="upload-mode">
          <div className="upload-mode-heading">
            <h3>Import mode <span>*</span></h3>
            <p>Choose how this upload should affect existing content.</p>
          </div>

          <div className="upload-mode-options">
            <label
              className={
                importMode === 'concatenate' ? 'selected' : ''
              }
            >
              <input
                type="radio"
                name="importMode"
                value="concatenate"
                checked={importMode === 'concatenate'}
                onChange={() => setImportMode('concatenate')}
                disabled={uploading}
              />

              <span className="upload-mode-icon">
                <GitMerge size={19} />
              </span>

              <span className="upload-mode-copy">
                <strong>Concatenate</strong>
                <small>
                  Append content to the existing collection.
                </small>
              </span>
            </label>

            <label
              className={importMode === 'override' ? 'selected' : ''}
            >
              <input
                type="radio"
                name="importMode"
                value="override"
                checked={importMode === 'override'}
                onChange={() => setImportMode('override')}
                disabled={uploading}
              />

              <span className="upload-mode-icon">
                <Replace size={19} />
              </span>

              <span className="upload-mode-copy">
                <strong>Override</strong>
                <small>
                  Replace the matching existing document or content.
                </small>
              </span>
            </label>
          </div>

          {importMode === 'override' && (
            <p className="upload-mode-warning">
              Confirm that the backend identifies the correct existing
              document before replacing its content.
            </p>
          )}
        </div>

        <UploadResult result={result} error={error} />

        <div className="upload-card-footer">
          <p>
            <FileText size={15} />
            PDF, HTML, HTM and TXT · Maximum 10 MB
          </p>

          <LoadingButton
            loading={uploading}
            disabled={!selectedFile || !importMode || uploading}
            onClick={handleUpload}
            className="primary-button"
          >
            <Upload size={17} />
            Upload document
          </LoadingButton>
        </div>
      </section>

      <div className="upload-security-note">
        <ShieldCheck size={21} />

        <div>
          <strong>Responsible document handling</strong>
          <p>
            Use the sample regulatory documents provided for the hackathon.
            Do not upload real client or confidential information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UploadDocuments
