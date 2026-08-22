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
    "Participantes": "btn-red", "Pagos": "btn-red", "Asistencia": "btn-red",
    "Calificaciones": "btn-green", "Auditoria Test": "btn-green", "Auditoria Taller": "btn-green", 
    "Analíticos": "btn-orange", "Visado analíticos": "btn-orange", "Emitir diplomas": "btn-orange", "Central de diplomas": "btn-orange",
    "Actividades recreativas": "btn-blue", "Enviar mensajes": "btn-blue", "Monitor resonancia evaluativa": "btn red", "Mi resonancia evaluativa": "btn red", 
    "Mis Test": "btn-sky", "Mis Talleres": "btn-sky", "Mis pagos": "btn-sky", "Mi asistencia": "btn-sky", "Mi analítico": "btn-sky", "Mi diploma": "btn-sky", "Mis mensajes": "btn-sky", "Mis calificaciones": "btn-sky", "Herramientas": "btn-red", "Mi red evaluativa": "btn-orange", "Salir": "btn-red",
};

const LISTA_ADMIN = ["Encuentros", "Talleres", "Biblioteca", "Actividades recreativas", "Participantes", "Pagos", "Asistencia", "Calificaciones", "Analíticos", "Visado analíticos", "Emitir diplomas", "Herramientas", "Auditoria Test", "Auditoria Taller", "Central de diplomas", "Enviar mensajes", "Monitor resonancia evaluativa",  "Salir" ];
const LISTA_ALUMNO = ["Encuentros", "Talleres", "Biblioteca", "Actividades recreativas", "Mis Test", "Mis Talleres", "Mis pagos", "Mi asistencia", "Mi analítico", "Mi diploma", "Mis mensajes", "Mis calificaciones", "Mi resonancia evaluativa", "Mi red evaluativa",  "Salir"];

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
    btn.onclick = () => abrirVistaPagos();
}
// PARA ASISTENCIA (vista alumno)
if (b === "Mi asistencia") {
    btn.onclick = () => mostrarMiAsistencia(usuarioActual.nombre);
}
// PARA ASISTENCIA (vista administrador)
if (b === "Asistencia") {
    btn.onclick = () => mostrarAsistenciaAdmin();
}
// MENSAJES ADM
if (b === "Enviar mensajes") {
    btn.onclick = () => window.iniciarModuloComunicacion(true);
}
// MENSAJES ALUMNOS
if (b === "Mis mensajes") {
    btn.onclick = () => window.iniciarModuloComunicacion(false);
}
// ACTIVIDADES RECREATIVAS
if (b === "Actividades recreativas") {
    btn.onclick = () => window.iniciarModuloActividades();
}
// PARA MIS TEST (alumno)
if (b === "Mis Test") {
    btn.onclick = () => window.iniciarModuloTest();
}
// PARA AUDITORIA TEST
if (b === "Auditoria Test") {
    btn.onclick = () => auditoriaTest();
}
// PARA MIS TALLERES (alumnos)
if (b === "Mis Talleres") {
    btn.onclick = () => gestionarTalleres();
}
// PARA AUDITORIA TALLER
if (b === "Auditoria Taller") { 
    btn.onclick = () => auditoriaTaller(); 
}
// DEPARTAMENTO DE TITULOS
if (b === "Central de diplomas") {
    btn.onclick = () => gestionarDiplomas();
}
// EMITIR DIPLOMA
if (b === "Emitir diplomas") {
    btn.onclick = () => emitirDiplomas();
}
// MI DIPLOMA (ALUMNOS)
if (b === "Mi diploma") {
    btn.onclick = () => gestionarDiploma();
    
}
// CALIFICACIONES (ADMINISTRADOR)
if (b === "Calificaciones") {
    btn.onclick = () => gestionarCalificacionesAdmin();
}
// PARA MIS CALIFICACIONES (alumnos)
if (b === "Mis calificaciones") {
    btn.onclick = () => abrirMisCalificaciones();
}

// ANALITICOS (ADMINISTRADOR)
if (b === "Analíticos") {
    btn.onclick = () => mostrarSeccion('analiticos');
}
// MI ASISTENCIA (vista alumno)
if (b === "Mi asistencia") {
    btn.onclick = () => abrirVistaAsistencia();
}

// AUDITORIA ANALÍTICOS (ADMINISTRADOR)
if (b === "Visado analíticos") {
    btn.onclick = () => window.abrirAuditoriaAnaliticos();
}
// MI ANALITICO
if (b === "Mi analítico") {
    btn.onclick = () => abrirMiAnalitico();
}
// PARA HERRAMIENTAS (ADM)
if (b === "Herramientas") {
        btn.onclick = () => limpiarDatosPrueba();
    }
// PARA HERRAMIENTAS (administrador)
if (b === "Herramientas") {
        btn.onclick = () => mostrarHerramientasAdministrador();
    }
// PARA MONITOR RESONANCIA EVALUATIVA (ADM)
if (b === "Monitor resonancia evaluativa") {
    btn.onclick = () => iniciarMonitorResonancia();
}
// PARA RESONANCIA EVALUATIVA (ALUMNOS)
if (b === "Mi resonancia evaluativa") {
    btn.onclick = () => abrirVistaMiResonancia();
}
// PARA MI RED EVALUATIVA
if (b === "Mi red evaluativa") {
    btn.onclick = () => abrirVistaRedEvaluativa();
}


