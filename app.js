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
    
    // Aquí es donde "conectas" cada botón a su función:
    if (b === "Encuentros") {
        btn.onclick = () => mostrarEncuentros();
    }
    
    // AGREGA ESTO PARA LA BIBLIOTECA:
    if (b === "Biblioteca") {
        btn.onclick = () => mostrarBiblioteca();
    }
    // PARA TALLERES
    if (b === "Talleres") {
    btn.onclick = () => mostrarTalleres();
}
// PARA PARTICIPANTES (solo vista adm)
if (b === "Participantes") {
    btn.onclick = () => mostrarParticipantes();
}
// PARA PAGOS (Solo vista admin)
if (b === "Pagos") {
    btn.onclick = () => mostrarDashboardPagos();
}
// PARA MIS PAGOS
if (b === "Mis pagos") {
    btn.onclick = () => mostrarMisPagos(usuarioActual.nombre);
}
// PARA ASISTENCIA (vista adm)
if (b === "Asistencia") {
    btn.onclick = () => mostrarDashboardAsistencia();
}
// PARA ASISTENCIA (vista alumno)
if (b === "Mi asistencia") {
    btn.onclick = () => mostrarMiAsistencia(usuarioActual.nombre);
}
// PARA ENVIAR MENSAJES (vista Adm)
if (b === "Enviar mensajes") { 
    btn.onclick = () => renderFormularioAdmin();
}
// PARA MIS MENSAJES (vista estudiante)
if (b === "Mis mensajes") {
    btn.onclick = () => renderVistaEstudiante();
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
// --- LÓGICA DE BIBLIOTECA ---

window.mostrarBiblioteca = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Biblioteca</h2><div id="lista-biblioteca">Cargando...</div>`;
    
    if (usuarioActual.rol === 'admin') {
        const btnCarga = document.createElement('button');
        btnCarga.className = "btn-gold";
        btnCarga.innerText = "Cargar Nuevo Material";
        btnCarga.onclick = () => renderFormularioBiblioteca();
        main.prepend(btnCarga);
    }

    const snapshot = await db.collection("biblioteca").get();
    let htmlLista = ""; 
    
    snapshot.forEach(doc => {
        const item = doc.data();
        htmlLista += `
            <div class="card" style="margin-top:20px; border: 1px solid #ccc;">
                <h3>${item.nombre}</h3>
                <img src="${item.imagen}" style="width:150px; display:block; margin:auto;" onerror="this.src='logo.jpg'">
                <br>
                <button onclick="window.open('${item.pdf}')">Ver / Descargar PDF</button>
                ${usuarioActual.rol === 'admin' ? `
                    <button onclick="renderFormularioBiblioteca('${doc.id}')" class="btn-green">Editar</button>
                    <button onclick="eliminarMaterial('${doc.id}')" class="btn-red">Eliminar</button>
                ` : ''}
            </div>`;
    });
    document.getElementById('lista-biblioteca').innerHTML = htmlLista || "<p>No hay material en la biblioteca.</p>";
};

window.renderFormularioBiblioteca = async (id = null) => {
    let item = { nombre: '', imagen: '', pdf: '' };
    if (id) {
        const doc = await db.collection("biblioteca").doc(id).get();
        item = doc.data();
    }
    
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>${id ? 'Editar' : 'Cargar'} Material</h2>
            <input id="inNombre" value="${item.nombre}" placeholder="Nombre del material">
            <input id="inImg" value="${item.imagen}" placeholder="Link de imagen">
            <input id="inPdf" value="${item.pdf}" placeholder="Link del PDF en Drive">
            <button onclick="guardarMaterial('${id || ''}')" class="btn-gold">Guardar Datos</button>
            <button onclick="mostrarBiblioteca()" class="btn-red">Cancelar</button>
        </div>
    `;
};

window.guardarMaterial = async (id) => {
    const data = {
        nombre: document.getElementById('inNombre').value,
        imagen: document.getElementById('inImg').value,
        pdf: document.getElementById('inPdf').value
    };
    
    if (id) await db.collection("biblioteca").doc(id).update(data);
    else await db.collection("biblioteca").add(data);
    
    alert("Material guardado correctamente");
    mostrarBiblioteca();
};

