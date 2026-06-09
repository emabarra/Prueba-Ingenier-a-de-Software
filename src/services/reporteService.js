import { mockFlowRecords } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 600));

export const reporteService = {
  async generar(fechaInicio, fechaFin, tipoFlujo) {
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
  },
};
