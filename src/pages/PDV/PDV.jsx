import { useState, useEffect } from 'react'
import api from '../../services/api'
import Input from '../../components/Input/Input'
import { Select } from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import './PDV.css'

export default function PDV() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    method: 'money',
    amount: 0,
    receivedAmount: 0,
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
    }
  }

  const searchProduct = async (barcode) => {
    if (!barcode) return

    try {
      const response = await api.get(`/api/v1/products/barcode/${barcode}`)
      addToCart(response.data)
      setSearch('')
    } catch (error) {
      alert('Produto não encontrado')
    }
  }

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product.id)

    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.salePrice,
          quantity: 1,
          discount: 0,
        },
      ])
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const updateDiscount = (productId, discount) => {
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, discount } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const discountAmount = (itemTotal * item.discount) / 100
      return sum + (itemTotal - discountAmount)
    }, 0)
  }

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho')
      return
    }

    setPaymentData({
      ...paymentData,
      amount: calculateTotal(),
      receivedAmount: calculateTotal(),
    })
    setPaymentModal(true)
  }

  const handlePayment = async () => {
    try {
      const saleData = {
        customerId: customer?.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount,
        })),
        paymentMethod: paymentData.method,
        totalAmount: calculateTotal(),
      }

      await api.post('/api/v1/sales', saleData)

      alert('Venda realizada com sucesso!')
      setCart([])
      setCustomer(null)
      setPaymentModal(false)
      setPaymentData({ method: 'money', amount: 0, receivedAmount: 0 })
    } catch (error) {
      alert('Erro ao finalizar venda: ' + error.response?.data?.message)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getChange = () => {
    if (paymentData.method !== 'money') return 0
    return Math.max(0, paymentData.receivedAmount - paymentData.amount)
  }

  return (
    <div className="pdv">
      <div className="pdv-header">
        <h1>PDV - Ponto de Venda</h1>
      </div>

      <div className="pdv-content">
        <div className="pdv-main">
          <div className="pdv-search">
            <Input
              placeholder="Código de barras ou nome do produto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') searchProduct(search)
              }}
              icon="🔍"
            />
            <Button onClick={() => searchProduct(search)}>Buscar</Button>
          </div>

          <div className="pdv-cart">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Carrinho vazio</p>
                <span>Escaneie ou busque produtos para adicionar</span>
              </div>
            ) : (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Qtd</th>
                    <th>Desc %</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const subtotal =
                      item.price * item.quantity * (1 - item.discount / 100)
                    return (
                      <tr key={item.productId}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="qty-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) =>
                              updateDiscount(
                                item.productId,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="discount-input"
                          />
                        </td>
                        <td className="subtotal">{formatCurrency(subtotal)}</td>
                        <td>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="remove-btn"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="pdv-sidebar">
          <div className="pdv-customer">
            <h3>Cliente</h3>
            <Select
              value={customer?.id || ''}
              onChange={(e) => {
                const selected = customers.find(
                  (c) => c.id === parseInt(e.target.value)
                )
                setCustomer(selected)
              }}
            >
              <option value="">Selecione um cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="pdv-summary">
            <div className="summary-row">
              <span>Itens:</span>
              <strong>{cart.length}</strong>
            </div>
            <div className="summary-row">
              <span>Quantidade:</span>
              <strong>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </strong>
            </div>
            <div className="summary-row total">
              <span>TOTAL:</span>
              <strong>{formatCurrency(calculateTotal())}</strong>
            </div>
          </div>

          <div className="pdv-actions">
            <Button
              variant="danger"
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              Limpar
            </Button>
            <Button
              variant="success"
              size="large"
              onClick={handleFinalizeSale}
              disabled={cart.length === 0}
            >
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        title="Finalizar Pagamento"
        size="medium"
      >
        <div className="payment-form">
          <div className="payment-total">
            <h2>Total: {formatCurrency(paymentData.amount)}</h2>
          </div>

          <Select
            label="Forma de Pagamento"
            value={paymentData.method}
            onChange={(e) =>
              setPaymentData({ ...paymentData, method: e.target.value })
            }
          >
            <option value="money">Dinheiro</option>
            <option value="pix">Pix</option>
            <option value="debit">Débito</option>
            <option value="credit">Crédito</option>
            <option value="fiado">Fiado</option>
          </Select>

          {paymentData.method === 'money' && (
            <>
              <Input
                type="number"
                label="Valor Recebido"
                value={paymentData.receivedAmount}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    receivedAmount: parseFloat(e.target.value) || 0,
                  })
                }
                step="0.01"
              />
              <div className="change-info">
                <strong>Troco: {formatCurrency(getChange())}</strong>
              </div>
            </>
          )}

          <div className="payment-actions">
            <Button variant="secondary" onClick={() => setPaymentModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handlePayment}>
              Confirmar Pagamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
