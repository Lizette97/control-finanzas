// Configuración de Firebase (copia esta parte desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      document.getElementById("login-section").style.display = "none";  // Ocultar login
      actualizarUI();
    })
    .catch(error => {
      document.getElementById("login-error").innerText = "Error: " + error.message;
    });
}

// Registro
function registrar() {
  const email = document.getElementById("registro-email").value;
  const password = document.getElementById("registro-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      document.getElementById("registro-section").style.display = "none";  // Ocultar registro
      actualizarUI();
    })
    .catch(error => {
      document.getElementById("registro-error").innerText = "Error: " + error.message;
    });
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

// Funciones de finanzas
function actualizarTotales() {
  const ingreso = parseFloat(document.getElementById("ingresos").value) || 0;
  datosPorMes[mesActual].ingresosTotales += ingreso;
  document.getElementById("ingresos").value = "";
  actualizarUI();
}

function agregarGasto() {
  const nombre = document.getElementById("nombre-gasto").value;
  const monto = parseFloat(document.getElementById("monto-gasto").value) || 0;

  if (nombre && monto > 0) {
    datosPorMes[mesActual].egresosTotales += monto;
    datosPorMes[mesActual].gastos.push({ nombre, monto });
    document.getElementById("nombre-gasto").value = "";
    document.getElementById("monto-gasto").value = "";
    actualizarUI();
  }
}

// Función para guardar ahorros
function guardarAhorros() {
  const monto = parseFloat(document.getElementById("ahorros").value) || 0;

  if (monto > 0) {
    datosPorMes[mesActual].totalAhorros += monto;
    document.getElementById("ahorros").value = "";
    actualizarUI();
  }
}

// Función para guardar notas
function guardarNotas() {
  const nota = document.getElementById("notas").value.trim();

  if (nota) {
    datosPorMes[mesActual].notas.push(nota);
    document.getElementById("notas").value = "";
    actualizarUI();
  }
}

// Cargar el estado inicial
window.onload = () => {
  document.getElementById("login-section").style.display = "block";  // Mostrar sección de login
};

