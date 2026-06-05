import { mockFlowRecords } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 600));

export const reporteService = {
  async generar(fechaInicio, fechaFin, tipoFlujo) {
    if (USE_MOCK) {
      await delay();
      return mockFlowRecords.filter((r) => {
        if (fechaInicio && r.fecha < fechaInicio) return false;
        if (fechaFin && r.fecha > fechaFin) return false;
        return true;
      }).map((r) => ({
        fecha: r.fecha,
        cantidad: tipoFlujo === 'INGRESO' ? r.ingresos : r.salidas,
        tipo: tipoFlujo,
      }));
    }
    const { data } = await api.get('/reportes/estadisticos', {
      params: { fechaInicio, fechaFin, tipoFlujo },
    });
    return data;
  },
};
