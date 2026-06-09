import { mockTramites } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 400));

export const tramiteService = {
  async consultarPorRut(rut) {
    await delay();
    return mockTramites.filter(
      (t) => t.rut.includes(rut) || rut === ''
    );
  },

  async listarTodos() {
    await delay();
    return [...mockTramites];
  },

  async crearTramite(formData) {
    await delay();
    const nuevo = { id: Date.now(), ...formData, estado: 'Pendiente', fecha: new Date().toISOString().split('T')[0] };
    mockTramites.unshift(nuevo);
    return nuevo;
  },
};
