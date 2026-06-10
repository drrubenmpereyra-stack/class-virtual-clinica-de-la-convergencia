// --- INICIALIZACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyD47_2UtWLFI_VRVvvXVAqn4zZzZ4d1ggo",
  authDomain: "av-clinica-convergencia.firebaseapp.com",
  databaseURL: "https://av-clinica-convergencia-default-rtdb.firebaseio.com",
  projectId: "av-clinica-convergencia",
  storageBucket: "av-clinica-convergencia.firebasestorage.app",
  messagingSenderId: "939404425675",
  appId: "1:939404425675:web:8cfae157099efabd741e4e"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CONFIGURACION_USUARIOS = [
    { user: "DRPEREYRA", pass: "235689", nombre: "Dr. Rubén M. Pereyra", rol: "admin" },
    { user: "RIOS", pass: "R305", nombre: "Rios Graciela", rol: "alumno" },
    { user: "SCHWAB", pass: "S473", nombre: "Schwab Gisela", rol: "alumno" },
    { user: "STEFANINI", pass: "S297", nombre: "Stefanini Benzo Romina", rol: "alumno" },
    { user: "RODRIGUEZ", pass: "R325", nombre: "Rodriguez Ramiro", rol: "alumno" },
    { user: "CAON", pass: "C703", nombre: "Caon Federico", rol: "alumno" },
    { user: "PRAVAZ", pass: "P206", nombre: "Pravaz Emilia", rol: "alumno" }
];

const MAPA_BOTONES = {
    "Encuentros": "btn-gold", "Talleres": "btn-gold", "Biblioteca": "btn-gold",
    "Participantes": "btn-red", "Legajos": "btn-red", "Pagos": "btn-red", "Asistencia": "btn-red",
    "Calificaciones": "btn-green", "Auditoria Test": "btn-green", "Auditoria Taller": "btn-green", "Edición Test": "btn-green", "Auditoria Autoevaluación": "btn-green",
    "Analíticos": "btn-orange", "Visado analíticos": "btn-orange", "Emitir diplomas": "btn-orange", "Central de diplomas": "btn-orange",
    "Actividades recreativas": "btn-blue", "Enviar mensajes": "btn-blue",
    "Mis Test": "btn-sky", "Autoaprendizaje": "btn-sky", "Mis pagos": "btn-sky", "Mi asistencia": "btn-sky", "Mi analítico": "btn-sky", "Mi diploma": "btn-sky", "Mis mensajes": "btn-sky", "Autoevaluación": "btn-sky"
};

const LISTA_ADMIN = ["Encuentros", "Talleres", "Biblioteca", "Actividades recreativas", "Participantes", "Legajos", "Pagos", "Asistencia", "Calificaciones", "Analíticos", "Visado analíticos", "Emitir diplomas", "Herramientas", "Edición Test", "Auditoria Test", "Auditoria Taller", "Central de diplomas", "Enviar mensajes", "Auditoria Autoevaluación"];
const LISTA_ALUMNO = ["Encuentros", "Talleres", "Biblioteca", "Actividades recreativas", "Mis Test", "Autoaprendizaje", "Mis pagos", "Mi asistencia", "Mi analítico", "Mi diploma", "Mis mensajes", "Autoevaluación"];

let usuarioActual = null;

function renderLogin() {
    document.getElementById('main-view').innerHTML = `
        <div class="card" style="max-width: 400px; margin: 40px auto;">
            <img src="logo.jpg" style="width: 120px; margin-bottom: 20px;">
            <input type="text" id="user" placeholder="Usuario">
            <input type="password" id="pass" placeholder="Contraseña">
            <button id="btn-ingresar" class="btn-gold" style="width: 100%;">Ingresar</button>
        </div>
    `;
    document.getElementById('btn-ingresar').onclick = () => {
        const u = document.getElementById('user').value.toUpperCase();
        const p = document.getElementById('pass').value;
        const user = CONFIGURACION_USUARIOS.find(x => x.user === u && x.pass === p);
        if (user) { usuarioActual = user; reproducirIntro(); }
        else { alert("Credenciales incorrectas"); }
    };
}

function reproducirIntro() {
    document.getElementById('main-view').innerHTML = `
        <div style="text-align:center;">
            <video id="intro-video" width="600" autoplay onended="mostrarDashboard()">
                <source src="https://github.com/drrubenmpereyra-stack/intro-aula-virtial-cc-DRPEREYRA/raw/refs/heads/main/INTRO_CC.mp4" type="video/mp4">
            </video>
        </div>
    `;
}

function mostrarDashboard() {
    const navMenu = document.getElementById('nav-menu');
    const botones = usuarioActual.rol === 'admin' ? LISTA_ADMIN : LISTA_ALUMNO;
    navMenu.innerHTML = botones.map(b => `<button class="${MAPA_BOTONES[b] || ''}">${b}</button>`).join('');
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <img src="${usuarioActual.user.toLowerCase()}.jpg" onerror="this.src='logo.jpg'" style="width:150px; border-radius:50%; border:3px solid #00d2ff;">
            <h2>Bienvenido, ${usuarioActual.nombre}</h2>
        </div>
    `;
}

document.body.onload = renderLogin;