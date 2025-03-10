// Variables principales
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let mesActual = 0;

// Datos por mes
const datosPorMes = meses.map(() => ({
  ingresosTotales: 0,
  egresosTotales: 0,
  totalAhorros: 0,
  gastos: [],
  notas: []
}));

// Cambiar de mes
function cambiarMes(direccion) {
  mesActual = (mesActual + direccion + meses.length) % meses.length;
  document.getElementById("mes").innerText = meses[mesActual];
  actualizarUI();
}

// Actualizar ingresos
function actualizarTotales() {
  const ingreso = parseFloat(document.getElementById("ingresos").value) || 0;
  datosPorMes[mesActual].ingresosTotales += ingreso;
  document.getElementById("ingresos").value = "";
  generarRecordatorios();
  actualizarUI();
}

// Agregar gastos
function agregarGasto() {
  const nombre = document.getElementById("nombre-gasto").value;
  const monto = parseFloat(document.getElementById("monto-gasto").value) || 0;

  if (nombre && monto > 0) {
    datosPorMes[mesActual].egresosTotales += monto;
    datosPorMes[mesActual].gastos.push({ nombre, monto });

    document.getElementById("nombre-gasto").value = "";
    document.getElementById("monto-gasto").value = "";
    generarRecordatorios();
    actualizarUI();
  }
}

// Guardar ahorros
function guardarAhorros() {
  const ahorro = parseFloat(document.getElementById("ahorros").value) || 0;

  if (ahorro > 0) {
    datosPorMes[mesActual].totalAhorros += ahorro;
    datosPorMes[mesActual].egresosTotales += ahorro;
    document.getElementById("ahorros").value = "";
    generarRecordatorios();
    actualizarUI();
  }
}

// Guardar notas
function guardarNotas() {
  const nota = document.getElementById("notas").value;
  if (nota.trim() !== "") {
    datosPorMes[mesActual].notas.push(nota);
    document.getElementById("notas").value = "";
    actualizarUI();
  }
}

// Generar recordatorios automáticos
function generarRecordatorios() {
  const datos = datosPorMes[mesActual];
  const saldo = datos.ingresosTotales - datos.egresosTotales;
  let recordatorio = "";

  if (saldo < 0) {
    recordatorio = "⚠️ ¡Tu saldo está en números rojos! Revisa tus gastos.";
  } else if (datos.totalAhorros >= 5000) {
    recordatorio = "🎉 ¡Felicidades! Has alcanzado un ahorro significativo.";
  } else if (datos.egresosTotales > datos.ingresosTotales * 0.8) {
    recordatorio = "⚠️ Cuidado, tus gastos están consumiendo más del 80% de tus ingresos.";
  }

  // Agregar recordatorio adicional
  if (datos.egresosTotales > 0 && datos.egresosTotales < 1000) {
    recordatorio = "📝 Tienes que ahorrar por lo menos $1000 este mes.";
  }

  // Recordatorio para la renta
  if (!recordatorio) {
    recordatorio = "🏠 Tienes que pagar la renta antes del día 15.";
  }

  document.getElementById("recordatorios-automaticos").innerText = recordatorio || "Todo está bajo control.";
}

// Actualizar UI
function actualizarUI() {
  const datos = datosPorMes[mesActual];
  const saldo = datos.ingresosTotales - datos.egresosTotales;

  // Actualizar resumen
  document.getElementById("ingresos-totales").innerText = `$${datos.ingresosTotales.toFixed(2)}`;
  document.getElementById("egresos-totales").innerText = `$${datos.egresosTotales.toFixed(2)}`;
  document.getElementById("saldo").innerText = `$${saldo.toFixed(2)}`;
  document.getElementById("total-ahorros").innerText = `Ahorros Totales: $${datos.totalAhorros.toFixed(2)}`;

  // Actualizar lista de gastos
  const listaGastos = document.getElementById("lista-gastos");
  listaGastos.innerHTML = "";
  datos.gastos.forEach(gasto => {
    const li = document.createElement("li");
    li.innerText = `${gasto.nombre}: $${gasto.monto.toFixed(2)}`;
    listaGastos.appendChild(li);
  });

  // Actualizar lista de notas
  const listaNotas = document.getElementById("lista-notas");
  listaNotas.innerHTML = "";
  datos.notas.forEach(nota => {
    const li = document.createElement("li");
    li.innerText = nota;
    listaNotas.appendChild(li);
  });
}
