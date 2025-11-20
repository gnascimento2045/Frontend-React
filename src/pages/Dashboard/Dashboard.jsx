import { useEffect, useState } from 'react'
import Card from '../../components/Card/Card'
import api from '../../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayRevenue: 0,
    lowStockCount: 0,
    openCashRegisters: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [salesRes, productsRes, cashRes] = await Promise.all([
        api.get('/api/v1/sales/stats'),
        api.get('/api/v1/products/low-stock'),
        api.get('/api/v1/cash-registers/current'),
      ])

      setStats({
        todaySales: salesRes.data.today?.count || 0,
        todayRevenue: salesRes.data.today?.total || 0,
        lowStockCount: productsRes.data.data?.length || 0,
        openCashRegisters: cashRes.data ? 1 : 0,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo de volta! Aqui está um resumo do seu negócio hoje.</p>
      </div>

      <div className="dashboard-cards">
        <Card
          title="Vendas Hoje"
          value={stats.todaySales}
          icon="🛒"
          color="blue"
        />
        <Card
          title="Faturamento Hoje"
          value={formatCurrency(stats.todayRevenue)}
          icon="💰"
          color="green"
        />
        <Card
          title="Produtos em Baixa"
          value={stats.lowStockCount}
          icon="📦"
          color="yellow"
        />
        <Card
          title="Caixas Abertos"
          value={stats.openCashRegisters}
          icon="💵"
          color="purple"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Vendas Recentes</h2>
          <p className="coming-soon">Em breve...</p>
        </div>

        <div className="dashboard-section">
          <h2>Produtos Mais Vendidos</h2>
          <p className="coming-soon">Em breve...</p>
        </div>
      </div>
    </div>
  )
}
