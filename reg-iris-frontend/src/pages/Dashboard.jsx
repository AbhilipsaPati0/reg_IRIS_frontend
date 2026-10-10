
import { FileText, Search, GitCompare, Bell } from 'lucide-react'

const quickActions = [
  {
    title: 'Upload Regulations',
    description: 'Add regulatory documents to your repository.',
    icon: FileText,
  },
  {
    title: 'Search Regulations',
    description: 'Find regulatory clauses with source citations.',
    icon: Search,
  },
  {
    title: 'Analyze Trades',
    description: 'Check trade data against JSON-based rules.',
    icon: GitCompare,
  },
  {
    title: 'View Alerts',
    description: 'Review regulatory updates and notifications.',
    icon: Bell,
  },
]

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">OVERVIEW</span>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="page-description">
            Monitor regulatory documents, discover updates, and investigate
            trade compliance issues.
          </p>
        </div>
      </div>

      <section className="dashboard-actions">
        {quickActions.map(({ title, description, icon: Icon }) => (
          <article className="quick-action-card" key={title}>
            <div className="quick-action-icon">
              <Icon size={22} />
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-empty-state">
        <FileText size={28} />
        <h2>Your compliance overview will appear here</h2>
        <p>
          Connect the backend to display real document counts, analysis
          results, regulatory changes, and alerts.
        </p>
      </section>
    </div>
  )
}

export default Dashboard
