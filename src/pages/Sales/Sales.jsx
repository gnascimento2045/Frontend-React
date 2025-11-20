import { useState, useEffect } from 'react'
import api from '../../services/api'
import Table from '../../components/Table/Table'
import '../Products/Products.css'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      const response = await api.get('/api/v1/sales')
      setSales(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const getPaymentLabel = (method) => {
    const labels = {
      money: 'Dinheiro',
      pix: 'Pix',
      debit: 'Débito',
      credit: 'Crédito',
      fiado: 'Fiado',
    }
    return labels[method] || method
  }

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: 'Concluída', class: 'badge-success' },
      pending: { label: 'Pendente', class: 'badge-warning' },
      cancelled: { label: 'Cancelada', class: 'badge-danger' },
    }
    const badge = badges[status] || { label: status, class: 'badge-default' }
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>
  }

  const columns = [
    {
      key: 'id',
      label: 'Nº',
      width: '8%',
      render: (row) => `#${row.id}`,
    },
    {
      key: 'createdAt',
      label: 'Data',
      width: '18%',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'customer',
      label: 'Cliente',
      width: '20%',
      render: (row) => row.customer?.name || 'Cliente não cadastrado',
    },
    {
      key: 'itemsCount',
      label: 'Itens',
      width: '8%',
      render: (row) => row.items?.length || 0,
    },
    {
      key: 'totalAmount',
      label: 'Total',
      width: '12%',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'paymentMethod',
      label: 'Pagamento',
      width: '12%',
      render: (row) => getPaymentLabel(row.paymentMethod),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '10%',
      render: (row) => (
        <div className="table-actions">
          <button className="btn-edit" title="Ver detalhes">
            👁️
          </button>
          {row.status !== 'cancelled' && (
            <button
              className="btn-delete"
              title="Cancelar"
              onClick={() => handleCancel(row.id)}
            >
              ❌
            </button>
          )}
        </div>
      ),
    },
  ]

  const handleCancel = async (id) => {
    if (!confirm('Deseja realmente cancelar esta venda?')) return

    try {
      await api.delete(`/api/v1/sales/${id}`)
      alert('Venda cancelada com sucesso!')
      loadSales()
    } catch (error) {
      alert('Erro ao cancelar venda: ' + error.response?.data?.message)
    }
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Vendas</h1>
      </div>

      <Table columns={columns} data={sales} loading={loading} />
    </div>
  )
}
