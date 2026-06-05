import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!email) { setError('Ingrese su email institucional'); return; }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMensaje(res.mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">SIGF</div>
          </div>
          <h1>Recuperar Contrasena</h1>
          <p className="login-subtitle">Ingrese su email para recibir un enlace de recuperacion</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <AlertMessage type="error" message={error} onClose={() => setError('')} />
          <AlertMessage type="success" message={mensaje} onClose={() => setMensaje('')} />

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

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <LoadingSpinner small /> : 'Enviar enlace'}
          </button>

          <div className="login-links">
            <Link to="/login">
              <FiArrowLeft size={14} /> Volver al inicio de sesion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
