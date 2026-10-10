
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  GitCompare,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import './RegulatoryChangeAnalysis.css';

const CHANGE_RECORDS = {
  '1': {
    title: 'Cross-border Transaction Reporting',
    regulator: 'RBI',
    type: 'Amended',
    priority: 'High',
    publishedDate: '08 Oct 2026',
    effectiveDate: '01 Nov 2026',
    documentName: 'Sample regulatory document',
    previousPage: 'Page 10',
    currentPage: 'Page 12',
    previousVersion:
      'Illustrative previous clause: reporting information must be maintained according to the applicable reporting procedure.',
    currentVersion:
      'Illustrative current clause: reporting information must be maintained and reviewed against the updated reporting procedure.',
    changes: [
      {
        type: 'Modified',
        title: 'Reporting procedure',
        description:
          'The illustrative current wording adds a review requirement to the reporting procedure.',
      },
      {
        type: 'Review required',
        title: 'Operational workflow',
        description:
          'Check whether existing reporting workflows and internal controls need updating.',
      },
    ],
    impact:
      'Compliance teams should review the reporting workflow, identify potentially affected processes, and validate any required changes against the original regulatory text.',
  },
  '2': {
    title: 'Securities Compliance Review',
    regulator: 'SEBI',
    type: 'New',
    priority: 'Medium',
    publishedDate: '06 Oct 2026',
    effectiveDate: '15 Nov 2026',
    documentName: 'Sample regulatory document',
    previousPage: 'No previous version',
    currentPage: 'Page 8',
    previousVersion:
      'No previous version has been provided for this illustrative record.',
    currentVersion:
      'Illustrative placeholder: review the applicable compliance-control requirements in the newly added document.',
    changes: [
      {
        type: 'New document',
        title: 'Compliance controls',
        description:
          'Review the source document to identify the actual requirements and applicable clauses.',
      },
      {
        type: 'Review required',
        title: 'Control assessment',
        description:
          'Identify potentially affected internal controls after validating the source text.',
      },
    ],
    impact:
      'Review the original document, identify the responsible teams, and determine whether existing controls need to be assessed.',
  },
  '3': {
    title: 'Regulatory Record Retention',
    regulator: 'RBI',
    type: 'Clarification',
    priority: 'Low',
    publishedDate: '03 Oct 2026',
    effectiveDate: '01 Dec 2026',
    documentName: 'Sample regulatory document',
    previousPage: 'Not available',
    currentPage: 'Page 4',
    previousVersion:
      'Previous-version text has not yet been connected to this demonstration.',
    currentVersion:
      'Current-version text has not yet been connected to this demonstration.',
    changes: [
      {
        type: 'Comparison pending',
        title: 'Record-retention requirements',
        description:
          'Compare the previous and current source documents after both versions are available.',
      },
      {
        type: 'Review required',
        title: 'Retention practices',
        description:
          'Validate any identified changes against the original clauses and applicable page references.',
      },
    ],
    impact:
      'Do not infer a regulatory change until the previous and current document versions have been compared and verified.',
  },
};

function ChangeBadge({ type }) {
  const className = type.toLowerCase().replace(/\s+/g, '-');

  return <span className={`rca-change-badge ${className}`}>{type}</span>;
}

