import { mockUsuarios } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 400));

export const adminService = {
  async listarUsuarios() {
    await delay();
    return [...mockUsuarios];
  },

  async crearUsuario(usuario) {
    await delay();
    const nuevo = { id: Date.now(), ...usuario, habilitado: true };
    mockUsuarios.push(nuevo);
    return nuevo;
  },

  async toggleHabilitado(id) {
    await delay();
    const user = mockUsuarios.find((u) => u.id === id);
    if (user) user.habilitado = !user.habilitado;
    return user;
  },
};
