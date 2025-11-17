import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../service/authService";
import "./index.less";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      authService.saveUser(response.user);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2>Bem-vindo de volta</h2>
          <p>Entre com suas credenciais</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className={isLoading ? "loading" : ""} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        <div className="login-footer">
          <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
        </div>
      </form>
    </div>
  );
}