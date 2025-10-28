const API_URL = "http://localhost:4000/api";

async function loadEquipos() {
  const res = await fetch(`${API_URL}/equipos-proximos`);
  const data = await res.json();
  renderTable(data);
}

async function loadCostos() {
  const res = await fetch(`${API_URL}/costos?start=2025-01-01&end=2025-12-31`);
  const data = await res.json();
  renderTable(data);
}

async function loadAlertas() {
  const res = await fetch(`${API_URL}/alertas`);
  const data = await res.json();
  renderTable(data);
}

async function loadMTTR() {
  const res = await fetch(`${API_URL}/mttr`);
  const data = await res.json();
  renderTable(data);
}

async function loadMTBF() {
  const res = await fetch(`${API_URL}/mtbf`);
  const data = await res.json();
  renderTable(data);
}

function renderTable(data) {
  const container = document.getElementById("data-container");
  if (!data.length) {
    container.innerHTML = "<p>No hay datos disponibles.</p>";
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    `<tr>${headers.map(h => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`
  );

  container.innerHTML = `
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table>
  `;
}
