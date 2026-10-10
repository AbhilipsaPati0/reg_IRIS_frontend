
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
} from "lucide-react";
import { runImpactAnalysis } from "../services/impactService";
import "./TradeImpact.css";

const PAGE_SIZE = 8;

function normalizeStatus(value = "") {
  const status = String(value).toLowerCase();

  if (["violation", "failed", "fail", "non_compliant"].includes(status)) {
    return "violation";
  }
  if (["compliant", "passed", "pass", "ok"].includes(status)) {
    return "compliant";
  }
  if (["warning", "review", "needs_review"].includes(status)) {
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
  link.click();
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
      setItems(data.items);
      setHasRun(true);
      setPage(1);
    } catch {
      setItems([]);
      setError(
        "Analysis failed. Check that the backend is running and its API endpoint matches the frontend configuration."
      );
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
        item.reason,
        item.explanation,
        item.document_name,
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

      return first.localeCompare(second, undefined, { numeric: true }) *
        (ascending ? 1 : -1);
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

  return (
    <main className="trade-impact">
      <header className="trade-impact__header">
        <div>
          <p className="trade-impact__eyebrow">COMPLIANCE WORKSPACE</p>
          <h1>Trade Impact Analysis</h1>
          <p className="trade-impact__subtitle">
            Evaluate trades against regulatory rules and inspect potential
            compliance impacts.
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
          {loading ? "Analyzing..." : "Run analysis"}
        </button>
      </header>

      <section className="trade-impact__stats">
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
            <p>Trade-to-rule evaluation results</p>
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
              placeholder="Search trade, rule, or reason..."
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
        </div>

        {error && (
          <div className="trade-impact__error" role="alert">
            <XCircle size={18} />
            {error}
          </div>
        )}

        {!hasRun && !loading && !error && (
          <div className="trade-impact__empty">
            <Activity size={32} />
            <h3>Ready to analyze trades</h3>
            <p>
              Run the analysis to view trade-to-rule impacts returned by
              the backend.
            </p>
          </div>
        )}

        {loading && (
          <div className="trade-impact__empty" role="status">
            <RefreshCw size={28} className="trade-impact__spin" />
            <p>Evaluating trades against available rules...</p>
          </div>
        )}

        {hasRun && !loading && !error && (
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
                        key={`${item.trade_id}-${item.rule_id}-${index}`}
                      >
                        <td className="trade-impact__id">
                          {item.trade_id ?? "—"}
                        </td>
                        <td>{item.rule_id ?? item.rule_name ?? "—"}</td>
                        <td>
                          <span
                            className={`trade-impact__badge trade-impact__badge--${status}`}
                          >
                            {status.replace("_", " ")}
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
                      <td colSpan="5" className="trade-impact__no-results">
                        No matching results.
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
