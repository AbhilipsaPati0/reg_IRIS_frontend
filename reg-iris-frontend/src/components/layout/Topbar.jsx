
import { Bell, ChevronDown } from 'lucide-react'

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <span className="breadcrumb">Workspace / Reg IRIS</span>
        <h3>Regulatory Intelligence</h3>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="notification-button"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
          <span className="notification-dot" />
        </button>

        <div className="user-profile">
          <div className="user-avatar">CO</div>

          <div className="user-details">
            <span className="user-name">Compliance Officer</span>
            <span className="user-role">Regulatory Workspace</span>
          </div>

          <ChevronDown size={16} className="profile-chevron" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
