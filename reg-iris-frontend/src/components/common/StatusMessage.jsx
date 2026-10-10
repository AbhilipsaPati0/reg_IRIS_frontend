
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

const statusConfig = {
  success: {
    icon: CheckCircle2,
    title: 'Success',
  },
  error: {
    icon: AlertCircle,
    title: 'Something went wrong',
  },
  info: {
    icon: Info,
    title: 'Information',
  },
}

function StatusMessage({ type = 'info', title, message, children }) {
  const config = statusConfig[type] || statusConfig.info
  const Icon = config.icon

  return (
    <div
      className={`status-message status-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <Icon size={20} className="status-icon" />

      <div className="status-content">
        <strong>{title || config.title}</strong>

        {message && <p>{message}</p>}

        {children}
      </div>
    </div>
  )
}

export default StatusMessage
