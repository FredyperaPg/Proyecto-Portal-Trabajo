// empleosPublico.js — VISTA_05_Empleos.html
// Fuente de verdad bd-datos.sql: categorías y modalidades exactas de la tabla Empleo
const API = 'http://localhost:3000/api';
 
let todosLosEmpleos = [];
 
// ── Valores exactos del SQL (columnas categoria y modalidad) ─────────────────
const CATEGORIAS = [
    'Tecnología', 'Ventas', 'Finanzas', 'Atención al Cliente', 'Logística',
    'Retail', 'Construcción', 'Telecomunicaciones', 'Calidad',
    'Administración', 'Salud', 'Recursos Humanos', 'Educación'
];
const MODALIDADES = ['Remoto', 'Presencial', 'Híbrido'];
 
document.addEventListener('DOMContentLoaded', async () => {
    poblarSelect('filter-categoria', CATEGORIAS, 'Todas las categorías');
    poblarSelect('filter-modalidad', MODALIDADES, 'Todas las modalidades');
 
    const params   = new URLSearchParams(window.location.search);
    const qInicial = params.get('q') || '';
    const searchInput = document.getElementById('search-input');
    if (searchInput && qInicial) searchInput.value = qInicial;
 
    await cargarEmpleos(qInicial);
 
    searchInput?.addEventListener('input', debounce(filtrarLocal, 300));
    document.getElementById('filter-modalidad')?.addEventListener('change', filtrarLocal);
    document.getElementById('filter-categoria')?.addEventListener('change', filtrarLocal);
    document.getElementById('sort-select')?.addEventListener('change', filtrarLocal);
    document.getElementById('btn-buscar')?.addEventListener('click', filtrarLocal);
 
    // Botón Limpiar — buscado por ID o por texto
    const btnLimpiar = document.getElementById('btn-limpiar') ||
        [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Limpiar');
    if (btnLimpiar) {
        btnLimpiar.id = 'btn-limpiar';
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', filtrarLocal);
});
 
function poblarSelect(id, opciones, placeholder) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = `<option value="">${placeholder}</option>` +
        opciones.map(o => `<option value="${o}">${o}</option>`).join('');
}
 
async function cargarEmpleos(busqueda = '') {
    const container = document.getElementById('empleos-list-container');
    if (!container) return;
    container.innerHTML = '<div class="text-center py-5 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Buscando empleos...</div>';
    try {
        const url = busqueda ? `${API}/empleos?busqueda=${encodeURIComponent(busqueda)}` : `${API}/empleos`;
        const res  = await fetch(url);
        const data = await res.json();
        todosLosEmpleos = data.data || [];
        filtrarLocal();
        const cnt = document.getElementById('count-empleos');
        if (cnt) cnt.textContent = todosLosEmpleos.length;
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="alert alert-danger m-3">Error al cargar empleos. Verifica tu conexión.</div>';
    }
}
 
function filtrarLocal() {
    const q     = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const modal = document.getElementById('filter-modalidad')?.value || '';
    const cat   = document.getElementById('filter-categoria')?.value  || '';
    const sort  = document.getElementById('sort-select')?.value       || '';
 
    // Checkboxes sidebar (tipo de empleo)
    const tipoLabels = { f1:'tiempo completo', f2:'medio tiempo', f3:'freelance', f4:'prácticas' };
    const tipoSel = Object.entries(tipoLabels)
        .filter(([id]) => document.getElementById(id)?.checked).map(([,v]) => v);
 
    let filtrados = todosLosEmpleos.filter(e => {
        const texto = `${e.titulo} ${e.nombreEmpresa} ${e.descripcion || ''}`.toLowerCase();
        const pasaQ     = !q     || texto.includes(q);
        const pasaModal = !modal || e.modalidad === modal;
        const pasaCat   = !cat   || e.categoria === cat;
        const pasaTipo  = tipoSel.length === 0 ||
            tipoSel.some(t => (e.tipoContrato || '').toLowerCase().includes(t));
        return pasaQ && pasaModal && pasaCat && pasaTipo;
    });
 
    // Ordenar
    if (sort === 'salario' || sort.toLowerCase().includes('mayor')) {
        filtrados.sort((a, b) => (b.salarioMax || 0) - (a.salarioMax || 0));
    } else if (sort === 'asc') {
        filtrados.sort((a, b) => new Date(a.creadoEl) - new Date(b.creadoEl));
    } else {
        filtrados.sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));
    }
 
    renderEmpleos(filtrados);
    const cnt = document.getElementById('count-empleos');
    if (cnt) cnt.textContent = filtrados.length;
}
 
function limpiarFiltros() {
    ['search-input','filter-modalidad','filter-categoria','sort-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['f1','f2','f3','f4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });
    const sr = document.getElementById('salaryRange');
    if (sr) sr.value = sr.max || 5000;
    filtrarLocal();
}
 
function renderEmpleos(empleos) {
    const container = document.getElementById('empleos-list-container');
    if (!container) return;
 
    if (empleos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-search fs-1 d-block mb-3"></i>
                <p>No se encontraron empleos con esos filtros.</p>
                <button class="btn btn-outline-primary btn-sm" onclick="limpiarFiltros()">Limpiar filtros</button>
            </div>`;
        return;
    }
 
    container.innerHTML = empleos.map(e => {
        const salario = e.salarioMin
            ? `$${Number(e.salarioMin).toLocaleString()} – $${Number(e.salarioMax).toLocaleString()}/mes`
            : 'A convenir';
        const dias   = Math.floor((Date.now() - new Date(e.creadoEl)) / 86400000);
        const tiempo = dias === 0 ? 'Hoy' : dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
 
        return `
        <div class="job-card">
            <div class="d-flex gap-3">
                <div class="company-logo">${sectorEmoji(e.categoria)}</div>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-start justify-content-between flex-wrap gap-2">
                        <div>
                            <h6 class="mb-1 fw-bold">
                                <a href="/VISTA_06_DetallesEmpleo.html?id=${e.id}"
                                   class="text-decoration-none" style="color:var(--text);">${esc(e.titulo)}</a>
                            </h6>
                            <div class="text-muted small mb-2">${esc(e.nombreEmpresa)} · ${esc((e.ubicacion||'').split(',')[0])}</div>
                        </div>
                        <span class="text-muted small">${tiempo}</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <span class="badge badge-full">${esc(e.modalidad)}</span>
                        <span class="badge" style="background:#f0fdf4;color:#166534;">${esc(e.categoria)}</span>
                        ${e.vacantes > 1 ? `<span class="badge bg-light text-muted">${e.vacantes} vacantes</span>` : ''}
                    </div>
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <span class="fw-semibold text-primary">${salario}</span>
                        <a href="/VISTA_06_DetallesEmpleo.html?id=${e.id}"
                           class="btn btn-outline-primary btn-sm">Ver detalle →</a>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}
 
function sectorEmoji(cat) {
    const map = {
        'Tecnología':'💻','Finanzas':'🏦','Banca y Finanzas':'🏦','Retail':'🛒',
        'Ventas':'📊','Telecomunicaciones':'📡','Construcción':'🏗️',
        'Atención al Cliente':'🎧','Logística':'📦','Calidad':'✅',
        'Administración':'🗂️','Salud':'🏥','Recursos Humanos':'👥','Educación':'🎓'
    };
    return map[cat] || '🏢';
}
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }