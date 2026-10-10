
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import "./WhatsNew.css";

const INITIAL_UPDATES = [
  {
    id: 1,
    title: "Cross-border Transaction Reporting",
    regulator: "RBI",
    category: "Reporting Requirements",
    type: "Amended",
    severity: "High",
    publishedDate: "2026-10-08",
    effectiveDate: "2026-11-01",
    reference: "Sample document · Page 12",
    summary:
      "Review the reporting requirements applicable to cross-border transactions and identify processes that may need to be updated.",
    changes: [
      "Review the reporting data required for applicable transactions.",
      "Validate existing reporting workflows against the updated requirements.",
    ],
  },
  {
    id: 2,
    title: "Securities Compliance Review",
    regulator: "SEBI",
    category: "Compliance Controls",
    type: "New",
    severity: "Medium",
    publishedDate: "2026-10-06",
    effectiveDate: "2026-11-15",
    reference: "Sample document · Page 8",
    summary:
      "Review the latest compliance-control requirements and assess whether existing internal procedures need changes.",
    changes: [
      "Review current compliance-control documentation.",
      "Identify procedures that require compliance-team validation.",
    ],
  },
  {
    id: 3,
    title: "Regulatory Record Retention",
    regulator: "RBI",
    category: "Record Keeping",
    type: "Clarification",
    severity: "Low",
    publishedDate: "2026-10-03",
    effectiveDate: "2026-12-01",
    reference: "Sample document · Page 4",
    summary:
      "A sample clarification for reviewing record-retention practices and their alignment with the applicable regulatory text.",
    changes: [
      "Review record-retention policies and supporting documentation.",
      "Confirm the applicable retention requirements with the compliance team.",
    ],
  },
];

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const STATUS_CLASS = {
  New: "new",
  Amended: "amended",
  Clarification: "clarification",
};

