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
           <video id="intro-video" width="600" autoplay onended="this.onended=null; mostrarDashboard()">
                <source src="https://github.com/drrubenmpereyra-stack/intro-aula-virtial-cc-DRPEREYRA/raw/refs/heads/main/INTRO_CC.mp4" type="video/mp4">
            </video>
        </div>
    `;
}
// Variable global fuera de la función
let dashboardRenderizado = false;

function mostrarDashboard() {
    const navMenu = document.getElementById('nav-menu');
    
    // LIMPIEZA AGRESIVA: Eliminamos todo nodo hijo antes de crear nada nuevo
    while (navMenu.firstChild) {
        navMenu.removeChild(navMenu.firstChild);
    }
    
    const botones = usuarioActual.rol === 'admin' ? LISTA_ADMIN : LISTA_ALUMNO;
    
    botones.forEach(b => {
        const btn = document.createElement('button');
        btn.className = MAPA_BOTONES[b] || '';
        btn.textContent = b;
        
        if (b === "Encuentros") {
            btn.onclick = () => mostrarEncuentros();
        }
        navMenu.appendChild(btn);
    });

    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <img src="${usuarioActual.user.toLowerCase()}.jpg" onerror="this.src='logo.jpg'" style="width:150px; border-radius:50%; border:3px solid #00d2ff;">
            <h2>Bienvenido, ${usuarioActual.nombre}</h2>
        </div>
    `;
}

document.body.onload = renderLogin;
// --- LÓGICA DE ENCUENTROS ---
window.mostrarEncuentros = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Encuentros</h2><div id="lista-encuentros">Cargando...</div>`;
    
    if (usuarioActual.rol === 'admin') {
        const btnCarga = document.createElement('button');
        btnCarga.className = "btn-gold";
        btnCarga.innerText = "Cargar Nuevo Encuentro";
        btnCarga.onclick = () => renderFormulario();
        main.prepend(btnCarga);
    }

    const snapshot = await db.collection("encuentros").get();
    let htmlLista = ""; 
    
    snapshot.forEach(doc => {
        const e = doc.data();
        const hoy = new Date().toISOString().split('T')[0];
        const estado = (e.fecha >= hoy) ? "Próximo" : "Publicado";
        
        htmlLista += `
            <div class="card" style="margin-top:20px; border: 1px solid #ccc;">
                <h3>${e.nombre}</h3>
                <p>Fecha: ${e.fecha} | Estado: <strong>${estado}</strong></p>
                <img src="${e.imagen}" style="width:150px; display:block; margin:auto;" onerror="this.src='logo.jpg'">
                <br>
                <button onclick="window.open('${e.meet}')">Ir al Meet</button>
                <button onclick="window.open('${e.drive}')">Ver Clase (Drive)</button>
                ${usuarioActual.rol === 'admin' ? `
                    <button onclick="renderFormulario('${doc.id}')" class="btn-green">Editar</button>
                    <button onclick="eliminarEncuentro('${doc.id}')" class="btn-red">Eliminar</button>
                ` : ''}
            </div>`;
    });
    document.getElementById('lista-encuentros').innerHTML = htmlLista || "<p>No hay encuentros cargados.</p>";
};

window.renderFormulario = async (id = null) => {
    let e = { nombre: '', imagen: '', fecha: '', meet: '', drive: '' };
    if (id) {
        const doc = await db.collection("encuentros").doc(id).get();
        e = doc.data();
    }
    
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>${id ? 'Editar' : 'Cargar'} Encuentro</h2>
            <input id="inNombre" value="${e.nombre}" placeholder="Nombre del encuentro">
            <input id="inImg" value="${e.imagen}" placeholder="Link de imagen">
            <input id="inFecha" type="date" value="${e.fecha}">
            <input id="inMeet" value="${e.meet}" placeholder="Link de Meet">
            <input id="inDrive" value="${e.drive}" placeholder="Link de Clase Grabada (Drive)">
            <button onclick="guardarEncuentro('${id || ''}')" class="btn-gold">Guardar Datos</button>
            <button onclick="mostrarEncuentros()" class="btn-red">Cancelar</button>
        </div>
    `;
};

window.guardarEncuentro = async (id) => {
    const data = {
        nombre: document.getElementById('inNombre').value,
        imagen: document.getElementById('inImg').value,
        fecha: document.getElementById('inFecha').value,
        meet: document.getElementById('inMeet').value,
        drive: document.getElementById('inDrive').value
    };
    
    if (id) await db.collection("encuentros").doc(id).update(data);
    else await db.collection("encuentros").add(data);
    
    alert("Datos guardados correctamente");
    mostrarEncuentros();
};

window.eliminarEncuentro = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este encuentro?")) {
        await db.collection("encuentros").doc(id).delete();
        mostrarEncuentros();
    }
};
