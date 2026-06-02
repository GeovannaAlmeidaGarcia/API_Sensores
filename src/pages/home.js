import { useEffect, useState } from "react";
import { getSensor } from "../services/api";

export default function Home() {
  const [dados, setDados] = useState(null);
  const sensorId = 23;

  useEffect(() => {
    async function carregar() {
      const res = await getSensor(sensorId);
      setDados(res.data);
    }

    carregar();
    const intervalo = setInterval(carregar, 10000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container">
      <h1>📡 Sensor {sensorId}</h1>

      {!dados ? (
        <p>Carregando...</p>
      ) : (
        <div className="card">
          <p>🌡 {dados.temperatura} °C</p>
          <p>💧 {dados.umidade} %</p>
          <p>⏱ {dados.data}</p>
        </div>
      )}
    </div>
  );
}