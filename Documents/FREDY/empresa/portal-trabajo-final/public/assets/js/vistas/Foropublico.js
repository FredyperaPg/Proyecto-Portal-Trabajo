// foroPublico.js — VISTA_11_Foro.html (vista pública con datos reales)
// Fuente de verdad: bd-datos.sql — tabla Publicacion_Foro, Comentario_Foro
const API = 'http://localhost:3000/api';
 
let todosLosPosts = [];
let filtroActivo  = 'todos'; // 'todos' | 'populares' | 'recientes' | '#tag'
 
document.addEventListener('DOMContentLoaded', async () => {
    await cargarForo();
    initFiltros();
    initHashtags();
    initBuscador();
});
 
// ── 1. Cargar posts desde la API ─────────────────────────────────────────────
async function cargarForo() {
    const container = document.getElementById('foro-container');
    if (!container) return;
    container.innerHTML = '<div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Cargando publicaciones...</div>';
 
    try {
        const res  = await fetch(`${API}/foro`);
        const data = await res.json();
        todosLosPosts = data.data || [];
        aplicarFiltro();
    } catch (err) {
        console.error('[foroPublico]', err);
        if (container) container.innerHTML =
            '<div class="alert alert-warning m-3">No se pudieron cargar las publicaciones del foro.</div>';
    }
}
 
// ── 2. Renderizado de posts ───────────────────────────────────────────────────
function renderPosts(posts) {
    const container = document.getElementById('foro-container');
    if (!container) return;
 
    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-chat-dots fs-1 d-block mb-3 opacity-50"></i>
                <p>No hay publicaciones con ese filtro.</p>
                <button class="btn btn-outline-secondary btn-sm" onclick="resetFiltro()">Ver todos</button>
            </div>`;
        return;
    }
 
    const gradients = [
        'linear-gradient(135deg,#2563EB,#60a5fa)',
        'linear-gradient(135deg,#10B981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#7c3aed,#a855f7)',
        'linear-gradient(135deg,#ef4444,#dc2626)',
    ];
 
    container.innerHTML = posts.map((p, idx) => {
        const autorNombre = `${p.autorNombre || ''} ${p.autorApellido || ''}`.trim() || 'Usuario';
        const ini         = iniciales(p.autorNombre, p.autorApellido);
        const grad        = gradients[idx % gradients.length];
        const fecha       = fechaRelativa(p.creadoEl);
        const respuestas  = p.totalRespuestas || p.comentarios?.length || 0;
        const likes       = p.cantidadLikes   || 0;
 
        // Detectar categoría del post si existe
        const catBadge = p.categoria
            ? `<span class="badge" style="background:#eff6ff;color:#1d4ed8;font-size:.7rem;border-radius:6px;padding:3px 8px;">${esc(p.categoria)}</span>`
            : '';
 
        return `
        <div class="thread-card" data-id="${p.id}" data-categoria="${esc(p.categoria || '')}">
            <div class="d-flex align-items-start gap-3">
                <div class="avatar-sm" style="background:${grad};">${ini}</div>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        ${catBadge}
                    </div>
                    <h6 class="fw-bold mb-1">
                        <a href="/VISTA_21_DetallesForo_Postulante.html?id=${p.id}"
                           class="text-decoration-none" style="color:var(--text);">${esc(p.titulo)}</a>
                    </h6>
                    <div class="text-muted small mb-2">Por <strong>${esc(autorNombre)}</strong> · ${fecha}</div>
                    ${p.contenido ? `<p class="text-muted small mb-2">${esc(p.contenido.slice(0, 160))}${p.contenido.length > 160 ? '...' : ''}</p>` : ''}
                    <div class="d-flex gap-3 flex-wrap align-items-center">
                        <span class="stat-pill"><i class="bi bi-chat-dots"></i>${respuestas} respuestas</span>
                        <button class="btn-like stat-pill border-0 bg-transparent p-0"
                                data-id="${p.id}" style="cursor:pointer;"
                                title="Me gusta">
                            <i class="bi bi-hand-thumbs-up"></i>
                            <span class="like-count">${likes}</span> likes
                        </button>
                        <a href="/VISTA_21_DetallesForo_Postulante.html?id=${p.id}"
                           class="btn-responder stat-pill text-decoration-none"
                           data-id="${p.id}">
                            <i class="bi bi-reply"></i> Responder
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
 
    // Conectar botones de Like y Responder con guard de auth
    container.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) { mostrarAlertaAuth('dar Me gusta'); return; }
            // Feedback visual optimista
            const span = btn.querySelector('.like-count');
            if (span) span.textContent = String(Number(span.textContent) + 1);
            btn.disabled = true;
        });
    });
 
    container.querySelectorAll('.btn-responder').forEach(a => {
        a.addEventListener('click', (e) => {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                e.preventDefault();
                mostrarAlertaAuth('responder en el foro');
            }
            // Si hay sesión, el enlace navega normalmente
        });
    });
}
 
