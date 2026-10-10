import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  ChevronDown,
  FileText,
  GitCompare,
  LayoutDashboard,
  Leaf,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import './MainLayout.css'

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Upload Regulations',
    path: '/upload',
    icon: FileText,
  },
  {
    label: 'Regulatory Library',
    path: '/library',
    icon: BookOpen,
  },
  {
    label: 'Regulatory Search',
    path: '/search',
    icon: Search,
  },
  {
    label: 'Trade Impact Analysis',
    path: '/impact',
    icon: GitCompare,
  },
]

const pageNames = {
  '/': 'Dashboard',
  '/upload': 'Upload Regulations',
  '/library': 'Regulatory Library',
  '/search': 'Regulatory Search',
  '/impact': 'Trade Impact Analysis',
  '/404': 'Page Not Found',
}

function Sidebar({ mobileOpen, onNavigate }) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="layout-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onNavigate}
        />
      )}

      <aside
        className={`layout-sidebar ${mobileOpen ? 'layout-sidebar-open' : ''}`}
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className="layout-brand"
          onClick={onNavigate}
          aria-label="Reg IRIS home"
        >
          <span className="layout-brand-symbol">
            <Leaf size={23} strokeWidth={1.8} />
          </span>

          <span className="layout-brand-copy">
            <span className="layout-brand-name">Reg IRIS</span>
            <span className="layout-brand-caption">
              REGULATORY INTELLIGENCE
            </span>
          </span>

          <button
            type="button"
            className="layout-mobile-close"
            aria-label="Close menu"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onNavigate()
            }}
          >
            <X size={20} />
          </button>
        </NavLink>

        <div className="layout-sidebar-divider" />

        <div className="layout-nav-heading">WORKSPACE</div>

        <nav className="layout-navigation">
          {navigationItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `layout-nav-item ${isActive ? 'layout-nav-item-active' : ''}`
              }
            >
              <Icon
                size={19}
                strokeWidth={1.7}
                className="layout-nav-icon"
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="layout-sidebar-bottom">
          <div className="layout-sidebar-bottom-mark">
            <ShieldCheck size={17} />
            <span>Compliance workspace</span>
          </div>
          <p>Regulatory research, all in one place.</p>
          <span className="layout-sidebar-version">REG IRIS WORKSPACE</span>
        </div>
      </aside>
    </>
  )
}

function Topbar({ onMenuClick, pageTitle }) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="layout-topbar">
      <div className="layout-topbar-left">
        <button
          type="button"
          className="layout-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        <div className="layout-breadcrumb">
          <span className="layout-breadcrumb-root">Workspace</span>
          <span className="layout-breadcrumb-separator">/</span>
          <span className="layout-breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="layout-topbar-right">
        <div className="layout-topbar-context">
          <span className="layout-context-dot" />
          <span>Regulatory Intelligence</span>
        </div>

        <button
          type="button"
          className="layout-notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} strokeWidth={1.7} />
        </button>

        <div className="layout-profile-wrap">
          <button
            type="button"
            className={`layout-profile-button ${profileOpen ? 'layout-profile-open' : ''}`}
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-label="Toggle profile menu"
          >
            <span className="layout-profile-avatar">CO</span>
            <span className="layout-profile-copy">
              <span className="layout-profile-name">Compliance Officer</span>
              <span className="layout-profile-role">Regulatory Workspace</span>
            </span>
            <ChevronDown
              size={16}
              className={profileOpen ? 'layout-chevron-open' : ''}
            />
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                className="layout-profile-dismiss"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
              />

              <div className="layout-profile-dropdown">
                <span className="layout-dropdown-label">SIGNED IN AS</span>
                <strong>Compliance Officer</strong>
                <span className="layout-dropdown-description">
                  Reg IRIS workspace
                </span>

                <div className="layout-dropdown-divider" />

                <NavLink
                  to="/"
                  onClick={() => setProfileOpen(false)}
                  className="layout-dropdown-link"
                >
                  <LayoutDashboard size={16} />
                  Go to dashboard
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const pageTitle =
    pageNames[location.pathname] ||
    (location.pathname === '/404' ? 'Page Not Found' : 'Workspace')

  function closeMobileNavigation() {
    setMobileOpen(false)
  }

  return (
    <div className="layout-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onNavigate={closeMobileNavigation}
      />

      <div className="layout-main">
        <Topbar
          onMenuClick={() => setMobileOpen((open) => !open)}
          pageTitle={pageTitle}
        />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}