
import { useState } from 'react'
import { Upload, ShieldCheck } from 'lucide-react'

import PageHeader from '../components/common/PageHeader'
import LoadingButton from '../components/common/LoadingButton'
import FileDropzone from '../components/documents/FileDropzone'
import SelectedFile from '../components/documents/SelectedFile'
import UploadResult from '../components/documents/UploadResult'

import { uploadDocument } from '../services/documentService'

const ALLOWED_EXTENSIONS = ['pdf', 'html', 'htm', 'txt']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function UploadDocuments() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleFileSelect(file) {
    setError('')
    setResult(null)

    const extension = file.name.split('.').pop().toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setSelectedFile(null)
      setError('Please select a PDF, HTML, or TXT document.')
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

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const response = await uploadDocument(selectedFile)
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
            <h2>Upload a document</h2>
            <p>Select a regulatory document to get started.</p>
          </div>
        </div>

        <FileDropzone
          onFileSelect={handleFileSelect}
          disabled={uploading}
        />

        <SelectedFile
          file={selectedFile}
          onRemove={handleRemoveFile}
          disabled={uploading}
        />

        <UploadResult result={result} error={error} />

        <div className="upload-card-footer">
          <p>PDF, HTML and TXT · Maximum file size: 10 MB</p>

          <LoadingButton
            loading={uploading}
            disabled={!selectedFile}
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
