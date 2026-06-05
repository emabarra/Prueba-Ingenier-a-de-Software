import { mockUsuarios } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 400));

export const adminService = {
  async listarUsuarios() {
    if (USE_MOCK) {
      await delay();
      return [...mockUsuarios];
    }
    const { data } = await api.get('/admin/usuarios');
    return data;
  },

  async crearUsuario(usuario) {
    if (USE_MOCK) {
      await delay();
      const nuevo = { id: Date.now(), ...usuario, habilitado: true };
      mockUsuarios.push(nuevo);
      return nuevo;
    }
    const { data } = await api.post('/admin/usuarios', usuario);
    return data;
  },

  async toggleHabilitado(id) {
    if (USE_MOCK) {
      await delay();
      const user = mockUsuarios.find((u) => u.id === id);
      if (user) user.habilitado = !user.habilitado;
      return user;
    }
    const { data } = await api.put(`/admin/usuarios/${id}/toggle`);
    return data;
  },
};
