// recursosPostulante.js — VISTA_18_Recursos_Postulante
const API = 'http://localhost:3000/api';
let todosRecursos = [];
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    await cargarRecursos();
 
    // ── Filtros por tipo (pills) ───────────────────────────────────────────────
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
 
            // Extraer tipo del texto del pill (quitando el emoji inicial si hay)
            const textoCompleto = pill.textContent.trim();
            const tipo = textoCompleto.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}📰🎓📄📚💼🚀✅🎬\s]+/u, '').trim();
 
            const filtrado = (tipo === 'Todos' || tipo === '')
                ? todosRecursos
                : todosRecursos.filter(r => {
                    if (!r.tipo) return false;
                    // Mapa de equivalencias pill→tipo en DB
                    const map = {
                        'Noticias':    ['Noticia'],
                        'Noticia':     ['Noticia'],
                        'Tutoriales':  ['Tutorial'],
                        'Tutorial':    ['Tutorial'],
                        'Artículos':   ['Articulo'],
                        'Artículo':    ['Articulo'],
                        'Guías':       ['Guia'],
                        'Guía':        ['Guia'],
                        'Entrevistas': ['Entrevista','Articulo'],
                        'Tendencias':  ['Noticia','Articulo'],
                    };
                    const posibles = map[tipo] || [tipo];
                    return posibles.some(t => r.tipo.toLowerCase() === t.toLowerCase());
                });
 
            renderRecursos(filtrado);
        });
    });
 
    // ── Buscador ──────────────────────────────────────────────────────────────
    const searchInput = document.querySelector('input[placeholder*="Buscar recursos"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            const q = searchInput.value.toLowerCase().trim();
            const filtrado = q
                ? todosRecursos.filter(r =>
                    r.titulo.toLowerCase().includes(q) ||
                    (r.contenido || '').toLowerCase().includes(q))
                : todosRecursos;
 
            // Mantener pill activa visible
            renderRecursos(filtrado);
        }, 300));
    }
});
 
async function cargarRecursos() {
    const container = document.getElementById('recursos-container');
    if (!container) return;
 
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">
        <span class="spinner-border spinner-border-sm me-2"></span>Cargando recursos...</div>`;
 
    try {
        const res  = await fetch(`${API}/recursos`);
        const data = await res.json();
        todosRecursos = data.data || [];
 
        if (todosRecursos.length === 0) {
            // Mostrar recursos de ejemplo si la DB está vacía
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        Aún no hay recursos en la base de datos. Ejecuta el script 
                        <strong>BD_Datos_ElSalvador.sql</strong> para cargar el contenido inicial.
                    </div>
                </div>`;
            return;
        }
 
        renderRecursos(todosRecursos);
    } catch (err) {
        console.error('[recursosPostulante] cargarRecursos:', err);
        container.innerHTML = `<div class="col-12">
            <div class="alert alert-danger">Error al cargar recursos. Verifica tu conexión.</div>
        </div>`;
    }
}
 
function renderRecursos(recursos) {
    const container = document.getElementById('recursos-container');
    if (!container) return;
 
    if (recursos.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5">
            <i class="bi bi-search fs-1 d-block mb-3"></i>
            <p>No hay recursos en esta categoría.</p></div>`;
        return;
    }
 
    const tipoEmoji  = { 'Articulo':'📄','Video':'🎬','Guia':'📚','Noticia':'📰','Tutorial':'🎓','Entrevista':'💼' };
    const tipoColor  = { 'Articulo':'#7c3aed','Guia':'#059669','Noticia':'#2563eb','Tutorial':'#d97706','Video':'#dc2626','Entrevista':'#0891b2' };
 
    container.innerHTML = recursos.map(r => {
        const emoji  = tipoEmoji[r.tipo]  || '📄';
        const color  = tipoColor[r.tipo]  || '#6b7280';
        const fecha  = new Date(r.fechaPublicacion).toLocaleDateString('es-SV');
        const resumen = (r.contenido || '').substring(0, 130).trim() + '...';
        const autor  = `${r.autorNombre || ''} ${r.autorApellido || ''}`.trim() || 'Redacción';
 
        return `
        <div class="col-md-6 col-lg-4">
            <div class="resource-card h-100">
                <div class="card-img" style="background:linear-gradient(135deg,${color},${color}99);
                     font-size:2rem;display:flex;align-items:center;justify-content:center;
                     min-height:140px;border-radius:12px 12px 0 0;">
                    ${emoji}
                </div>
                <div class="card-body p-3 d-flex flex-column">
                    <span class="badge mb-2 align-self-start" style="background:${color}22;color:${color};">
                        ${esc(r.tipo)}
                    </span>
                    <h6 class="fw-bold mb-2 flex-grow-1">${esc(r.titulo)}</h6>
                    <p class="text-muted small mb-3">${esc(resumen)}</p>
                    <div class="d-flex align-items-center justify-content-between mt-auto">
                        <span class="text-muted small">
                            <i class="bi bi-person me-1"></i>${esc(autor)} · ${fecha}
                        </span>
                        <a href="/VISTA_19_DetallesRecurso_Postulante.html?id=${r.id}"
                           class="btn btn-outline-primary btn-sm">Leer →</a>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}
 
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }