import './RegulatoryLibrary.css'
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  FileText,
  RefreshCw,
  Filter,
  CalendarDays,
  ExternalLink,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { apiRequest } from '../services/api'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getDocumentName(document) {
  return (
    document.document_name ??
    document.filename ??
    document.name ??
    document.title ??
    'Untitled document'
  )
}

function getDocumentType(document) {
  const type = document.document_type ?? document.file_type
  if (type) return String(type).replace('.', '').toUpperCase()

  const name = getDocumentName(document)
  const extension = name.split('.').pop()
  return extension && extension !== name
    ? extension.toUpperCase()
    : 'OTHER'
}

function normalizeStatus(value) {
  const status = String(value ?? 'UNKNOWN').toUpperCase()

  if (['COMPLETED', 'PROCESSED', 'SUCCESS', 'READY'].includes(status)) {
    return 'Processed'
  }

  if (['PROCESSING', 'PENDING', 'QUEUED', 'UPLOADING'].includes(status)) {
    return 'Processing'
  }

  if (['FAILED', 'ERROR', 'REJECTED'].includes(status)) {
    return 'Failed'
  }

  return 'Unknown'
}

export default function RegulatoryLibrary() {
  const [documents, setDocuments] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDocuments() {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/api/documents')
      const list = Array.isArray(data)
        ? data
        : data.documents ?? data.results ?? data.items ?? []

      setDocuments(list)
    } catch (err) {
      setError(
        err.message ||
          'Unable to load documents. Check that the backend is running and the endpoint is configured.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const name = getDocumentName(document).toLowerCase()
      const type = getDocumentType(document)
      const status = normalizeStatus(
        document.status ?? document.processing_status
      )

      const documentDate =
        document.uploaded_at ??
        document.upload_date ??
        document.created_at ??
        document.createdAt

      const matchesQuery = name.includes(query.trim().toLowerCase())
      const matchesType = !typeFilter || type === typeFilter
      const matchesStatus = !statusFilter || status === statusFilter

      let matchesDate = true

      if (dateFilter && documentDate) {
        const date = new Date(documentDate)
        matchesDate =
          !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === dateFilter
      } else if (dateFilter) {
        matchesDate = false
      }

      return (
        matchesQuery &&
        matchesType &&
        matchesStatus &&
        matchesDate
      )
    })
  }, [documents, query, typeFilter, statusFilter, dateFilter])

  return (
    <main className="library-page">
      <PageHeader
        eyebrow="DOCUMENT MANAGEMENT"
        title="Regulatory Library"
        description="Search, filter and track regulatory documents in your repository."
        action={
          <button
            type="button"
            className="library-refresh"
            onClick={loadDocuments}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <section className="library-summary">
        <div>
          <span>Total documents</span>
          <strong>{documents.length}</strong>
        </div>
        <div>
          <span>Processed</span>
          <strong>
            {documents.filter((document) =>
              ['Processed'].includes(
                normalizeStatus(
                  document.status ?? document.processing_status
                )
              )
            ).length}
          </strong>
        </div>
        <div>
          <span>Processing</span>
          <strong>
            {documents.filter((document) =>
              ['Processing'].includes(
                normalizeStatus(
                  document.status ?? document.processing_status
                )
              )
            ).length}
          </strong>
        </div>
      </section>

      <section className="library-panel">
        <div className="library-panel-heading">
          <div>
            <h2>All documents</h2>
            <p>Filter the repository to find a specific regulation.</p>
          </div>
          <Filter size={19} />
        </div>

        <div className="library-filters">
          <label className="library-search">
            <span>Search documents</span>
            <div>
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by filename..."
              />
            </div>
          </label>

          <label>
            <span>File type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="">All types</option>
              <option value="PDF">PDF</option>
              <option value="HTML">HTML</option>
              <option value="HTM">HTM</option>
              <option value="TXT">TXT</option>
            </select>
          </label>

          <label>
            <span>Processing status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="Processed">Processed</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
              <option value="Unknown">Unknown</option>
            </select>
          </label>

          <label>
            <span>Upload date</span>
            <div className="library-date">
              <CalendarDays size={16} />
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="library-table-meta">
          Showing {filteredDocuments.length} of {documents.length} documents
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setTypeFilter('')
              setStatusFilter('')
              setDateFilter('')
            }}
          >
            Clear filters
          </button>
        </div>

        {error && (
          <div className="library-error" role="alert">
            {error}
            <button type="button" onClick={loadDocuments}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="library-empty">Loading regulatory documents...</div>
        ) : !error && filteredDocuments.length === 0 ? (
          <div className="library-empty">
            <FileText size={30} />
            <h3>
              {documents.length
                ? 'No matching documents'
                : 'No documents available yet'}
            </h3>
            <p>
              {documents.length
                ? 'Try changing your filters.'
                : 'Upload a regulation to start building your repository.'}
            </p>
          </div>
        ) : !error ? (
          <div className="library-table-wrap">
            <table className="library-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document, index) => {
                  const name = getDocumentName(document)
                  const status = normalizeStatus(
                    document.status ?? document.processing_status
                  )
                  const date =
                    document.uploaded_at ??
                    document.upload_date ??
                    document.created_at ??
                    document.createdAt

                  return (
                    <tr key={document.id ?? document.document_id ?? `${name}-${index}`}>
                      <td>
                        <div className="library-document-name">
                          <FileText size={18} />
                          <span>{name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="library-type">
                          {getDocumentType(document)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`library-status library-status--${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>{formatDate(date)}</td>
                      <td>
                        {document.document_url ? (
                          <a
                            href={document.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${name}`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  )
}
