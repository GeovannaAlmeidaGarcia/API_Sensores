export default function SobreSensor() {
  return (
    <div className="container">
      <h1>Sobre o Sensor</h1>

      <p>Sensor DHT11 com ESP32</p>

      <h3>Componentes:</h3>
      <ul>
        <li>ESP32</li>
        <li>DHT11</li>
      </ul>

      <h3>Funcionamento:</h3>
      <p>
        O sensor coleta temperatura e umidade e envia via API a cada 10 minutos.
      </p>
    </div>
  );
}