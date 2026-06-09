import { mockDashboardStats } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 300));

export const dashboardService = {
  async getStats() {
    await delay();
    return { ...mockDashboardStats };
  },
};
