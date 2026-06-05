import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { mockFlowRecords } from '../services/mockData';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiUsers, FiTruck, FiUserCheck, FiShield,
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const chartData = {
  labels: mockFlowRecords.map((r) => {
    const d = new Date(r.fecha);
    return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' });
  }),
  datasets: [
    {
      label: 'Ingresos',
      data: mockFlowRecords.map((r) => r.ingresos),
      backgroundColor: '#003366',
      borderRadius: 4,
    },
    {
      label: 'Salidas',
      data: mockFlowRecords.map((r) => r.salidas),
      backgroundColor: '#DC2626',
      borderRadius: 4,
    },
  ],
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const calcTrend = (hoy, ayer) => {
    if (ayer === 0) return 0;
    return Math.round(((hoy - ayer) / ayer) * 100);
  };

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Panel de Control</h2>
        <p>Resumen operativo del complejo fronterizo Los Libertadores</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Personas hoy"
          value={stats.personasHoy}
          subtitle="Flujo de pasajeros"
          icon={<FiUsers size={24} />}
          color="#003366"
          trend={calcTrend(stats.personasHoy, stats.personasAyer)}
        />
        <StatCard
          title="Vehiculos hoy"
          value={stats.vehiculosHoy}
          subtitle="Admisiones temporales"
          icon={<FiTruck size={24} />}
          color="#005A9E"
          trend={calcTrend(stats.vehiculosHoy, stats.vehiculosAyer)}
        />
        <StatCard
          title="Menores Pendientes"
          value={stats.menoresPendientes}
          subtitle="Validacion PDI requerida"
          icon={<FiUserCheck size={24} />}
          color="#D97706"
        />
        <StatCard
          title="SAG Pendientes"
          value={stats.sagPendientes}
          subtitle="Declaraciones por revisar"
          icon={<FiShield size={24} />}
          color="#DC2626"
        />
      </div>

      <div className="card chart-card">
        <div className="card__header">
          <h3>Flujo de personas - Ultimos 8 dias</h3>
        </div>
        <div className="card__body">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
