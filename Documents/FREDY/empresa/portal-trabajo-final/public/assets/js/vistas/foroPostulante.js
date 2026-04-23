// ============================================================
// foroPostulante.js — VISTA_20_Foro_Postulante
// Carga las publicaciones REALES desde GET /api/foro
// que hace JOIN con la tabla Usuario para traer el nombre del autor.
//
// Campos mapeados desde Publicacion_Foro + Usuario:
//   id, titulo, contenido, cantidadLikes, creadoEl,
//   autorNombre, autorApellido, totalComentarios
// ============================================================
const API = 'http://localhost:3000/api';
let todasPublicaciones = [];
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    await cargarForo();
 
    // Buscador con debounce
    const si = document.querySelector('input[placeholder*="Buscar"], input[placeholder*="buscar"]');
    si?.addEventListener('input', debounce(() => {
        const q = si.value.toLowerCase().trim();
        renderForo(q
            ? todasPublicaciones.filter(p =>
                p.titulo.toLowerCase().includes(q) || (p.contenido || '').toLowerCase().includes(q))
            : todasPublicaciones
        );
    }, 300));
 
    // Botón "Nueva publicación" (si existe en la vista)
    document.getElementById('btn-nueva-publicacion')?.addEventListener('click', () => {
        abrirModalNuevaPublicacion(user);
    });
});
 
// ═══════════════════════════════════════════════════════════════
// CARGA DESDE API — GET /api/foro
// Trae datos REALES de la tabla Publicacion_Foro
// ═══════════════════════════════════════════════════════════════
async function cargarForo() {
    const container = document.getElementById('foro-container');
    if (!container) return;
 
    // Limpiar contenido estático/fantasma antes de renderizar BD
    container.innerHTML = `
        <div class="text-center py-5 text-muted">
            <span class="spinner-border spinner-border-sm me-2"></span>Cargando publicaciones del foro...
        </div>`;
 
    try {
        const res  = await fetch(`${API}/foro`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
 
        const data = await res.json();
        todasPublicaciones = Array.isArray(data.data) ? data.data : [];
 
        if (todasPublicaciones.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-chat-dots fs-1 d-block mb-3 opacity-40"></i>
                    <p class="fw-semibold mb-1">Aún no hay publicaciones en el foro.</p>
                    <p class="small">¡Sé el primero en publicar una pregunta o tema!</p>
                </div>`;
            return;
        }
 
        renderForo(todasPublicaciones);
 
    } catch (err) {
        console.error('[foroPostulante] cargarForo:', err);
        container.innerHTML = `
            <div class="alert alert-danger m-3">
                <i class="bi bi-wifi-off me-2"></i>
                Error al cargar el foro. Verifica tu conexión y recarga la página.
            </div>`;
    }
}
 
// ═══════════════════════════════════════════════════════════════
// RENDERIZADO — Tarjetas de publicaciones con datos reales de BD
// ═══════════════════════════════════════════════════════════════
function renderForo(pubs) {
    const container = document.getElementById('foro-container');
    if (!container) return;
 
    // Limpiar antes de renderizar
    container.innerHTML = '';
 
    if (pubs.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-muted">No hay publicaciones que coincidan con tu búsqueda.</div>';
        return;
    }
 
    const colores = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];
 
    container.innerHTML = pubs.map(p => {
        // Iniciales del autor (desde Usuario.nombres + Usuario.apellidos)
        const ini   = ((p.autorNombre || '?').charAt(0) + (p.autorApellido || '').charAt(0)).toUpperCase();
        const color = colores[Math.abs(ini.charCodeAt(0) + (ini.charCodeAt(1) || 0)) % colores.length];
        const dias  = Math.floor((Date.now() - new Date(p.creadoEl)) / 86400000);
        const tiempoStr = dias === 0 ? 'Hoy' : dias === 1 ? 'Ayer' : `Hace ${dias} días`;
        const resumen   = (p.contenido || '').substring(0, 220).trim();
 
        return `
<div class="card border-0 shadow-sm mb-3" style="border-radius:12px;">
    <div class="card-body p-4">
        <div class="d-flex gap-3 align-items-start">
 
            <!-- Avatar con iniciales del autor real -->
            <div class="fw-bold text-white d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                 style="width:44px;height:44px;background:${color};font-size:.9rem;">
                ${ini}
            </div>
 
            <div class="flex-grow-1 min-width-0">
                <!-- Nombre del autor (viene de Usuario JOIN) -->
                <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span class="fw-semibold">${esc(p.autorNombre)} ${esc(p.autorApellido)}</span>
                    <span class="text-muted small">· ${tiempoStr}</span>
                </div>
 
                <!-- Título de la publicación -->
                <h6 class="fw-bold mb-2">
                    <a href="/VISTA_21_DetallesForo_Postulante.html?id=${p.id}"
                       class="text-decoration-none" style="color:inherit;">
                        ${esc(p.titulo)}
                    </a>
                </h6>
 
                <!-- Resumen del contenido real -->
                <p class="text-muted small mb-3 lh-base">
                    ${esc(resumen)}${(p.contenido || '').length > 220 ? '...' : ''}
                </p>
 
                <!-- Métricas y enlace -->
                <div class="d-flex align-items-center gap-3 text-muted small flex-wrap">
                    <span><i class="bi bi-chat me-1"></i>${p.totalComentarios || 0} respuestas</span>
                    <span><i class="bi bi-heart me-1"></i>${p.cantidadLikes || 0} me gusta</span>
                    <a href="/VISTA_21_DetallesForo_Postulante.html?id=${p.id}"
                       class="btn btn-outline-primary btn-sm ms-auto">
                        Ver hilo <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }).join('');
}
 
// ═══════════════════════════════════════════════════════════════
// MODAL NUEVA PUBLICACIÓN (si el HTML lo incluye)
// ═══════════════════════════════════════════════════════════════
async function abrirModalNuevaPublicacion(user) {
    const titulo   = prompt('Título de tu publicación:');
    const contenido = prompt('Contenido / descripción:');
    if (!titulo?.trim() || !contenido?.trim()) return;
 
    try {
        const r = await fetch(`${API}/foro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                idUsuario: user.id,
                titulo:    titulo.trim(),
                contenido: contenido.trim()
            })
        });
        if (r.ok) {
            await cargarForo(); // Recargar lista actualizada
        } else {
            alert('Error al publicar. Intenta de nuevo.');
        }
    } catch (err) {
        console.error('[foroPostulante] nueva publicación:', err);
        alert('Error de conexión.');
    }
}
 
// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════
function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
 
function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
 