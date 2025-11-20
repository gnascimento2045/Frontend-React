import { useState, useEffect } from 'react'
import api from '../../services/api'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import '../Products/Products.css'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    creditLimit: 0,
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await api.get('/api/v1/customers')
      setCustomers(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingCustomer) {
        await api.put(`/api/v1/customers/${editingCustomer.id}`, formData)
        alert('Cliente atualizado com sucesso!')
      } else {
        await api.post('/api/v1/customers', formData)
        alert('Cliente criado com sucesso!')
      }

      setModalOpen(false)
      resetForm()
      loadCustomers()
    } catch (error) {
      alert('Erro ao salvar cliente: ' + error.response?.data?.message)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      document: customer.document || '',
      address: customer.address || '',
      creditLimit: customer.creditLimit || 0,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este cliente?')) return

    try {
      await api.delete(`/api/v1/customers/${id}`)
      alert('Cliente excluído com sucesso!')
      loadCustomers()
    } catch (error) {
      alert('Erro ao excluir cliente: ' + error.response?.data?.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      creditLimit: 0,
    })
    setEditingCustomer(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const columns = [
    { key: 'name', label: 'Nome', width: '25%' },
    { key: 'phone', label: 'Telefone', width: '15%' },
    { key: 'document', label: 'CPF/CNPJ', width: '15%' },
    {
      key: 'creditLimit',
      label: 'Limite Crédito',
      width: '15%',
      render: (row) => formatCurrency(row.creditLimit || 0),
    },
    {
      key: 'totalDebt',
      label: 'Dívida',
      width: '15%',
      render: (row) => (
        <span className={row.totalDebt > 0 ? 'text-danger' : ''}>
          {formatCurrency(row.totalDebt || 0)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '15%',
      render: (row) => (
        <div className="table-actions">
          <button className="btn-edit" onClick={() => handleEdit(row)}>
            ✏️
          </button>
          <button
            className="btn-delete"
            onClick={() => handleDelete(row.id)}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Clientes</h1>
        <Button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          icon="+"
        >
          Novo Cliente
        </Button>
      </div>

      <Table columns={columns} data={customers} loading={loading} />

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="product-form">
          <Input
            label="Nome Completo"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div className="form-grid">
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="(00) 00000-0000"
            />

            <Input
              label="CPF/CNPJ"
              value={formData.document}
              onChange={(e) =>
                setFormData({ ...formData, document: e.target.value })
              }
            />
          </div>

          <Input
            label="Endereço"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <Input
            type="number"
            label="Limite de Crédito (Fiado)"
            value={formData.creditLimit}
            onChange={(e) =>
              setFormData({
                ...formData,
                creditLimit: parseFloat(e.target.value),
              })
            }
            step="0.01"
          />

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setModalOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editingCustomer ? 'Atualizar' : 'Criar'} Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
