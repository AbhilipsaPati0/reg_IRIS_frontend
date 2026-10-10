
function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}

        <h1 className="page-title">{title}</h1>

        {description && (
          <p className="page-description">{description}</p>
        )}
      </div>

      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}

export default PageHeader