// PARA SALIR
if (b === "Salir") {
        btn.onclick = () => salirSistema();
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
window.iniciarModuloComunicacion = async (esAdmin) => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.className = 'card-mensajeria';
    contenedor.style.cssText = "border: 2px solid #2e7d32; padding: 20px; border-radius: 8px;";

    if (esAdmin) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Enviar Comunicación';
        contenedor.appendChild(h2);

        const lblDest = document.createElement('label');
        lblDest.textContent = 'Destinatario: ';
        const selectDest = document.createElement('select');
        selectDest.style.cssText = "border: 1px solid #000; display: block; margin-bottom: 10px; width: 100%;";

        const optTodos = document.createElement('option');
        optTodos.value = "TODOS"; optTodos.textContent = "TODOS";
        selectDest.appendChild(optTodos);

        // --- CARGA DINÁMICA CORREGIDA ---
        try {
            const snap = await db.collection("usuarios").get();
            snap.forEach((doc) => {
                const u = doc.data();
                // Verificamos si 'u' existe antes de intentar leer propiedades
                if (u) {
                    // CAMBIA 'nombre' SI EL CAMPO EN TU DB SE LLAMA DE OTRA FORMA
                    const nombreMostrar = u.nombre || u.nombre_completo || ""; 
                    
                    if (nombreMostrar) {
                        const opt = document.createElement('option');
                        opt.value = nombreMostrar;
                        opt.textContent = nombreMostrar;
                        selectDest.appendChild(opt);
                    }
                }
            });
        } catch (e) {
            console.error("Error al cargar la base de datos:", e);
        }

        const inputAsunto = document.createElement('input');
        inputAsunto.placeholder = 'Asunto';
        inputAsunto.style.cssText = "border: 1px solid #000; display: block; width: 100%; margin-bottom: 10px;";
        
        const areaMensaje = document.createElement('textarea');
        areaMensaje.placeholder = 'Mensaje...';
        areaMensaje.style.cssText = "border: 1px solid #000; display: block; width: 100%; height: 80px;";

        const divEmo = document.createElement('div');
        ['😊', '📢', '⚠️', '✅', '📅'].forEach(e => {
            const s = document.createElement('span');
            s.textContent = e;
            s.style.cursor = 'pointer';
            s.onclick = () => areaMensaje.value += e;
            divEmo.appendChild(s);
        });

        const btn = document.createElement('button');
        btn.textContent = 'Enviar';
        btn.style.marginTop = '10px';

        contenedor.append(lblDest, selectDest, inputAsunto, areaMensaje, divEmo, btn);

        btn.onclick = async () => {
            if (!inputAsunto.value || !areaMensaje.value) return alert("Completa los campos");
            await db.collection("mensajes").add({
                remitente: "Administración",
                destinatario: selectDest.value,
                asunto: inputAsunto.value,
                cuerpo: areaMensaje.value,
                fecha: new Date().toLocaleString(),
                leido: false
            });
            inputAsunto.value = ''; areaMensaje.value = '';
            alert("Mensaje enviado a: " + selectDest.value);
        };
    }

    const tabla = document.createElement('table');
    tabla.style.cssText = "width: 100%; border-collapse: collapse; margin-top: 20px;";
    tabla.innerHTML = esAdmin 
        ? '<tr><th>Fecha</th><th>Destinatario</th><th>Asunto</th><th>Mensaje</th><th>Acción</th></tr>'
        : '<tr><th>Remitente</th><th>Fecha</th><th>Asunto</th><th>Mensaje</th><th>Estado</th></tr>';
    
    const tbody = document.createElement('tbody');
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
    vista.appendChild(contenedor);

    db.collection("mensajes").orderBy("fecha", "desc").onSnapshot(snap => {
        tbody.textContent = '';
        snap.forEach(doc => {
            const m = doc.data();
            const tr = document.createElement('tr');
            if (esAdmin) {
                [m.fecha, m.destinatario, m.asunto, m.cuerpo].forEach(v => {
                    const td = document.createElement('td'); td.style.border = "1px solid #ccc"; td.textContent = v; tr.appendChild(td);
                });
                const b = document.createElement('button');
                b.textContent = 'Eliminar';
                b.onclick = () => db.collection("mensajes").doc(doc.id).delete();
                const td = document.createElement('td'); td.appendChild(b); tr.appendChild(td);
            } else {
                [m.remitente, m.fecha, m.asunto, m.cuerpo].forEach(v => {
                    const td = document.createElement('td'); td.style.border = "1px solid #ccc"; td.textContent = v; tr.appendChild(td);
                });
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = m.leido;
                chk.onchange = (e) => db.collection("mensajes").doc(doc.id).update({ leido: e.target.checked });
                const td = document.createElement('td');
                td.textContent = m.leido ? "Leído" : "Pendiente";
                td.prepend(chk);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    });
};
// MODULO COMUNICACION
window.iniciarModuloComunicacion = async (esAdmin) => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.className = 'card-mensajeria';
    contenedor.style.cssText = "border: 2px solid #2e7d32; padding: 20px; border-radius: 8px;";

    if (esAdmin) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Enviar Comunicación';
        contenedor.appendChild(h2);

        const lblDest = document.createElement('label');
        lblDest.textContent = 'Destinatario: ';
        const selectDest = document.createElement('select');
        selectDest.style.cssText = "border: 1px solid #000; display: block; margin-bottom: 10px; width: 100%;";

        const optTodos = document.createElement('option');
        optTodos.value = "TODOS"; optTodos.textContent = "TODOS";
        selectDest.appendChild(optTodos);

        // Bloque de carga que ya confirmamos es correcto
        db.collection("participantes").get().then((snap) => {
            snap.forEach(doc => {
                const u = doc.data();
                if (u.nombre) {
                    const opt = document.createElement('option');
                    opt.value = u.nombre;
                    opt.textContent = u.nombre;
                    selectDest.appendChild(opt);
                }
            });
        }).catch(e => console.error("Error al cargar participantes:", e));

        const inputAsunto = document.createElement('input');
        inputAsunto.placeholder = 'Asunto';
        inputAsunto.style.cssText = "border: 1px solid #000; display: block; width: 100%; margin-bottom: 10px;";
        
        const areaMensaje = document.createElement('textarea');
        areaMensaje.placeholder = 'Mensaje...';
        areaMensaje.style.cssText = "border: 1px solid #000; display: block; width: 100%; height: 80px;";

        const btn = document.createElement('button');
        btn.textContent = 'Enviar';
        btn.style.marginTop = '10px';

        contenedor.append(lblDest, selectDest, inputAsunto, areaMensaje, btn);

        btn.onclick = async () => {
            if (!inputAsunto.value || !areaMensaje.value) return alert("Completa los campos");
            await db.collection("mensajes").add({
                remitente: "Administración",
                destinatario: selectDest.value,
                asunto: inputAsunto.value,
                cuerpo: areaMensaje.value,
                fecha: new Date().toLocaleString(),
                leido: false
            });
            inputAsunto.value = ''; areaMensaje.value = '';
            alert("Mensaje enviado a: " + selectDest.value);
        };
    }

    const tabla = document.createElement('table');
    tabla.style.cssText = "width: 100%; border-collapse: collapse; margin-top: 20px;";
    tabla.innerHTML = esAdmin 
        ? '<tr><th>Fecha</th><th>Destinatario</th><th>Asunto</th><th>Mensaje</th><th>Acción</th></tr>'
        : '<tr><th>Remitente</th><th>Fecha</th><th>Asunto</th><th>Mensaje</th><th>Estado</th></tr>';
    
    const tbody = document.createElement('tbody');
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
    vista.appendChild(contenedor);

    db.collection("mensajes").orderBy("fecha", "desc").onSnapshot(snap => {
        tbody.textContent = '';
        snap.forEach(doc => {
            const m = doc.data();
            const tr = document.createElement('tr');
            if (esAdmin) {
                [m.fecha, m.destinatario, m.asunto, m.cuerpo].forEach(v => {
                    const td = document.createElement('td'); td.style.border = "1px solid #ccc"; td.textContent = v; tr.appendChild(td);
                });
                const b = document.createElement('button');
                b.textContent = 'Eliminar';
                b.onclick = () => db.collection("mensajes").doc(doc.id).delete();
                const td = document.createElement('td'); td.appendChild(b); tr.appendChild(td);
            } else {
                [m.remitente, m.fecha, m.asunto, m.cuerpo].forEach(v => {
                    const td = document.createElement('td'); td.style.border = "1px solid #ccc"; td.textContent = v; tr.appendChild(td);
                });
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = m.leido;
                chk.onchange = (e) => db.collection("mensajes").doc(doc.id).update({ leido: e.target.checked });
                const td = document.createElement('td');
                td.textContent = m.leido ? "Leído" : "Pendiente";
                td.prepend(chk);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    });
};
//ACTIVIDADES RECREATIVAS
window.iniciarModuloActividades = () => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "padding: 20px; text-align: center; color: #fff; font-family: sans-serif;";

    // Botón Salir
    const btnSalir = document.createElement('button');
    btnSalir.textContent = "⬅ Volver al Panel Principal";
    btnSalir.style.cssText = "background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;";
    btnSalir.onclick = () => mostrarDashboard(); // Aquí llamamos a tu función principal
    contenedor.appendChild(btnSalir);

    const h2 = document.createElement('h2');
    h2.textContent = 'Actividades Recreativas - Clínica de la Convergencia';
    h2.style.color = "#2e7d32";
    contenedor.appendChild(h2);

    const grid = document.createElement('div');
    grid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 20px;";
    
    const actividades = [
        { nombre: 'Pacman', link: 'https://drrubenmpereyra-stack.github.io/Pacman-convergencia/', img: 'Pacman.jpg' },
        { nombre: 'Tetris', link: 'https://drrubenmpereyra-stack.github.io/Teris-converencia/', img: 'Tetris.jpg' },
        { nombre: 'Ruleta', link: 'https://drrubenmpereyra-stack.github.io/Ruleta-convergencia/', img: 'Ruleta.jpg' },
        { nombre: 'Batalla Naval', link: 'https://drrubenmpereyra-stack.github.io/Batalla-naval-convergencia/', img: 'Batalla.jpg' },
        { nombre: 'Tejedor de Circuitos', link: 'https://drrubenmpereyra-stack.github.io/tejedor-de-circuitos/', img: 'Tejedor.jpg' },
        { nombre: 'Detectives de la Mente', link: 'https://drrubenmpereyra-stack.github.io/Detectives-de-la-mente/', img: 'Detectives.jpg' },
        { nombre: 'Cartógrafo del Sujeto', link: 'https://drrubenmpereyra-stack.github.io/Cartografo-del-sujeto/', img: 'Cartografo.jpg' },
        { nombre: 'Triage', link: 'https://drrubenmpereyra-stack.github.io/Trige-de-la-convergencia/', img: 'Triage.jpg' }
    ];

    actividades.forEach(act => {
        const card = document.createElement('div');
        card.style.cssText = "border: 2px solid #2e7d32; border-radius: 15px; overflow: hidden; cursor: pointer; background: #1a1a1a;";
        card.innerHTML = `<img src="${act.img}" style="width: 100%;"><div style="padding: 10px; color: #4caf50;">${act.nombre}</div>`;
        card.onclick = () => cargarIframe(act.link, act.nombre);
        grid.appendChild(card);
    });

    contenedor.appendChild(grid);
    vista.appendChild(contenedor);

    const divVisor = document.createElement('div');
    divVisor.id = 'visor-juego';
    divVisor.style.cssText = "margin-top: 30px; display: none; width: 100%;";
    const iframe = document.createElement('iframe');
    iframe.style.cssText = "width: 100%; height: 700px; border: 4px solid #2e7d32; border-radius: 10px;";
    divVisor.appendChild(iframe);
    vista.appendChild(divVisor);

    function cargarIframe(url, nombre) {
        divVisor.style.display = 'block';
        iframe.src = url;
        divVisor.scrollIntoView({ behavior: 'smooth' });
    }
};
// MODULOS DE TEST 1 al 10
window.iniciarModuloTest = () => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "padding: 20px; text-align: center; color: #fff; font-family: sans-serif;";

    const btnSalir = document.createElement('button');
    btnSalir.textContent = "⬅ Volver al Panel Principal";
    btnSalir.style.cssText = "background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;";
    btnSalir.onclick = () => mostrarDashboard(); 
    contenedor.appendChild(btnSalir);

    const h2 = document.createElement('h2');
    h2.textContent = 'Evaluaciones Clínicas - Clínica de la Convergencia';
    h2.style.color = "#D4AF37";
    contenedor.appendChild(h2);

    const grid = document.createElement('div');
    grid.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center; margin-top: 20px; gap: 20px;";
    
    // Lista de datos para los tests (se agregó Test 10)
    const tests = [
        { nombre: "Test 1", img: "Test1.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-1/" },
        { nombre: "Test 2", img: "Test2.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-2/" },
        { nombre: "Test 3", img: "Test3.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-3_1/" },
        { nombre: "Test 4", img: "Test4.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-4/" },
        { nombre: "Test 5", img: "Test5.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-5/" },
        { nombre: "Test 6", img: "Test6.png", url: "https://drrubenmpereyra-stack.github.io/cuestionario6/" },
        { nombre: "Test 7", img: "Test7.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-7/" },
        { nombre: "Test 8", img: "Test8.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-8/" },
        { nombre: "Test 9", img: "Test9.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-9/" },
        { nombre: "Test 10", img: "Test10.png", url: "https://drrubenmpereyra-stack.github.io/Cuestionario-10/" }
    ];

    tests.forEach(test => {
        const card = document.createElement('div');
        card.style.cssText = "border: 2px solid #D4AF37; border-radius: 15px; overflow: hidden; cursor: pointer; width: 220px; background: #050508; transition: transform 0.2s;";
        
        card.innerHTML = `<img src="${test.img}" style="width: 100%;"><div style="padding: 10px; color: #D4AF37;">${test.nombre}</div>`;
        
        card.onclick = () => {
            const nombre = (window.usuarioActual && window.usuarioActual.nombre) ? window.usuarioActual.nombre : "Alumno Anónimo";
            const url = test.url + '?alumno=' + encodeURIComponent(nombre);
            window.open(url, '_blank');
        };
        
        grid.appendChild(card);
    });
    
    contenedor.appendChild(grid);
    vista.appendChild(contenedor);
};
// AUDITORIA TEST (funcion modificada corrige errores)
// AUDITORIA TEST (A prueba de fallos: muestra todo sin filtros estrictos de orden)
window.auditoriaTest = async () => {
    const vista = document.getElementById('main-view');
    vista.innerHTML = '<div style="color: #fff; padding: 20px; text-align: center;">Cargando registros de auditoría...</div>';

    try {
        // Traemos todos los documentos sin el .orderBy estricto para que Firestore no oculte nada
        const snapshot = await db.collection("resultados").get();
        
        let filas = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const esVerificado = data.visibleParaAlumno ? "checked" : "";
            
            filas += `
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 15px;">${data.alumno || 'Sin nombre'}</td>
                    <td style="padding: 15px;">${data.test_numero || 'Test'}</td>
                    <td style="padding: 15px; text-align: center;">${data.nota || '-'}</td>
                    <td style="padding: 15px; text-align: center;">
                        <input type="checkbox" ${esVerificado} onchange="actualizarVisibilidadTest('${doc.id}', this.checked)" style="cursor: pointer; transform: scale(1.5);">
                    </td>
                    <td style="padding: 15px; text-align: center;">
                        <button onclick="eliminarRegistro('${doc.id}', '${data.test_numero || 'Test'}', '${data.alumno || 'Alumno'}')" 
                                style="background:#8b0000; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
        });

        vista.innerHTML = `
            <div style="padding: 20px; color: #fff; font-family: sans-serif;">
                <button onclick="mostrarDashboard()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">⬅ Volver al Panel</button>
                <h2 style="color: #D4AF37; text-align: center; margin-bottom: 20px;">Auditoría de Test</h2>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; max-width: 900px; margin: 0 auto; border-collapse: collapse; background: #050508; border: 1px solid #D4AF37;">
                        <thead>
                            <tr style="background: #1e293b; color: #D4AF37;">
                                <th style="padding: 15px; border: 1px solid #334155;">Estudiante</th>
                                <th style="padding: 15px; border: 1px solid #334155;">Test</th>
                                <th style="padding: 15px; border: 1px solid #334155;">Nota</th>
                                <th style="padding: 15px; border: 1px solid #334155;">Visible / Aprobado</th>
                                <th style="padding: 15px; border: 1px solid #334155;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>${filas || '<tr><td colspan="5" style="padding:20px; text-align:center;">No hay resultados registrados.</td></tr>'}</tbody>
                    </table>
                </div>
            </div>`;
    } catch (e) {
        vista.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">Error al cargar auditoría: ${e.message}</div>`;
    }
};
// DESARROLLO PARA TALLERES 1 al 10 (ALUMNOS)

window.gestionarTalleres = () => {
    const vista = document.getElementById('main-view');
    const talleres = [
        { titulo: "Cartografía de la Intersubjetividad", url: "https://drrubenmpereyra-stack.github.io/Taller/", img: "Taller1.png" },
        { titulo: "Memorias traumáticas y el a posteriori", url: "https://drrubenmpereyra-stack.github.io/Taller-2/", img: "Taller2.png" },
        { titulo: "Circuitos de recompensa y patologías del deseo", url: "https://drrubenmpereyra-stack.github.io/Taller-3/", img: "Taller3.png" },
        { titulo: "El marcador somático en la transferencia", url: "https://drrubenmpereyra-stack.github.io/Taller-4/", img: "Taller4.png" },
        { titulo: "Neurobiología de la repetición", url: "https://drrubenmpereyra-stack.github.io/Taller-5/", img: "Taller5.png" },
        { titulo: "El laberinto de la urgencia y plasticidad sináptica", url: "https://drrubenmpereyra-stack.github.io/Taller-6/", img: "Taller6.png" },
        { titulo: "Arquitectura del Sueño y Función Alucinatoria", url: "https://drrubenmpereyra-stack.github.io/Taller-7/", img: "Taller7.png" },
        { titulo: "El Ello Somático y Trastornos Psicosomáticos", url: "https://drrubenmpereyra-stack.github.io/Taller-8/", img: "Taller8.png" },
        { titulo: "Caso Valeria y el Tormento Límbico", url: "https://drrubenmpereyra-stack.github.io/Taller-9/", img: "Taller9.png" },
        { titulo: "Caso Lucas y la Intoxicación Dopaminérgica", url: "https://drrubenmpereyra-stack.github.io/Taller10/", img: "Taller10.png" }
    ];

    let contenido = `
        <div style="padding: 20px; color: #fff; font-family: sans-serif;">
            <button onclick="mostrarDashboard()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">⬅ Volver al Panel</button>
            <h2 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">Mis Talleres de Convergencia</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                ${talleres.map(t => `
                    <div style="background: #0f172a; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden; text-align: center; padding: 15px;">
                        <img src="${t.img}" style="width: 100%; border-radius: 4px; margin-bottom: 10px;">
                        <h4 style="margin: 10px 0; color: #fff;">${t.titulo}</h4>
                        <a href="${t.url}" target="_blank" style="display: block; background: #D4AF37; color: #000; padding: 10px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acceder al Taller</a>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    vista.innerHTML = contenido;
};
// AUDITORIA TALLER (ADM)
// Función completa de Auditoría de Talleres
window.auditoriaTaller = async () => {
    const vista = document.getElementById('main-view');
    vista.innerHTML = `
        <div style="padding: 20px; color: #fff; font-family: sans-serif;">
            <button onclick="mostrarDashboard()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">⬅ Volver al Panel</button>
            <h2 style="color: #D4AF37; text-align: center; margin-bottom: 20px;">Auditoría de Talleres</h2>
            <table style="width: 100%; border-collapse: collapse; background: #0f172a; border: 1px solid #334155;">
                <thead>
                    <tr style="border-bottom: 2px solid #D4AF37; color: #D4AF37;">
                        <th style="padding: 12px; text-align: left;">Alumno</th>
                        <th style="padding: 12px; text-align: left;">Taller</th>
                        <th style="padding: 12px; text-align: left;">Nota</th>
                        <th style="padding: 12px; text-align: left;">Fecha</th>
                        <th style="padding: 12px; text-align: center;">Verificado</th>
                        <th style="padding: 12px; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="lista-resultados"></tbody>
            </table>
        </div>
    `;

    try {
        const tbody = document.getElementById('lista-resultados');
        const snapshot = await db.collection("resultados_talleres").orderBy("fecha", "desc").get();

        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No hay registros de talleres aún.</td></tr>`;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #334155";
            
            tr.innerHTML = `
                <td style="padding: 12px;">${data.alumno}</td>
                <td style="padding: 12px;">${data.taller_numero}</td>
                <td style="padding: 12px;">${data.nota}</td>
                <td style="padding: 12px;">${data.fecha}</td>
                <td style="padding: 12px; text-align: center;">
                    <input type="checkbox" ${data.verificado ? 'checked' : ''} onchange="toggleVerificado('${doc.id}', this.checked)" style="cursor: pointer; transform: scale(1.5);">
                </td>
                <td style="padding: 12px; text-align: center;">
                    <button onclick="eliminarRegistro('${doc.id}')" style="background: #991b1b; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar auditoría:", error);
        alert("Error al cargar los registros de la base de datos.");
    }
};

