import './Input.css'

export default function Input({ label, error, icon, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`} {...props} />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  )
}

export function Select({ label, error, children, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select className={`input ${error ? 'input-error' : ''}`} {...props}>
        {children}
      </select>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  )
}

export function Textarea({ label, error, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className={`input textarea ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  )
}
