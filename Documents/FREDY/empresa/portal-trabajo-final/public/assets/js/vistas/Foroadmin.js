// ============================================================
// foroAdmin.js — VISTA_35_ForoAdmin
// Carga publicaciones REALES desde GET /api/foro
// Incluye botones "Eliminar" vinculados al ID real de cada
// publicación para que la moderación del Admin funcione.
//
// Campos mapeados: id, titulo, contenido, cantidadLikes, creadoEl,
//                  autorNombre, autorApellido, totalComentarios
// DELETE /api/foro/:id — elimina por ID real de la BD
// ============================================================
const API = 'http://localhost:3000/api';
let todasPublicaciones = [];
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.rol !== 'admin') {
        window.location.href = '/VISTA_01_Login.html';
        return;
    }
 
    await cargarForo();
 
    // Buscador
    const si = document.querySelector('input[placeholder*="Buscar"], input[placeholder*="buscar"]');
    si?.addEventListener('input', debounce(() => {
        const q = si.value.toLowerCase().trim();
        renderForo(q
            ? todasPublicaciones.filter(p =>
                p.titulo.toLowerCase().includes(q) || (p.contenido || '').toLowerCase().includes(q))
            : todasPublicaciones
        );
    }, 300));
});
 
// ═══════════════════════════════════════════════════════════════
// CARGA DESDE API
// ═══════════════════════════════════════════════════════════════
async function cargarForo() {
    const container = document.getElementById('foro-container');
    if (!container) return;
 
    container.innerHTML = `
        <div class="text-center py-5 text-muted">
            <span class="spinner-border spinner-border-sm me-2"></span>Cargando publicaciones...
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
                    <p>No hay publicaciones en el foro aún.</p>
                </div>`;
            return;
        }
 
        renderForo(todasPublicaciones);
 
    } catch (err) {
        console.error('[foroAdmin] cargarForo:', err);
        container.innerHTML = `
            <div class="alert alert-danger m-3">
                <i class="bi bi-wifi-off me-2"></i>
                Error al cargar el foro. Verifica tu conexión.
            </div>`;
    }
}
 
// ═══════════════════════════════════════════════════════════════
// RENDERIZADO CON BOTÓN ELIMINAR (vinculado al ID real de la BD)
// ═══════════════════════════════════════════════════════════════
function renderForo(pubs) {
    const container = document.getElementById('foro-container');
    if (!container) return;
 
    container.innerHTML = '';
 
    // Actualizar contador si existe
    const countEl = document.getElementById('count-publicaciones');
    if (countEl) countEl.textContent = pubs.length;
 
    if (pubs.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-muted">No hay publicaciones que coincidan.</div>';
        return;
    }
 
    const colores = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];
 
    container.innerHTML = pubs.map(p => {
        const ini   = ((p.autorNombre || '?').charAt(0) + (p.autorApellido || '').charAt(0)).toUpperCase();
        const color = colores[Math.abs(ini.charCodeAt(0) + (ini.charCodeAt(1) || 0)) % colores.length];
        const dias  = Math.floor((Date.now() - new Date(p.creadoEl)) / 86400000);
        const tiempoStr = dias === 0 ? 'Hoy' : dias === 1 ? 'Ayer' : `Hace ${dias} días`;
        const resumen   = (p.contenido || '').substring(0, 200).trim();
 
        return `
<div class="card border-0 shadow-sm mb-3 publicacion-card" data-id="${p.id}" style="border-radius:12px;">
    <div class="card-body p-4">
        <div class="d-flex gap-3 align-items-start">
 
            <div class="fw-bold text-white d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                 style="width:44px;height:44px;background:${color};font-size:.9rem;">
                ${ini}
            </div>
 
            <div class="flex-grow-1 min-width-0">
                <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span class="fw-semibold">${esc(p.autorNombre)} ${esc(p.autorApellido)}</span>
                    <span class="text-muted small">· ${tiempoStr}</span>
                    <span class="badge bg-light text-secondary ms-auto" style="font-size:.7rem;">
                        ID: ${p.id.substring(0, 8)}...
                    </span>
                </div>
 
                <h6 class="fw-bold mb-2">${esc(p.titulo)}</h6>
 
                <p class="text-muted small mb-3 lh-base">
                    ${esc(resumen)}${(p.contenido || '').length > 200 ? '...' : ''}
                </p>
 
                <!-- Métricas + Botones de Admin -->
                <div class="d-flex align-items-center gap-3 text-muted small flex-wrap">
                    <span><i class="bi bi-chat me-1"></i>${p.totalComentarios || 0} respuestas</span>
                    <span><i class="bi bi-heart me-1"></i>${p.cantidadLikes || 0} me gusta</span>
 
                    <div class="d-flex gap-2 ms-auto">
                        <!-- Ver detalle -->
                        <a href="/VISTA_36_DetallesForoAdmin.html?id=${p.id}"
                           class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye me-1"></i>Ver
                        </a>
 
                        <!-- Eliminar — vinculado al ID REAL de Publicacion_Foro -->
                        <button class="btn btn-outline-danger btn-sm btn-eliminar"
                                data-id="${p.id}"
                                data-titulo="${esc(p.titulo)}"
                                title="Eliminar publicación (ID: ${p.id})">
                            <i class="bi bi-trash me-1"></i>Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }).join('');
 
    // ── Conectar botones Eliminar con DELETE /api/foro/:id ────────────────────
    container.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminar(btn));
    });
}
 
// ═══════════════════════════════════════════════════════════════
// ELIMINAR PUBLICACIÓN — DELETE /api/foro/:id (ID real de BD)
// ═══════════════════════════════════════════════════════════════
async function confirmarEliminar(btn) {
    const id     = btn.dataset.id;
    const titulo = btn.dataset.titulo;
 
    if (!confirm(`¿Eliminar la publicación "${titulo}"?\n\nEsta acción no se puede deshacer y también eliminará todos sus comentarios.`)) {
        return;
    }
 
    btn.disabled  = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
 
    try {
        const r = await fetch(`${API}/foro/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
 
        const data = await r.json();
 
        if (r.ok) {
            // Remover la tarjeta del DOM sin recargar toda la lista
            const card = document.querySelector(`.publicacion-card[data-id="${id}"]`);
            if (card) {
                card.style.transition = 'opacity .3s';
                card.style.opacity    = '0';
                setTimeout(() => card.remove(), 300);
            }
 
            // Actualizar la lista en memoria
            todasPublicaciones = todasPublicaciones.filter(p => p.id !== id);
 
            const countEl = document.getElementById('count-publicaciones');
            if (countEl) countEl.textContent = todasPublicaciones.length;
 
            mostrarToast('success', `Publicación "${titulo}" eliminada correctamente.`);
        } else {
            btn.disabled  = false;
            btn.innerHTML = '<i class="bi bi-trash me-1"></i>Eliminar';
            mostrarToast('danger', data.message || 'Error al eliminar la publicación.');
        }
    } catch (err) {
        console.error('[foroAdmin] eliminar:', err);
        btn.disabled  = false;
        btn.innerHTML = '<i class="bi bi-trash me-1"></i>Eliminar';
        mostrarToast('danger', 'Error de conexión al eliminar.');
    }
}
 
// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════
function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
 
function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
 
function mostrarToast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:300px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show">
        <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'x-circle'} me-2"></i>${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    setTimeout(() => { box.innerHTML = ''; }, 4500);
}
 