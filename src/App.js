import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Sensores from "./pages/sensores";
import SensorDetalhe from "./pages/sensorDetalhe";
import SobreGrupo from "./pages/sobre";
import SobreSensor from "./pages/sobreSensor";
import Navbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sensores" element={<Sensores />} />
        <Route path="/sensor/:id" element={<SensorDetalhe />} />
        <Route path="/grupo" element={<SobreGrupo />} />
        <Route path="/sobre-sensor" element={<SobreSensor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;