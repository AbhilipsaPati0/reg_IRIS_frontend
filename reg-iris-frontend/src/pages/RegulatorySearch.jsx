
import { useState } from "react";
import { Search, FileText, ExternalLink, LoaderCircle } from "lucide-react";
import { searchRegulations } from "../services/searchService";
import "./RegulatorySearch.css";

export default function RegulatorySearch() {
  const [query, setQuery] = useState("");
  const [regulator, setRegulator] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Enter a keyword or regulatory clause to search.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await searchRegulations({
        query: query.trim(),
        regulator,
      });

      setResults(data.results);
    } catch (err) {
      setResults([]);
      setError(
        "Unable to retrieve results. Check that the backend is running and the search API is configured."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="reg-search">
      <header className="reg-search__header">
        <div>
          <p className="reg-search__eyebrow">COMPLIANCE WORKSPACE</p>
          <h1>Regulatory Search</h1>
          <p className="reg-search__subtitle">
            Search regulatory documents and locate relevant clauses
            with document references.
          </p>
        </div>

        <div className="reg-search__document-count">
          <FileText size={18} />
          <span>Document Explorer</span>
        </div>
      </header>

      <section className="reg-search__panel">
        <form onSubmit={handleSearch}>
          <label htmlFor="reg-query">Search regulations</label>

          <div className="reg-search__controls">
            <div className="reg-search__input-wrap">
              <Search size={20} />
              <input
                id="reg-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try a keyword, clause, or requirement..."
              />
            </div>

            <select
              aria-label="Filter by regulator"
              value={regulator}
              onChange={(event) => setRegulator(event.target.value)}
            >
              <option value="">All regulators</option>
              <option value="RBI">RBI</option>
              <option value="SEBI">SEBI</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={17} className="reg-search__spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search size={17} />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="reg-search__results">
        <div className="reg-search__results-heading">
          <div>
            <h2>Search results</h2>
            <p>Relevant clauses from the regulatory repository</p>
          </div>

          {searched && !loading && !error && (
            <span className="reg-search__count">
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {error && (
          <div className="reg-search__message reg-search__message--error"
            role="alert">
            {error}
          </div>
        )}

        {!searched && !loading && (
          <div className="reg-search__empty">
            <Search size={30} />
            <h3>Find a regulatory clause</h3>
            <p>
              Enter a search term to explore available regulatory
              documents and their citations.
            </p>
          </div>
        )}

        {loading && (
          <div className="reg-search__empty" role="status">
            <LoaderCircle size={28} className="reg-search__spin" />
            <p>Searching the regulatory repository...</p>
          </div>
        )}

        {searched && !loading && !error && results.length === 0 && (
          <div className="reg-search__empty">
            <FileText size={30} />
            <h3>No results found</h3>
            <p>Try another keyword or remove the regulator filter.</p>
          </div>
        )}

        {!loading && !error && results.map((item, index) => {
          const documentName =
            item.document_name ?? item.document ?? item.title ?? "Untitled document";

          const page = item.page ?? item.page_number;

          const clause =
            item.clause ?? item.text ?? item.content ?? item.snippet ?? "";

          return (
            <article
              className="reg-search__result-card"
              key={item.id ?? `${documentName}-${page}-${index}`}
            >
              <div className="reg-search__result-icon">
                <FileText size={21} />
              </div>

              <div className="reg-search__result-content">
                <h3>{documentName}</h3>

                <p className="reg-search__clause">
                  {clause || "No clause text was provided by the API."}
                </p>

                <div className="reg-search__citation">
                  <span>
                    {item.regulator ?? regulator ?? "Regulatory source"}
                  </span>
                  <span>
                    {page != null ? `Page ${page}` : "Page unavailable"}
                  </span>
                  {item.effective_date && (
                    <span>Effective: {item.effective_date}</span>
                  )}
                </div>

                {item.document_url && (
                  <a
                    className="reg-search__source-link"
                    href={item.document_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open source <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
