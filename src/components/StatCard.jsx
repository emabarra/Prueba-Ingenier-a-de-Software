export default function StatCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__icon" style={{ backgroundColor: color + '15', color }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`stat-card__trend ${trend >= 0 ? 'trend--up' : 'trend--down'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__title">{title}</span>
      </div>
      {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
    </div>
  );
}
