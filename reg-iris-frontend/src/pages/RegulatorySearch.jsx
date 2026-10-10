
import { useState } from 'react'
import {
  Search,
  FileText,
  ExternalLink,
  LoaderCircle,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'
import { searchRegulations } from '../services/searchService'
import './RegulatorySearch.css'

const INITIAL_FILTERS = {
  regulator: '',
  documentType: '',
  effectiveDate: '',
}

function getDocumentName(item) {
  return (
    item.document_name ??
    item.document_title ??
    item.document ??
    item.title ??
    'Untitled document'
  )
}

function getClause(item) {
  return (
    item.clause_text ??
    item.text ??
    item.content ??
    item.snippet ??
    item.excerpt ??
    ''
  )
}

function getPage(item) {
  return item.page ?? item.page_number ?? item.pageNumber
}

function SourceCard({ item, regulatorFilter }) {
  const documentName = getDocumentName(item)
  const clause = getClause(item)
  const page = getPage(item)
  const regulator = item.regulator ?? regulatorFilter
  const score = item.score ?? item.relevance_score

  return (
    <article className="reg-search__result-card">
      <div className="reg-search__result-icon">
        <FileText size={21} />
      </div>

      <div className="reg-search__result-content">
        <div className="reg-search__source-heading">
          <h3>{documentName}</h3>
          {score != null && Number.isFinite(Number(score)) && (
            <span className="reg-search__relevance">
              Relevance: {Math.round(Number(score) * (Number(score) <= 1 ? 100 : 1))}%
            </span>
          )}
        </div>

        <p className="reg-search__clause">
          {clause || 'No excerpt was provided by the search API.'}
        </p>

        <div className="reg-search__citation">
          {regulator && <span>{regulator}</span>}
          {item.document_type && <span>{item.document_type}</span>}
          <span>{page != null ? `Page ${page}` : 'Page unavailable'}</span>
          {item.clause_number && <span>Clause {item.clause_number}</span>}
          {item.effective_date && (
            <span>Effective: {item.effective_date}</span>
          )}
        </div>

        {item.document_url && (
          <a
            className="reg-search__source-link"
            href={item.document_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open source <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}

export default function RegulatorySearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [results, setResults] = useState([])
  const [answer, setAnswer] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [total, setTotal] = useState(0)

  function updateFilter(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  async function handleSearch(event) {
    event.preventDefault()

    if (!query.trim()) {
      setError('Enter a regulatory question or keyword to search.')
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)
    setAnswer('')
    setResults([])
    setSearchedQuery(query.trim())

    try {
      const data = await searchRegulations({
        query: query.trim(),
        regulator: filters.regulator,
        documentType: filters.documentType,
        effectiveDate: filters.effectiveDate,
      })

      setResults(data.results)
      setAnswer(data.answer)
      setTotal(data.total)
    } catch (err) {
      setResults([])
      setAnswer('')
      setTotal(0)
      setError(
        err.message ||
          'Unable to search. Check that the backend is running and its search API is configured.'
      )
    } finally {
      setLoading(false)
    }
  }

  function resetSearch() {
    setQuery('')
    setFilters(INITIAL_FILTERS)
    setResults([])
    setAnswer('')
    setSearchedQuery('')
    setError('')
    setSearched(false)
    setTotal(0)
  }

  return (
    <main className="reg-search">
      <header className="reg-search__header">
        <div>
          <p className="reg-search__eyebrow">REG IRIS / INTELLIGENT SEARCH</p>
          <h1>Regulatory Intelligence Search</h1>
          <p className="reg-search__subtitle">
            Ask questions across your regulatory repository and trace answers
            back to their source documents.
          </p>
        </div>

        <div className="reg-search__document-count">
          <BookOpen size={18} />
          <span>RAG Search</span>
        </div>
      </header>

      <section className="reg-search__panel">
        <form onSubmit={handleSearch}>
          <label htmlFor="reg-query">What do you want to know?</label>

          <div className="reg-search__input-wrap">
            <Search size={20} />
            <input
              id="reg-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask a question or search a clause..."
              aria-describedby="reg-search-hint"
            />
          </div>

          <p id="reg-search-hint" className="reg-search__hint">
            Example: What reporting requirements apply to cross-border
            transactions?
          </p>

          <div className="reg-search__filter-heading">
            <SlidersHorizontal size={16} />
            <span>Refine your search</span>
          </div>

          <div className="reg-search__controls">
            <label className="reg-search__filter">
              <span>Regulator</span>
              <select
                name="regulator"
                value={filters.regulator}
                onChange={updateFilter}
              >
                <option value="">All regulators</option>
                <option value="RBI">RBI</option>
                <option value="SEBI">SEBI</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="reg-search__filter">
              <span>Document type</span>
              <select
                name="documentType"
                value={filters.documentType}
                onChange={updateFilter}
              >
                <option value="">All types</option>
                <option value="PDF">PDF</option>
                <option value="HTML">HTML</option>
                <option value="TXT">TXT</option>
              </select>
            </label>

            <label className="reg-search__filter">
              <span>Effective from</span>
              <input
                type="date"
                name="effectiveDate"
                value={filters.effectiveDate}
                onChange={updateFilter}
              />
            </label>
          </div>

          <div className="reg-search__actions">
            <button
              type="button"
              className="reg-search__reset"
              onClick={resetSearch}
              disabled={loading}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={17} className="reg-search__spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Search regulations
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="reg-search__results">
        <div className="reg-search__results-heading">
          <div>
            <h2>{searched ? 'Search response' : 'Explore regulations'}</h2>
            <p>
              {searched
                ? `Results for "${searchedQuery}"`
                : 'Answers and evidence from indexed regulatory documents'}
            </p>
          </div>

          {searched && !loading && !error && (
            <span className="reg-search__count">
              {total} source{total === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {error && (
          <div
            className="reg-search__message reg-search__message--error"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="reg-search__empty" role="status">
            <LoaderCircle size={30} className="reg-search__spin" />
            <h3>Searching regulatory sources</h3>
            <p>Retrieving relevant passages. This may take a moment.</p>
          </div>
        )}

        {!searched && !loading && (
          <div className="reg-search__empty">
            <div className="reg-search__empty-icon">
              <Sparkles size={28} />
            </div>
            <h3>Ask your regulatory question</h3>
            <p>
              Search for requirements, clauses and regulatory guidance.
              Retrieved sources will appear here when you search.
            </p>
          </div>
        )}

        {searched && !loading && !error && (
          <>
            {answer && (
              <article className="reg-search__answer">
                <div className="reg-search__answer-heading">
                  <Sparkles size={19} />
                  <h3>Answer from regulatory sources</h3>
                </div>
                <p>{answer}</p>
                <p className="reg-search__answer-note">
                  Verify the cited source before making a compliance decision.
                </p>
              </article>
            )}

            {results.length > 0 && (
              <div className="reg-search__source-list">
                <div className="reg-search__source-list-heading">
                  <h3>Supporting evidence</h3>
                  <span>{results.length} retrieved passages</span>
                </div>

                {results.map((item, index) => (
                  <SourceCard
                    key={
                      item.id ??
                      `${getDocumentName(item)}-${getPage(item)}-${index}`
                    }
                    item={item}
                    regulatorFilter={filters.regulator}
                  />
                ))}
              </div>
            )}

            {results.length === 0 && !answer && (
              <div className="reg-search__empty">
                <FileText size={30} />
                <h3>No matching sources found</h3>
                <p>
                  Try a different query or broaden your filters. If the
                  backend is not returning results, verify its search response.
                </p>
              </div>
            )}

            {answer && results.length === 0 && (
              <div className="reg-search__message">
                The API returned an answer without supporting source records.
                Confirm that the backend can return citations for verification.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