window.eliminarMaterial = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este material?")) {
        await db.collection("biblioteca").doc(id).delete();
        mostrarBiblioteca();
    }
};
// --- LÓGICA DE TALLERES ---
window.mostrarTalleres = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Talleres</h2><div id="lista-talleres">Cargando...</div>`;
    
    if (usuarioActual.rol === 'admin') {
        const btnCarga = document.createElement('button');
        btnCarga.className = "btn-gold";
        btnCarga.innerText = "Cargar Nuevo Taller";
        btnCarga.onclick = () => renderFormularioTalleres();
        main.prepend(btnCarga);
    }

    const snapshot = await db.collection("talleres").get();
    let htmlLista = ""; 
    
    snapshot.forEach(doc => {
        const item = doc.data();
        htmlLista += `
            <div class="card" style="margin-top:20px; border: 1px solid #ccc;">
                <h3>${item.nombre}</h3>
                <img src="${item.imagen}" style="width:150px; display:block; margin:auto;" onerror="this.src='logo.jpg'">
                <p>Descripción: ${item.descripcion || 'Sin descripción'}</p>
                <button onclick="window.open('${item.link}')">Acceder al Taller</button>
                ${usuarioActual.rol === 'admin' ? `
                    <button onclick="renderFormularioTalleres('${doc.id}')" class="btn-green">Editar</button>
                    <button onclick="eliminarTaller('${doc.id}')" class="btn-red">Eliminar</button>
                ` : ''}
            </div>`;
    });
    document.getElementById('lista-talleres').innerHTML = htmlLista || "<p>No hay talleres disponibles.</p>";
};

window.renderFormularioTalleres = async (id = null) => {
    let item = { nombre: '', imagen: '', descripcion: '', link: '' };
    if (id) {
        const doc = await db.collection("talleres").doc(id).get();
        item = doc.data();
    }
    
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>${id ? 'Editar' : 'Cargar'} Taller</h2>
            <input id="inNombre" value="${item.nombre}" placeholder="Nombre del taller">
            <input id="inImg" value="${item.imagen}" placeholder="Link de imagen">
            <input id="inDesc" value="${item.descripcion}" placeholder="Breve descripción">
            <input id="inLink" value="${item.link}" placeholder="Link de acceso">
            <button onclick="guardarTaller('${id || ''}')" class="btn-gold">Guardar Datos</button>
            <button onclick="mostrarTalleres()" class="btn-red">Cancelar</button>
        </div>
    `;
};

window.guardarTaller = async (id) => {
    const data = {
        nombre: document.getElementById('inNombre').value,
        imagen: document.getElementById('inImg').value,
        descripcion: document.getElementById('inDesc').value,
        link: document.getElementById('inLink').value
    };
    
    if (id) await db.collection("talleres").doc(id).update(data);
    else await db.collection("talleres").add(data);
    
    alert("Taller guardado correctamente");
    mostrarTalleres();
};

window.eliminarTaller = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este taller?")) {
        await db.collection("talleres").doc(id).delete();
        mostrarTalleres();
    }
};

