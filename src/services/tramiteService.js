import { mockTramites } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 400));

export const tramiteService = {
  async consultarPorRut(rut) {
    if (USE_MOCK) {
      await delay();
      return mockTramites.filter(
        (t) => t.rut.includes(rut) || rut === ''
      );
    }
    const { data } = await api.get('/public/tramites', { params: { rut } });
    return data;
  },

  async listarTodos() {
    if (USE_MOCK) {
      await delay();
      return [...mockTramites];
    }
    const { data } = await api.get('/tramites');
    return data;
  },

  async crearTramite(formData) {
    if (USE_MOCK) {
      await delay();
      const nuevo = { id: Date.now(), ...formData, estado: 'Pendiente', fecha: new Date().toISOString().split('T')[0] };
      mockTramites.unshift(nuevo);
      return nuevo;
    }
    const { data } = await api.post('/tramites', formData);
    return data;
  },
};