function SummaryCard({ icon: Icon, label, value, description, tone }) {
  return (
    <article className="wn-summary-card">
      <div className={`wn-summary-icon ${tone}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="wn-summary-copy">
        <span className="wn-summary-label">{label}</span>
        <strong className="wn-summary-value">{value}</strong>
        <span className="wn-summary-description">{description}</span>
      </div>
    </article>
  );
}

function UpdateCard({ update, expanded, onToggle }) {
  return (
    <article className="wn-update-card">
      <div className="wn-card-main">
        <div className="wn-card-leading">
          <div className="wn-document-icon">
            <FileText size={21} strokeWidth={1.7} />
          </div>
        </div>

        <div className="wn-card-content">
          <div className="wn-card-badges">
            <span
              className={`wn-status-badge ${
                STATUS_CLASS[update.type] || "new"
              }`}
            >
              {update.type}
            </span>

            <span className={`wn-severity-badge ${update.severity.toLowerCase()}`}>
              <span className="wn-severity-dot" />
              {update.severity} priority
            </span>

            <span className="wn-regulator-badge">{update.regulator}</span>
          </div>

          <h3 className="wn-update-title">{update.title}</h3>
          <p className="wn-update-summary">{update.summary}</p>

          <div className="wn-update-meta">
            <span>
              <CalendarDays size={15} />
              Published {formatDate(update.publishedDate)}
            </span>

            <span>
              <Clock3 size={15} />
              Effective {formatDate(update.effectiveDate)}
            </span>
          </div>

          <div className="wn-reference">
            <FileText size={15} />
            <span>{update.reference}</span>
          </div>

          {expanded && (
            <div className="wn-change-details">
              <h4>Review checklist</h4>
              <ul>
                {update.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
              <p>
                <ShieldCheck size={15} />
                Validate these items against the original regulatory document
                before making compliance decisions.
              </p>
            </div>
          )}
        </div>

        <button
          className="wn-expand-button"
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide update details" : "View update details"}
        >
          {expanded ? <X size={17} /> : <ArrowRight size={18} />}
        </button>
      </div>

      <div className="wn-card-footer">
        <span className="wn-category">{update.category}</span>

        <button
          className="wn-details-link"
          type="button"
          onClick={onToggle}
        >
          {expanded ? "Hide details" : "Review changes"}
          <ChevronDown
            size={15}
            className={expanded ? "wn-chevron-open" : ""}
          />
        </button>
      </div>
    </article>
  );
}

export default function WhatsNew() {
  const [updates] = useState(INITIAL_UPDATES);
  const [query, setQuery] = useState("");
  const [regulator, setRegulator] = useState("All regulators");
  const [type, setType] = useState("All updates");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredUpdates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return updates
      .filter((update) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            update.title,
            update.summary,
            update.regulator,
            update.category,
            update.reference,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesRegulator =
          regulator === "All regulators" || update.regulator === regulator;

        const matchesType = type === "All updates" || update.type === type;

        return matchesQuery && matchesRegulator && matchesType;
      })
      .sort((a, b) =>
        sortOrder === "newest"
          ? b.publishedDate.localeCompare(a.publishedDate)
          : a.publishedDate.localeCompare(b.publishedDate)
      );
  }, [updates, query, regulator, type, sortOrder]);

  const newCount = updates.filter((item) => item.type === "New").length;
  const amendedCount = updates.filter(
    (item) => item.type === "Amended"
  ).length;

  const resetFilters = () => {
    setQuery("");
    setRegulator("All regulators");
    setType("All updates");
    setSortOrder("newest");
  };

  return (
    <main className="wn-page">
      <section className="wn-page-header">
        <div>
          <div className="wn-eyebrow">
            <Sparkles size={14} />
            REG IRIS / REGULATORY MONITORING
          </div>

          <h1>What's New</h1>

          <p>
            Stay informed about regulatory changes and identify updates
            that may require your attention.
          </p>
        </div>

        <div className="wn-header-badge">
          <span className="wn-live-dot" />
          Regulatory update feed
        </div>
      </section>

      <section className="wn-summary-grid" aria-label="Update summary">
        <SummaryCard
          icon={FileText}
          label="Total updates"
          value={updates.length}
          description="Updates in this demo feed"
          tone="blue"
        />

        <SummaryCard
          icon={Sparkles}
          label="New regulations"
          value={newCount}
          description="Marked as new"
          tone="purple"
        />

        <SummaryCard
          icon={TrendingUp}
          label="Amended documents"
          value={amendedCount}
          description="Marked as amended"
          tone="amber"
        />

        <SummaryCard
          icon={BellRing}
          label="Matching updates"
          value={filteredUpdates.length}
          description="Based on current filters"
          tone="green"
        />
      </section>

      <section className="wn-feed-section">
        <div className="wn-feed-heading">
          <div>
            <div className="wn-section-kicker">REGULATORY ACTIVITY</div>
            <h2>Recent updates</h2>
            <p>Review changes, publication dates and effective dates.</p>
          </div>

          <span className="wn-result-count">
            {filteredUpdates.length}{" "}
            {filteredUpdates.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="wn-toolbar">
          <label className="wn-search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search updates, regulators or topics..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search regulatory updates"
            />

            {query && (
              <button
                type="button"
                className="wn-clear-search"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <button
            type="button"
            className={`wn-filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((current) => !current)}
            aria-expanded={showFilters}
          >
            <Filter size={16} />
            Filters
          </button>

          <label className="wn-sort-control">
            <ArrowDownUp size={15} />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort updates"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="wn-filter-panel">
            <label>
              Regulator
              <select
                value={regulator}
                onChange={(event) => setRegulator(event.target.value)}
              >
                <option>All regulators</option>
                <option>RBI</option>
                <option>SEBI</option>
              </select>
            </label>

            <label>
              Update type
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option>All updates</option>
                <option>New</option>
                <option>Amended</option>
                <option>Clarification</option>
              </select>
            </label>

            <button
              className="wn-reset-button"
              type="button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        )}

        <div className="wn-update-list">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => (
              <UpdateCard
                key={update.id}
                update={update}
                expanded={expandedId === update.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === update.id ? null : update.id
                  )
                }
              />
            ))
          ) : (
            <div className="wn-empty-state">
              <div className="wn-empty-icon">
                <Search size={24} />
              </div>
              <h3>No matching updates</h3>
              <p>
                Try a different keyword or clear your selected filters.
              </p>
              <button type="button" onClick={resetFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="wn-demo-notice">
          <CheckCircle2 size={17} />
          <p>
            <strong>Demo data:</strong> These entries are illustrative
            placeholders, not verified regulatory notices. Connect the
            backend document feed before presenting them as actual updates.
          </p>
        </div>
      </section>
    </main>
  );
}