// ── 3. Filtros (Todos / Populares / Recientes) ────────────────────────────────
function initFiltros() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
 
            const texto = pill.textContent.trim().toLowerCase();
            if (texto.includes('popular'))   filtroActivo = 'populares';
            else if (texto.includes('recien')) filtroActivo = 'recientes';
            else                               filtroActivo = 'todos';
 
            aplicarFiltro();
        });
    });
}
 
// ── 4. Hashtags / Etiquetas ───────────────────────────────────────────────────
function initHashtags() {
    document.querySelectorAll('.tag-cloud a').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagTexto = tag.textContent.trim().replace('#', '').toLowerCase();
            filtroActivo = '#' + tagTexto;
 
            // Marcar tag activo visualmente
            document.querySelectorAll('.tag-cloud a').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
 
            aplicarFiltro(tagTexto);
        });
    });
}
 
// ── 5. Buscador ───────────────────────────────────────────────────────────────
function initBuscador() {
    const input = document.querySelector('input[placeholder*="Buscar"]');
    if (!input) return;
    input.addEventListener('input', debounce(() => {
        aplicarFiltro(null, input.value.trim());
    }, 300));
}
 
// ── 6. Aplicar filtro combinado ───────────────────────────────────────────────
function aplicarFiltro(tagTexto = null, busqueda = '') {
    let resultado = [...todosLosPosts];
 
    // Filtro de búsqueda
    if (busqueda) {
        const q = busqueda.toLowerCase();
        resultado = resultado.filter(p =>
            `${p.titulo} ${p.contenido || ''} ${p.categoria || ''}`.toLowerCase().includes(q)
        );
    }
 
    // Filtro por hashtag — busca en título + contenido + categoría
    if (tagTexto) {
        resultado = resultado.filter(p =>
            `${p.titulo} ${p.contenido || ''} ${p.categoria || ''}`.toLowerCase().includes(tagTexto)
        );
    } else if (filtroActivo === 'populares') {
        resultado = resultado.sort((a, b) => (b.cantidadLikes || 0) - (a.cantidadLikes || 0));
    } else if (filtroActivo === 'recientes') {
        resultado = resultado.sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));
    }
 
    renderPosts(resultado);
}
 
function resetFiltro() {
    filtroActivo = 'todos';
    document.querySelectorAll('.filter-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    document.querySelectorAll('.tag-cloud a').forEach(t => t.classList.remove('active'));
    aplicarFiltro();
}
 
// ── 7. Auth guard ─────────────────────────────────────────────────────────────
function mostrarAlertaAuth(accion = 'interactuar') {
    // Intentar usar modal si existe
    const modalEl = document.getElementById('modalAuthRequerido');
    if (modalEl && window.bootstrap) {
        const msgEl = modalEl.querySelector('#modal-auth-msg');
        if (msgEl) msgEl.textContent = `Debes iniciar sesión para ${accion}.`;
        new bootstrap.Modal(modalEl).show();
        return;
    }
    // Fallback: toast flotante
    let box = document.getElementById('toast-global-foro');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global-foro';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:320px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-warning alert-dismissible shadow fade show">
        ⚠️ Debes <a href="/VISTA_01_Login.html" class="alert-link fw-bold">iniciar sesión</a> para ${accion}.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 5000);
}
 
// ── Utilidades ────────────────────────────────────────────────────────────────
function iniciales(n, a) { return ((n||'').charAt(0) + (a||'').charAt(0)).toUpperCase() || '??'; }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fechaRelativa(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const horas = Math.floor(mins  / 60);
    const dias  = Math.floor(horas / 24);
    if (mins < 1)    return 'Hace un momento';
    if (mins < 60)   return `Hace ${mins} min`;
    if (horas < 24)  return `Hace ${horas} h`;
    if (dias < 7)    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    return new Date(iso).toLocaleDateString('es-SV', { day:'numeric', month:'short', year:'numeric' });
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }