import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTemp, getUmidadeLatest } from "../services/api";

export default function SensorDetalhe() {
  const { id } = useParams();
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function load() {
      const temp = await getTemp(id);
      setDados(temp.data);
    }
    load();
  }, [id]);

  return (
    <div className="container">
      <h1>Histórico Sensor {id}</h1>

      {dados.map((d, i) => (
        <div key={i} className="card">
          <p>🌡 {d.valor}°C</p>
          <p>{d.timestamp}</p>
        </div>
      ))}
    </div>
  );
}