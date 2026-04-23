// detallesForo.js — VISTA_21_DetallesForo_Postulante
// Carga la publicación del foro por ID desde URL (?id=UUID),
// renderiza el post original y todas las respuestas (Comentario_Foro).
const API = 'http://localhost:3000/api';
 
let hiloId     = null;
let userActual = null;
 
document.addEventListener('DOMContentLoaded', async () => {
    userActual = JSON.parse(localStorage.getItem('user') || 'null');
    // NOTA: No redirigir aquí — la vista es de acceso mixto (postulante logueado).
    // checkAuth.js ya protege la ruta si es necesario.
 
    hiloId = new URLSearchParams(window.location.search).get('id');
    if (!hiloId) {
        mostrarError('No se especificó un tema. Vuelve al <a href="/VISTA_20_Foro_Postulante.html">Foro</a>.');
        return;
    }
 
    await cargarHilo();
    initFormRespuesta();
    initLikeButton();
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 1. CARGA Y RENDERIZADO DEL HILO
// ─────────────────────────────────────────────────────────────────────────────
async function cargarHilo() {
    try {
        const res  = await fetch(`${API}/foro/${hiloId}`);
        const data = await res.json();
 
        if (!res.ok || !data.data) {
            mostrarError('La publicación no existe o no está disponible.');
            return;
        }
 
        const p = data.data;
        document.title = `${p.titulo} — Foro PortalEmpleos`;
 
        setText('hilo-titulo-breadcrumb', p.titulo);
        setText('hilo-titulo',           p.titulo);
        setText('hilo-total-respuestas', (p.comentarios?.length ?? 0).toString());
        setText('hilo-likes',            (p.cantidadLikes ?? 0).toString());
        setText('hilo-fecha',            fechaRelativa(p.creadoEl));
 
        const autorNombre = `${p.autorNombre || ''} ${p.autorApellido || ''}`.trim();
        const ini         = iniciales(p.autorNombre, p.autorApellido);
 
        setText('hilo-autor-avatar',  ini);
        setText('hilo-autor-nombre',  autorNombre);
        setText('hilo-fecha-post',    fechaRelativa(p.creadoEl));
        setText('hilo-likes-post',    (p.cantidadLikes ?? 0).toString());
 
        const contenidoEl = document.getElementById('hilo-contenido');
        if (contenidoEl) {
            contenidoEl.innerHTML = String(p.contenido || '')
                .split(/\n{2,}/)
                .map(par => `<p>${esc(par.trim()).replace(/\n/g, '<br>')}</p>`)
                .join('') || '<p class="text-muted">Sin contenido.</p>';
        }
 
        setText('sidebar-autor-avatar', ini);
        setText('sidebar-autor-nombre', autorNombre);
 
        renderRespuestas(p.comentarios || []);
 
    } catch (err) {
        console.error('[detallesForo] cargarHilo:', err);
        mostrarError('Error al cargar la publicación. Intenta de nuevo.');
    }
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 2. RENDERIZADO DE RESPUESTAS
// ─────────────────────────────────────────────────────────────────────────────
function renderRespuestas(comentarios) {
    const container = document.getElementById('respuestas-container');
    if (!container) return;
 
    if (!comentarios || comentarios.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-chat-dots fs-2 d-block mb-2 opacity-50"></i>
                <p class="small">Sé el primero en responder este hilo.</p>
            </div>`;
        return;
    }
 
    const gradients = [
        'linear-gradient(135deg,#10B981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#8b5cf6,#7c3aed)',
        'linear-gradient(135deg,#ef4444,#dc2626)',
        'linear-gradient(135deg,#06b6d4,#0891b2)',
    ];
 
    container.innerHTML = comentarios.map((c, idx) => {
        const nombreAutor  = `${c.autorNombre || ''} ${c.autorApellido || ''}`.trim();
        const ini          = iniciales(c.autorNombre, c.autorApellido);
        const grad         = gradients[idx % gradients.length];
        const contenidoHtml = String(c.contenido || '')
            .split(/\n{2,}/)
            .map(par => `<p>${esc(par.trim()).replace(/\n/g, '<br>')}</p>`)
            .join('');
 
        return `
        <div class="post-card">
            <div class="d-flex gap-3">
                <div>
                    <div class="avatar-md mb-2" style="background:${grad};">${ini}</div>
                    <div class="text-center">
                        <div class="fw-bold" style="font-size:.8rem;">${esc(nombreAutor)}</div>
                        <div class="text-muted" style="font-size:.7rem;">Miembro</div>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="text-muted small mb-2">${fechaRelativa(c.creadoEl)}</div>
                    <div style="line-height:1.7;">${contenidoHtml}</div>
                </div>
            </div>
        </div>`;
    }).join('');
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 3. LIKE BUTTON — guard de autenticación
// ─────────────────────────────────────────────────────────────────────────────
function initLikeButton() {
    // El botón de like está dentro del post original (renderizado por JS)
    // Usamos delegación de eventos en el contenedor
    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('button[data-action="like"], .post-actions button');
        if (!likeBtn) return;
 
        if (!userActual) {
            mostrarModalAuth('dar Like');
            return;
        }
        // Si está autenticado, aquí iría la lógica de like al API
        // Por ahora solo feedback visual
        const span = likeBtn.querySelector(`#hilo-likes-post`);
        if (span) span.textContent = String(Number(span.textContent || 0) + 1);
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLICAR RESPUESTA — guard de autenticación
// ─────────────────────────────────────────────────────────────────────────────
function initFormRespuesta() {
    const form    = document.getElementById('formRespuesta');
    const replyBox = document.getElementById('reply-box');
    if (!form) return;
 
    // Si no hay sesión, reemplazar el formulario con mensaje de login
    if (!userActual) {
        if (replyBox) {
            replyBox.innerHTML = `
                <div class="alert alert-warning d-flex align-items-center gap-3 rounded-3" role="alert">
                    <i class="bi bi-lock-fill fs-4"></i>
                    <div>
                        <strong>Debes iniciar sesión para participar en el foro.</strong><br>
                        <a href="/VISTA_01_Login.html" class="btn btn-primary btn-sm mt-2">
                            <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
                        </a>
                        <a href="/VISTA_03_Register_Postulante.html" class="btn btn-outline-secondary btn-sm mt-2 ms-1">
                            Registrarse
                        </a>
                    </div>
                </div>`;
        }
        return;
    }
 
    form.addEventListener('submit', async e => {
        e.preventDefault();
 
        // Doble check por si la sesión expiró
        if (!userActual) { mostrarModalAuth('responder'); return; }
 
        const btn      = document.getElementById('btn-publicar');
        const textarea = document.getElementById('respuestaTexto');
        const texto    = (textarea?.value || '').trim();
 
        if (!texto) { toast('warning', 'Escribe tu respuesta antes de publicar.'); return; }
 
        setLoading(btn, true);
 
        try {
            const res  = await fetch(`${API}/foro/comentario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    idPublicacion: hiloId,
                    idUsuario:     userActual.id,
                    contenido:     texto,
                }),
            });
            const data = await res.json();
 
            if (res.ok) {
                textarea.value = '';
                toast('success', '✅ Respuesta publicada.');
                await cargarHilo();
            } else {
                toast('danger', data.message || 'Error al publicar la respuesta.');
            }
        } catch (err) {
            console.error(err);
            toast('danger', 'Error de conexión.');
        } finally {
            setLoading(btn, false, 'Publicar respuesta');
        }
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// MODAL / ALERTA DE AUTENTICACIÓN
// ─────────────────────────────────────────────────────────────────────────────
function mostrarModalAuth(accion = 'interactuar') {
    // Intentar usar modal de Bootstrap si existe, si no usar toast
    const modalEl = document.getElementById('modalAuthRequerido');
    if (modalEl && window.bootstrap) {
        const msgEl = modalEl.querySelector('#modal-auth-msg');
        if (msgEl) msgEl.textContent = `Debes iniciar sesión para ${accion} en el foro.`;
        new bootstrap.Modal(modalEl).show();
        return;
    }
 
    // Fallback: toast con enlace
    toast('warning',
        `⚠️ Debes <a href="/VISTA_01_Login.html" class="alert-link fw-bold">iniciar sesión</a> para ${accion} en el foro.`
    );
}
 
// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = (text ?? '').toString();
}
function esc(s) {
    return String(s || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function iniciales(n, a) {
    return ((n || '').charAt(0) + (a || '').charAt(0)).toUpperCase() || '??';
}
function fechaRelativa(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const horas = Math.floor(mins  / 60);
    const dias  = Math.floor(horas / 24);
    if (mins  < 1)   return 'Hace un momento';
    if (mins  < 60)  return `Hace ${mins} min`;
    if (horas < 24)  return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias  < 7)   return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    return new Date(iso).toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' });
}
function setLoading(btn, on, label = 'Publicar respuesta') {
    if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = on
        ? '<span class="spinner-border spinner-border-sm me-1"></span>Publicando...'
        : label;
}
function mostrarError(html) {
    const c = document.getElementById('respuestas-container');
    if (c) c.innerHTML = `<div class="alert alert-warning mt-3">${html}</div>`;
    const titulo = document.getElementById('hilo-titulo');
    if (titulo) titulo.textContent = 'Error al cargar';
}
function toast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:300px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show" role="alert">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 5500);
}