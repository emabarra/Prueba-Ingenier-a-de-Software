import { useState } from 'react';
import { reporteService } from '../services/reporteService';
import DataTable from '../components/DataTable';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFileText, FiDownload } from 'react-icons/fi';

const columns = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'tipo', label: 'Tipo Flujo' },
];

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoFlujo, setTipoFlujo] = useState('INGRESO');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [generado, setGenerado] = useState(false);

  const handleGenerar = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const data = await reporteService.generar(fechaInicio, fechaFin, tipoFlujo);
      setResultados(data);
      setGenerado(true);
      if (data.length === 0) {
        setAlert({ type: 'info', message: 'No hay datos para los filtros seleccionados' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const header = 'Fecha,Cantidad,Tipo Flujo\n';
    const rows = resultados.map((r) => `${r.fecha},${r.cantidad},${r.tipo}`).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${tipoFlujo}_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte Estadistico - Aduanas de Chile', 14, 20);
    doc.setFontSize(10);
    doc.text(`Tipo: ${tipoFlujo}  |  ${fechaInicio || '---'} a ${fechaFin || '---'}`, 14, 28);
    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Cantidad', 'Tipo Flujo']],
      body: resultados.map((r) => [r.fecha, r.cantidad, r.tipo]),
    });
    doc.save(`reporte_${tipoFlujo}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Reportes Estadisticos</h2>
        <p>Generacion de informes de flujo de personas y vehiculos</p>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="card">
        <div className="card__header">
          <h3>Filtros del Reporte</h3>
        </div>
        <form onSubmit={handleGenerar} className="reporte-form">
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fecha Fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo de Flujo</label>
              <select value={tipoFlujo} onChange={(e) => setTipoFlujo(e.target.value)}>
                <option value="INGRESO">Ingreso</option>
                <option value="SALIDA">Salida</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? <LoadingSpinner small /> : <><FiFileText /> Generar Reporte</>}
          </button>
        </form>
      </div>

      {generado && resultados.length > 0 && (
        <div className="card animate-in">
          <div className="card__header">
            <h3>Resultados</h3>
            <div className="btn-group">
              <button className="btn btn--outline" onClick={exportToPDF}>
                <FiDownload /> PDF
              </button>
              <button className="btn btn--outline" onClick={exportToCSV}>
                <FiDownload /> Excel (CSV)
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={resultados} />
        </div>
      )}
    </div>
  );
}
