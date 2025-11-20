import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Sidebar.css'

export default function Sidebar({ isOpen }) {
  const { hasPermission, hasRole } = useAuth()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/pdv', label: 'PDV', icon: '🛒', permission: 'sales.create' },
    { path: '/produtos', label: 'Produtos', icon: '📦', permission: 'products.view' },
    { path: '/categorias', label: 'Categorias', icon: '🏷️', permission: 'products.view' },
    { path: '/clientes', label: 'Clientes', icon: '👥', permission: 'customers.view' },
    { path: '/fornecedores', label: 'Fornecedores', icon: '🏢', permission: 'suppliers.view' },
    { path: '/vendas', label: 'Vendas', icon: '💰', permission: 'sales.view' },
    { path: '/caixa', label: 'Caixa', icon: '💵', permission: 'cash.view' },
    { path: '/relatorios', label: 'Relatórios', icon: '📈', permission: 'reports.view' },
    { path: '/configuracoes', label: 'Configurações', icon: '⚙️', role: ['owner', 'admin'] },
  ]

  const visibleItems = menuItems.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) return false
    if (item.role && !hasRole(...item.role)) return false
    return true
  })

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
