import { mockUsers } from './mockData';

export const authService = {
  async login(email, password) {
    await new Promise((r) => setTimeout(r, 600));
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales invalidas');
    const { password: _, ...safe } = user;
    const token = 'mock-jwt-' + user.id + '-' + Date.now();
    return { token, user: safe };
  },

  async forgotPassword(email) {
    await new Promise((r) => setTimeout(r, 800));
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error('Email no registrado');
    return { mensaje: 'Se ha enviado un enlace de recuperacion a ' + email };
  },
};
