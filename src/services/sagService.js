import { mockDeclaracionesSag } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 400));

export const sagService = {
  async listar() {
    if (USE_MOCK) {
      await delay();
      return [...mockDeclaracionesSag];
    }
    const { data } = await api.get('/sag/declaraciones');
    return data;
  },

  async crear(declaracion) {
    if (USE_MOCK) {
      await delay();
      const nueva = {
        id: Date.now(),
        ...declaracion,
        aprobado: null,
        fecha: new Date().toISOString().split('T')[0],
      };
      mockDeclaracionesSag.unshift(nueva);
      return nueva;
    }
    const { data } = await api.post('/sag/declaracion', declaracion);
    return data;
  },

  async aprobar(id, aprobado) {
    if (USE_MOCK) {
      await delay();
      const decl = mockDeclaracionesSag.find((d) => d.id === id);
      if (decl) decl.aprobado = aprobado;
      return { id, aprobado };
    }
    const { data } = await api.put(`/sag/declaraciones/${id}`, { aprobado });
    return data;
  },
};