// Función para alternar estado de verificación
window.toggleVerificado = async (id, estado) => {
    try {
        await db.collection("resultados_talleres").doc(id).update({ verificado: estado });
    } catch (error) {
        console.error("Error al actualizar verificación:", error);
    }
};

// Función para eliminar un registro con confirmación
window.eliminarRegistro = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de taller?")) {
        try {
            await db.collection("resultados_talleres").doc(id).delete();
            auditoriaTaller(); // Recargar la tabla automáticamente
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
};

// DEPARTAMENTO DE DIPLOMAS
window.gestionarDiplomas = () => {
    // Si la función no se ejecuta, veremos este log en la consola (F12)
    console.log("Abriendo Central de Diplomas...");
    
    // Ejecución forzada de la función
    const vista = document.getElementById('main-view');
    
    const estudiantes = [
        { nombre: "CAON FEDERICO", drive: "https://drive.google.com/drive/folders/1LnnPq0w7P81ShMJsG3MNoLkfhktakV6v?usp=sharing" },
        { nombre: "PRAVAZ EMILIA", drive: "https://drive.google.com/drive/folders/1fOJ27u87krGO9ykIbBtNBT_xSvSUmXuF?usp=drive_link" },
        { nombre: "RIOS GRACIELA", drive: "https://drive.google.com/drive/folders/1da5V0BKy4FghsOCz7B66mNOz7ZTFMKt5?usp=drive_link" },
        { nombre: "RODRIGUEZ RAMIRO", drive: "https://drive.google.com/drive/folders/1kixAS7AqD1zr3pDYKC4mjBBW0sqNimx0?usp=drive_link" },
        { nombre: "SCHWAB GISELA", drive: "https://drive.google.com/drive/folders/1xDl_o19beXQrXMo4AdLBF4TWmEHkqwYb?usp=drive_link" },
        { nombre: "STEFANINI BENZO ROMINA", drive: "https://drive.google.com/drive/folders/1PioVY2n5eJp7W1-c-yLqVzHkiXfNbEzh?usp=drive_link" }
    ];

    vista.innerHTML = `
        <div style="padding: 20px; color: #fff; font-family: sans-serif;">
            <button onclick="mostrarDashboard()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">⬅ Volver al Panel</button>
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="color: #D4AF37;">Central de Diplomas</h2>
                <img src="diploma.png" onclick="window.open('https://drrubenmpereyra-stack.github.io/Departamento-de-titulos-clinica-de-la-convergencia/', '_blank')" 
                     style="width: 200px; cursor: pointer; border: 2px solid #D4AF37;">
            </div>
            <table style="width: 100%; border-collapse: collapse; background: #0f172a;">
                <thead>
                    <tr style="border-bottom: 2px solid #D4AF37; color: #D4AF37;">
                        <th style="padding: 12px; text-align: left;">Apellido y Nombres</th>
                        <th style="padding: 12px; text-align: center;">Acceso Drive</th>
                    </tr>
                </thead>
                <tbody>
                    ${estudiantes.map(e => `
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 12px;">${e.nombre}</td>
                            <td style="padding: 12px; text-align: center;">
                                <input type="checkbox" onchange="if(this.checked) { window.open('${e.drive}', '_blank'); this.checked = false; }" style="cursor: pointer; transform: scale(1.5);">
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};
window.emitirDiplomas = async () => {
    const vista = document.getElementById('main-view');
    vista.innerHTML = `<div style="padding: 20px; color: #fff;">Cargando lista de participantes y diplomas...</div>`;

    try {
        // Obtenemos participantes y los diplomas ya emitidos
        const [snapPart, snapDiplomas] = await Promise.all([
            db.collection("participantes").get(),
            db.collection("registro_diplomas").get()
        ]);

        // Creamos un mapa de diplomas emitidos para consultar rápido
        const diplomasEmitidos = {};
        snapDiplomas.forEach(doc => {
            const d = doc.data();
            diplomasEmitidos[d.alumno] = d; 
        });

        let htmlTabla = `
            <div style="padding: 20px; color: #fff;">
                <button onclick="mostrarDashboard()" style="background:#d32f2f; color:white; padding:10px; border:none; cursor:pointer;">⬅ Volver</button>
                <h2 style="color:#D4AF37; text-align:center;">Emisión de Diplomas</h2>
                <table class="tabla-diplomas" style="width:100%; border-collapse:collapse; background:#0f172a; margin-top:20px; color:white;">
                    <thead>
                        <tr style="border-bottom: 2px solid #D4AF37;">
                            <th style="padding:10px;">Alumno</th>
                            <th style="padding:10px;">Fecha</th>
                            <th style="padding:10px;">Observaciones</th>
                            <th style="padding:10px;">Emitido</th>
                        </tr>
                    </thead>
                    <tbody>`;

        snapPart.forEach(doc => {
            const p = doc.data();
            const id = doc.id;
            const emitido = diplomasEmitidos[p.nombre];
            
            // Si ya está emitido, precargamos los datos
            const fechaVal = emitido ? emitido.fecha : '';
            const obsVal = emitido ? emitido.observaciones : '';
            const check = emitido ? 'checked' : '';
            const colorSwitch = emitido ? 'background-color: #D4AF37;' : '';

            htmlTabla += `
                <tr style="border-bottom:1px solid #334155;">
                    <td style="padding:10px;">${p.nombre}</td>
                    <td style="padding:10px;"><input type="date" id="f-${id}" value="${fechaVal}" style="background:#1e293b; color:white; border:1px solid #475569; padding:5px;"></td>
                    <td style="padding:10px;"><input type="text" id="obs-${id}" value="${obsVal}" style="background:#1e293b; color:white; border:1px solid #475569; padding:5px;"></td>
                    <td style="padding:10px; text-align:center;">
                        <label class="switch">
                            <input type="checkbox" id="sw-${id}" ${check} onchange="guardarDiploma('${id}', '${p.nombre}')">
                            <span class="slider" style="${colorSwitch}"></span>
                        </label>
                    </td>
                </tr>`;
        });

        htmlTabla += `</tbody></table></div>`;
        vista.innerHTML = htmlTabla;
    } catch (e) {
        console.error("Error al cargar:", e);
        vista.innerHTML = `<p style="color:red;">Error al cargar la base de datos.</p>`;
    }
};window.guardarDiploma = async (id, nombre) => {
    const sw = document.getElementById(`sw-${id}`);
    const slider = sw.nextElementSibling;
    const fecha = document.getElementById(`f-${id}`).value;
    const obs = document.getElementById(`obs-${id}`).value;

    if (sw.checked) {
        if (!fecha) {
            alert("¡Error! Debes ingresar la fecha primero.");
            sw.checked = false;
            return;
        }
        try {
            // Usamos .set() con un ID único basado en el nombre para evitar duplicados
            await db.collection("registro_diplomas").doc(nombre).set({
                alumno: nombre,
                fecha: fecha,
                observaciones: obs,
                timestamp: new Date()
            });
            slider.style.backgroundColor = "#D4AF37";
            alert(`Diploma de ${nombre} registrado con éxito.`);
        } catch (e) {
            console.error(e);
            sw.checked = false;
        }
    } else {
        // Si desmarca, eliminamos el registro
        try {
            await db.collection("registro_diplomas").doc(nombre).delete();
            slider.style.backgroundColor = "#334155";
            alert(`Diploma de ${nombre} eliminado.`);
        } catch (e) {
            console.error(e);
        }
    }
};
// Mi diploma
window.gestionarDiploma = () => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "padding: 20px; text-align: center; color: #fff; font-family: sans-serif;";

    // Botón Salir
    const btnSalir = document.createElement('button');
    btnSalir.textContent = "⬅ Volver al Panel Principal";
    btnSalir.style.cssText = "background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;";
    btnSalir.onclick = () => mostrarDashboard();
    contenedor.appendChild(btnSalir);

    const h2 = document.createElement('h2');
    h2.textContent = 'Certificación de Formación';
    h2.style.color = "#D4AF37";
    h2.style.marginBottom = "30px";
    contenedor.appendChild(h2);

    // Contenedor de la Carta
    const divCarta = document.createElement('div');
    divCarta.style.cssText = "max-width: 700px; margin: 0 auto;";

    const imgCarta = document.createElement('img');
    imgCarta.src = 'carta.jpg';
    imgCarta.style.cssText = "width: 100%; border-radius: 10px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); margin-bottom: 30px;";
    divCarta.appendChild(imgCarta);

    // Botón de acceso al Diploma (Imagen)
    const imgDiploma = document.createElement('img');
    imgDiploma.src = 'diploma.png';
    imgDiploma.style.cssText = "width: 200px; cursor: pointer; transition: transform 0.2s;";
    imgDiploma.onmouseover = () => imgDiploma.style.transform = 'scale(1.05)';
    imgDiploma.onmouseout = () => imgDiploma.style.transform = 'scale(1)';
    
    // Acción de redirección
    imgDiploma.onclick = () => window.open("https://drrubenmpereyra-stack.github.io/Diploma-generado/", "_blank");
    
    divCarta.appendChild(imgDiploma);
    contenedor.appendChild(divCarta);
    vista.appendChild(contenedor);
};

