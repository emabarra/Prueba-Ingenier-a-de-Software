import { mockDeclaracionesSag } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 400));

export const sagService = {
  async listar() {
    await delay();
    return [...mockDeclaracionesSag];
  },

  async crear(declaracion) {
    await delay();
    const nueva = {
      id: Date.now(),
      ...declaracion,
      aprobado: null,
      fecha: new Date().toISOString().split('T')[0],
    };
    mockDeclaracionesSag.unshift(nueva);
    return nueva;
  },

  async aprobar(id, aprobado) {
    await delay();
    const decl = mockDeclaracionesSag.find((d) => d.id === id);
    if (decl) decl.aprobado = aprobado;
    return { id, aprobado };
  },
};