// --- LÓGICA DE PARTICIPANTES ---
window.mostrarParticipantes = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Participantes</h2><div id="lista-participantes">Cargando...</div>`;
    
    const btnCarga = document.createElement('button');
    btnCarga.className = "btn-gold";
    btnCarga.innerText = "Cargar Nuevo Participante";
    btnCarga.onclick = () => renderFormularioParticipante();
    main.prepend(btnCarga);

    const snapshot = await db.collection("participantes").get();
    
    // CORRECCIÓN: He agregado los TH faltantes (Título y DNI)
    let html = `<table class="tabla-clinica">
        <thead>
            <tr><th>Foto</th><th>Nombre</th><th>DNI</th><th>Profesión</th><th>Legajo</th><th>Teléfono</th><th>Título</th><th>DNI</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;
    
    snapshot.forEach(doc => {
        const p = doc.data();
        html += `<tr>
            <td><img src="${p.imagen || 'logo.jpg'}" class="foto-participante" onerror="this.src='logo.jpg'"></td>
            <td>${p.nombre}</td>
            <td>${p.dni}</td>
            <td>${p.profesion}</td>
            <td>${p.legajo}</td>
            <td>${p.telefono}</td>
            <td>${p.titulo ? `<a href="${p.titulo}" target="_blank" style="color:var(--cyan); font-size: 20px; text-decoration:none;">●</a>` : `<span style="color:#ccc; font-size: 20px;">○</span>`}</td>
            <td>${p.dniImg ? `<a href="${p.dniImg}" target="_blank" style="color:var(--cyan); font-size: 20px; text-decoration:none;">●</a>` : `<span style="color:#ccc; font-size: 20px;">○</span>`}</td>
            <td>
                <button onclick="renderFormularioParticipante('${doc.id}')" class="btn-green">Editar</button>
                <button onclick="eliminarParticipante('${doc.id}')" class="btn-red">Eliminar</button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('lista-participantes').innerHTML = html;
};

window.renderFormularioParticipante = async (id = null) => {
    let p = { nombre: '', dni: '', profesion: '', legajo: '', telefono: '', imagen: '' };
    if (id) { const doc = await db.collection("participantes").doc(id).get(); p = doc.data(); }
    
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>${id ? 'Editar' : 'Cargar'} Participante</h2>
            <input id="inNombre" value="${p.nombre}" placeholder="Apellido y Nombres">
            <input id="inDni" value="${p.dni}" placeholder="D.N.I.">
            <input id="inProf" value="${p.profesion}" placeholder="Profesión">
            <input id="inLegajo" value="${p.legajo}" placeholder="Código/Legajo (Pass)">
            <input id="inTel" value="${p.telefono}" placeholder="Teléfono">
            <input id="inImg" value="${p.imagen}" placeholder="Link de foto (Drive)">
            <input id="inTitulo" value="${p.titulo || ''}" placeholder="Link Drive: Título">
            <input id="inDniImg" value="${p.dniImg || ''}" placeholder="Link Drive: DNI (Anverso/Reverso)">
            <button onclick="guardarParticipante('${id || ''}')" class="btn-gold">Guardar Datos</button>
            <button onclick="mostrarParticipantes()" class="btn-red">Cancelar</button>
        </div>
    `;
};

window.guardarParticipante = async (id) => {
    const data = {
        nombre: document.getElementById('inNombre').value,
        dni: document.getElementById('inDni').value,
        profesion: document.getElementById('inProf').value,
        legajo: document.getElementById('inLegajo').value,
        telefono: document.getElementById('inTel').value,
        imagen: document.getElementById('inImg').value, 
        titulo: document.getElementById('inTitulo').value,
        dniImg: document.getElementById('inDniImg').value
    };
    if (id) await db.collection("participantes").doc(id).update(data);
    else await db.collection("participantes").add(data);
    alert("Participante guardado");
    mostrarParticipantes();
};

window.eliminarParticipante = async (id) => {
    if (confirm("¿Seguro que quieres borrar a este participante?")) {
        await db.collection("participantes").doc(id).delete();
        mostrarParticipantes();
    }
};
window.mostrarDashboardPagos = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Dashboard Financiero</h2><div id="stats-container">Cargando datos...</div>`;

    const snapshot = await db.collection("pagos").get();
    let pagado = 0, pendiente = 0;

    snapshot.forEach(doc => {
        const p = doc.data();
        const monto = parseFloat(p.monto) || 0;
        if (p.estado === 'Pagado') pagado += monto;
        else if (p.estado === 'Pendiente') pendiente += monto;
    });

    const total = pagado + pendiente;
    const porcentaje = total > 0 ? (pagado / total) * 100 : 0;

    document.getElementById('stats-container').innerHTML = `
        <div class="card">
            <h3>Resumen: ${porcentaje.toFixed(1)}% Cobrado</h3>
            <progress value="${pagado}" max="${total}" style="width:100%; height:30px;"></progress>
            <p><strong>Pagado:</strong> $${pagado.toLocaleString()} | <strong>Pendiente:</strong> $${pendiente.toLocaleString()}</p>
            <button onclick="renderFormularioPago()" class="btn-gold">+ Registrar Pago</button>
            <button onclick="mostrarListaPagos()" class="btn-green">Ver Lista Completa</button>
        </div>`;
};
window.renderFormularioPago = () => {
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>Registrar Nuevo Pago</h2>
            <input id="inNombreEstudiante" placeholder="Nombre del Estudiante">
            <select id="inEncuentro">${[...Array(10)].map((_, i) => `<option value="${i+1}">Encuentro ${i+1}</option>`).join('')}</select>
            <input id="inMonto" type="number" placeholder="Monto ($)">
            <select id="inEstado"><option value="Pagado">Pagado</option><option value="Pendiente">Pendiente</option><option value="Becado">Becado</option></select>
            <select id="inMedio"><option value="Efectivo">Efectivo</option><option value="Transferencia">Transferencia</option></select>
            <button onclick="guardarPago()" class="btn-gold">Guardar Pago</button>
            <button onclick="mostrarDashboardPagos()" class="btn-red">Cancelar</button>
        </div>`;
};
window.guardarPago = async () => {
    const data = {
        nombreEstudiante: document.getElementById('inNombreEstudiante').value,
        encuentro: document.getElementById('inEncuentro').value,
        monto: document.getElementById('inMonto').value,
        estado: document.getElementById('inEstado').value,
        medio: document.getElementById('inMedio').value
    };
    await db.collection("pagos").add(data);
    alert("Pago registrado con éxito");
    mostrarDashboardPagos();
};
window.mostrarListaPagos = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Historial de Pagos</h2><div id="lista-pagos">Cargando...</div>`;
    
    const snapshot = await db.collection("pagos").get();
    let html = `<table class="tabla-clinica">
        <thead><tr><th>Estudiante</th><th>Encuentro</th><th>Monto</th><th>Estado</th><th>Medio</th><th>Acciones</th></tr></thead>
        <tbody>`;
    
    snapshot.forEach(doc => {
        const p = doc.data();
        html += `<tr>
            <td>${p.nombreEstudiante}</td>
            <td>Encuentro ${p.encuentro}</td>
            <td>$${p.monto}</td>
            <td>${p.estado}</td>
            <td>${p.medio}</td>
            <td><button onclick="eliminarPago('${doc.id}')" class="btn-red">Eliminar</button></td>
        </tr>`;
    });
    
    html += `</tbody></table><br><button onclick="mostrarDashboardPagos()" class="btn-red">Volver al Dashboard</button>`;
    document.getElementById('lista-pagos').innerHTML = html;
};
window.eliminarPago = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de pago?")) {
        await db.collection("pagos").doc(id).delete();
        alert("Pago eliminado");
        // Recargamos la lista para ver el cambio
        mostrarListaPagos();
    }
};
window.mostrarMisPagos = async (nombre) => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Mis Pagos</h2><div id="lista-pagos">Cargando...</div>`;

    // Filtramos los pagos por nombre del alumno
    const snapshot = await db.collection("pagos")
                             .where("nombreEstudiante", "==", nombre)
                             .get();
    
    let html = `<table class="tabla-clinica">
        <thead><tr><th>Encuentro</th><th>Monto</th><th>Estado</th><th>Medio</th></tr></thead>
        <tbody>`;
    
    let hayPagos = false;
    snapshot.forEach(doc => {
        hayPagos = true;
        const p = doc.data();
        html += `<tr>
            <td>Encuentro ${p.encuentro}</td>
            <td>$${p.monto}</td>
            <td>${p.estado}</td>
            <td>${p.medio}</td>
        </tr>`;
    });
    
    if (!hayPagos) html += `<tr><td colspan="4">No se encontraron registros de pago.</td></tr>`;
    
    html += `</tbody></table>`;
    document.getElementById('lista-pagos').innerHTML = html;
};
// ASISTENCIA EN VISTA ADMINISTRADOR
// 1. Formulario sin fecha
window.renderFormularioAsistencia = () => {
    document.getElementById('main-view').innerHTML = `
        <div class="card">
            <h2>Registrar Asistencia</h2>
            <input id="inNombreEstudiante" placeholder="Nombre del Estudiante">
            <select id="inEncuentro">${[...Array(10)].map((_, i) => `<option value="${i+1}">Encuentro ${i+1}</option>`).join('')}</select>
            <select id="inEstado">
                <option value="Presente">Presente</option>
                <option value="Ausente">Ausente</option>
                <option value="Justificado">Justificado</option>
            </select>
            <button onclick="guardarAsistencia()" class="btn-green">Guardar Asistencia</button>
            <button onclick="mostrarDashboardAsistencia()" class="btn-red">Volver</button>
        </div>`;
};