export default function RegulatoryChangeAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = CHANGE_RECORDS[id];

  if (!record) {
    return (
      <main className="rca-page">
        <button
          type="button"
          className="rca-back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <section className="rca-not-found">
          <FileText size={32} />
          <h1>Change analysis not found</h1>
          <p>
            This document ID does not exist in the current demonstration data.
          </p>
          <button type="button" onClick={() => navigate('/')}>
            Return to dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="rca-page">
      <button
        type="button"
        className="rca-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <header className="rca-header">
        <div>
          <div className="rca-eyebrow">
            <Sparkles size={14} />
            REG IRIS / CHANGE ANALYSIS
          </div>

          <h1>Regulatory Change Analysis</h1>

          <p>
            Review document versions, understand identified differences, and
            assess potential compliance impact.
          </p>
        </div>

        <span className={`rca-type-badge ${record.type.toLowerCase()}`}>
          {record.type}
        </span>
      </header>

      <section className="rca-document-card">
        <div className="rca-document-icon">
          <FileText size={25} />
        </div>

        <div className="rca-document-info">
          <div className="rca-document-meta">
            <span>{record.regulator}</span>
            <span>{record.documentName}</span>
            <span className={`rca-priority ${record.priority.toLowerCase()}`}>
              <span />
              {record.priority} priority
            </span>
          </div>

          <h2>{record.title}</h2>

          <div className="rca-dates">
            <span>
              <CalendarDays size={15} />
              Published: {record.publishedDate}
            </span>
            <span>
              <CalendarDays size={15} />
              Effective: {record.effectiveDate}
            </span>
          </div>
        </div>
      </section>

      <section className="rca-section">
        <div className="rca-section-header">
          <div className="rca-section-icon">
            <GitCompare size={19} />
          </div>
          <div>
            <h2>Version comparison</h2>
            <p>Compare the previous wording with the current wording.</p>
          </div>
        </div>

        <div className="rca-version-grid">
          <article className="rca-version-card previous">
            <div className="rca-version-heading">
              <div>
                <span className="rca-version-label">PREVIOUS VERSION</span>
                <h3>Original document</h3>
              </div>
              <span className="rca-version-page">{record.previousPage}</span>
            </div>

            <p className="rca-clause-text">{record.previousVersion}</p>

            <div className="rca-version-footer">
              <FileText size={15} />
              Previous source text
            </div>
          </article>

          <article className="rca-version-card current">
            <div className="rca-version-heading">
              <div>
                <span className="rca-version-label">CURRENT VERSION</span>
                <h3>Updated document</h3>
              </div>
              <span className="rca-version-page">{record.currentPage}</span>
            </div>

            <p className="rca-clause-text">{record.currentVersion}</p>

            <div className="rca-version-footer">
              <FileText size={15} />
              Current source text
            </div>
          </article>
        </div>

        <div className="rca-legend">
          <span><i className="rca-legend-dot added" /> Added or new</span>
          <span><i className="rca-legend-dot modified" /> Modified</span>
          <span><i className="rca-legend-dot removed" /> Removed</span>
        </div>
      </section>

      <section className="rca-section">
        <div className="rca-section-header">
          <div className="rca-section-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <h2>What changed?</h2>
            <p>Review the change findings and follow-up items.</p>
          </div>
        </div>

        <div className="rca-change-list">
          {record.changes.map((change, index) => (
            <article className="rca-change-item" key={`${id}-${index}`}>
              <div className="rca-change-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="rca-change-content">
                <div className="rca-change-item-heading">
                  <h3>{change.title}</h3>
                  <ChangeBadge type={change.type} />
                </div>
                <p>{change.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rca-impact-card">
        <div className="rca-impact-heading">
          <div className="rca-impact-icon">
            <ShieldCheck size={21} />
          </div>
          <div>
            <h2>Potential compliance impact</h2>
            <p>Assessment for compliance review</p>
          </div>
        </div>

        <p>{record.impact}</p>

        <div className="rca-impact-notice">
          <AlertTriangle size={17} />
          <span>
            Demo content: verify all findings, clause wording, page references,
            and effective dates against the original documents before taking
            compliance action.
          </span>
        </div>
      </section>

      <footer className="rca-footer">
        <span>
          <FileText size={15} />
          Source: {record.documentName} · {record.currentPage}
        </span>

        <button
          type="button"
          className="rca-footer-button"
          onClick={() => navigate('/search')}
        >
          Go to regulatory search
          <ArrowRight size={16} />
        </button>
      </footer>
    </main>
  );
}
