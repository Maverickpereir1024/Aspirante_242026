// Abre la invitación de entrevista
function openInterviewModal() {
    document.getElementById('interview-modal').style.display = 'flex';
}

function showWarning() {
const warningDiv = document.getElementById('warning-text');
    const modal = document.getElementById('interview-modal');

    // Verificamos si la advertencia ya es visible
    if (warningDiv.style.display === 'none' || warningDiv.style.display === '') {
        
        // PRIMER CLIC: Solo mostramos la advertencia
        warningDiv.style.display = 'block';
        warningDiv.style.animation = 'shake 0.5s ease';
        
        // Opcional: Puedes cambiar el texto del botón a "¿Confirmar?" 
        // para que el usuario sepa que el siguiente clic es el definitivo.
        
    } else {
        // SEGUNDO CLIC: Como la advertencia ya estaba ahí, cerramos el modal
        modal.style.display = 'none';
    }


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

// ==========================================
// CONEXIÓN A SUPABASE (Base de datos)
// ==========================================
const supabaseUrl = 'https://mrretnaghvkipwggktfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycmV0bmFnaHZraXB3Z2drdGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTA0NDgsImV4cCI6MjA5MTc4NjQ0OH0.UF_bhFFP__31GiiTxy2fsaKVqNjGie6H2LdGuAvZmoc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function obtenerTrabajos() {
    const contenedor = document.getElementById('lista-vacantes');
    
    if (!contenedor) return; 

    // Reemplazar 'vacantes' por el nombre real de la tabla en Supabase
    const { data, error } = await supabase
        .from('job_offer') 
        .select('*'); 

    if (error) {
        console.error('Hubo un error al traer vacantes:', error);
        contenedor.innerHTML = '<p>Error de conexión con el servidor.</p>';
        return;
    }

    // Limpiamos el texto de "Cargando..."
    contenedor.innerHTML = ''; 
    
    // Recorremos los datos y creamos el HTML para cada trabajo
    data.forEach(trabajo => {
        
        contenedor.innerHTML += `
        <div class="vacante-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 style="margin-top: 0; color: #2c3e50;">${trabajo.Título}</h3>
                <span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    ${trabajo.Estado}
                </span>
            </div>

            <p style="margin: 5px 0;"><strong>Empresa:</strong> ${trabajo.description_original}</p>
            
            <p style="font-size: 14px; color: #555; line-height: 1.5;">
                ${trabajo.description_en}
            </p>

            <div style="background-color: #f8f9fa; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px 0;">💰 <strong>Salario:</strong> ${trabajo.salary_range}</p>
                <p style="margin: 0 0 5px 0;">⏱️ <strong>Experiencia requerida:</strong> ${trabajo.experience_years} años</p>
                <p style="margin: 0;">🛠️ <strong>Habilidades:</strong> ${trabajo.skills_clave}</p>
            </div>

            <button 
                style="background-color: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;"
                onclick="abrirModalAplicacion(${trabajo.id})"
            >
                Aplicar a esta vacante
            </button>
        </div>
    `;
});
}

// Ejecutamos la función apenas cargue el archivo
obtenerTrabajos();



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



// buscador
function buscarVacantes() {
    // 1. Obtener el texto del buscador y pasarlo a minúsculas
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Seleccionar todas las tarjetas de trabajo
    let tarjetas = document.getElementsByClassName('job-card');
    let mensajeNoHay = document.getElementById('noResults');
    let contadorEncontrados = 0;

    // 3. Recorrer cada tarjeta
    for (let i = 0; i < tarjetas.length; i++) {
        // Buscamos el texto dentro del strong (título del puesto)
        let titulo = tarjetas[i].getElementsByTagName('h4')[0].innerText.toLowerCase();

        if (titulo.includes(input)) {
            tarjetas[i].style.display = ""; // Mostrar si coincide
            contadorEncontrados++;
        } else {
            tarjetas[i].style.display = "none"; // Ocultar si no coincide
        }
    }

    // 4. Mostrar u ocultar el mensaje de "No hay nada"
    if (contadorEncontrados === 0) {
        mensajeNoHay.style.display = "block";
    } else {
        mensajeNoHay.style.display = "none";
    }
}

// Opcional: Que busque automáticamente mientras escribes
document.getElementById('searchInput').addEventListener('keyup', buscarVacantes);