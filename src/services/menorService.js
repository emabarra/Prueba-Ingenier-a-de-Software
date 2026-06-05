import { mockMenores } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 500));

export const menorService = {
  async listar() {
    if (USE_MOCK) {
      await delay();
      return [...mockMenores];
    }
    const { data } = await api.get('/menores');
    return data;
  },

  async validarPermiso(id) {
    if (USE_MOCK) {
      await delay(800);
      const menor = mockMenores.find((m) => m.id === id);
      if (!menor) throw new Error('Registro no encontrado');
      menor.estado = 'VALIDADO';
      menor.fechaValidacion = new Date().toISOString().split('T')[0];
      return { ...menor, mensaje: 'Permiso validado con PDI exitosamente' };
    }
    const { data } = await api.post(`/menores/${id}/validar`);
    return data;
  },

  async registrar(data) {
    if (USE_MOCK) {
      await delay();
      const nuevo = { id: Date.now(), ...data, estado: 'PENDIENTE', fechaValidacion: null };
      mockMenores.push(nuevo);
      return nuevo;
    }
    const { data: res } = await api.post('/menores', data);
    return res;
  },
};
