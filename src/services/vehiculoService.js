import { mockVehiculos } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 500));

function calcularAdmision() {
  const hoy = new Date();
  const fin = new Date(hoy);
  fin.setDate(fin.getDate() + 180);
  return {
    fechaIngreso: hoy.toISOString().split('T')[0],
    admisionHasta: fin.toISOString().split('T')[0],
  };
}

export const vehiculoService = {
  async listar() {
    if (USE_MOCK) {
      await delay();
      return [...mockVehiculos];
    }
    const { data } = await api.get('/vehiculos');
    return data;
  },

  async procesarAdmision(patente) {
    if (USE_MOCK) {
      await delay(800);
      const fechas = calcularAdmision();
      const nuevo = {
        id: Date.now(),
        patente: patente.toUpperCase(),
        marca: '---',
        modelo: '---',
        anio: new Date().getFullYear(),
        propietario: '---',
        ...fechas,
        estado: 'ACTIVA',
      };
      mockVehiculos.unshift(nuevo);
      return { ...nuevo, documentoGenerado: 'SYAT-' + Date.now() };
    }
    const { data } = await api.post('/vehiculos/admision', { patente });
    return data;
  },
};
