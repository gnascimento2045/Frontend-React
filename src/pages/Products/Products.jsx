import { useState, useEffect } from 'react'
import api from '../../services/api'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import { Select } from '../../components/Input/Input'
import './Products.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    barcode: '',
    sku: '',
    unit: 'un',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/v1/products')
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        await api.put(`/api/v1/products/${editingProduct.id}`, formData)
        alert('Produto atualizado com sucesso!')
      } else {
        await api.post('/api/v1/products', formData)
        alert('Produto criado com sucesso!')
      }

      setModalOpen(false)
      resetForm()
      loadProducts()
    } catch (error) {
      alert('Erro ao salvar produto: ' + error.response?.data?.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      barcode: product.barcode || '',
      sku: product.sku,
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este produto?')) return

    try {
      await api.delete(`/api/v1/products/${id}`)
      alert('Produto excluído com sucesso!')
      loadProducts()
    } catch (error) {
      alert('Erro ao excluir produto: ' + error.response?.data?.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      barcode: '',
      sku: '',
      unit: 'un',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      minStock: 0,
      maxStock: 0,
    })
    setEditingProduct(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const columns = [
    { key: 'name', label: 'Nome', width: '25%' },
    { key: 'sku', label: 'SKU', width: '10%' },
    { key: 'barcode', label: 'Cód. Barras', width: '12%' },
    {
      key: 'stock',
      label: 'Estoque',
      width: '10%',
      render: (row) => (
        <span
          className={
            row.stock <= row.minStock ? 'stock-low' : 'stock-ok'
          }
        >
          {row.stock} {row.unit}
        </span>
      ),
    },
    {
      key: 'salePrice',
      label: 'Preço Venda',
      width: '12%',
      render: (row) => formatCurrency(row.salePrice),
    },
    {
      key: 'category',
      label: 'Categoria',
      width: '15%',
      render: (row) => row.category?.name || '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '16%',
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
        <h1>Produtos</h1>
        <Button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          icon="+"
        >
          Novo Produto
        </Button>
      </div>

      <Table columns={columns} data={products} loading={loading} />

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <Input
              label="Nome do Produto"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Select
              label="Categoria"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
            >
              <option value="">Selecione</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Input
              label="Código de Barras"
              value={formData.barcode}
              onChange={(e) =>
                setFormData({ ...formData, barcode: e.target.value })
              }
            />

            <Select
              label="Unidade"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            >
              <option value="un">Unidade</option>
              <option value="kg">Quilograma</option>
              <option value="g">Grama</option>
              <option value="l">Litro</option>
              <option value="ml">Mililitro</option>
              <option value="m">Metro</option>
              <option value="cx">Caixa</option>
              <option value="pct">Pacote</option>
            </Select>

            <Input
              type="number"
              label="Preço de Compra"
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchasePrice: parseFloat(e.target.value),
                })
              }
              step="0.01"
              required
            />

            <Input
              type="number"
              label="Preço de Venda"
              value={formData.salePrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salePrice: parseFloat(e.target.value),
                })
              }
              step="0.01"
              required
            />

            <Input
              type="number"
              label="Estoque Atual"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseFloat(e.target.value),
                })
              }
              step="0.01"
              required
            />

            <Input
              type="number"
              label="Estoque Mínimo"
              value={formData.minStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minStock: parseFloat(e.target.value),
                })
              }
              step="0.01"
            />

            <Input
              type="number"
              label="Estoque Máximo"
              value={formData.maxStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxStock: parseFloat(e.target.value),
                })
              }
              step="0.01"
            />
          </div>

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
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
