// Configurações da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

// Prefixo das rotas da API
export const API_PREFIX = '/api/v1'

// Rotas da API (com prefixo)
export const API_ROUTES = {
  // Dashboard
  DASHBOARD: `${API_PREFIX}/dashboard`,

  // Produtos
  PRODUCTS: `${API_PREFIX}/products`,
  PRODUCTS_BY_BARCODE: (barcode) => `${API_PREFIX}/products/barcode/${barcode}`,
  PRODUCTS_LOW_STOCK: `${API_PREFIX}/products/low-stock`,
  PRODUCTS_EXPIRING: `${API_PREFIX}/products/expiring`,

  // Categorias
  CATEGORIES: `${API_PREFIX}/categories`,

  // Clientes
  CUSTOMERS: `${API_PREFIX}/customers`,
  CUSTOMERS_SALES: (id) => `${API_PREFIX}/customers/${id}/sales`,
  CUSTOMERS_CREDIT_SALES: (id) => `${API_PREFIX}/customers/${id}/credit-sales`,

  // Vendas
  SALES: `${API_PREFIX}/sales`,
  SALES_STATS: `${API_PREFIX}/sales/stats`,

  // Caixa
  CASH_REGISTERS: `${API_PREFIX}/cash-registers`,
  CASH_REGISTERS_CURRENT: `${API_PREFIX}/cash-registers/current`,
  CASH_REGISTERS_MOVEMENTS: (id) => `${API_PREFIX}/cash-registers/${id}/movements`,
  CASH_REGISTERS_CLOSE: (id) => `${API_PREFIX}/cash-registers/${id}/close`,
  CASH_REGISTERS_DEPOSIT: (id) => `${API_PREFIX}/cash-registers/${id}/deposit`,
  CASH_REGISTERS_WITHDRAWAL: (id) => `${API_PREFIX}/cash-registers/${id}/withdrawal`,
  CASH_REGISTERS_EXPENSE: (id) => `${API_PREFIX}/cash-registers/${id}/expense`,
}

// Rotas de autenticação (sem prefixo)
export const AUTH_ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ME: '/me',
}
