// ============================================================
// empleosPrivado.js — VISTA_15_Empleos_Postulante
// Conecta con GET /api/empleos — mapeando campos reales de BD:
//   titulo, nombreEmpresa (= Perfil_Empresa.nombreComercial),
//   descripcion_puesto, requisitos, modalidad, categoria, etc.
// ============================================================
const API = 'http://localhost:3000/api';
 
// Cache global — filtros trabajan en memoria sobre este array
let todosEmpleos = [];
 
// Categorías exactas del SQL
const CAT_LABELS = {
    cat1: 'Tecnología',
    cat2: 'Finanzas',
    cat3: 'Ventas',
    cat4: 'Atención al Cliente',
    cat5: 'Retail',
    cat6: 'Telecomunicaciones',
};
 
const MODAL_LABELS = {
    m1: 'Remoto',
    m2: 'Presencial',
    m3: 'Híbrido',
};
 
const TIPO_LABELS = {
    f1: 'Tiempo completo',
    f2: 'Medio tiempo',
    f3: 'Freelance',
    f4: 'Prácticas',
};
 
// ═══════════════════════════════════════════════════════════════
// 1. ENTRADA
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    // Pre-rellenar buscador desde ?q= (viene de home/dashboard)
    const urlParams   = new URLSearchParams(window.location.search);
    const qInicial    = urlParams.get('q') || '';
    const searchInput = document.getElementById('search-input') ||
                        document.querySelector('input[placeholder*="Cargo"]');
    if (searchInput && qInicial) searchInput.value = qInicial;
 
    await cargarEmpleos();
 
    // Listeners de filtros
    searchInput?.addEventListener('input', debounce(aplicarFiltros, 300));
 
    [...Object.keys(TIPO_LABELS), ...Object.keys(MODAL_LABELS), ...Object.keys(CAT_LABELS)].forEach(id =>
        document.getElementById(id)?.addEventListener('change', aplicarFiltros)
    );
 
    const salaryRange = document.getElementById('salaryRange');
    if (salaryRange) {
        salaryRange.addEventListener('input', function () {
            const label = this.parentElement?.querySelector('.fw-bold');
            if (label) label.textContent = `$${Number(this.value).toLocaleString()}`;
            aplicarFiltros();
        });
    }
 
    document.querySelectorAll('input[name="exp"]').forEach(r =>
        r.addEventListener('change', aplicarFiltros)
    );
 
    document.getElementById('sort-select')?.addEventListener('change', aplicarFiltros);
 
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', () => aplicarFiltrosConAPI());
 
    const btnLimpiar =
        document.getElementById('btn-limpiar') ||
        [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Limpiar');
    btnLimpiar?.addEventListener('click', limpiarFiltros);
});
 
