import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'rol', label: 'Rol', render: (row) => {
    const labels = { ADMIN: 'Administrador', ADUANA: 'Aduana', PDI: 'PDI', SAG: 'SAG' };
    const colors = { ADMIN: 'danger', ADUANA: 'primary', PDI: 'warning', SAG: 'info' };
    return <span className={`badge badge--${colors[row.rol] || 'info'}`}>{labels[row.rol] || row.rol}</span>;
  }},
  {
    key: 'habilitado',
    label: 'Estado',
    render: (row) => (
      <span className={`badge badge--${row.habilitado ? 'success' : 'danger'}`}>
        {row.habilitado ? 'Habilitado' : 'Deshabilitado'}
      </span>
    ),
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => (
      <button
        className={`btn btn--sm btn--${row.habilitado ? 'danger' : 'success'}`}
        onClick={() => window.handleToggleUser?.(row.id)}
      >
        {row.habilitado ? 'Deshabilitar' : 'Habilitar'}
      </button>
    ),
  },
];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ email: '', nombre: '', password: '', rol: 'ADUANA' });

  const load = async () => {
    setLoading(true);
    const data = await adminService.listarUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  window.handleToggleUser = async (id) => {
    try {
      await adminService.toggleHabilitado(id);
      load();
      setAlert({ type: 'success', message: 'Estado de usuario actualizado' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.crearUsuario(form);
      setAlert({ type: 'success', message: 'Usuario creado exitosamente' });
      setModalOpen(false);
      setForm({ email: '', nombre: '', password: '', rol: 'ADUANA' });
      load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Administracion de Usuarios</h2>
        <p>Gestion de cuentas de funcionarios de Aduana, PDI y SAG</p>
        <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
          + Nuevo Usuario
        </button>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="card">
        <DataTable columns={columns} data={usuarios} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Crear Nuevo Usuario">
        <form onSubmit={handleCreate} className="modal-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email institucional</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Contrasena</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option value="ADMIN">Administrador</option>
              <option value="ADUANA">Aduana</option>
              <option value="PDI">PDI</option>
              <option value="SAG">SAG</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Crear Usuario</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
