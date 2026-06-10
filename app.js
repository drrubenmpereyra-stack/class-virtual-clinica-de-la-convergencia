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

