import { useEffect, useState } from "react";
import { apiService, request } from "../../services/api";
export function MonitoringTab() {
  const [topics, setTopics] = useState<string[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [offsets, setOffsets] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("elegance.demo.v1");
  const load = async () => {
    try {
      const [t, g, a] = await Promise.all([
        apiService.getTopics(),
        apiService.getGroups(),
        apiService.getAudit(),
      ]);
      setTopics(t);
      setGroups(g);
      setAudit(a.content);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return load();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const act = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <div>
      <h1 className="page-title">Eventos y monitoreo</h1>
      {error && <p role="alert">{error}</p>}
      <button className="btn-secondary" onClick={() => void load()}>
        Actualizar
      </button>
      <p>
        {import.meta.env.VITE_KAFKA_UI_URL && (
          <a
            href={import.meta.env.VITE_KAFKA_UI_URL}
            target="_blank"
            rel="noreferrer"
          >
            Abrir Kafka UI
          </a>
        )}{" "}
        {import.meta.env.VITE_RABBITMQ_UI_URL && (
          <a
            href={import.meta.env.VITE_RABBITMQ_UI_URL}
            target="_blank"
            rel="noreferrer"
          >
            Abrir RabbitMQ Management
          </a>
        )}
      </p>
      <section className="card-panel">
        <h2>Topics Kafka</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void act(() =>
              request("/admin/kafka/topics", "POST", {
                name,
                partitions: 3,
                replicationFactor: Number(
                  import.meta.env.VITE_KAFKA_REPLICATION_FACTOR || 1,
                ),
                configs: {
                  "retention.ms": "604800000",
                  "cleanup.policy": "delete",
                },
              }),
            );
          }}
        >
          <label>
            Nombre del topic{" "}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              pattern="elegance\.[a-zA-Z0-9._-]+"
              required
            />
          </label>
          <button>Crear topic</button>
        </form>
        {topics.map((t) => (
          <div key={t} style={{ padding: 8 }}>
            {t}{" "}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Eliminar permanentemente el topic ${t} y sus mensajes?`,
                  )
                )
                  void act(() =>
                    request(
                      `/admin/kafka/topics/${encodeURIComponent(t)}`,
                      "DELETE",
                    ),
                  );
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </section>
      <section className="card-panel">
        <h2>Grupos de consumidores</h2>
        {groups.map((g) => (
          <p key={g.groupId}>
            <button
              onClick={() => {
                apiService
                  .getOffsets(g.groupId)
                  .then(setOffsets)
                  .catch((e) => setError(e.message));
              }}
            >
              {g.groupId}
            </button>{" "}
            · {g.state}
          </p>
        ))}
        {offsets.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Partición</th>
                <th>Offset</th>
                <th>Lag</th>
              </tr>
            </thead>
            <tbody>
              {offsets.map((o) => (
                <tr key={`${o.topic}-${o.partition}`}>
                  <td>{o.topic}</td>
                  <td>{o.partition}</td>
                  <td>{o.offset}</td>
                  <td>{o.lag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="card-panel">
        <h2>Últimos eventos de auditoría</h2>
        {audit.length === 0 ? (
          <p>Sin eventos.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Evento</th>
                <th>Cita</th>
                <th>Partición / offset</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((e) => (
                <tr key={e.eventId}>
                  <td>{new Date(e.occurredAt).toLocaleString("es-CL")}</td>
                  <td>{e.eventType}</td>
                  <td>{e.appointmentId}</td>
                  <td>
                    {e.partitionNumber} / {e.eventOffset}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