// CALIFICACIONES (administrador)
window.gestionarCalificacionesAdmin = function() {
    const vista = document.getElementById('main-view');
    vista.innerHTML = ''; // Limpiamos la pantalla

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "padding: 20px; color: #fff;";
    contenedor.innerHTML = `
        <h2 style="color: #D4AF37;">Consola de Auditoría: Test y Talleres</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background: #050508;">
            <thead>
                <tr style="background: #1a1a1a; color: #fff;">
                    <th style="padding: 15px; border: 1px solid #333;">Estudiante</th>
                    <th style="padding: 15px; border: 1px solid #333;">Actividad</th>
                    <th style="padding: 15px; border: 1px solid #333;">Detalle</th>
                    <th style="padding: 15px; border: 1px solid #333;">Nota</th>
                    <th style="padding: 15px; border: 1px solid #333;">Acción</th>
                </tr>
            </thead>
            <tbody id="tabla-datos-admin"></tbody>
        </table>
    `;
    vista.appendChild(contenedor);

    cargarDatosGenerales();
};

// --- FUNCIÓN QUE IMPORTA DATOS DE AMBAS COLECCIONES ---
async function cargarDatosGenerales() {
    const tbody = document.getElementById('tabla-datos-admin');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Auditoría de registros en curso...</td></tr>';

    try {
        // Consultamos ambas colecciones
        const [snapTest, snapTalleres] = await Promise.all([
            db.collection("resultados_test").orderBy("fecha", "desc").get(),
            db.collection("resultados_talleres").orderBy("fecha", "desc").get()
        ]);

        tbody.innerHTML = ''; 

        // Procesar Test
        snapTest.forEach((doc) => {
            const data = doc.data();
            if (data.nombre && data.nombre !== "Alumno Anónimo") {
                agregarFila(tbody, data.nombre, "Test", data.Test_numero, data.nota, doc.id, "resultados_test");
            }
        });

        // Procesar Talleres
        snapTalleres.forEach((doc) => {
            const data = doc.data();
            const nombre = data.alumno || "Sin nombre"; 
            if (nombre !== "Alumno Anónimo") {
                agregarFila(tbody, nombre, "Taller", data.taller_numero, data.nota, doc.id, "resultados_talleres");
            }
        });

    } catch (error) {
        console.error("Error al cargar auditoría:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center;">Error al conectar con la base de datos.</td></tr>';
    }
}

// --- FUNCIÓN AUXILIAR DE RENDERIZADO ---
function agregarFila(tbody, nombre, tipo, detalle, nota, docId, coleccion) {
    const colorTipo = (tipo === "Taller") ? "#00FF88" : "#D4AF37";
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td style="padding: 12px; border: 1px solid #333;">${nombre}</td>
        <td style="padding: 12px; border: 1px solid #333; color: ${colorTipo}; font-weight: bold;">${tipo}</td>
        <td style="padding: 12px; border: 1px solid #333;">${detalle || 'Sin título'}</td>
        <td style="padding: 12px; border: 1px solid #333; text-align: center;">${nota}</td>
        <td style="padding: 12px; border: 1px solid #333; text-align: center;">
            <button onclick="confirmarBorrado('${docId}', '${coleccion}')" style="background: #991b1b; color: white; border: none; padding: 5px 10px; cursor: pointer;">Eliminar</button>
        </td>
    `;
    tbody.appendChild(tr);
}

// --- FUNCIÓN DE SEGURIDAD PARA BORRAR ---
window.confirmarBorrado = (docId, coleccion) => {
    if (confirm("ATENCIÓN: Se eliminará permanentemente este registro. ¿Desea continuar?")) {
        db.collection(coleccion).doc(docId).delete().then(() => {
            cargarDatosGenerales(); // Refresca la tabla completa
        });
    }
};
// MIS CALIFICACIONES (ALUMNOS)   (modificado por solución de errores)
window.abrirMisCalificaciones = async function() {
    const vista = document.getElementById('main-view');
    vista.innerHTML = '<div style="text-align: center; padding: 40px; color: #fff;">Cargando tus calificaciones...</div>';

    const nombreAlumno = usuarioActual && usuarioActual.nombre ? usuarioActual.nombre.trim() : "";

    try {
        const snapshot = await db.collection("resultados").get();
        let filas = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            const alumnoRegistro = data.alumno ? data.alumno.trim() : "";
            
            // Comparamos el nombre del alumno y validamos que esté visible
            if (alumnoRegistro.toUpperCase() === nombreAlumno.toUpperCase() && data.visibleParaAlumno === true) {
                // Normalizamos el número de test para mostrarlo prolijo
                const numeroTest = data.test_numero ? data.test_numero : 'Evaluación';

                filas += `
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 12px; font-weight: bold; color: #D4AF37;">${numeroTest}</td>
                        <td style="padding: 12px; text-align: center;">${data.nota || '-'}</td>
                        <td style="padding: 12px; text-align: center;">${data.fecha ? data.fecha.split('T')[0] : '-'}</td>
                    </tr>`;
            }
        });

        vista.innerHTML = `
            <div style="padding: 40px; color: #fff; font-family: sans-serif; max-width: 700px; margin: 0 auto;">
                <button onclick="mostrarDashboard()" style="background: #991b1b; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">⬅ Volver</button>
                <h2 style="color: #D4AF37; text-align: center; margin-bottom: 20px;">Mis Calificaciones Aprobadas</h2>
                <table style="width: 100%; border-collapse: collapse; background: #050508; border: 1px solid #D4AF37;">
                    <thead>
                        <tr style="background: #1e293b; color: #D4AF37;">
                            <th style="padding: 12px; border: 1px solid #334155;">Evaluación</th>
                            <th style="padding: 12px; border: 1px solid #334155; text-align: center;">Calificación</th>
                            <th style="padding: 12px; border: 1px solid #334155; text-align: center;">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas || '<tr><td colspan="3" style="padding: 20px; text-align: center;">Aún no tienes calificaciones publicadas por la administración.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error("Error al consultar calificaciones:", e);
        vista.innerHTML = `<div style="color: red; text-align: center; padding: 40px;">Error al cargar tus calificaciones.</div>`;
    }
};
// PARA ANALÍTICOS EN ADMINISTRADOR
/**
 * Función para renderizar el módulo de Analíticos en el Dashboard
 * @param {string} view - El nombre de la vista a mostrar
 */
