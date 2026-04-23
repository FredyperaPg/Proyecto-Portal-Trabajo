// detalleRecurso.js — VISTA_19_DetallesRecurso_Postulante
// Carga dinámica del recurso y renderiza el cuerpo + sidebar "Contenido del artículo".
// El sidebar de índice sólo se muestra si el contenido tiene secciones (<h2>).
const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }

    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        mostrarError('No se especificó un recurso. Vuelve al listado.');
        return;
    }

    try {
        const res  = await fetch(`${API}/recursos/${id}`);
        const data = await res.json();
        if (!res.ok || !data.data) {
            mostrarError('Recurso no encontrado o no disponible.');
            return;
        }
        const r = data.data;

        // ── Encabezado ────────────────────────────────────────────────────────
        set('#recurso-titulo, h1.recurso-titulo', r.titulo);
        set('#recurso-tipo',                      r.tipo);
        set('#recurso-autor',                     `${r.autorNombre || ''} ${r.autorApellido || ''}`.trim());
        set('#recurso-fecha',                     r.fechaPublicacion
            ? new Date(r.fechaPublicacion).toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' })
            : '');

        document.title = `${r.titulo} — PortalEmpleos`;

        // ── Banner / imagen de portada ─────────────────────────────────────
        // object-fit: cover para evitar distorsión
        const coverEl = document.querySelector('.article-cover');
        if (coverEl) {
            if (r.urlBanner) {
                coverEl.innerHTML = `<img src="${esc(r.urlBanner)}" alt="${esc(r.titulo)}"
                    style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;">`;
            }
            // Si no hay banner, el emoji/placeholder estático del HTML se conserva
        }

        // ── Cuerpo del artículo ───────────────────────────────────────────
        const bodyEl = document.querySelector('.article-body');
        if (bodyEl && r.contenido) {
            // El contenido puede venir como HTML o como texto plano
            const esHtml = /<[a-z][\s\S]*>/i.test(r.contenido);
            if (esHtml) {
                bodyEl.innerHTML = r.contenido;
            } else {
                // Texto plano → convertir párrafos separados por doble salto
                bodyEl.innerHTML = r.contenido
                    .split(/\n{2,}/)
                    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                    .join('');
            }
        }

        // ── Sidebar "Contenido del artículo" ─────────────────────────────
        // Se muestra sólo si existen secciones (h2) en el cuerpo renderizado
        const sidebarCard = document.querySelector('.content-card');
        if (sidebarCard) {
            const headings = bodyEl
                ? Array.from(bodyEl.querySelectorAll('h2'))
                : [];

            if (headings.length === 0) {
                // Sin secciones: ocultar tarjeta de índice
                sidebarCard.style.display = 'none';
            } else {
                // Construir índice dinámico con anclas
                const liItems = headings.map((h, i) => {
                    const ancla = `seccion-${i + 1}`;
                    h.id = ancla;          // asignar ID al heading para el scroll
                    return `<li class="mb-2">
                        <a href="#${ancla}" style="color:var(--muted);text-decoration:none;">
                            <i class="bi bi-chevron-right me-1"></i>${esc(h.textContent)}
                        </a></li>`;
                }).join('');

                sidebarCard.innerHTML = `
                    <h6 class="fw-bold mb-3">Contenido del artículo</h6>
                    <ul class="list-unstyled small">${liItems}</ul>`;
            }
        }

        // ── Autor ─────────────────────────────────────────────────────────
        const autorCard = document.querySelector('.author-card');
        if (autorCard) {
            const nombreAutor = `${r.autorNombre || ''} ${r.autorApellido || ''}`.trim();
            const iniciales   = (r.autorNombre?.[0] || '') + (r.autorApellido?.[0] || '');
            const avatarEl    = autorCard.querySelector('.avatar-lg');
            if (avatarEl) avatarEl.textContent = iniciales.toUpperCase() || '??';
            const nombreEl = autorCard.querySelector('.fw-bold');
            if (nombreEl) nombreEl.textContent = nombreAutor;
        }

    } catch (err) {
        console.error('[detalleRecurso]', err);
        mostrarError('Ocurrió un error al cargar el recurso.');
    }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function set(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text || ''; });
}
function esc(s) {
    return String(s || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function mostrarError(msg) {
    const bodyEl = document.querySelector('.article-body');
    if (bodyEl) {
        bodyEl.innerHTML = `<div class="alert alert-warning">${msg}</div>`;
    }
    // Ocultar sidebar de índice también
    const sc = document.querySelector('.content-card');
    if (sc) sc.style.display = 'none';
}
