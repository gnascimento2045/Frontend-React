import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import '../Login/Login.css'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register(formData)

    if (!result.success) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Criar Conta</h1>
          <p>Comece seu teste grátis hoje</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            type="text"
            name="name"
            label="Nome Completo"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            required
            icon="👤"
          />

          <Input
            type="text"
            name="companyName"
            label="Nome da Empresa"
            placeholder="Nome da sua empresa"
            value={formData.companyName}
            onChange={handleChange}
            required
            icon="🏢"
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon="📧"
          />

          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            icon="🔒"
          />

          <Button type="submit" loading={loading} size="large" style={{ width: '100%' }}>
            Criar Conta
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
