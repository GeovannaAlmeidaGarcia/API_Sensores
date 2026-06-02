import { useEffect, useState } from "react";
import { getSensores } from "../services/api";
import { Link } from "react-router-dom";

export default function Sensores() {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    getSensores().then((res) => setSensores(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Sensores</h1>

      {sensores.map((s) => (
        <div key={s.id} className="card">
          <h3>{s.localizacao}</h3>
          <p>{s.tipo}</p>
          <Link to={`/sensor/${s.id}`}>Ver detalhes</Link>
        </div>
      ))}
    </div>
  );
}