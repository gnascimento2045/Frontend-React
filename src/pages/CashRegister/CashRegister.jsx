import { useState, useEffect } from 'react'
import api from '../../services/api'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import { Select } from '../../components/Input/Input'
import './CashRegister.css'

export default function CashRegister() {
  const [cashRegister, setCashRegister] = useState(null)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [movementModal, setMovementModal] = useState(false)
  const [movementType, setMovementType] = useState('deposit')
  const [movementData, setMovementData] = useState({
    amount: 0,
    description: '',
  })

  useEffect(() => {
    loadCashRegister()
  }, [])

  const loadCashRegister = async () => {
    try {
      const response = await api.get('/api/v1/cash-registers/current')
      if (response.data) {
        setCashRegister(response.data)
        loadMovements(response.data.id)
      }
    } catch (error) {
      console.error('Erro ao carregar caixa:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMovements = async (cashRegisterId) => {
    try {
      const response = await api.get(`/api/v1/cash-registers/${cashRegisterId}/movements`)
      setMovements(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error)
    }
  }

  const handleOpen = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const initialBalance = parseFloat(formData.get('initialBalance'))

    try {
      await api.post('/api/v1/cash-registers', { initialBalance })
      alert('Caixa aberto com sucesso!')
      setOpenModal(false)
      loadCashRegister()
    } catch (error) {
      alert('Erro ao abrir caixa: ' + error.response?.data?.message)
    }
  }

  const handleClose = async () => {
    if (!confirm('Deseja realmente fechar o caixa?')) return

    try {
      await api.post(`/api/v1/cash-registers/${cashRegister.id}/close`)
      alert('Caixa fechado com sucesso!')
      setCashRegister(null)
      setMovements([])
    } catch (error) {
      alert('Erro ao fechar caixa: ' + error.response?.data?.message)
    }
  }

  const handleMovement = async () => {
    try {
      const endpoint = `/api/v1/cash-registers/${cashRegister.id}/${movementType}`
      await api.post(endpoint, movementData)
      alert('Movimentação registrada com sucesso!')
      setMovementModal(false)
      setMovementData({ amount: 0, description: '' })
      loadCashRegister()
    } catch (error) {
      alert('Erro ao registrar movimentação: ' + error.response?.data?.message)
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

  const getMovementLabel = (type) => {
    const labels = {
      sale: 'Venda',
      deposit: 'Suprimento',
      withdrawal: 'Sangria',
      expense: 'Despesa',
    }
    return labels[type] || type
  }

  const calculateBalance = () => {
    if (!cashRegister) return 0
    const movementsTotal = movements.reduce((sum, mov) => {
      if (mov.type === 'sale' || mov.type === 'deposit') {
        return sum + mov.amount
      } else {
        return sum - mov.amount
      }
    }, 0)
    return cashRegister.initialBalance + movementsTotal
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  if (!cashRegister) {
    return (
      <div className="cash-register-empty">
        <div className="empty-state">
          <h1>Nenhum caixa aberto</h1>
          <p>Abra um caixa para começar a registrar vendas e movimentações</p>
          <Button size="large" onClick={() => setOpenModal(true)}>
            Abrir Caixa
          </Button>
        </div>

        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Abrir Caixa"
          size="small"
        >
          <form onSubmit={handleOpen} className="cash-form">
            <Input
              type="number"
              name="initialBalance"
              label="Saldo Inicial"
              step="0.01"
              required
              defaultValue={0}
            />
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="success">
                Abrir Caixa
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    )
  }

  return (
    <div className="cash-register">
      <div className="cash-header">
        <div>
          <h1>Caixa Aberto</h1>
          <p>Aberto em: {formatDate(cashRegister.openedAt)}</p>
        </div>
        <Button variant="danger" onClick={handleClose}>
          Fechar Caixa
        </Button>
      </div>

      <div className="cash-cards">
        <div className="cash-card">
          <span className="card-label">Saldo Inicial</span>
          <span className="card-value">{formatCurrency(cashRegister.initialBalance)}</span>
        </div>
        <div className="cash-card">
          <span className="card-label">Vendas</span>
          <span className="card-value text-success">
            {formatCurrency(
              movements
                .filter((m) => m.type === 'sale')
                .reduce((sum, m) => sum + m.amount, 0)
            )}
          </span>
        </div>
        <div className="cash-card">
          <span className="card-label">Despesas</span>
          <span className="card-value text-danger">
            {formatCurrency(
              movements
                .filter((m) => m.type === 'expense')
                .reduce((sum, m) => sum + m.amount, 0)
            )}
          </span>
        </div>
        <div className="cash-card highlight">
          <span className="card-label">Saldo Atual</span>
          <span className="card-value">{formatCurrency(calculateBalance())}</span>
        </div>
      </div>

      <div className="cash-actions-row">
        <Button
          onClick={() => {
            setMovementType('deposit')
            setMovementModal(true)
          }}
        >
          Suprimento
        </Button>
        <Button
          variant="warning"
          onClick={() => {
            setMovementType('withdrawal')
            setMovementModal(true)
          }}
        >
          Sangria
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setMovementType('expense')
            setMovementModal(true)
          }}
        >
          Despesa
        </Button>
      </div>

      <div className="cash-movements">
        <h2>Movimentações</h2>
        <table className="movements-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{formatDate(movement.createdAt)}</td>
                <td>{getMovementLabel(movement.type)}</td>
                <td>{movement.description || '-'}</td>
                <td
                  className={
                    movement.type === 'sale' || movement.type === 'deposit'
                      ? 'text-success'
                      : 'text-danger'
                  }
                >
                  {movement.type === 'sale' || movement.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(movement.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={movementModal}
        onClose={() => setMovementModal(false)}
        title={
          movementType === 'deposit'
            ? 'Suprimento'
            : movementType === 'withdrawal'
            ? 'Sangria'
            : 'Despesa'
        }
        size="small"
      >
        <div className="cash-form">
          <Input
            type="number"
            label="Valor"
            value={movementData.amount}
            onChange={(e) =>
              setMovementData({
                ...movementData,
                amount: parseFloat(e.target.value),
              })
            }
            step="0.01"
            required
          />
          <Input
            label="Descrição"
            value={movementData.description}
            onChange={(e) =>
              setMovementData({
                ...movementData,
                description: e.target.value,
              })
            }
            required
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setMovementModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleMovement}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
