const BASE_URL = "http://192.168.0.101:8000/api";
const SENSOR_ID = 23;

let TOKEN = "";


async function login() {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: "smart_city",
      password: "senai501"
    })
  });

  const data = await res.json();
  TOKEN = data.access;
}


async function getSensorInfo() {
  const res = await fetch(`${BASE_URL}/sensores/${SENSOR_ID}/`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar sensor");
  }

  return await res.json();
}


function formatarDataTop(timestamp) {
  const data = new Date(timestamp);
  const agora = new Date();

  const dia = data.toLocaleDateString("pt-BR");

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const diffMs = agora - data;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHora = Math.floor(diffMin / 60);

  let relativo = "";

  if (diffMin < 1) {
    relativo = "Agora mesmo";
  } else if (diffMin < 60) {
    relativo = `${diffMin} min atrás`;
  } else if (diffHora < 24) {
    relativo = `${diffHora}h atrás`;
  } else {
    relativo = `${Math.floor(diffHora / 24)} dias atrás`;
  }

  return { dia, hora, relativo, diffMin };
}


async function getDadosAtuais() {
  const tempRes = await fetch(`${BASE_URL}/temperatura/?sensor=${SENSOR_ID}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  const umidRes = await fetch(`${BASE_URL}/umidade/?sensor=${SENSOR_ID}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  const temps = await tempRes.json();
  const umids = await umidRes.json();

  if (!temps.length || !umids.length) {
    return null;
  }

  return {
    temp: temps[temps.length - 1],
    umid: umids[umids.length - 1]
  };
}


async function atualizarDashboard() {
  try {
    await login();

    const [dados, sensor] = await Promise.all([
      getDadosAtuais(),
      getSensorInfo()
    ]);

    if (!dados) {
      document.getElementById("status").innerText = "⏳ Sem dados ainda";
      return;
    }

    const { temp, umid } = dados;
    const f = formatarDataTop(temp.timestamp);

    
    document.getElementById("temp").innerText = temp.valor + "°C";
    document.getElementById("umid").innerText = umid.valor + "%";
    document.getElementById("localizacao").innerText = sensor.localizacao;

    
    document.getElementById("data").innerHTML = `
      <div>📅 ${f.dia}</div>
      <div>⏰ ${f.hora}</div>
      <div style="color:#a78bfa; font-size:14px;">${f.relativo}</div>
    `;

    
    const sensorDiv = document.getElementById("sensorInfo");
    if (sensorDiv) {
      sensorDiv.innerHTML = `
        <div><b>Tipo:</b> ${sensor.tipo}</div>
        <div><b>Local:</b> ${sensor.localizacao}</div>
        <div><b>Responsável:</b> ${sensor.responsavel}</div>
        <div><b>Status:</b> ${sensor.status_operacional ? "Ativo ✅" : "Inativo ❌"}</div>
        <div><b>MAC:</b> ${sensor.mac_address}</div>
      `;
    }

   
    if (!sensor.status_operacional) {
      document.getElementById("status").innerText = "Sensor OFF ❌";
    } else if (f.diffMin > 15) {
      document.getElementById("status").innerText = "⚠️ Sensor desatualizado";
    } else if (temp.valor > 30) {
      document.getElementById("status").innerText = "🔥 Temperatura Alta";
    } else {
      document.getElementById("status").innerText = "Online ✅";
    }

  } catch (erro) {
    console.error(erro);
    document.getElementById("status").innerText = "Offline ❌";
  }
}


async function carregarHistorico() {
  try {
    await login();

    const tempRes = await fetch(`${BASE_URL}/temperatura/?sensor=${SENSOR_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const umidRes = await fetch(`${BASE_URL}/umidade/?sensor=${SENSOR_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const temps = await tempRes.json();
    const umids = await umidRes.json();

    const ultTemp = temps.slice(-20).reverse();
    const ultUmid = umids.slice(-20).reverse();

    const tabela = document.getElementById("tabela");

    if (tabela) {
      tabela.innerHTML = "";

      for (let i = 0; i < ultTemp.length; i++) {
        const f = formatarDataTop(ultTemp[i].timestamp);

        const linha = document.createElement("tr");

        linha.innerHTML = `
          <td>
            📅 ${f.dia}<br>
            ⏰ ${f.hora}<br>
            <span style="color:#aaa; font-size:12px;">
              ${f.relativo}
            </span>
          </td>
          <td>${ultTemp[i].valor}°C</td>
          <td>${ultUmid[i]?.valor || "-"}%</td>
        `;

        tabela.appendChild(linha);
      }
    }

  } catch (erro) {
    console.error("Erro histórico:", erro);
  }
}


async function iniciar() {
  if (document.getElementById("temp")) {
    await atualizarDashboard();
    setInterval(atualizarDashboard, 10000);
  }

  if (document.getElementById("tabela")) {
    await carregarHistorico();
  }
}

iniciar();