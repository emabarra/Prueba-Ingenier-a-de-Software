import { useState, useEffect } from 'react';
import { sagService } from '../services/sagService';
import DataTable from '../components/DataTable';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const columns = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'pasajero', label: 'Pasajero' },
  {
    key: 'tipo',
    label: 'Tipo',
    render: (row) => {
      const labels = { MASCOTA: 'Mascota', PROD_ANIMAL: 'Prod. Animal', PROD_VEGETAL: 'Prod. Vegetal' };
      return labels[row.tipo] || row.tipo;
    },
  },
  { key: 'descripcion', label: 'Descripcion' },
  {
    key: 'aprobado',
    label: 'Estado',
    render: (row) => {
      if (row.aprobado === true) return <span className="badge badge--success">Aprobado</span>;
      if (row.aprobado === false) return <span className="badge badge--danger">Rechazado</span>;
      return <span className="badge badge--warning">Pendiente</span>;
    },
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => {
      if (row.aprobado === true) {
        return <span className="badge badge--success"><FiCheckCircle size={14} /> Aprobado</span>;
      }
      if (row.aprobado === false) {
        return <span className="badge badge--danger"><FiXCircle size={14} /> Rechazado</span>;
      }
      return (
        <div className="action-btns">
          <button
            className="btn btn--sm btn--success"
            onClick={() => window.handleAprobarSag?.(row.id, true)}
          >
            <FiCheckCircle /> Aprobar
          </button>
          <button
            className="btn btn--sm btn--danger"
            onClick={() => window.handleAprobarSag?.(row.id, false)}
          >
            <FiXCircle /> Rechazar
          </button>
        </div>
      );
    },
  },
];

export default function PanelSag() {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  const load = async () => {
    setLoading(true);
    const data = await sagService.listar();
    setDeclaraciones(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  window.handleAprobarSag = async (id, aprobado) => {
    try {
      await sagService.aprobar(id, aprobado);
      setAlert({
        type: aprobado ? 'success' : 'warning',
        message: aprobado ? 'Declaracion aprobada' : 'Declaracion rechazada',
      });
      load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const filtrados = declaraciones.filter((d) => {
    if (filtro === 'PENDIENTE' && d.aprobado !== null) return false;
    if (filtro === 'APROBADOS' && d.aprobado !== true) return false;
    if (filtro === 'RECHAZADOS' && d.aprobado !== false) return false;
    if (filtroTipo !== 'TODOS' && d.tipo !== filtroTipo) return false;
    return true;
  });

  const pendientes = declaraciones.filter((d) => d.aprobado === null).length;
  const aprobados = declaraciones.filter((d) => d.aprobado === true).length;
  const rechazados = declaraciones.filter((d) => d.aprobado === false).length;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Panel SAG - Revision de Declaraciones</h2>
        <p>Control sanitario de mascotas, productos de origen animal y vegetal</p>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="card">
        <div className="card__header">
          <h3>Filtros</h3>
        </div>
        <div className="card__body">
          <div className="form-row" style={{ marginBottom: 0 }}>
            <div className="filtro-group">
              <button
                className={`btn btn--sm ${filtro === 'PENDIENTE' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('PENDIENTE')}
              >
                Pendientes ({pendientes})
              </button>
              <button
                className={`btn btn--sm ${filtro === 'APROBADOS' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('APROBADOS')}
              >
                Aprobados ({aprobados})
              </button>
              <button
                className={`btn btn--sm ${filtro === 'RECHAZADOS' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('RECHAZADOS')}
              >
                Rechazados ({rechazados})
              </button>
            </div>
            <div className="form-group" style={{ maxWidth: 200 }}>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="TODOS">Todos los tipos</option>
                <option value="MASCOTA">Mascotas</option>
                <option value="PROD_ANIMAL">Prod. Animal</option>
                <option value="PROD_VEGETAL">Prod. Vegetal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtrados} />
      </div>
    </div>
  );
}
