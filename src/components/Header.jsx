import { FiMenu, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const rolLabel = { ADMIN: 'Administrador', ADUANA: 'Aduana', PDI: 'PDI', SAG: 'SAG' };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar}>
          <FiMenu size={22} />
        </button>
        <div className="header__brand">
          <img src="/logo-aduanas.svg" alt="Aduanas de Chile" className="header__brand-logo" />
          <span className="header__brand-name">Sistema Integrado de Gestion Fronteriza</span>
        </div>
      </div>

      <div className="header__right" ref={ref}>
        <div className="header__user" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="header__avatar">
            <FiUser size={18} />
          </div>
          <div className="header__user-info">
            <span className="header__user-name">{user?.nombre}</span>
            <span className="header__user-rol">{rolLabel[user?.rol] || user?.rol}</span>
          </div>
          <FiChevronDown size={16} className={`header__chevron ${menuOpen ? 'header__chevron--open' : ''}`} />
        </div>

        {menuOpen && (
          <div className="header__dropdown">
            <button onClick={handleLogout} className="header__dropdown-item">
              <FiLogOut size={16} />
              <span>Cerrar sesion</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
