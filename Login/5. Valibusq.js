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