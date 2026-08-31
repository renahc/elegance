import React from 'react';

export const AnalyticsTab: React.FC = () => {
  const monthlyData = [
    { month: 'Mar', revenue: 4200000 },
    { month: 'Abr', revenue: 4800000 },
    { month: 'May', revenue: 5300000 },
    { month: 'Jun', revenue: 5100000 },
    { month: 'Jul', revenue: 6200000 },
    { month: 'Ago', revenue: 7450000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const categories = [
    { name: 'Cabello & Coloración', percentage: 52, amount: '$3.874.000', color: 'var(--text-primary)' },
    { name: 'Manicura & Uñas', percentage: 24, amount: '$1.788.000', color: 'var(--accent-gold)' },
    { name: 'Tratamientos Faciales', percentage: 14, amount: '$1.043.000', color: '#8A9A86' },
    { name: 'Maquillaje & Spa', percentage: 10, amount: '$745.000', color: 'var(--accent-rose)' },
  ];

  const peakHours = [
    { hour: '09:00 - 11:00', load: 65 },
    { hour: '11:00 - 13:00', load: 92 },
    { hour: '13:00 - 15:00', load: 45 },
    { hour: '15:00 - 17:00', load: 88 },
    { hour: '17:00 - 19:00', load: 96 },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Estadísticas & Reportes Financieros</h1>
        <p className="page-subtitle">Desempeño mensual de ingresos, distribución por especialidad y horas de mayor demanda.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Ingresos Brutos Agosto</div>
          <div className="kpi-value">$7.450.000</div>
          <div className="kpi-period">+20.1% vs mes anterior</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Citas Atendidas</div>
          <div className="kpi-value">154</div>
          <div className="kpi-period">+18 citas adicionadas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Calificación Promedio</div>
          <div className="kpi-value">4.9 / 5.0</div>
          <div className="kpi-period">Basado en 342 reseñas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Margen Operativo</div>
          <div className="kpi-value">38.5%</div>
          <div className="kpi-period">Salón de alta eficiencia</div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Monthly Revenue Trend Chart */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Evolución de Ingresos Mensuales (CLP)</h3>
          </div>

          <div style={{ height: 260, display: 'flex', alignItems: 'flex-end', gap: 24, padding: '20px 10px 0 10px' }}>
            {monthlyData.map((d) => {
              const heightPct = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    ${(d.revenue / 1000000).toFixed(1)}M
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxHeight: '180px',
                      height: `${heightPct}%`,
                      background: 'linear-gradient(180deg, var(--text-primary) 0%, var(--accent-gold) 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 12, color: 'var(--text-primary)' }}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Ingresos por Categoría</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categories.map((c) => (
              <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{c.percentage}% ({c.amount})</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${c.percentage}%`, background: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Ocupación Horas Punta</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {peakHours.map((p) => (
                <div key={p.hour} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{p.hour}</span>
                  <div style={{ width: 120, height: 6, backgroundColor: 'var(--bg-app)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${p.load}%`, height: '100%', backgroundColor: p.load > 90 ? '#991B1B' : 'var(--accent-gold)' }} />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', width: 36, textAlign: 'right' }}>{p.load}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
