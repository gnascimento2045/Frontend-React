import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading,
  disabled,
  icon,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner"></span>}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  )
}
