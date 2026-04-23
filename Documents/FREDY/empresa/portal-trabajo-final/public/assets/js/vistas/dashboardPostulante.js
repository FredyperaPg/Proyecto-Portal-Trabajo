// dashboardPostulante.js
// Carga dinámica del dashboard del postulante desde localStorage y la API

const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    // ── 1. CARGAR DATOS DEL USUARIO DESDE LOCALSTORAGE ─────────────────────
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = '/VISTA_01_Login.html';
        return;
    }

    // Mostrar nombre en sidebar y saludo
    const displayName = document.getElementById('user-display-name');
    if (displayName) displayName.textContent = user.email || user.nombre;

    const saludoEl = document.getElementById('saludo-nombre');
    if (saludoEl) saludoEl.textContent = user.nombre || 'Postulante';

    // ── 2. LOGOUT ────────────────────────────────────────────────────────────
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API_BASE}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });
            } catch (err) {
                console.error('Error cerrando sesión en servidor:', err);
            }
            localStorage.clear();
            window.location.href = '/VISTA_01_Login.html';
        });
    }

    // ── 3. CARGAR VACANTES RECIENTES DESDE LA API ────────────────────────────
    const jobsContainer = document.getElementById('jobs-container');
    const countJobs     = document.getElementById('count-jobs');
    const countCompanies = document.getElementById('count-companies');

    try {
        const res = await fetch(`${API_BASE}/empleos`, { credentials: 'include' });

        if (res.ok) {
            const data = await res.json();
            const empleos = data.data || data || [];

            // Actualizar contadores
            if (countJobs) countJobs.textContent = empleos.length;

            // Contar empresas únicas
            if (countCompanies) {
                const empresasUnicas = new Set(empleos.map(e => e.idEmpresa || e.empresa)).size;
                countCompanies.textContent = empresasUnicas;
            }

            // Renderizar tarjetas de empleo
            if (jobsContainer) {
                if (empleos.length === 0) {
                    jobsContainer.innerHTML = `
                        <div class="col-12 text-center text-muted py-4">
                            <i class="bi bi-briefcase fs-1 d-block mb-2"></i>
                            No hay vacantes disponibles en este momento.
                        </div>`;
                } else {
                    jobsContainer.innerHTML = empleos.slice(0, 6).map(empleo => `
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body">
                                    <h6 class="fw-bold mb-1">${escHtml(empleo.titulo)}</h6>
                                    <p class="text-muted small mb-2">
                                        <i class="bi bi-building me-1"></i>${escHtml(empleo.nombreEmpresa || empleo.empresa || 'Empresa')}
                                    </p>
                                    <p class="text-muted small mb-2">
                                        <i class="bi bi-geo-alt me-1"></i>${escHtml(empleo.ubicacion)}
                                        &nbsp;·&nbsp;
                                        <i class="bi bi-laptop me-1"></i>${escHtml(empleo.modalidad)}
                                    </p>
                                    ${empleo.salarioMin ? `
                                    <p class="small mb-2">
                                        <i class="bi bi-cash-coin me-1 text-success"></i>
                                        $${Number(empleo.salarioMin).toLocaleString()} – $${Number(empleo.salarioMax).toLocaleString()}
                                    </p>` : ''}
                                    <span class="badge bg-primary-subtle text-primary">${escHtml(empleo.categoria)}</span>
                                </div>
                                <div class="card-footer bg-transparent border-0 pt-0">
                                    <a href="/VISTA_16_DetallesEmpleo_Postulante.html?id=${empleo.id}"
                                       class="btn btn-outline-primary btn-sm w-100">
                                        Ver detalle
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } else {
            if (jobsContainer) jobsContainer.innerHTML = renderError('No se pudieron cargar las vacantes.');
        }
    } catch (err) {
        console.error('Error cargando empleos:', err);
        if (jobsContainer) jobsContainer.innerHTML = renderError('Error de conexión con el servidor.');
    }

    // ── 4. BUSCADOR (filtro local) ───────────────────────────────────────────
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase();
            document.querySelectorAll('#jobs-container .col-md-6').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }
});

// ── HELPERS ──────────────────────────────────────────────────────────────────
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderError(msg) {
    return `<div class="col-12 text-center text-danger py-4">
                <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                ${msg}
            </div>`;
}