function mostrarSeccion(view) {
    let contenedor = document.getElementById("dashboard-content");
    
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "dashboard-content";
        document.body.appendChild(contenedor);
    }

    // Si el usuario presiona "Cerrar", limpiamos todo
    if (view === 'cerrar') {
        contenedor.innerHTML = '';
        return;
    }
    
    // Vista de Analíticos
    if (view === 'analiticos') {
        contenedor.innerHTML = `
            <div style="text-align: right; margin-bottom: 10px;">
                <button onclick="mostrarSeccion('cerrar')" style="background:#ff4444; color:white; border:none; padding:5px 15px; cursor:pointer; border-radius:3px;">Cerrar</button>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <img src="analitico.png" alt="Encabezado Analítico" style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="margin-top: 30px;">
                    <button onclick="window.open('https://drrubenmpereyra-stack.github.io/anal-tico-nuev-a-aula-virtual/', '_blank')" 
                            style="padding: 15px 40px; font-size: 1.2em; background-color: #003366; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Ir a Analítico
                    </button>
                </div>
            </div>
        `;
    }
}
// Mi sistencia vista alumno
/**
 * Muestra el reporte de asistencia filtrado para el alumno
 * @param {string} nombreAlumno - El nombre del alumno que está logueado
 */
async function mostrarMiAsistencia(nombreAlumno) {
    const vista = document.getElementById('main-view');
    vista.innerHTML = '<h2>Cargando mi asistencia...</h2>';

    try {
        // Consultamos la colección de asistencia
        const snapshot = await db.collection("asistencia").get();
        
        let html = `
            <h2 style="color: #D4AF37;">Mi Registro de Asistencia</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #fff;">
                <thead>
                    <tr style="background: #1a1a1a;">
                        <th style="padding: 15px; border: 1px solid #333;">Encuentro</th>
                        <th style="padding: 15px; border: 1px solid #333;">Fecha</th>
                        <th style="padding: 15px; border: 1px solid #333;">Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalPresente = 0;
        let totalEncuentros = 0;
        let encontrado = false;

        snapshot.forEach((doc) => {
            const data = doc.data();
            // Normalizamos nombres para comparar (evita errores de tildes o mayúsculas)
            if (data.nombreEstudiante && data.nombreEstudiante.toUpperCase() === nombreAlumno.toUpperCase()) {
                encontrado = true;
                totalEncuentros++;
                if (data.estado.toLowerCase() === "presente") totalPresente++;

                html += `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #333;">${data.encuentro || '-'}</td>
                        <td style="padding: 12px; border: 1px solid #333;">${data.fecha || '-'}</td>
                        <td style="padding: 12px; border: 1px solid #333; color: ${data.estado.toLowerCase() === 'presente' ? '#00FF88' : '#FF4444'}">
                            ${data.estado}
                        </td>
                    </tr>
                `;
            }
        });

        if (!encontrado) {
            html += `<tr><td colspan="3" style="text-align:center; padding:20px;">No se encontraron registros de asistencia.</td></tr>`;
        }

        html += `</tbody></table>`;
        html += `<p style="margin-top:20px; font-size:1.2em;"><strong>Asistencia Total:</strong> ${totalPresente}/${totalEncuentros} (${totalEncuentros > 0 ? ((totalPresente/totalEncuentros)*100).toFixed(0) : 0}%)</p>`;
        
        vista.innerHTML = html;

    } catch (error) {
        console.error("Error al cargar asistencia:", error);
        vista.innerHTML = `<p style="color:red;">Error al conectar con la base de datos.</p>`;
    }
}
// MI ASISTENCIA (ALUMNO)

window.abrirVistaAsistencia = function() {
    const vista = document.getElementById('main-view');
    
    // Limpiamos el contenido actual de la vista
    vista.innerHTML = ''; 

    // Creamos el contenedor principal de la vista
    const contenedor = document.createElement('div');
    contenedor.style.cssText = "text-align: center; padding: 40px; color: #fff; background-color: #050508; min-height: 400px;";
    
    // Inyectamos la imagen, el botón de acción y el botón de volver
    contenedor.innerHTML = `
        <img src="miasistencia.png" alt="Mi Asistencia" style="max-width: 400px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">
        <br>
        <button id="btn-ver-asistencia" style="background: #D4AF37; color: black; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Ver mi asistencia
        </button>
        <button id="btn-volver" style="background: #991b1b; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Volver
        </button>
    `;
    
    vista.appendChild(contenedor);

    // Evento para abrir el enlace externo de GitHub
    document.getElementById('btn-ver-asistencia').onclick = () => {
        window.open("https://drrubenmpereyra-stack.github.io/mi-asistencia-/", "_blank");
    };

    // Evento para volver al dashboard principal usando su función original
    document.getElementById('btn-volver').onclick = () => {
        mostrarDashboard();
    };
};
// MIS NOTAS
window.abrirAuditoriaAnaliticos = function() {
    const vista = document.getElementById('main-view');

    vista.innerHTML = `
        <div style="padding: 20px; color: #fff; background: #050508;">
            <h2 style="color: #D4AF37; margin-bottom: 20px;">AUDITORIA DE ANALÍTICOS</h2>
            <table style="width: 100%; border-collapse: collapse; background: #1a1a1a;">
                <thead>
                    <tr style="background: #333; color: #D4AF37;">
                        <th style="padding: 12px; border: 1px solid #444;">APELLIDO_Nombres</th>
                        <th style="padding: 12px; border: 1px solid #444;">Fecha</th>
                        <th style="padding: 12px; border: 1px solid #444;">Visado</th>
                        <th style="padding: 12px; border: 1px solid #444;">Estado</th>
                    </tr>
                </thead>
                <tbody id="tabla-auditoria"></tbody>
            </table>
            <br>
            <button onclick="mostrarDashboard()" style="background: #991b1b; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer;">Volver al Dashboard</button>
        </div>
    `;

    const tbody = document.getElementById('tabla-auditoria');
    const alumnos = CONFIGURACION_USUARIOS.filter(u => u.rol === 'alumno');

    alumnos.forEach((est, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="padding: 10px; border: 1px solid #444;">${est.nombre}</td>
            <td style="padding: 10px; border: 1px solid #444;">
                <input type="date" id="fecha-${index}" value="${new Date().toISOString().split('T')[0]}" style="background: #333; color: white; border: none; padding: 5px;">
            </td>
            <td style="padding: 10px; border: 1px solid #444; text-align: center;">
                <input type="checkbox" id="check-${index}" onchange="guardarVisado('${est.nombre}', 'fecha-${index}', 'estado-${index}', this)">
            </td>
            <td style="padding: 10px; border: 1px solid #444; text-align: center; color: #D4AF37; font-size: 12px;" id="estado-${index}"></td>
        `;
        tbody.appendChild(row);
    });
};
// Guarda el visado de analiticos en la base de datos
window.guardarVisado = async function(nombre, fechaId, estadoId, checkbox) {
    if (!checkbox.checked) return;
    
    const fecha = document.getElementById(fechaId).value;
    const estadoCampo = document.getElementById(estadoId);
    
    estadoCampo.innerText = "Guardando...";
    
    try {
        await db.collection("visado_analítico").add({
            estudiante: nombre,
            fecha: fecha,
            verificado: true,
            auditor: "Dr. Pereyra",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        estadoCampo.innerText = "✓ Guardado";
    } catch (e) {
        console.error("Error al guardar:", e);
        estadoCampo.innerText = "Error";
        checkbox.checked = false;
    }
};
// MI ANALÍTICO (ALUMNO)
window.abrirMiAnalitico = function() {
    const vista = document.getElementById('main-view');
    
    // Limpiamos el contenido actual de la vista
    vista.innerHTML = ''; 

    // Creamos el contenedor principal de la vista
    const contenedor = document.createElement('div');
    contenedor.style.cssText = "text-align: center; padding: 40px; color: #fff; background-color: #050508; min-height: 400px;";
    
    // Inyectamos la imagen, el botón de acción y el botón de volver
    contenedor.innerHTML = `
        <img src="visanal.png" alt="Mi Analítico" style="max-width: 400px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">
        <br>
        <button id="btn-ver-analitico" style="background: #D4AF37; color: black; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Consulta
        </button>
        <button id="btn-volver-analitico" style="background: #991b1b; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Volver
        </button>
    `;
    
    vista.appendChild(contenedor);

    // Evento para abrir el enlace externo
    document.getElementById('btn-ver-analitico').onclick = () => {
        window.open("https://drrubenmpereyra-stack.github.io/Auditoria-anal-tico/", "_blank");
    };

    // Evento para volver al dashboard principal
    document.getElementById('btn-volver-analitico').onclick = () => {
        mostrarDashboard();
    };
};
// ASISTENCIA (administrador)
// Función para mostrar la vista de Asistencia (Administrador)
window.mostrarAsistenciaAdmin = async () => {
    const main = document.getElementById('main-view');
    main.innerHTML = `
        <h2>Gestión de Asistencia</h2>
        <div class="formulario-admin" style="padding: 20px; background: #f4f4f4; border-radius: 8px;">
            <input type="text" id="input-nombre" placeholder="Nombre del Estudiante">
            <input type="number" id="input-encuentro" placeholder="Nro de Encuentro">
            <input type="date" id="input-fecha">
            <select id="input-estado">
                <option value="Presente">Presente</option>
                <option value="Ausente">Ausente</option>
            </select>
            <button onclick="guardarAsistencia()" class="btn-verde">Guardar Registro</button>
        </div>
        <hr>
        <div id="lista-asistencia">Cargando historial...</div>
        <br>
        <button onclick="mostrarDashboard()" class="btn-red">Volver al Dashboard</button>
    `;
    
    // Cargar historial inmediatamente
    await actualizarTablaAsistencia();
};

// Función para guardar en Firestore
window.guardarAsistencia = async () => {
    const nombre = document.getElementById('input-nombre').value;
    const encuentro = document.getElementById('input-encuentro').value;
    const fecha = document.getElementById('input-fecha').value;
    const estado = document.getElementById('input-estado').value;

    if (!nombre || !encuentro || !fecha) {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    try {
        await db.collection("asistencia").add({
            nombreEstudiante: nombre,
            encuentro: parseInt(encuentro),
            fecha: fecha,
            estado: estado,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Registro guardado.");
        await actualizarTablaAsistencia(); // Refrescar tabla tras guardar
    } catch (e) {
        console.error("Error al guardar asistencia:", e);
        alert("Error al conectar con la base de datos.");
    }
};

// Función para renderizar la tabla
// 1. Reemplaza tu función actual por esta versión con botones
window.actualizarTablaAsistencia = async () => {
    const listaDiv = document.getElementById('lista-asistencia');
    const snapshot = await db.collection("asistencia").orderBy("timestamp", "desc").get();
    
    let html = `<table class="tabla-clinica">
        <thead>
            <tr>
                <th>Estudiante</th>
                <th>Encuentro</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;
    
    snapshot.forEach(doc => {
        const p = doc.data();
        const id = doc.id; 
        html += `<tr>
            <td>${p.nombreEstudiante}</td>
            <td>${p.encuentro}</td>
            <td>${p.fecha}</td>
            <td>${p.estado}</td>
            <td>
                <button onclick="eliminarAsistencia('${id}')" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer;">Eliminar</button>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    listaDiv.innerHTML = html;
};

// 2. Agrega esta nueva función al final de tu archivo
window.eliminarAsistencia = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro de asistencia? Esta acción no se puede deshacer.")) return;
    
    try {
        await db.collection("asistencia").doc(id).delete();
        alert("Registro eliminado correctamente.");
        await actualizarTablaAsistencia(); // Refresca la tabla automáticamente
    } catch (e) {
        console.error("Error al eliminar:", e);
        alert("No se pudo eliminar el registro.");
    }
};
// HERRAMIENTAS (administrador)
window.mostrarHerramientasAdministrador = () => {
    const main = document.getElementById('main-view');
    
    // Re-renderizamos toda la vista de Herramientas incluyendo los botones
    main.innerHTML = `
        <div style="padding: 40px; color: #fff; text-align: center;">
            <h2 style="color: #D4AF37; margin-bottom: 30px;">Herramientas de Administración</h2>
            <div id="contenedor-herramientas" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                
                <div id="btn-backup" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; width: 160px;">
                    <img src="hbac.png" alt="Backup" style="width: 150px; height: 150px; border-radius: 10px; border: 2px solid #D4AF37; object-fit: cover;">
                    <p style="margin-top: 10px; color: #D4AF37; font-weight: bold;">Hacer Backup</p>
                </div>

                <div id="btn-restaurar" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; width: 160px;">
                    <img src="rbac.png" alt="Restaurar" style="width: 150px; height: 150px; border-radius: 10px; border: 2px solid #D4AF37; object-fit: cover;">
                    <p style="margin-top: 10px; color: #D4AF37; font-weight: bold;">Restaurar Backup</p>
                </div>
            </div>
            
            <div style="margin-top: 40px;">
                <button id="btn-volver-seguro" style="background:#1e293b; color:white; padding:10px 20px; border:1px solid #475569; cursor:pointer; border-radius:5px;">
                    ⬅ Volver al Panel
                </button>
            </div>
        </div>
    `;

    // Asignamos todos los eventos aquí, una vez que el HTML ya existe en el DOM
    document.getElementById('btn-backup').onclick = window.hacerBackup;
    document.getElementById('btn-restaurar').onclick = window.restaurarBackup;
    
    // Este es el botón de Volver que te estaba dando problemas
    document.getElementById('btn-volver-seguro').onclick = () => {
        window.mostrarDashboardAdmin();
    };
};
window.hacerBackup = async () => {
    try {
        const colecciones = ['pagos', 'asistencia', 'registro_diplomas'];
        let respaldoTotal = {};

        for (const col of colecciones) {
            const snapshot = await db.collection(col).get();
            respaldoTotal[col] = [];
            snapshot.forEach(doc => {
                respaldoTotal[col].push({ id: doc.id, ...doc.data() });
            });
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(respaldoTotal, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "backup_aula_virtual_" + new Date().toISOString() + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        alert("Backup descargado con éxito.");
    } catch (e) {
        console.error("Error en backup:", e);
        alert("Falló el backup.");
    }
};

window.restaurarBackup = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                for (const col in data) {
                    const batch = db.batch();
                    data[col].forEach(docData => {
                        const { id, ...campos } = docData;
                        const ref = db.collection(col).doc(id);
                        batch.set(ref, campos);
                    });
                    await batch.commit();
                }
                alert("¡Restauración completada con éxito!");
            } catch (err) {
                console.error("Error al restaurar:", err);
                alert("Error al procesar el archivo. Asegúrate de que sea un JSON válido.");
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
};
// SALIR SISTEMA
window.salirSistema = () => {
    const realizarBackup = confirm("⚠️ RECORDATORIO: ¿Has realizado tu backup semanal? \n\nPresiona 'Aceptar' para ir a Herramientas y hacerlo, o 'Cancelar' para salir del sistema ahora.");

    if (realizarBackup) {
        // Redirige al panel donde está la herramienta de Backup
        window.mostrarHerramientasAdministrador();
    } else {
        // Salida directa sin alertas extra
        window.location.href = "index.html"; 
    }
};
// PARA MIS PAGOS (VISTA ALUMNO)

window.abrirVistaPagos = function() {
    const vista = document.getElementById('main-view');
    
    // Limpiamos el contenido actual de la vista
    vista.innerHTML = ''; 

    // Creamos el contenedor principal de la vista
    const contenedor = document.createElement('div');
    contenedor.style.cssText = "text-align: center; padding: 40px; color: #fff; background-color: #050508; min-height: 400px;";
    
    // Inyectamos la imagen, el botón de acción y el botón de volver
    contenedor.innerHTML = `
        <img src="mispagos.png" alt="Mis Pagos" style="max-width: 400px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">
        <br>
        <button id="btn-ver-pagos" style="background: #D4AF37; color: black; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Consultar pagos
        </button>
        <button id="btn-volver" style="background: #991b1b; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Volver
        </button>
    `;
    
    vista.appendChild(contenedor);

    // Evento para abrir el enlace externo de GitHub
    document.getElementById('btn-ver-pagos').onclick = () => {
        window.open("https://drrubenmpereyra-stack.github.io/pagos-convergencia/", "_blank");
    };

    // Evento para volver al dashboard principal usando su función original
    document.getElementById('btn-volver').onclick = () => {
        mostrarDashboard();
    };
};
// MONITOR DE RESONANCIA EVALUATIVA (ADM)
window.iniciarMonitorResonancia = () => {
    const vista = document.getElementById('main-view');
    vista.textContent = ''; 

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "padding: 20px; text-align: center; color: #fff; font-family: sans-serif;";

    // Botón Salir
    const btnSalir = document.createElement('button');
    btnSalir.textContent = "⬅ Volver al Panel Principal";
    btnSalir.style.cssText = "background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-bottom: 20px;";
    btnSalir.onclick = () => mostrarDashboard();
    contenedor.appendChild(btnSalir);

    // Imagen
    const imgEncabezado = document.createElement('img');
    imgEncabezado.src = 'analisis_enc.png';
    imgEncabezado.style.cssText = "max-width: 600px; width: 100%; border-radius: 8px; display: block; margin: 0 auto 20px auto; border: 1px solid #30363d;";
    contenedor.appendChild(imgEncabezado);

    // Botón Ir al Panel
    const btnIr = document.createElement('button');
    btnIr.textContent = "Ir al panel";
    btnIr.style.cssText = "background: #D4AF37; color: black; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;";
    btnIr.onclick = () => window.open('https://drrubenmpereyra-stack.github.io/Evaluacion-encuesta/', '_blank');
    contenedor.appendChild(btnIr);

    vista.appendChild(contenedor);
};
// MI RESONANCIA (ALUMNO)
window.abrirVistaMiResonancia = function() {
    const vista = document.getElementById('main-view');
    
    // Limpiamos el contenido actual de la vista
    vista.innerHTML = ''; 

    // Creamos el contenedor principal de la vista
    const contenedor = document.createElement('div');
    contenedor.style.cssText = "text-align: center; padding: 40px; color: #fff; background-color: #050508; min-height: 400px;";
    
    // Inyectamos la imagen, el botón de acción y el botón de volver
    contenedor.innerHTML = `
        <img src="encuesta.png" alt="Mi Resonancia" style="max-width: 400px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">
        <br>
        <button id="btn-ver-resonancia" style="background: #D4AF37; color: black; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Ir a encuesta
        </button>
        <button id="btn-volver" style="background: #991b1b; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Volver
        </button>
    `;
    
    vista.appendChild(contenedor);

    // Evento para abrir el enlace externo
    document.getElementById('btn-ver-resonancia').onclick = () => {
        window.open("https://drrubenmpereyra-stack.github.io/Encuesta-de-satisfaccion/", "_blank");
    };

    // Evento para volver al dashboard principal
    document.getElementById('btn-volver').onclick = () => {
        mostrarDashboard();
    };
};
window.actualizarVisibilidadTest = async function(idDoc, estado) {
    try {
        await db.collection("resultados").doc(idDoc).update({
            visibleParaAlumno: Boolean(estado)
        });
        console.log("Visibilidad actualizada con éxito para el documento:", idDoc);
    } catch (error) {
        console.error("Error al actualizar la visibilidad del test:", error);
        alert("Error al actualizar la visibilidad. Revisa la consola.");
    }
};
window.abrirVistaRedEvaluativa = function() {
    const vista = document.getElementById('main-view');
    vista.innerHTML = ''; 

    const contenedor = document.createElement('div');
    contenedor.style.cssText = "text-align: center; padding: 40px; color: #fff; background-color: #050508; min-height: 400px;";
    
    contenedor.innerHTML = `
        <img src="red_eval.jpg" alt="Red Evaluativa" style="max-width: 400px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">
        <br>
        <button id="btn-ver-red" style="background: #D4AF37; color: black; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Ir a red evaluativa
        </button>
        <button id="btn-volver" style="background: #991b1b; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px; font-weight: bold;">
            Volver
        </button>
    `;
    
    vista.appendChild(contenedor);

    document.getElementById('btn-ver-red').onclick = () => {
        window.open("https://drrubenmpereyra-stack.github.io/estaciones-evaluacion/", "_blank");
    };

    document.getElementById('btn-volver').onclick = () => {
        mostrarDashboard();
    };
};
// 3. ARRANQUE
document.body.onload = renderLogin;

