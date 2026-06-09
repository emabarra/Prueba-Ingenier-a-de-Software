import { mockMenores } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 500));

export const menorService = {
  async listar() {
    await delay();
    return [...mockMenores];
  },

  async validarPermiso(id) {
    await delay(800);
    const menor = mockMenores.find((m) => m.id === id);
    if (!menor) throw new Error('Registro no encontrado');
    menor.estado = 'VALIDADO';
    menor.fechaValidacion = new Date().toISOString().split('T')[0];
    return { ...menor, mensaje: 'Permiso validado con PDI exitosamente' };
  },

  async registrar(data) {
    await delay();
    const nuevo = { id: Date.now(), ...data, estado: 'PENDIENTE', fechaValidacion: null };
    mockMenores.push(nuevo);
    return nuevo;
  },
};
