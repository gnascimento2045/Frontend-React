import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../../service/dashboardService";
import "./index.less";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dashboardService.isAuthenticated()) {
      navigate("/");
      return;
    }
    
    setUser(dashboardService.getUser());
  }, [navigate]);

  function handleLogout() {
    dashboardService.logout();
    navigate("/");
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <span>Dashboard</span>
          </div>
          
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Bem-vindo, {user.name}! 👋</h1>
          <p>Esta é sua área de trabalho</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="card-content">
              <h3>Perfil</h3>
              <p>Gerencie suas informações</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="card-content">
              <h3>Configurações</h3>
              <p>Ajuste suas preferências</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="card-content">
              <h3>Atividades</h3>
              <p>Acompanhe seu progresso</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="card-content">
              <h3>Ajuda</h3>
              <p>Central de suporte</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}