// ═══════════════════════════════════════════════════════════════
// 2. CARGA DESDE API
// ═══════════════════════════════════════════════════════════════
async function cargarEmpleos(queryParams = '') {
    const container = document.getElementById('empleos-list-container');
 
    // ── LIMPIEZA DE DATOS FANTASMA ────────────────────────────
    // Borra cualquier contenido estático (TecnoCorp, Desarrollador Java, etc.)
    // antes de renderizar los datos reales de la BD
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <span class="spinner-border spinner-border-sm me-2"></span>Buscando empleos...
            </div>`;
    }
 
    try {
        const url = queryParams ? `${API}/empleos?${queryParams}` : `${API}/empleos`;
        const res  = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
 
        const data  = await res.json();
        todosEmpleos = Array.isArray(data.data) ? data.data : [];
 
        aplicarFiltros();
    } catch (err) {
        console.error('[empleosPrivado] cargarEmpleos:', err);
        if (container) container.innerHTML = `
            <div class="alert alert-danger m-3">
                <i class="bi bi-wifi-off me-2"></i>
                Error al cargar empleos. Verifica tu conexión o recarga la página.
            </div>`;
    }
}
 
// ═══════════════════════════════════════════════════════════════
// 3. FILTROS VÍA API (botón "Aplicar filtros")
// ═══════════════════════════════════════════════════════════════
async function aplicarFiltrosConAPI() {
    const params = new URLSearchParams();
 
    const catSel = Object.entries(CAT_LABELS)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, v]) => v);
    if (catSel.length === 1) params.set('categoria', catSel[0]);
 
    const modalSel = Object.entries(MODAL_LABELS)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, v]) => v);
    if (modalSel.length === 1) params.set('modalidad', modalSel[0]);
 
    const searchInput = document.getElementById('search-input') ||
                        document.querySelector('input[placeholder*="Cargo"]');
    const q = (searchInput?.value || '').trim();
    if (q) params.set('busqueda', q);
 
    await cargarEmpleos(params.toString());
}
 
// ═══════════════════════════════════════════════════════════════
// 4. FILTROS EN MEMORIA (reacciona a cada cambio de UI)
// ═══════════════════════════════════════════════════════════════
function aplicarFiltros() {
    const searchInput = document.getElementById('search-input') ||
                        document.querySelector('input[placeholder*="Cargo"]');
    const q = (searchInput?.value || '').toLowerCase().trim();
 
    const tipoSel = Object.entries(TIPO_LABELS)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, v]) => v.toLowerCase());
 
    const modalSel = Object.entries(MODAL_LABELS)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, v]) => v.toLowerCase());
 
    const catSel = Object.entries(CAT_LABELS)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, v]) => v.toLowerCase());
 
    const salarioMax = Number(document.getElementById('salaryRange')?.value || 99999);
    const expId = document.querySelector('input[name="exp"]:checked')?.id || 'e1';
    const sortVal = document.getElementById('sort-select')?.value || '';
 
    let filtrados = todosEmpleos.filter(e => {
        // nombreEmpresa viene de Perfil_Empresa.nombreComercial (alias del JOIN)
        const texto = `${e.titulo} ${e.nombreEmpresa || ''} ${e.descripcion || e.descripcion_puesto || ''} ${e.categoria || ''}`.toLowerCase();
 
        if (q && !texto.includes(q)) return false;
 
        if (tipoSel.length > 0 &&
            !tipoSel.some(t => (e.tipoContrato || '').toLowerCase().includes(t))) return false;
 
        if (modalSel.length > 0 &&
            !modalSel.some(m => (e.modalidad || '').toLowerCase() === m)) return false;
 
        if (catSel.length > 0 &&
            !catSel.some(c => (e.categoria || '').toLowerCase() === c)) return false;
 
        if (salarioMax < 4999 && e.salarioMin && Number(e.salarioMin) > salarioMax) return false;
 
        const anos = e.anosExperiencia ?? null;
        if (anos !== null) {
            if (expId === 'e2' && (anos < 1 || anos > 3)) return false;
            if (expId === 'e3' && (anos < 3 || anos > 5)) return false;
            if (expId === 'e4' && anos < 5)               return false;
        }
 
        return true;
    });
 
    // Ordenamiento
    if (sortVal.toLowerCase().includes('salario') || sortVal.toLowerCase().includes('mayor')) {
        filtrados.sort((a, b) => (Number(b.salarioMax) || 0) - (Number(a.salarioMax) || 0));
    } else if (sortVal.toLowerCase().includes('asc')) {
        filtrados.sort((a, b) => new Date(a.creadoEl) - new Date(b.creadoEl));
    } else {
        filtrados.sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));
    }
 
    renderEmpleos(filtrados);
}
 
// ═══════════════════════════════════════════════════════════════
// 5. LIMPIAR FILTROS
// ═══════════════════════════════════════════════════════════════
function limpiarFiltros() {
    [...Object.keys(TIPO_LABELS), ...Object.keys(MODAL_LABELS), ...Object.keys(CAT_LABELS)]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = false;
        });
 
    const e1 = document.getElementById('e1');
    if (e1) e1.checked = true;
 
    const sr = document.getElementById('salaryRange');
    if (sr) {
        sr.value = sr.max || 5000;
        const label = sr.parentElement?.querySelector('.fw-bold');
        if (label) label.textContent = `$${Number(sr.value).toLocaleString()}`;
    }
 
    const si = document.getElementById('search-input') ||
               document.querySelector('input[placeholder*="Cargo"]');
    if (si) si.value = '';
 
    const sortSel = document.getElementById('sort-select');
    if (sortSel) sortSel.selectedIndex = 0;
 
    aplicarFiltros();
}
 
// ═══════════════════════════════════════════════════════════════
// 6. RENDERIZADO — Tarjetas con datos REALES de BD
//    Campos: titulo, nombreEmpresa (nombreComercial),
//            descripcion/descripcion_puesto, requisitos
//    Botón "Ver detalle" → VISTA_16_DetallesEmpleo_Postulante.html?id=
// ═══════════════════════════════════════════════════════════════
function renderEmpleos(empleos) {
    const container = document.getElementById('empleos-list-container');
    if (!container) return;
 
    // ── LIMPIEZA ANTES DE RENDERIZAR ─────────────────────────
    container.innerHTML = '';
 
    // Actualizar contador
    document.querySelectorAll('#count-empleos').forEach(el => {
        el.textContent = empleos.length;
    });
 
    if (empleos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
                <p class="fw-semibold mb-1">No se encontraron empleos con esos criterios.</p>
                <p class="small">Prueba con otros filtros o amplía tu búsqueda.</p>
                <button class="btn btn-outline-secondary btn-sm mt-2" onclick="limpiarFiltros()">
                    <i class="bi bi-x-circle me-1"></i>Limpiar filtros
                </button>
            </div>`;
        return;
    }
 
    const user = JSON.parse(localStorage.getItem('user') || 'null');
 
    container.innerHTML = empleos.map(empleo => {
        // ── Campos reales mapeados desde la BD ───────────────
        // nombreEmpresa = Perfil_Empresa.nombreComercial (traído por JOIN en empleoService)
        const empresa   = empleo.nombreEmpresa || empleo.nombreComercial || '—';
 
        // descripcion = alias virtual de descripcion_puesto en la tabla Empleo
        const descRaw   = empleo.descripcion || empleo.descripcion_puesto || '';
        const descCorta = descRaw.length > 150
            ? descRaw.substring(0, 150).trimEnd() + '...'
            : descRaw;
 
        // Salario
        const salarioTexto = (empleo.salarioMin && empleo.salarioMax)
            ? `$${Number(empleo.salarioMin).toLocaleString('es-SV')} – $${Number(empleo.salarioMax).toLocaleString('es-SV')}/mes`
            : empleo.salarioMin
                ? `Desde $${Number(empleo.salarioMin).toLocaleString('es-SV')}/mes`
                : 'A convenir';
 
        // Tiempo publicado
        const dias = Math.floor((Date.now() - new Date(empleo.creadoEl)) / 86400000);
        const tiempoTexto = dias === 0 ? 'Hoy'
            : dias === 1 ? 'Hace 1 día'
            : `Hace ${dias} días`;
 
        const vacantesTexto = empleo.vacantes > 1 ? ` · ${empleo.vacantes} vacantes` : '';
 
        // Botón Aplicar solo si el usuario es postulante
        const btnAplicar = user?.idCandidato
            ? `<button class="btn btn-primary btn-sm aplicar-btn"
                       data-id="${empleo.id}"
                       title="Aplicar a esta vacante">
                   <i class="bi bi-send me-1"></i>Aplicar
               </button>`
            : '';
 
        return `
<div class="job-card p-3 mb-3 border rounded shadow-sm" data-id="${empleo.id}">
 
    <!-- Fila 1: Título + badge modalidad -->
    <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
        <h5 class="mb-0 fw-bold">
            <a href="/VISTA_16_DetallesEmpleo_Postulante.html?id=${empleo.id}"
               class="text-primary text-decoration-none">
                ${esc(empleo.titulo)}
            </a>
        </h5>
        <span class="badge bg-light text-dark flex-shrink-0">${esc(empleo.modalidad || '—')}</span>
    </div>
 
    <!-- Fila 2: Empresa (nombreComercial) + ubicación -->
    <p class="text-muted small mb-2">
        <i class="bi bi-building me-1"></i><strong>${esc(empresa)}</strong>
        &nbsp;•&nbsp;
        <i class="bi bi-geo-alt me-1"></i>${esc((empleo.ubicacion || '—').split(',')[0])}
        ${vacantesTexto
            ? `&nbsp;•&nbsp;<span class="text-info">${esc(vacantesTexto.replace(' · ', ''))}</span>`
            : ''}
    </p>
 
    <!-- Fila 3: Descripción del puesto (descripcion_puesto real) -->
    <p class="small text-secondary mb-3" style="line-height:1.5;">
        ${descCorta
            ? esc(descCorta)
            : '<em class="text-muted">Sin descripción disponible.</em>'}
    </p>
 
    <!-- Badges categoría + tipo contrato -->
    <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge" style="background:#f0fdf4;color:#166534;">${esc(empleo.categoria || '—')}</span>
        ${empleo.tipoContrato
            ? `<span class="badge" style="background:#eff6ff;color:#1d4ed8;">${esc(empleo.tipoContrato)}</span>`
            : ''}
    </div>
 
    <!-- Fila 4: Salario + botones -->
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span class="fw-bold text-success fs-6">${esc(salarioTexto)}</span>
        <div class="d-flex align-items-center gap-2">
            <span class="text-muted" style="font-size:.75rem;">${tiempoTexto}</span>
            ${btnAplicar}
            <a href="/VISTA_16_DetallesEmpleo_Postulante.html?id=${empleo.id}"
               class="btn btn-outline-primary btn-sm">
                <i class="bi bi-eye me-1"></i>Ver detalle
            </a>
        </div>
    </div>
 
</div>`;
    }).join('');
 
    // Botones Aplicar — postulación rápida sin recargar
    if (user?.idCandidato) {
        container.querySelectorAll('.aplicar-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const idEmpleo = btn.dataset.id;
                btn.disabled  = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Aplicando...';
 
                try {
                    const r = await fetch(`${API}/postulaciones`, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ idCandidato: user.idCandidato, idEmpleo }),
                    });
 
                    if (r.ok) {
                        btn.innerHTML  = '✅ Aplicado';
                        btn.className  = 'btn btn-success btn-sm';
                    } else if (r.status === 409) {
                        btn.textContent = 'Ya aplicado';
                        btn.className  = 'btn btn-secondary btn-sm';
                        btn.disabled   = true;
                    } else {
                        const err = await r.json();
                        btn.disabled   = false;
                        btn.textContent = 'Error — Reintentar';
                        console.error('[aplicar]', err.message);
                    }
                } catch (err) {
                    console.error('[aplicar] red:', err);
                    btn.disabled   = false;
                    btn.innerHTML  = '<i class="bi bi-send me-1"></i>Aplicar';
                }
            });
        });
    }
}
 
// ═══════════════════════════════════════════════════════════════
// 7. UTILIDADES
// ═══════════════════════════════════════════════════════════════
function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;');
}
 
function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}
 