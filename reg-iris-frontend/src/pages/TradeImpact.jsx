import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Download,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
  FileSearch,
  ArrowUpDown,
  ClipboardCheck,
} from "lucide-react";
import { runImpactAnalysis } from "../services/impactService";
import "./TradeImpact.css";

const PAGE_SIZE = 8;

function normalizeStatus(value = "") {
  const status = String(value).toLowerCase().replace(/[\s-]+/g, "_");

  if (
    ["violation", "failed", "fail", "non_compliant", "noncompliant"].includes(
      status
    )
  ) {
    return "violation";
  }

  if (["compliant", "passed", "pass", "ok"].includes(status)) {
    return "compliant";
  }

  if (
    ["warning", "review", "needs_review", "pending_review"].includes(status)
  ) {
    return "review";
  }

  return "unknown";
}

function exportCsv(rows) {
  if (!rows.length) return;

  const columns = [
    ["Trade ID", "trade_id"],
    ["Rule ID", "rule_id"],
    ["Rule Name", "rule_name"],
    ["Status", "status"],
    ["Reason", "reason"],
    ["Explanation", "explanation"],
    ["Document", "document_name"],
    ["Page", "page"],
  ];

  const escapeCell = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [
    columns.map(([label]) => escapeCell(label)).join(","),
    ...rows.map((row) =>
      columns.map(([, key]) => escapeCell(row[key])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "reg-iris-impact-matrix.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function TradeImpact() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trade_id");
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);

  async function handleRunAnalysis() {
    setLoading(true);
    setError("");

    try {
      const data = await runImpactAnalysis({});
      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.results)
            ? data.results
            : [];

      setItems(results);
      setHasRun(true);
      setPage(1);
    } catch (err) {
      setItems([]);
      setError(
        "Analysis couldn't be completed. Check that the backend is running and the impact-analysis API endpoint is configured correctly."
      );
      console.error("Trade impact analysis failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    return items.filter((item) => {
      const searchable = [
        item.trade_id,
        item.rule_id,
        item.rule_name,
        item.status,
        item.reason,
        item.explanation,
        item.document_name,
        item.page,
      ]
        .map((value) => String(value ?? ""))
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(search);
      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(item.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = String(a[sortBy] ?? "").toLowerCase();
      const second = String(b[sortBy] ?? "").toLowerCase();

      return (
        first.localeCompare(second, undefined, { numeric: true }) *
        (ascending ? 1 : -1)
      );
    });
  }, [filteredItems, sortBy, ascending]);

  const pageCount = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const visibleItems = sortedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const violations = items.filter(
    (item) => normalizeStatus(item.status) === "violation"
  ).length;

  const compliant = items.filter(
    (item) => normalizeStatus(item.status) === "compliant"
  ).length;

  const review = items.filter(
    (item) => normalizeStatus(item.status) === "review"
  ).length;

  function changeSort(event) {
    const value = event.target.value;

    if (value === sortBy) {
      setAscending((current) => !current);
    } else {
      setSortBy(value);
      setAscending(true);
    }

    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPage(1);
  }

  return (
    <main className="trade-impact">
      <header className="trade-impact__header">
        <div>
          <p className="trade-impact__eyebrow">
            REG IRIS WORKSPACE / COMPLIANCE
          </p>
          <h1>Trade Impact Analysis</h1>
          <p className="trade-impact__subtitle">
            Evaluate trades against regulatory rules, identify potential
            compliance risks, and review supporting regulatory evidence.
          </p>
        </div>

        <button
          className="trade-impact__run"
          type="button"
          onClick={handleRunAnalysis}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="trade-impact__spin" size={17} />
          ) : (
            <Activity size={17} />
          )}
          {loading ? "Analyzing..." : hasRun ? "Run again" : "Run analysis"}
        </button>
      </header>

      <section className="trade-impact__stats" aria-label="Analysis summary">
        <article className="trade-impact__stat">
          <span className="trade-impact__stat-icon trade-impact__stat-icon--blue">
            <Activity size={20} />
          </span>
          <div>
            <p>Evaluated results</p>
            <strong>{hasRun ? items.length : "—"}</strong>
          </div>
        </article>

        <article className="trade-impact__stat">
          <span className="trade-impact__stat-icon trade-impact__stat-icon--red">
            <AlertTriangle size={20} />
          </span>
          <div>
            <p>Violations</p>
            <strong>{hasRun ? violations : "—"}</strong>
          </div>
        </article>

        <article className="trade-impact__stat">
          <span className="trade-impact__stat-icon trade-impact__stat-icon--green">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <p>Compliant</p>
            <strong>{hasRun ? compliant : "—"}</strong>
          </div>
        </article>

        <article className="trade-impact__stat">
          <span className="trade-impact__stat-icon trade-impact__stat-icon--amber">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p>Needs review</p>
            <strong>{hasRun ? review : "—"}</strong>
          </div>
        </article>
      </section>

      <section className="trade-impact__panel">
        <div className="trade-impact__panel-heading">
          <div>
            <h2>Impact Matrix</h2>
            <p>
              {hasRun
                ? `${items.length} evaluation result${items.length === 1 ? "" : "s"} returned`
                : "Trade-to-rule evaluation results will appear here"}
            </p>
          </div>

          <button
            className="trade-impact__export"
            type="button"
            onClick={() => exportCsv(sortedItems)}
            disabled={!sortedItems.length}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="trade-impact__toolbar">
          <label className="trade-impact__search">
            <Search size={17} />
            <input
              aria-label="Search impact results"
              placeholder="Search trade, rule, document, or reason..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            <option value="violation">Violation</option>
            <option value="compliant">Compliant</option>
            <option value="review">Needs review</option>
            <option value="unknown">Other</option>
          </select>

          <select
            aria-label="Sort results"
            value={sortBy}
            onChange={changeSort}
          >
            <option value="trade_id">Sort by trade</option>
            <option value="rule_id">Sort by rule</option>
            <option value="status">Sort by status</option>
          </select>

          <button
            className="trade-impact__export"
            type="button"
            onClick={() => setAscending((value) => !value)}
            title={`Switch to ${ascending ? "descending" : "ascending"} order`}
            aria-label={`Switch to ${ascending ? "descending" : "ascending"} order`}
          >
            <ArrowUpDown size={15} />
            {ascending ? "Ascending" : "Descending"}
          </button>
        </div>

        {error && (
          <div className="trade-impact__error" role="alert">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!hasRun && !loading && !error && (
          <div className="trade-impact__empty">
            <span className="trade-impact__stat-icon trade-impact__stat-icon--blue">
              <FileSearch size={25} />
            </span>
            <h3>Ready to analyze trades</h3>
            <p>
              Run an analysis to evaluate available trade data against
              regulatory rules. Results, compliance statuses, and source
              references will appear in the impact matrix.
            </p>
            <button
              className="trade-impact__run"
              type="button"
              onClick={handleRunAnalysis}
            >
              <Activity size={16} />
              Start analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="trade-impact__empty" role="status">
            <RefreshCw
              size={30}
              className="trade-impact__spin"
            />
            <h3>Analyzing trade impacts</h3>
            <p>
              Evaluating trades against the available regulatory rules.
              Please wait...
            </p>
          </div>
        )}

        {hasRun && !loading && !error && items.length === 0 && (
          <div className="trade-impact__empty">
            <ClipboardCheck size={32} />
            <h3>No evaluation results returned</h3>
            <p>
              The analysis request completed, but no results were returned.
              Check whether trade data and regulatory rules are available.
            </p>
            <button
              className="trade-impact__export"
              type="button"
              onClick={handleRunAnalysis}
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {hasRun && !loading && !error && items.length > 0 && (
          <>
            <div className="trade-impact__table-wrap">
              <table className="trade-impact__table">
                <thead>
                  <tr>
                    <th>Trade ID</th>
                    <th>Rule ID</th>
                    <th>Status</th>
                    <th>Explanation</th>
                    <th>Source citation</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleItems.map((item, index) => {
                    const status = normalizeStatus(item.status);

                    return (
                      <tr
                        key={`${item.trade_id ?? "trade"}-${item.rule_id ?? "rule"}-${index}`}
                      >
                        <td className="trade-impact__id">
                          {item.trade_id ?? "—"}
                        </td>

                        <td>
                          {item.rule_id ?? item.rule_name ?? "—"}
                        </td>

                        <td>
                          <span
                            className={`trade-impact__badge trade-impact__badge--${status}`}
                          >
                            {status.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td>
                          {item.reason ??
                            item.explanation ??
                            "No explanation provided"}
                        </td>

                        <td>
                          {item.document_name
                            ? `${item.document_name}${
                                item.page != null ? ` · p. ${item.page}` : ""
                              }`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}

                  {visibleItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="trade-impact__no-results">
                        <Search size={19} />
                        <p>No matching results found.</p>
                        <button
                          className="trade-impact__export"
                          type="button"
                          onClick={clearFilters}
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="trade-impact__pagination">
              <span>
                Showing{" "}
                {sortedItems.length === 0
                  ? 0
                  : (currentPage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(currentPage * PAGE_SIZE, sortedItems.length)}
                {" of "}
                {sortedItems.length} results
              </span>

              <div>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {pageCount}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}