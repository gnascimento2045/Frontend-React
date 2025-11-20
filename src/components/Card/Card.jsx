import './Card.css'

export default function Card({ title, value, icon, trend, trendValue, color = 'blue', onClick }) {
  return (
    <div className={`card card-${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <p className="card-value">{value}</p>
        </div>
      </div>
      {(trend || trendValue) && (
        <div className={`card-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