// 2. Guardado simple
window.guardarAsistencia = async () => {
    const data = {
        nombreEstudiante: document.getElementById('inNombreEstudiante').value.trim(),
        encuentro: document.getElementById('inEncuentro').value,
        estado: document.getElementById('inEstado').value
    };
    
    await db.collection("asistencia").add(data);
    alert("Asistencia registrada");
    mostrarDashboardAsistencia();
};

// 3. Tabla sin columna de fecha
window.mostrarDashboardAsistencia = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `
        <h2>Control de Asistencia</h2>
        <button onclick="renderFormularioAsistencia()" class="btn-gold">+ Nueva Asistencia</button>
        <div id="lista-asistencia">Cargando...</div>`;
    
    const snapshot = await db.collection("asistencia").get();
    let html = `<table class="tabla-clinica">
        <thead><tr><th>Estudiante</th><th>Encuentro</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>`;
    
    snapshot.forEach(doc => {
        const a = doc.data();
        html += `<tr>
            <td>${a.nombreEstudiante}</td>
            <td>Encuentro ${a.encuentro}</td>
            <td>${a.estado}</td>
            <td><button onclick="eliminarAsistencia('${doc.id}')" class="btn-red">Eliminar</button></td>
        </tr>`;
    });
    
    html += `</tbody></table><br>
             <button onclick="mostrarDashboard()" class="btn-red">Volver al Menú</button>`;
    document.getElementById('lista-asistencia').innerHTML = html;
};

