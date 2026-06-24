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
const clienteSupabase = supabase.createClient(supabaseUrl, supabaseKey);

async function obtenerTrabajos() {
    const contenedor = document.getElementById('lista-vacantes');
    
    if (!contenedor) return; 

    // Reemplazar 'vacantes' por el nombre real de la tabla en Supabase
    const { data, error } = await clienteSupabase
        .from('job_offer') 
        .select('*'); 

        // AGREGA ESTAS DOS LÍNEAS AQUÍ:
    console.log("Datos recibidos de Supabase:", data);
    console.log("Errores de Supabase:", error);

    if (error) {
        console.error('Hubo un error al traer vacantes:', error);
        contenedor.innerHTML = '<p>Error de conexión con el servidor.</p>';
        return;
    }

    // Limpiamos el texto de "Cargando..."
    contenedor.innerHTML = ''; 
    
    // Recorremos los datos y creamos el HTML para cada trabajo
    data.forEach(trabajo => {
        
        // Abrimos las comillas invertidas (backticks) y pegamos tu HTML exacto
    contenedor.innerHTML += `
        <main class="detalle-principal" style="margin-bottom: 40px; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h1 style="color: #2e54a5;">${trabajo.Título}</h1>
            
            <div class="header-info-container">
                <div class="info-badge">
                    <div class="badge-icon"><i class="fas fa-building"></i></div>
                    <div class="badge-text">
                        <span class="label">Empresa</span>
                        <span class="value">${trabajo.description_original}</span>
                    </div>
                </div>

                <div class="info-badge">
                    <div class="badge-icon badge-purple"><i class="fas fa-calendar-alt"></i></div>
                    <div class="badge-text">
                        <span class="label">Estado</span>
                        <span class="value">${trabajo.Estado}</span>
                    </div>
                </div>

                <div class="info-badge">
                    <div class="badge-icon badge-green"><i class="fas fa-map-marker-alt"></i></div>
                    <div class="badge-text">
                        <span class="label">Experiencia Mínima</span>
                        <span class="value">${trabajo.experience_years} años</span>
                    </div>
                </div>
            </div>

            <div class="acciones-rapidas">
                <button class="btn-favorito"><i class="far fa-star"></i> AGREGAR A FAVORITOS</button>
                <button class="btn-aplicar-oferta" onclick="abrirModalAplicacion(${trabajo.id})">APLICAR A ESTA OFERTA</button>
            </div>

            <section class="descripcion-texto">
                <h3 style="color: #2e54a5;">DETALLES DE LA OFERTA</h3>
                <hr>
                <div class="grid-detalles">
                    <div class="dato"><strong>Habilidades requeridas:</strong><span> ${trabajo.skills_clave} </span></div>
                    <div class="dato"><strong>Salario ofrecido:</strong><span> ${trabajo.salary_range} </span></div>
                </div>

                <section class="detalle-vacante">
                    <div class="info-bloque">
                        <h4><i class="fa fa-user-check"></i> Descripción y Requisitos</h4>
                        <p style="white-space: pre-line; color: #555; line-height: 1.6;">${trabajo.description_en}</p>
                    </div>
                </section>

                <div class="container-detalle">
                    <aside class="sidebar-empresa">
                        <h3>${trabajo.description_original}</h3>
                        <div style="margin-bottom: 20px;">
                            <a href="#" class="link-empresa">Ver más empleos de esta empresa &rarr;</a>
                        </div>
                        <button class="btn-alertas">ENVIARME MAS OFERTAS COMO ESTAS</button>
                    </aside>
                </div>
            </section>
        </main>
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