const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "http://192.168.0.101:8000/api";

let token = "";

// 🔐 LOGIN AUTOMÁTICO
async function autenticar() {
  try {
    const res = await axios.post(`${API_BASE}/token/`, {
      username: "smart_city",
      password: "senai501",
    });

    token = res.data.access;
    console.log("✅ Token atualizado");
  } catch (err) {
    console.log("❌ Erro ao autenticar");
  }
}

// chama ao iniciar
autenticar();

// 🔄 atualiza token a cada 10 min
setInterval(autenticar, 600000);

// 📡 ROTA: SENSOR (TEMP + UMIDADE)
app.get("/sensor/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const temp = await axios.post(
      `${API_BASE}/temperatura_filter/`,
      {
        sensor_id: id,
        latest: true,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const umidade = await axios.get(
      `${API_BASE}/umidade/?sensor=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json({
      temperatura: temp.data.results?.[0]?.valor,
      umidade: umidade.data?.[0]?.valor,
      data: temp.data.results?.[0]?.timestamp,
    });

  } catch (erro) {
    console.log("ERRO COMPLETO:", erro.response?.data || erro.message);
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
});

// 🚀 START
app.listen(3001, () => {
  console.log("🔥 Backend rodando em http://localhost:3001");
});