// 4. Eliminación
window.eliminarAsistencia = async (id) => {
    await db.collection("asistencia").doc(id).delete();
    mostrarDashboardAsistencia();
};
window.mostrarMiAsistencia = async (nombre) => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Mi Asistencia</h2><div id="lista-asistencia">Cargando...</div>`;

    // Filtramos la colección "asistencia" por el nombre del usuario logueado
    const snapshot = await db.collection("asistencia")
                             .where("nombreEstudiante", "==", nombre)
                             .get();
    
    let html = `<table class="tabla-clinica">
        <thead><tr><th>Encuentro</th><th>Estado</th></tr></thead>
        <tbody>`;
    
    let hayRegistros = false;
    snapshot.forEach(doc => {
        hayRegistros = true;
        const a = doc.data();
        html += `<tr>
            <td>Encuentro ${a.encuentro}</td>
            <td>${a.estado}</td>
        </tr>`;
    });
    
    if (!hayRegistros) html += `<tr><td colspan="2">No se encontraron registros de asistencia.</td></tr>`;
    
    html += `</tbody></table><br>
             <button onclick="mostrarDashboard()" class="btn-red">Volver</button>`;
    
    document.getElementById('lista-asistencia').innerHTML = html;
};
// Renderizado del formulario
window.renderFormularioAdmin = () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `
        <div class="card-mensajeria">
            <h2>Redactar Comunicación</h2>
            <input id="inAsunto" placeholder="Asunto" class="input-estilo">
            <select id="inDestinatario" class="input-estilo">
                <option value="TODOS">Enviar a TODOS</option>
                ${CONFIGURACION_USUARIOS.filter(u => u.rol === "alumno")
                  .map(u => `<option value="${u.nombre}">${u.nombre}</option>`).join('')}
            </select>
            <div id="emojis" style="margin-bottom:10px;">
                ${['💬', '🧠', '⚡', '📍', '✅'].map(e => `<button onclick="document.getElementById('inCuerpo').value += '${e}'">${e}</button>`).join('')}
            </div>
            <textarea id="inCuerpo" placeholder="Cuerpo del mensaje..." rows="6" class="input-estilo"></textarea>
            <button onclick="enviarMensajeAdmin()" class="btn-enviar">Enviar Mensaje</button>
        </div>`;
};

// Guardar y redireccionar
window.enviarMensajeAdmin = async () => {
    const asunto = document.getElementById('inAsunto').value;
    const destinatario = document.getElementById('inDestinatario').value;
    const cuerpo = document.getElementById('inCuerpo').value;

    await db.collection("mensajes").add({
        remitente: "Administración",
        asunto,
        destinatario,
        cuerpo,
        fecha: new Date().toLocaleString()
    });
    
    // Al finalizar, mostramos el historial
    mostrarHistorialMensajes();
};

// Historial de mensajes (Tabla)
window.mostrarHistorialMensajes = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `<h2>Historial de Comunicaciones</h2><div id="lista-mensajes">Cargando...</div>`;
    
    const snapshot = await db.collection("mensajes").orderBy("fecha", "desc").get();
    
    let html = `
        <table class="tabla-clinica" style="width:100%; border-collapse: collapse; margin-top:20px;">
            <thead>
                <tr style="background:#1b3a2a; color:white;">
                    <th style="padding:10px;">Fecha</th>
                    <th>Remitente</th>
                    <th>Asunto</th>
                    <th>Destinatario</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>`;
    
    snapshot.forEach(doc => {
        const m = doc.data();
        html += `
            <tr style="border-bottom:1px solid #ddd;">
                <td style="padding:10px;">${m.fecha}</td>
                <td>${m.remitente}</td>
                <td>${m.asunto}</td>
                <td>${m.destinatario}</td>
                <td>
                    <button onclick="eliminarMensaje('${doc.id}')" style="background:#d32f2f; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">
                        Eliminar
                    </button>
                </td>
            </tr>`;
    });
    
    html += `</tbody></table>`;
    document.getElementById('lista-mensajes').innerHTML = html;
};

// Función para ejecutar la eliminación
window.eliminarMensaje = async (id) => {
    if (confirm("¿Está seguro de que desea eliminar este mensaje?")) {
        await db.collection("mensajes").doc(id).delete();
        // Recargamos el historial para que desaparezca de la pantalla
        mostrarHistorialMensajes();
    }
};
window.renderVistaEstudiante = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = ''; // Limpieza total

    // 1. Contenedor principal
    const div = document.createElement('div');
    div.className = 'card-mensajeria';
    div.innerHTML = '<h2>Mis Mensajes</h2><div id="lista-mensajes-estudiante"></div>';
    main.appendChild(div);

    // 2. FORMULARIO DE RESPUESTA (Aquí está el botón que te falta)
    const formDiv = document.createElement('div');
    formDiv.style.marginTop = '20px';
    formDiv.innerHTML = `
        <input id="inAsunto" placeholder="Asunto" class="input-estilo">
        <textarea id="inCuerpo" placeholder="Tu mensaje..." class="input-estilo"></textarea>
        <button id="btnEnviar" class="btn-enviar">Enviar al Administrador</button>
    `;
    div.appendChild(formDiv);

    // 3. EVENTO DEL BOTÓN (Directo al nodo)
    document.getElementById('btnEnviar').onclick = async () => {
        const asunto = document.getElementById('inAsunto').value;
        const cuerpo = document.getElementById('inCuerpo').value;
        if(!asunto || !cuerpo) return alert("Completa los campos");
        
        await db.collection("mensajes").add({
            remitente: usuarioActual.nombre, // Asegúrate de que esto exista
            destinatario: "Administración",
            asunto: asunto,
            cuerpo: cuerpo,
            fecha: new Date().toLocaleString()
        });
        alert("Enviado");
        document.getElementById('inAsunto').value = '';
        document.getElementById('inCuerpo').value = '';
    };

    // 4. LECTURA DE MENSAJES (Filtrado)
    const lista = document.getElementById('lista-mensajes-estudiante');
    db.collection("mensajes").orderBy("fecha", "desc").onSnapshot(snapshot => {
        lista.innerHTML = "";
        snapshot.forEach(doc => {
            const m = doc.data();
            if (m.destinatario === "Administración" || m.destinatario === "TODOS" || m.destinatario === usuarioActual.nombre) {
                lista.innerHTML += `<div style="border-bottom:1px solid #ccc; padding:10px;">
                    <strong>${m.remitente}:</strong> ${m.asunto}<br>${m.cuerpo}</div>`;
            }
        });
    });
};
// --- ARRANQUE ---
document.body.onload = renderLogin;
