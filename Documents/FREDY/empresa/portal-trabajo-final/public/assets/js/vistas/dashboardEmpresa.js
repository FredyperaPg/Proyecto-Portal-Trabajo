// dashboardEmpresa.js — VISTA_22_InicioEmpresa
const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }

    // ── Nombre de empresa en sidebar footer ───────────────────────────────────
    const empNombre = document.getElementById('empresa-nombre-sidebar');
    if (empNombre) empNombre.textContent = user.nombre || 'Mi Empresa';

    // ── Saludo en topbar ───────────────────────────────────────────────────────
    ['userNameDisplay', 'saludo-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.nombre || 'Empresa';
    });

    if (!user.idEmpresa) {
        mostrarError('jobs-empresa-container', 'No se encontró el perfil de empresa. Contacta al administrador.');
        return;
    }

    // ── Cargar vacantes publicadas por esta empresa ───────────────────────────
    const container     = document.getElementById('jobs-empresa-container');
    const cntActivas    = document.getElementById('count-activas');
    const cntPendientes = document.getElementById('count-pendientes');
    const cntTotal      = document.getElementById('count-total');
    // KPI cards nuevas
    const kpiEmpleos     = document.getElementById('kpi-empleos');
    const kpiActivas     = document.getElementById('kpi-activas');
    const kpiAplicaciones = document.getElementById('kpi-aplicaciones');

    try {
        const res  = await fetch(`${API}/empleos/empresa/${user.idEmpresa}`, { credentials: 'include' });
        const data = await res.json();
        const empleos = data.data || [];

        // Contadores
        const activas    = empleos.filter(e => e.estado === 'abierta').length;
        const pendientes = empleos.reduce((acc, e) => acc + (Number(e.totalPostulaciones) || 0), 0);

        // Llenar contadores tabla
        if (cntActivas)    cntActivas.textContent    = activas;
        if (cntPendientes) cntPendientes.textContent = pendientes;
        if (cntTotal)      cntTotal.textContent      = empleos.length;

        // Llenar KPI cards
        if (kpiEmpleos)      kpiEmpleos.textContent      = empleos.length;
        if (kpiActivas)      kpiActivas.textContent      = activas;
        if (kpiAplicaciones) kpiAplicaciones.textContent = pendientes;

        if (!container) return;

        if (empleos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-briefcase fs-1 d-block mb-3"></i>
                    <p class="mb-2">Aún no has publicado ninguna oferta.</p>
                    <a href="/VISTA_27_PublicarOfertaEmpresa.html" class="btn btn-primary btn-sm">
                        <i class="bi bi-plus-circle me-1"></i>Publicar primera oferta
                    </a>
                </div>`;
            return;
        }

        container.innerHTML = empleos.slice(0, 6).map(e => {
            const badge = e.estado === 'abierta'
                ? '<span class="badge bg-success">Activa</span>'
                : '<span class="badge bg-secondary">Cerrada</span>';
            return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="fw-bold mb-0">${esc(e.titulo)}</h6>
                            ${badge}
                        </div>
                        <p class="text-muted small mb-1">
                            <i class="bi bi-geo-alt me-1"></i>${esc(e.ubicacion)}
                            &nbsp;·&nbsp;<i class="bi bi-laptop me-1"></i>${esc(e.modalidad)}
                        </p>
                        <p class="small mb-2">
                            <i class="bi bi-people me-1 text-primary"></i>
                            <strong>${e.totalPostulaciones || 0}</strong> postulaciones
                            &nbsp;·&nbsp;
                            <i class="bi bi-person-badge me-1 text-success"></i>
                            ${e.vacantes || 1} vacante${(e.vacantes || 1) !== 1 ? 's' : ''}
                        </p>
                        <p class="text-muted small mb-0">
                            <i class="bi bi-calendar3 me-1"></i>
                            Publicada: ${new Date(e.creadoEl).toLocaleDateString('es-SV')}
                        </p>
                    </div>
                    <div class="card-footer bg-transparent border-0 d-flex gap-2">
                        <a href="/VISTA_25_AplicacionesOfertaEmpresa.html?idEmpleo=${e.id}"
                           class="btn btn-outline-primary btn-sm flex-grow-1">Ver postulantes</a>
                        <button class="btn btn-outline-secondary btn-sm"
                                onclick="toggleEstado('${e.id}', '${e.estado}', this)">
                            ${e.estado === 'abierta' ? 'Cerrar' : 'Reabrir'}
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

    } catch (err) {
        console.error(err);
        if (container) mostrarError('jobs-empresa-container', 'Error al cargar las vacantes. Verifica tu conexión.');
    }
});

async function toggleEstado(idEmpleo, estadoActual, btn) {
    const nuevoEstado = estadoActual === 'abierta' ? 'cerrada' : 'abierta';
    try {
        btn.disabled = true;
        await fetch(`http://localhost:3000/api/empleos/${idEmpleo}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        location.reload();
    } catch { btn.disabled = false; alert('Error al cambiar el estado.'); }
}

function mostrarError(containerId, msg) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = `<div class="col-12"><div class="alert alert-danger">${msg}</div></div>`;
}

function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


