import { useState } from 'react';
import { tramiteService } from '../services/tramiteService';
import DataTable from '../components/DataTable';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const columns = [
  { key: 'rut', label: 'RUT/DNI' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo', label: 'Tipo Tramite' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => {
      const cls = {
        'Aprobado': 'badge badge--success',
        'Pendiente PDI': 'badge badge--warning',
        'Revision': 'badge badge--info',
        'Rechazado': 'badge badge--danger',
        'En Proceso': 'badge badge--info',
      }[row.estado] || 'badge';
      return <span className={cls}>{row.estado}</span>;
    },
  },
  { key: 'fecha', label: 'Fecha' },
];

export default function ConsultaTramites() {
  const [rut, setRut] = useState('');
  const [tramites, setTramites] = useState([]);
  const [consultado, setConsultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rut.trim()) { setError('Ingrese un RUT o DNI para consultar'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await tramiteService.consultarPorRut(rut.trim());
      setTramites(data);
      setConsultado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <div className="public-container">
        <div className="public-header">
          <Link to="/" className="public-back">
            <FiArrowLeft size={16} /> Volver al inicio
          </Link>
          <div className="public-logo">SIGF</div>
          <h1>Consulta de Tramites</h1>
          <p>Ingrese su RUT o DNI para consultar el estado de sus tramites</p>
        </div>

        <form onSubmit={handleSearch} className="public-search">
          <AlertMessage type="error" message={error} onClose={() => setError('')} />
          <div className="search-box">
            <input
              type="text"
              placeholder="Ej: 12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn--primary search-btn" disabled={loading}>
              {loading ? <LoadingSpinner small /> : <><FiSearch size={18} /> Consultar</>}
            </button>
          </div>
        </form>

        {consultado && (
          <div className="animate-in">
            {tramites.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No se encontraron tramites para el RUT ingresado.</p>
              </div>
            ) : (
              <div className="card">
                <div className="card__header">
                  <h3>Resultados para {rut}</h3>
                  <span className="badge badge--info">{tramites.length} tramite(s)</span>
                </div>
                <DataTable columns={columns} data={tramites} />
              </div>
            )}
          </div>
        )}

        <div className="public-footer">
          <p>Aduanas de Chile - Sistema Integrado de Gestion Fronteriza &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
