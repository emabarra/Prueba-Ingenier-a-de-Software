import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-back">
          <FiArrowLeft size={16} /> Volver al inicio
        </Link>
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo-aduanas.svg" alt="Aduanas de Chile" className="login-logo-img" />
          </div>
          <h1>Aduanas de Chile</h1>
          <p className="login-subtitle">Acceso exclusivo para funcionarios</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <AlertMessage type="error" message={error} onClose={() => setError('')} />

          <div className="form-group">
            <label htmlFor="email">
              <FiMail size={16} />
              Email institucional
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@aduana.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FiLock size={16} />
              Contrasena
            </label>
            <input
              id="password"
              type="password"
               placeholder="Ingrese su contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <LoadingSpinner small /> : 'Ingresar'}
          </button>

          <div className="login-links">
            <Link to="/recuperar-password">Olvido su contrasena?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
