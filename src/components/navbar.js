import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <h2>IoT Escola</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/sensores">Sensores</Link>
        <Link to="/grupo">Grupo</Link>
        <Link to="/sobre-sensor">Sensor</Link>
      </div>
    </nav>
  );
}