
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Files,
  Search,
  GitCompare,
  ShieldCheck,
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Upload Regulations',
    path: '/upload',
    icon: Upload,
  },
  {
    label: 'Regulatory Library',
    path: '/library',
    icon: Files,
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
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={26} />
        </div>

        <div className="brand-details">
          <h2>Reg IRIS</h2>
          <span>REGULATORY INTELLIGENCE</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="nav-label">WORKSPACE</p>

        <nav className="navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="footer-indicator" />
        <span>Regulatory intelligence workspace</span>
      </div>
    </aside>
  );
}

export default Sidebar;
