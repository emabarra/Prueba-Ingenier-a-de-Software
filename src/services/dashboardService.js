import { mockDashboardStats } from './mockData';

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 300));

export const dashboardService = {
  async getStats() {
    if (USE_MOCK) {
      await delay();
      return { ...mockDashboardStats };
    }
    const { data } = await api.get('/dashboard/stats');
    return data;
  },
};
