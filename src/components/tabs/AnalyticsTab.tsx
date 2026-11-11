type Metrics = {
  appointments: number;
  completedServices: number;
  serviceValue: number;
  statuses: Record<string, number>;
  demandByCategory: Record<string, number>;
  demandByHour: Record<string, number>;
  valueByCategory: Record<string, number>;
  valueByDate: Record<string, number>;
  updatedAt: string;
};
export function AnalyticsTab({ metrics }: { metrics: Metrics | null }) {
  if (!metrics)
    return (
      <p role="status">
        Las estadísticas todavía no están disponibles. Se actualizarán al
        conectar el servicio de analítica.
      </p>
    );
  const clp = (n: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(n);
  const table = (
    title: string,
    data: Record<string, number>,
    money = false,
  ) => (
    <section className="card-panel">
      <h3>{title}</h3>
      {Object.keys(data).length === 0 ? (
        <p>Sin eventos procesados.</p>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Detalle</th>
              <th>{money ? "Valor CLP" : "Cantidad"}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{money ? clp(value) : value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Estadísticas del salón</h1>
        <p>
          Actualización cada 10 segundos · Última consulta:{" "}
          {new Date(metrics.updatedAt).toLocaleString("es-CL")}
        </p>
      </div>
      <div className="kpi-grid">
        {[
          ["Reservas", metrics.appointments],
          ["Servicios realizados", metrics.completedServices],
          ["Valor de servicios realizados", clp(metrics.serviceValue)],
        ].map(([label, value]) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-title">{label}</div>
            <div className="kpi-value">{value}</div>
          </div>
        ))}
      </div>
      <p>
        El valor corresponde a atenciones completadas; no representa pagos
        cobrados. Los datos reflejan los eventos incorporados al pipeline.
      </p>
      <div className="dashboard-columns">
        {table("Estados de reservas", metrics.statuses)}
        {table("Demanda por categoría", metrics.demandByCategory)}
        {table("Demanda por horario", metrics.demandByHour)}
        {table("Valor por categoría", metrics.valueByCategory, true)}
        {table("Valor por fecha", metrics.valueByDate, true)}
      </div>
    </div>
  );
}
