
import { LoaderCircle } from 'lucide-react'

function LoadingButton({
  children,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`loading-button ${className}`.trim()}
    >
      {loading ? (
        <>
          <LoaderCircle size={18} className="loading-spinner" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default LoadingButton
