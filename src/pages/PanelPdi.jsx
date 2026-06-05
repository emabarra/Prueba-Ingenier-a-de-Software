import { useState, useEffect } from 'react';
import { menorService } from '../services/menorService';
import DataTable from '../components/DataTable';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUserCheck, FiXCircle, FiCheckCircle } from 'react-icons/fi';

const columns = [
  { key: 'nombreMenor', label: 'Nombre Menor' },
  { key: 'rutMenor', label: 'RUT Menor' },
  { key: 'tutor', label: 'Tutor' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => (
      <span className={`badge badge--${row.estado === 'VALIDADO' ? 'success' : 'warning'}`}>
        {row.estado}
      </span>
    ),
  },
  {
    key: 'fechaValidacion',
    label: 'Validacion PDI',
    render: (row) => row.fechaValidacion || 'Pendiente',
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => {
      if (row.estado === 'VALIDADO') {
        return <span className="badge badge--success"><FiCheckCircle size={14} /> Validado</span>;
      }
      return (
        <div className="action-btns">
          <button
            className="btn btn--sm btn--success"
            onClick={() => window.handleValidarMenor?.(row.id)}
          >
            <FiUserCheck /> Validar
          </button>
          <button
            className="btn btn--sm btn--danger"
            onClick={() => window.handleRechazarMenor?.(row.id)}
          >
            <FiXCircle /> Rechazar
          </button>
        </div>
      );
    },
  },
];

export default function PanelPdi() {
  const [menores, setMenores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filtro, setFiltro] = useState('TODOS');

  const load = async () => {
    setLoading(true);
    const data = await menorService.listar();
    setMenores(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  window.handleValidarMenor = async (id) => {
    try {
      await menorService.validarPermiso(id);
      setAlert({ type: 'success', message: 'Permiso validado exitosamente' });
      load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  window.handleRechazarMenor = async (id) => {
    try {
      await menorService.validarPermiso(id);
      setAlert({ type: 'warning', message: 'Permiso rechazado' });
      load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const filtrados = filtro === 'TODOS'
    ? menores
    : menores.filter((m) => m.estado === filtro);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Panel PDI - Validacion de Menores</h2>
        <p>Revision y validacion de permisos notariales para entrada y salida de menores</p>
        <div className="filtro-group">
          <button
            className={`btn btn--sm ${filtro === 'TODOS' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setFiltro('TODOS')}
          >
            Todos ({menores.length})
          </button>
          <button
            className={`btn btn--sm ${filtro === 'PENDIENTE' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setFiltro('PENDIENTE')}
          >
            Pendientes ({menores.filter((m) => m.estado === 'PENDIENTE').length})
          </button>
          <button
            className={`btn btn--sm ${filtro === 'VALIDADO' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setFiltro('VALIDADO')}
          >
            Validados ({menores.filter((m) => m.estado === 'VALIDADO').length})
          </button>
        </div>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="card">
        <DataTable columns={columns} data={filtrados} />
      </div>
    </div>
  );
}
