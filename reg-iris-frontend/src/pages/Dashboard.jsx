
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  BotMessageSquare,
  CheckCircle2,
  FileText,
  GitCompare,
  Leaf,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import './Dashboard.css'

const quickActions = [
  {
    title: 'Upload Regulations',
    description:
      'Add regulatory documents and prepare them for analysis.',
    detail: 'DOCUMENT MANAGEMENT',
    icon: FileText,
    path: '/upload',
    number: '01',
  },
  {
    title: 'Search Regulations',
    description:
      'Explore regulatory requirements and trace answers to their sources.',
    detail: 'INTELLIGENT SEARCH',
    icon: Search,
    path: '/search',
    number: '02',
  },
  {
    title: 'Trade Impact Analysis',
    description:
      'Evaluate trades against applicable rules and identify potential risks.',
    detail: 'COMPLIANCE ANALYSIS',
    icon: GitCompare,
    path: '/impact',
    number: '03',
  },
  {
    title: 'Regulatory Alerts',
    description:
      'Review regulatory changes and keep track of important updates.',
    detail: 'MONITORING',
    icon: Bell,
    path: '/alerts',
    number: '04',
  },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-brand-label">
            <span className="dashboard-brand-dot" />
            REG IRIS · REGULATORY INTELLIGENCE
          </div>

          <h1>
            Navigate regulations.
            <br />
            <span>Make informed decisions.</span>
          </h1>

          <p className="dashboard-hero-description">
            Your workspace for regulatory research, document intelligence,
            and trade compliance analysis.
          </p>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => navigate('/search')}
            >
              <Search size={18} />
              Explore regulations
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => navigate('/upload')}
            >
              <FileText size={17} />
              Upload a document
            </button>
          </div>

          <div className="dashboard-trust-note">
            <ShieldCheck size={17} />
            <span>
              Built for regulatory research and compliance workflows
            </span>
          </div>
        </div>

        <div className="dashboard-hero-art" aria-hidden="true">
          <div className="dashboard-orbit dashboard-orbit-one" />
          <div className="dashboard-orbit dashboard-orbit-two" />

          <div className="dashboard-emblem">
            <div className="dashboard-emblem-inner">
              <Leaf size={49} strokeWidth={1.5} />
            </div>
            <span className="dashboard-emblem-spark dashboard-spark-one" />
            <span className="dashboard-emblem-spark dashboard-spark-two" />
            <span className="dashboard-emblem-spark dashboard-spark-three" />
          </div>

          <div className="dashboard-floating-card dashboard-floating-top">
            <ShieldCheck size={19} />
            <div>
              <strong>Regulatory intelligence</strong>
              <span>Research · Evidence · Analysis</span>
            </div>
          </div>

          <div className="dashboard-floating-card dashboard-floating-bottom">
            <BookOpen size={19} />
            <div>
              <strong>Source-led research</strong>
              <span>Trace answers to documents</span>
            </div>
          </div>
        </div>

        <div className="dashboard-hero-decoration" />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-section-eyebrow">
              YOUR WORKSPACE
            </span>
            <h2>What would you like to do?</h2>
            <p>
              Access your key regulatory intelligence tools in one place.
            </p>
          </div>

          <span className="dashboard-tool-count">
            04 WORKSPACE TOOLS
          </span>
        </div>

        <div className="dashboard-action-grid">
          {quickActions.map(
            ({ title, description, detail, icon: Icon, path, number }) => (
              <button
                type="button"
                className="dashboard-action-card"
                key={title}
                onClick={() => navigate(path)}
              >
                <div className="dashboard-action-top">
                  <span className="dashboard-action-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <span className="dashboard-action-number">{number}</span>
                </div>

                <span className="dashboard-action-detail">{detail}</span>
                <h3>{title}</h3>
                <p>{description}</p>

                <span className="dashboard-action-link">
                  Open workspace
                  <ArrowUpRight size={17} />
                </span>
              </button>
            ),
          )}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-library-panel">
          <div className="dashboard-panel-icon">
            <BookOpen size={23} />
          </div>

          <div className="dashboard-panel-copy">
            <span className="dashboard-section-eyebrow">
              REGULATORY KNOWLEDGE
            </span>
            <h2>Your regulatory library</h2>
            <p>
              Browse your available documents and build a central place
              for regulatory research.
            </p>

            <button
              type="button"
              className="dashboard-text-link"
              onClick={() => navigate('/library')}
            >
              Browse document library
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="dashboard-panel-watermark" aria-hidden="true">
            <FileText size={96} strokeWidth={0.8} />
          </div>
        </article>

        <article className="dashboard-status-panel">
          <div className="dashboard-status-heading">
            <span className="dashboard-status-icon">
              <CheckCircle2 size={20} />
            </span>
            <span className="dashboard-section-eyebrow">
              WORKSPACE STATUS
            </span>
          </div>

          <h2>Ready for your next task</h2>
          <p>
            Start by uploading sample regulations or searching your
            available regulatory documents.
          </p>

          <div className="dashboard-status-divider" />

          <div className="dashboard-status-foot">
            <Sparkles size={16} />
            <span>
              Live document counts and analysis results will appear when
              the backend is connected.
            </span>
          </div>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>REG IRIS</span>
        <span>Regulatory intelligence workspace</span>
      </footer>

      {/* Floating AI Assistant button */}
      <button
        type="button"
        className="dashboard-ai-fab"
        onClick={() => navigate('/ai-assistant')}
        aria-label="Open Reg IRIS AI Assistant"
        title="Ask Reg IRIS AI"
      >
        <BotMessageSquare size={20} />
        <span>Ask Reg IRIS AI</span>
      </button>
    </div>
  )
}

export default Dashboard
