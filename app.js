window.limpiarDatosPrueba = async () => {
    if (!confirm("¿ESTÁS SEGURO? Esto borrará toda la información de pagos, asistencias y registros de diplomas. Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        const colecciones = ['pagos', 'asistencia', 'registro_diplomas'];
        
        // Ejecutamos las limpiezas de forma secuencial y limpia
        for (const col of colecciones) {
            const snapshot = await db.collection(col).get();
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        alert("Base de datos de prueba limpiada con éxito.");
        
        // En lugar de llamar al dashboard directamente, forzamos una recarga limpia
        // o llamamos a mostrarDashboardAdmin solo después de asegurar la limpieza
        window.mostrarDashboardAdmin();
        
    } catch (e) {
        console.error("Error al limpiar:", e);
        // Solo lanzamos este alert si realmente hubo un error técnico
        alert("Ocurrió un error técnico al limpiar los datos: " + e.message);
    }
};
