function validarYEnviar() {
    // 1. Obtenemos los elementos
    const inputCargo = document.getElementById('cargo');
    const inputLugar = document.getElementById('lugar');

    // 2. Extraemos los valores y quitamos espacios en blanco
    const cargo = inputCargo.value.trim();
    const lugar = inputLugar.value.trim();

    console.log("Intentando buscar:", cargo, lugar); // Esto es para probar

    // 3. Validamos
    if (cargo === "" || lugar === "") {
        alert("¡Error! Debes completar ambos campos para continuar.");
        
        // Opcional: ponerle un borde rojo al que esté vacío
        if(cargo === "") inputCargo.style.border = "2px solid red";
        if(lugar === "") inputLugar.style.border = "2px solid red";
        
    } else {
        // 4. Si todo está bien, redirigimos
        // IMPORTANTE: Verifica que esta ruta sea la correcta desde tu index.html
        window.location.href = "/Inicio/1. indexmenu.html";
    }
}


// ==========================================
// GEOLOCALIZACIÓN DEL USUARIO
// ==========================================

function obtenerUbicacion() {
    const inputCiudad = document.getElementById('input-ciudad');
    inputCiudad.value = "Buscando ubicación..."; // Mensaje temporal

    // Verificamos si el navegador del celular soporta GPS
    if (navigator.geolocation) {
        // Esto lanza la ventanita del navegador pidiendo permiso
        navigator.geolocation.getCurrentPosition(ubicacionExitosa, ubicacionError);
    } else {
        alert("Tu navegador no soporta geolocalización.");
        inputCiudad.value = "";
    }
}

// Si el usuario le da a "Permitir"
async function ubicacionExitosa(posicion) {
    const lat = posicion.coords.latitude;
    const lon = posicion.coords.longitude;

    try {
        // Usamos una API gratuita para traducir lat/lon a una dirección real
        const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const datos = await respuesta.json();

        // En Nicaragua, OpenStreetMap suele guardar el departamento en "state"
        let departamento = datos.address.state || datos.address.city;

        // Limpiamos un poco el texto por si la API devuelve "Departamento de Managua"
        if (departamento.includes("Departamento de")) {
            departamento = departamento.replace("Departamento de ", "");
        }

        // Colocamos el resultado en el input
        document.getElementById('input-ciudad').value = departamento;

    } catch (error) {
        console.error("Error al traducir las coordenadas:", error);
        document.getElementById('input-ciudad').value = "";
        alert("No pudimos traducir tu ubicación. Por favor, escríbela manualmente.");
    }
}

// Si el usuario le da a "Bloquear" o hay un error
function ubicacionError(error) {
    const inputCiudad = document.getElementById('input-ciudad');
    inputCiudad.value = ""; // Limpiamos el mensaje temporal
    
    if (error.code === 1) {
        alert("Denegaste el acceso a la ubicación. Puedes escribir tu departamento manualmente.");
    } else {
        alert("No se pudo obtener tu ubicación actual. Intenta escribiéndola.");
    }
}