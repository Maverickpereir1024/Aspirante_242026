// Abre la invitación de entrevista
function openInterviewModal() {
    document.getElementById('interview-modal').style.display = 'flex';
}

function showWarning() {
    const warningDiv = document.getElementById('warning-text');

    // Hacemos que el texto de advertencia aparezca con una animación
    warningDiv.style.display = 'block';
    warningDiv.style.animation = 'shake 0.5s ease';
}

// Ir al lobby de videollamada
function goToLobby() {
    document.getElementById('interview-modal').style.display = 'none';
    document.getElementById('video-lobby').style.display = 'flex';
    requestPermissions(); // Pide permiso de cámara al entrar
}

// Función para pedir cámara y micro al dispositivo sea PC o móvil (Algo parecido a Google Meet)
async function requestPermissions() {
    const preview = document.getElementById('camera-preview');

    try {
        // Pedimos video y audio al dispositivo, esto abrirá la cámara o en celular como su camara frontal por defecto.
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user", // Usa la cámara frontal en móviles
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });

        // Creamos el elemento de video dinámicamente
        const videoElement = document.createElement('video');

        // Conectamos la cámara al elemento
        videoElement.srcObject = stream;

        // Configuraciones críticas para que se vea de inmediato
        videoElement.autoplay = true;
        videoElement.muted = true; // Silenciamos el preview para evitar eco molesto contigo mismo
        videoElement.playsInline = true;

        // Estilo para que llene el cuadro y parezca un espejo
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover"; // Para que no se vea estirado
        videoElement.style.borderRadius = "12px";
        videoElement.style.transform = "scaleX(-1)"; // Efecto espejo

        // Limpiamos el mensaje de "Cámara apagada" y metemos el video
        preview.innerHTML = '';
        preview.appendChild(videoElement);

        console.log("¡Cámara activada! Ahora deberías ver tu rostro.");

    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        preview.innerHTML = `
            <div style="color: #ff4d4d; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No pudimos acceder a tu cámara. Revisa los permisos del navegador.</p>
            </div>`;
    }
}


/* Con este script le pedimos permisos de cámara y audio al dispositivo desde que le damos  aceptar y unirse
 le hacemos un llamado desde el archivo Ent.html a la función requestPermissions */












// Datos de prueba (Aqui adriana debemos poner la parte de ramon o sea en vez de "mispostulaciones"
//  el backend FastAPI después)
const misPostulaciones = [
    { puesto: "Ejecutivo de Soporte Tecnico", empresa: "Maverick, S.A.", estado: "revision" },
    { puesto: "Pasantia de Sistemas", empresa: "Castillo Solutions", estado: "contratado" }
];

// Mapeo de estados a números (índices)
const niveles = {
    "recibido": 0,
    "revision": 1,
    "entrevista": 2,
    "contratado": 3,
    "finalizado": 4
};

function renderizarPostulaciones() {
    const contenedor = document.getElementById('lista-postulaciones');
    const template = document.getElementById('template-postulacion');

    misPostulaciones.forEach(postulacion => {
        const clone = template.content.cloneNode(true);
        
        // Rellenar datos básicos
        clone.querySelector('.puesto').textContent = postulacion.puesto;
        clone.querySelector('.empresa').textContent = postulacion.empresa;

        // Lógica del Stepper
        const pasos = clone.querySelectorAll('.step');
        const lineas = clone.querySelectorAll('.line');
        const nivelActual = niveles[postulacion.estado];

        pasos.forEach((paso, index) => {
            if (index <= nivelActual) {
                paso.classList.add('active');
            }
        });

        lineas.forEach((linea, index) => {
            if (index < nivelActual) {
                linea.classList.add('active');
            }
        });

        contenedor.appendChild(clone);
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', renderizarPostulaciones);





//Zona de los filtros
function toggleDropdown(event, id) {
    // Evita que el clic cierre el menú inmediatamente
    event.stopPropagation();

    const dropdown = document.getElementById(id);
    const todos = document.querySelectorAll('.filter-dropdown');

    // Cerrar los otros que estén abiertos
    todos.forEach(d => {
        if (d.id !== id) d.classList.remove('show-dropdown');
    });

    // Alternar el actual
    dropdown.classList.toggle('show-dropdown');
}

// Cerrar si haces clic en cualquier otro lado de la pantalla
document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    dropdowns.forEach(d => {
        if (!d.contains(e.target)) {
            d.classList.remove('show-dropdown');
        }
    });
});