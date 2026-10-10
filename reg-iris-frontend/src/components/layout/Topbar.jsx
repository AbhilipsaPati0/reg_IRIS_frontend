
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  Clock3,
  CheckCheck,
} from 'lucide-react';
import './Topbar.css';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Cross-border Transaction Reporting',
    regulator: 'RBI',
    type: 'Amended',
    priority: 'High',
    date: '08 Oct 2026',
    description:
      'Review reporting requirements and identify workflows that may need updating.',
  },
  {
    id: 2,
    title: 'Securities Compliance Review',
    regulator: 'SEBI',
    type: 'New',
    priority: 'Medium',
    date: '06 Oct 2026',
    description:
      'Review applicable compliance controls and internal procedures.',
  },
  {
    id: 3,
    title: 'Regulatory Record Retention',
    regulator: 'RBI',
    type: 'Clarification',
    priority: 'Low',
    date: '03 Oct 2026',
    description:
      'Review record-retention practices against applicable requirements.',
  },
];

function Topbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const notificationRef = useRef(null);

  const unreadCount = DEMO_NOTIFICATIONS.filter(
    (item) => !readNotifications.includes(item.id)
  ).length;

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function openAnalysis(id) {
    setIsOpen(false);
    navigate(`/regulatory-change/${id}`);
  }

  function markAsRead(id) {
    setReadNotifications((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  function markAllAsRead() {
    setReadNotifications(DEMO_NOTIFICATIONS.map((item) => item.id));
  }

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <span className="breadcrumb">Workspace / Reg IRIS</span>
        <h3>Regulatory Intelligence</h3>
      </div>

      <div className="topbar-actions">
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className={`notification-button ${
              isOpen ? 'notification-button-open' : ''
            }`}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            title="Regulatory notifications"
            onClick={() => setIsOpen((current) => !current)}
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          {isOpen && (
            <section
              className="notification-panel"
              role="dialog"
              aria-label="Regulatory notifications"
            >
              <div className="notification-panel-header">
                <div>
                  <h2>Regulatory Updates</h2>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread updates`
                      : 'You are all caught up'}
                  </p>
                </div>

                <button
                  type="button"
                  className="notification-icon-button"
                  aria-label="Close notifications"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="notification-panel-toolbar">
                <span className="notification-feed-label">
                  <span className="notification-feed-dot" />
                  REGULATORY CHANGE FEED
                </span>

                <button
                  type="button"
                  className="notification-mark-read"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={15} />
                  Mark all read
                </button>
              </div>

              <div className="notification-list">
                {DEMO_NOTIFICATIONS.map((notification) => {
                  const isRead = readNotifications.includes(notification.id);

                  return (
                    <article
                      key={notification.id}
                      className={`notification-item ${
                        isRead ? 'notification-item-read' : ''
                      }`}
                    >
                      <div className="notification-item-icon">
                        <FileText size={19} />
                      </div>

                      <div className="notification-item-content">
                        <div className="notification-item-topline">
                          <span
                            className={`notification-type notification-type-${notification.type.toLowerCase()}`}
                          >
                            {notification.type}
                          </span>

                          <span
                            className={`notification-priority notification-priority-${notification.priority.toLowerCase()}`}
                          >
                            {notification.priority}
                          </span>

                          {!isRead && (
                            <span className="notification-unread-indicator" />
                          )}
                        </div>

                        <button
                          type="button"
                          className="notification-document-title"
                          onClick={() => openAnalysis(notification.id)}
                        >
                          <span>{notification.title}</span>
                          <ChevronRight size={16} />
                        </button>

                        <p className="notification-description">
                          {notification.description}
                        </p>

                        <div className="notification-metadata">
                          <span className="notification-regulator">
                            {notification.regulator}
                          </span>

                          <span>
                            <Clock3 size={13} />
                            {notification.date}
                          </span>
                        </div>

                        <div className="notification-item-actions">
                          <button
                            type="button"
                            className="notification-read-action"
                            disabled={isRead}
                            onClick={() => markAsRead(notification.id)}
                          >
                            {isRead ? 'Read' : 'Mark as read'}
                          </button>

                          <button
                            type="button"
                            className="notification-review-action"
                            onClick={() => openAnalysis(notification.id)}
                          >
                            Compare versions
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="notification-panel-footer">
                <p>
                  Demo data only. Verify changes against original regulatory
                  documents.
                </p>
              </div>
            </section>
          )}
        </div>

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
  );
}

export default Topbar;
