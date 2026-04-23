// homePublico.js — VISTA_04_Inicio
const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([cargarEmpleosHome(), cargarStats(), cargarStatsCategorias()]);

    // Buscador del hero
    const heroSearch = document.getElementById('hero-search');
    const heroBtn    = document.getElementById('hero-search-btn');
    if (heroBtn && heroSearch) {
        heroBtn.addEventListener('click', () => {
            const q = heroSearch.value.trim();
            window.location.href = `/VISTA_05_Empleos.html${q ? '?q=' + encodeURIComponent(q) : ''}`;
        });
        heroSearch.addEventListener('keydown', e => { if (e.key === 'Enter') heroBtn.click(); });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Stats generales (barra debajo del hero)
// ─────────────────────────────────────────────────────────────────────────────
async function cargarStats() {
    try {
        const res  = await fetch(`${API}/recursos/stats`);
        const data = await res.json();
        const s    = data.data || {};

        setStatEl(0, s.totalEmpleos,    'Empleos activos');
        setStatEl(1, s.totalEmpresas,   'Empresas registradas');
        setStatEl(2, s.totalCandidatos, 'Candidatos');

        setEl('stat-empleos',    s.totalEmpleos);
        setEl('stat-empresas',   s.totalEmpresas);
        setEl('stat-candidatos', s.totalCandidatos);
    } catch (err) {
        console.error('Error cargando stats:', err);
    }
}

function setStatEl(index, value, label) {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems[index]) {
        const h3 = statItems[index].querySelector('h3');
        const p  = statItems[index].querySelector('p');
        if (h3) h3.textContent = Number(value || 0).toLocaleString('es-SV');
        if (p)  p.textContent  = label;
    }
}

function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(value || 0).toLocaleString('es-SV');
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats por categoría — actualiza los contadores de las tarjetas de categorías
// ─────────────────────────────────────────────────────────────────────────────
async function cargarStatsCategorias() {
    try {
        const res  = await fetch(`${API}/empleos/stats-categorias`);
        if (!res.ok) return;          // endpoint opcional; si falla no rompe la página
        const data = await res.json();
        const cats = data.data || {}; // { "Tecnología": 12, "Finanzas": 5, ... }

        // Recorre cada tarjeta de categoría y actualiza su <small>
        document.querySelectorAll('.category-card').forEach(card => {
            const h6       = card.querySelector('h6');
            const smallEl  = card.querySelector('small');
            if (!h6 || !smallEl) return;

            const nombre = h6.textContent.trim();
            const count  = cats[nombre];

            if (count !== undefined) {
                smallEl.textContent = `${Number(count).toLocaleString('es-SV')} empleo${count !== 1 ? 's' : ''}`;
            } else {
                // Categoría sin datos en la DB → ocultar número para no confundir
                smallEl.textContent = 'Ver empleos';
            }
        });
    } catch (err) {
        // Si el endpoint no existe todavía, simplemente limpia los valores hardcodeados
        console.warn('[homePublico] stats-categorias no disponible:', err);
        document.querySelectorAll('.category-card small').forEach(el => {
            el.textContent = 'Ver empleos';
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Últimos empleos en la home
// ─────────────────────────────────────────────────────────────────────────────
async function cargarEmpleosHome() {
    const container = document.getElementById('home-jobs-container');
    if (!container) return;

    try {
        const res     = await fetch(`${API}/empleos`);
        const data    = await res.json();
        const empleos = (data.data || []).slice(0, 6);

        if (empleos.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-3">No hay empleos disponibles en este momento.</div>';
            return;
        }

        container.innerHTML = empleos.map(e => {
            const salario = e.salarioMin
                ? `$${Number(e.salarioMin).toLocaleString()} – $${Number(e.salarioMax).toLocaleString()}/mes`
                : 'Salario a convenir';
            return `
            <div class="col-md-6 col-lg-4">
                <div class="job-card h-100">
                    <div class="d-flex align-items-start gap-3 mb-3">
                        <div class="company-logo">${sectorEmoji(e.categoria)}</div>
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">
                                <a href="/VISTA_06_DetallesEmpleo.html?id=${e.id}"
                                   class="text-decoration-none" style="color:var(--text);">${esc(e.titulo)}</a>
                            </h6>
                            <span class="text-muted small">${esc(e.nombreEmpresa)}</span>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-3">
                        <span class="badge" style="background:#eff6ff;color:#1d4ed8;">${esc(e.modalidad)}</span>
                        <span class="badge" style="background:#f0fdf4;color:#166534;">${esc(e.categoria)}</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="fw-semibold" style="color:var(--primary);font-size:.9rem;">${salario}</span>
                        <a href="/VISTA_06_DetallesEmpleo.html?id=${e.id}" class="btn btn-primary btn-sm">Ver oferta</a>
                    </div>
                </div>
            </div>`;
        }).join('');

    } catch (err) {
        console.error('Error cargando empleos home:', err);
        container.innerHTML = '<div class="col-12 text-center text-muted py-3">No se pudieron cargar los empleos.</div>';
    }
}

function sectorEmoji(cat) {
    const m = { 'Tecnología':'💻','Finanzas':'🏦','Banca y Finanzas':'🏦','Retail':'🛒',
                'Ventas':'📊','Marketing':'📊','Telecomunicaciones':'📡','Construcción':'🏗️',
                'Atención al Cliente':'🎧','Logística':'📦','Calidad':'✅',
                'Salud':'🏥','Legal':'⚖️','Educación':'🎓','Ingeniería':'🔧','Diseño':'🎨' };
    return m[cat] || '🏢';
}
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
