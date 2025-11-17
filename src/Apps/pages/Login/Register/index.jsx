import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../../service/authService";
import "./index.less";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-header">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2>Criar conta</h2>
          <p>Preencha seus dados para começar</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="input-group">
          <label htmlFor="name">Nome completo</label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
        </div>

        <button type="submit" className={isLoading ? "loading" : ""} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Criando conta...
            </>
          ) : (
            "Cadastrar"
          )}
        </button>

        <div className="register-footer">
          <p>Já tem uma conta? <a href="/">Entrar</a></p>
        </div>
      </form>
    </div>
  );
}