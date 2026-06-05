import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiUserCheck, FiShield, FiFileText, FiSettings, FiSearch,
} from 'react-icons/fi';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiGrid, roles: ['ADMIN', 'ADUANA', 'PDI', 'SAG'] },
  { path: '/panel-pdi', label: 'Panel PDI', icon: FiUserCheck, roles: ['ADMIN', 'PDI'] },
  { path: '/panel-sag', label: 'Panel SAG', icon: FiShield, roles: ['ADMIN', 'SAG'] },
  { path: '/reportes', label: 'Reportes', icon: FiFileText, roles: ['ADMIN', 'ADUANA'] },
  { path: '/admin', label: 'Admin Usuarios', icon: FiSettings, roles: ['ADMIN'] },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__logo">
        <img src="/logo-aduanas.svg" alt="Aduanas de Chile" className="sidebar__logo-img" />
        {!collapsed && <span className="sidebar__logo-text">SIGF</span>}
      </div>

      <nav className="sidebar__nav">
        {menuItems
          .filter((item) => hasRole(...item.roles))
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
      </nav>

      <Link
        to="/"
        className="sidebar__link sidebar__link--public"
      >
        <FiSearch size={20} />
        {!collapsed && <span>Volver al inicio</span>}
      </Link>
    </aside>
  );
}
