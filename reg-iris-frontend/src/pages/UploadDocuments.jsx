
import { useState } from 'react'
import {
  Upload,
  ShieldCheck,
  FileText,
  Replace,
  FileCheck2,
  ChevronDown,
} from 'lucide-react'

import PageHeader from '../components/common/PageHeader'
import LoadingButton from '../components/common/LoadingButton'
import FileDropzone from '../components/documents/FileDropzone'
import SelectedFile from '../components/documents/SelectedFile'
import UploadResult from '../components/documents/UploadResult'

import { uploadDocument } from '../services/documentService'
import './UploadDocuments.css'

const ALLOWED_EXTENSIONS = ['pdf', 'html', 'htm', 'txt']
const MAX_FILE_SIZE = 10 * 1024 * 1024

const FILE_ACCEPT_TYPES = {
  all: '.pdf,.html,.htm,.txt',
  pdf: '.pdf',
  html: '.html,.htm',
  txt: '.txt',
}

const EXISTING_DOCUMENTS = [
  {
    id: 'demo-rbi-cross-border',
    name: 'RBI — Cross-Border Reporting (Demo)',
  },
  {
    id: 'demo-sebi-securities',
    name: 'SEBI — Securities Compliance (Demo)',
  },
  {
    id: 'demo-rbi-retention',
    name: 'RBI — Record Retention (Demo)',
  },
]

function UploadDocuments() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState('all')
  const [uploadFormat, setUploadFormat] = useState('all')
  const [importMode, setImportMode] = useState('')
  const [existingDocumentId, setExistingDocumentId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function fileMatchesType(file, type) {
    const extension = file.name.split('.').pop().toLowerCase()

    return (
      type === 'all' ||
      (type === 'pdf' && extension === 'pdf') ||
      (type === 'html' && ['html', 'htm'].includes(extension)) ||
      (type === 'txt' && extension === 'txt')
    )
  }

  function handleFileTypeChange(event) {
    const nextType = event.target.value

    setFileType(nextType)
    setUploadFormat(nextType)
    setError('')
    setResult(null)

    if (selectedFile && !fileMatchesType(selectedFile, nextType)) {
      setSelectedFile(null)
    }
  }

  function handleUploadFormatChange(event) {
    const nextFormat = event.target.value

    setUploadFormat(nextFormat)
    setFileType(nextFormat)
    setError('')
    setResult(null)

    if (selectedFile && !fileMatchesType(selectedFile, nextFormat)) {
      setSelectedFile(null)
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

    if (!fileMatchesType(file, fileType)) {
      setSelectedFile(null)
      setError(
        `Please select a file matching the ${fileType.toUpperCase()} filter.`,
      )
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

  function handleImportModeChange(mode) {
    setImportMode(mode)
    setExistingDocumentId('')
    setError('')
    setResult(null)
  }

  async function handleUpload() {
    if (!selectedFile || uploading) return

    if (!importMode) {
      setError('Please select New or Override before uploading.')
      return
    }

    if (importMode === 'override' && !existingDocumentId) {
      setError('Please select the existing regulation to replace.')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      // Existing service signature retained for compatibility.
      // The backend must separately support the selected target ID
      // before Override can safely replace a specific document.
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
            <p>
              Choose your file format and import method before uploading.
            </p>
          </div>
        </div>

        <div className="upload-filter-grid">
          <div className="upload-filter">
            <label htmlFor="upload-file-type">
              1. Filter file type
            </label>

            <div className="upload-select-wrap">
              <FileText size={17} />
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
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="upload-filter">
            <label htmlFor="upload-format">2. Upload format</label>

            <div className="upload-select-wrap">
              <FileCheck2 size={17} />
              <select
                id="upload-format"
                value={uploadFormat}
                onChange={handleUploadFormatChange}
                disabled={uploading}
              >
                <option value="all">All supported formats</option>
                <option value="pdf">PDF document</option>
                <option value="html">HTML document</option>
                <option value="txt">Text document</option>
              </select>
              <ChevronDown size={16} />
            </div>

            <p className="upload-filter-hint">
              Automatically follows the file type selected above.
            </p>
          </div>
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
            <h3>
              Import mode <span>*</span>
            </h3>
            <p>Choose how this upload should affect existing content.</p>
          </div>

          <div className="upload-mode-options">
            <label className={importMode === 'new' ? 'selected' : ''}>
              <input
                type="radio"
                name="importMode"
                value="new"
                checked={importMode === 'new'}
                onChange={() => handleImportModeChange('new')}
                disabled={uploading}
              />

              <span className="upload-mode-icon">
                <FileCheck2 size={19} />
              </span>

              <span className="upload-mode-copy">
                <strong>New</strong>
                <small>Add a new regulation to the library.</small>
              </span>
            </label>

            <label className={importMode === 'override' ? 'selected' : ''}>
              <input
                type="radio"
                name="importMode"
                value="override"
                checked={importMode === 'override'}
                onChange={() => handleImportModeChange('override')}
                disabled={uploading}
              />

              <span className="upload-mode-icon">
                <Replace size={19} />
              </span>

              <span className="upload-mode-copy">
                <strong>Override</strong>
                <small>
                  Replace a selected regulation with its updated version.
                </small>
              </span>
            </label>
          </div>

          {importMode === 'override' && (
            <div className="upload-filter override-document-select">
              <label htmlFor="existing-document">
                Select existing regulation to replace *
              </label>

              <div className="upload-select-wrap">
                <FileText size={17} />

                <select
                  id="existing-document"
                  value={existingDocumentId}
                  onChange={(event) => {
                    setExistingDocumentId(event.target.value)
                    setError('')
                    setResult(null)
                  }}
                  disabled={uploading}
                  required
                >
                  <option value="">Choose an existing regulation</option>

                  {EXISTING_DOCUMENTS.map((document) => (
                    <option key={document.id} value={document.id}>
                      {document.name}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>

              <p className="upload-filter-hint">
                Demo documents are shown here. Connect this list to your
                regulatory library API for actual documents.
              </p>

              {existingDocumentId && (
                <p className="upload-mode-warning">
                  Selected target:{' '}
                  {
                    EXISTING_DOCUMENTS.find(
                      (document) => document.id === existingDocumentId,
                    )?.name
                  }
                  . Confirm the target before replacing its content.
                </p>
              )}
            </div>
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
            disabled={
              !selectedFile ||
              !importMode ||
              (importMode === 'override' && !existingDocumentId) ||
              uploading
            }
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
