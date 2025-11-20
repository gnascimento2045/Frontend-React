import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import './Navbar.css'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1 className="navbar-title">Sistema SaaS</h1>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon" onClick={toggleTheme} title="Alternar tema">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="navbar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>

        <button className="navbar-logout" onClick={logout}>
          Sair
        </button>
      </div>
    </nav>
  )
}
