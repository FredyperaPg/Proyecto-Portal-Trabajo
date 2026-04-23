// misAplicaciones.js — VISTA_17
const API = 'http://localhost:3000/api';
let todasLasApps = [];

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }

    if (!user.idCandidato) {
        setContainer('<div class="alert alert-warning m-3">No se encontró tu perfil de candidato. Intenta cerrar sesión e ingresar de nuevo.</div>');
        return;
    }

    try {
        const res  = await fetch(`${API}/postulaciones/candidato/${user.idCandidato}`, { credentials: 'include' });
        const data = await res.json();
        todasLasApps = data.data || [];

        // Contadores
        setNum('count-aplicaciones', todasLasApps.length);
        setNum('count-revisando',    todasLasApps.filter(a => a.estado === 'revisando').length);
        setNum('count-aceptadas',    todasLasApps.filter(a => a.estado === 'aceptada').length);
        setNum('count-rechazadas',   todasLasApps.filter(a => a.estado === 'rechazada').length);

        renderApps(todasLasApps);

    } catch (err) {
        console.error(err);
        setContainer('<div class="alert alert-danger m-3">Error al cargar tus aplicaciones.</div>');
    }

    // ── Filtros por tab ────────────────────────────────────────────────────────
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.dataset.filter || 'todas';
            const filtradas = filtro === 'todas'
                ? todasLasApps
                : todasLasApps.filter(a => a.estado === filtro);
            renderApps(filtradas);
        });
    });
});

function renderApps(apps) {
    const container = document.getElementById('aplicaciones-container');
    if (!container) return;

    if (apps.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                <p>No hay aplicaciones en esta categoría.</p>
                <a href="/VISTA_15_Empleos_Postulante.html" class="btn btn-primary btn-sm">
                    <i class="bi bi-search me-1"></i>Buscar empleos
                </a>
            </div>`;
        return;
    }

    const estadoMap = {
        pendiente:  { cls: 'status-pill s-pending',   label: 'Pendiente' },
        revisando:  { cls: 'status-pill s-review',    label: 'En revisión' },
        aceptada:   { cls: 'status-pill s-interview', label: 'Aceptada' },
        rechazada:  { cls: 'status-pill s-rejected',  label: 'Rechazada' },
    };

    container.innerHTML = apps.map(a => {
        const { cls, label } = estadoMap[a.estado] || { cls: 'status-pill s-pending', label: a.estado };
        const fecha = new Date(a.fechaPostulacion).toLocaleDateString('es-SV');
        const emoji = a.logoEmpresa ? '' : '🏢';
        return `
        <div class="app-item" data-estado="${a.estado}">
            <div class="co-logo">${emoji}</div>
            <div class="app-info">
                <a href="/VISTA_16_DetallesEmpleo_Postulante.html?id=${a.idEmpleo}" class="job-title">
                    ${esc(a.tituloEmpleo)}
                </a>
                <div class="job-meta">
                    ${esc(a.nombreEmpresa)} · ${esc(a.ubicacion || '')} · ${esc(a.modalidad || '')}
                </div>
            </div>
            <span class="${cls}">${label}</span>
            <div class="app-date">${fecha}</div>
        </div>`;
    }).join('');
}

function setContainer(html) {
    const el = document.getElementById('aplicaciones-container');
    if (el) el.innerHTML = html;
}
function setNum(id, n) { const el = document.getElementById(id); if (el) el.textContent = n; }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
