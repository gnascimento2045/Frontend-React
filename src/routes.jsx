import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout/Layout'

// Pages
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import PDV from './pages/PDV/PDV'
import Products from './pages/Products/Products'
import Customers from './pages/Customers/Customers'
import Sales from './pages/Sales/Sales'
import CashRegister from './pages/CashRegister/CashRegister'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pdv" element={<PDV />} />
              <Route path="produtos" element={<Products />} />
              <Route path="clientes" element={<Customers />} />
              <Route path="vendas" element={<Sales />} />
              <Route path="caixa" element={<CashRegister />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}