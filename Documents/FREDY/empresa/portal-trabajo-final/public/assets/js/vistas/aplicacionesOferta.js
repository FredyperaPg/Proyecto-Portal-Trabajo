// aplicacionesOferta.js — VISTA_25 (por oferta) y VISTA_26 (todas las aplicaciones)
const API = 'http://localhost:3000/api';
 
let appsGlobal = []; // cache para CSV export
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    // ── Sidebar dinámico ──────────────────────────────────────────────────────
    const sidebarNombre = document.getElementById('empresa-nombre-sidebar');
    if (sidebarNombre) {
        sidebarNombre.textContent = user.nombreComercial || user.nombre || user.email || 'Mi Empresa';
    }
 
    // Si hay logo en el perfil, reemplazar el emoji estático
    const logoEl = document.querySelector('.company-mini .logo-sm');
    if (logoEl && user.urlLogo) {
        logoEl.innerHTML = `<img src="${user.urlLogo}" alt="Logo empresa"
            style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;
    }
 
    if (!user.idEmpresa) {
        setContainer('<div class="alert alert-warning m-3">No se encontró el perfil de empresa.</div>');
        return;
    }
 
    // Leer idEmpleo de la URL (VISTA_25); ausente en VISTA_26
    const params   = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('idEmpleo') || params.get('id') || null;
 
    const container      = document.getElementById('aplicantes-container') ||
                           document.getElementById('aplicaciones-container');
    const ofertaTitulo   = document.getElementById('oferta-titulo');
    const ofertaMeta     = document.getElementById('oferta-meta');
    const pipelineNuevas = document.getElementById('pipeline-nuevas') || document.getElementById('stat-nuevas');
    const pipelineTotal  = document.getElementById('pipeline-total')  || document.getElementById('stat-total');
 
    if (!container) return;
    container.innerHTML = '<div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Cargando aplicaciones...</div>';
 
    // Cargar datos de la oferta si viene por URL (VISTA_25)
    if (idEmpleo && ofertaTitulo) {
        try {
            const resEmpleo  = await fetch(`${API}/empleos/${idEmpleo}`, { credentials: 'include' });
            const dataEmpleo = await resEmpleo.json();
            if (dataEmpleo.data) {
                const e = dataEmpleo.data;
                ofertaTitulo.textContent = e.titulo || '—';
                if (ofertaMeta) ofertaMeta.textContent = `${e.nombreEmpresa || ''} · ${e.ubicacion || ''} · ${e.modalidad || ''}`;
            }
        } catch (err) { console.error('Error cargando oferta:', err); }
    }
 
    // Cargar postulaciones con JOIN completo
    try {
        const url = idEmpleo
            ? `${API}/postulaciones/empresa/aplicaciones/${user.idEmpresa}?idEmpleo=${idEmpleo}`
            : `${API}/postulaciones/empresa/aplicaciones/${user.idEmpresa}`;
 
        const res  = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const apps = Array.isArray(data.data) ? data.data : [];
        appsGlobal = apps;
 
        // Actualizar stats
        const nuevas = apps.filter(a => a.estado === 'pendiente').length;
        if (pipelineNuevas) pipelineNuevas.textContent = nuevas;
        if (pipelineTotal)  pipelineTotal.textContent  = apps.length;
 
        if (apps.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-people fs-1 d-block mb-3 opacity-50"></i>
                    <p class="fw-semibold mb-1">Aún no hay candidatos para tus ofertas</p>
                    <p class="small">Las aplicaciones aparecerán aquí cuando los candidatos postulen.</p>
                </div>`;
            return;
        }
 
        const estadoBadge = {
            pendiente: { cls: 'bg-warning text-dark', label: 'Nueva' },
            revisando: { cls: 'bg-info    text-dark', label: 'En revisión' },
            aceptada:  { cls: 'bg-success',           label: 'Aceptada' },
            rechazada: { cls: 'bg-danger',            label: 'Rechazada' },
        };
 
        container.innerHTML = `
        <div class="d-flex flex-column gap-3">
            ${apps.map((a, idx) => {
                const badge = estadoBadge[a.estado] || { cls: 'bg-secondary', label: a.estado };
                const avatarColor = ['#2563EB','#10B981','#f59e0b','#7c3aed','#ef4444'][idx % 5];
                // Icono PDF junto al nombre si tiene CV
                const cvIcon = a.urlCV
                    ? `<i class="bi bi-file-earmark-pdf text-danger ms-1" title="Tiene CV adjunto"></i>`
                    : '';
                // Botón exportar CV
                const cvBtn = a.urlCV
                    ? `<button class="btn btn-sm btn-outline-danger" onclick="exportarCV('${esc(a.urlCV)}', '${esc(a.nombres)}_${esc(a.apellidos)}')" title="Ver / Descargar CV">
                           <i class="bi bi-file-earmark-pdf me-1"></i>CV
                       </button>`
                    : `<button class="btn btn-sm btn-outline-secondary" disabled title="Sin CV adjunto">
                           <i class="bi bi-file-earmark-x me-1"></i>Sin CV
                       </button>`;
                return `
                <div class="app-card p-3 bg-white border rounded-3 shadow-sm" data-id="${a.id}">
                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div class="d-flex align-items-center justify-content-center fw-bold text-white rounded-circle"
                             style="width:44px;height:44px;background:${avatarColor};font-size:.9rem;flex-shrink:0;">
                            ${iniciales(a.nombres, a.apellidos)}
                        </div>
                        <div class="flex-grow-1 min-width-0">
                            <div class="fw-semibold">${esc(a.nombres)} ${esc(a.apellidos)}${cvIcon}</div>
                            <div class="text-muted small">
                                ${esc(a.email)}${a.tituloCandidato ? ` · ${esc(a.tituloCandidato)}` : ''}${a.anosExperiencia ? ` · ${a.anosExperiencia} años exp.` : ''}
                            </div>
                            <div class="text-muted small mt-1">
                                <i class="bi bi-calendar3 me-1"></i>
                                Aplicó: ${new Date(a.fechaPostulacion).toLocaleDateString('es-SV')}
                                ${!idEmpleo && a.tituloEmpleo ? ` · <span class="fw-semibold text-primary">${esc(a.tituloEmpleo)}</span>` : ''}
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 flex-wrap flex-shrink-0">
                            <span class="badge ${badge.cls} badge-estado">${badge.label}</span>
                            ${cvBtn}
                            <select class="form-select form-select-sm" style="width:auto;"
                                    onchange="cambiarEstado('${a.id}', this.value, this)">
                                <option value="pendiente"  ${a.estado==='pendiente' ?'selected':''}>Nueva</option>
                                <option value="revisando"  ${a.estado==='revisando' ?'selected':''}>En revisión</option>
                                <option value="aceptada"   ${a.estado==='aceptada'  ?'selected':''}>Aceptada</option>
                                <option value="rechazada"  ${a.estado==='rechazada' ?'selected':''}>Rechazada</option>
                            </select>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
 
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="alert alert-danger m-3">Error al cargar las aplicaciones. Verifica tu conexión.</div>';
    }
 
    // Botón Exportar CSV
    const btnCSV = document.getElementById('btn-exportar-csv');
    if (btnCSV) btnCSV.addEventListener('click', exportarCSV);
});
 
// ── Exportar / Ver CV de un candidato ────────────────────────────────────────
function exportarCV(urlCV, nombreCandidato) {
    if (!urlCV) { alert('Este candidato no tiene CV adjunto.'); return; }
 
    // Abrir en pestaña nueva (visualización directa del PDF)
    const fullUrl = urlCV.startsWith('http') ? urlCV : `http://localhost:3000${urlCV}`;
    window.open(fullUrl, '_blank');
}
 
// ── Cambiar estado de postulación ────────────────────────────────────────────
async function cambiarEstado(idPostulacion, nuevoEstado, sel) {
    sel.disabled = true;
    try {
        const res = await fetch(`${API}/postulaciones/${idPostulacion}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (!res.ok) throw new Error();
 
        // Actualizar badge visualmente
        const card   = sel.closest('.app-card');
        const badge  = card?.querySelector('.badge-estado');
        const labels  = { pendiente:'Nueva', revisando:'En revisión', aceptada:'Aceptada', rechazada:'Rechazada' };
        const classes = { pendiente:'bg-warning text-dark', revisando:'bg-info text-dark', aceptada:'bg-success', rechazada:'bg-danger' };
        if (badge) {
            badge.textContent = labels[nuevoEstado] || nuevoEstado;
            badge.className   = `badge badge-estado ${classes[nuevoEstado] || 'bg-secondary'}`;
        }
        // Actualizar cache
        const app = appsGlobal.find(a => a.id === idPostulacion);
        if (app) app.estado = nuevoEstado;
 
    } catch { alert('Error al actualizar el estado.'); }
    finally  { sel.disabled = false; }
}
 
// ── Exportar CSV ─────────────────────────────────────────────────────────────
function exportarCSV() {
    if (!appsGlobal.length) { alert('No hay datos para exportar.'); return; }
    const cols = ['Nombre', 'Email', 'Oferta', 'Fecha Aplicación', 'Estado', 'Tiene CV'];
    const rows = appsGlobal.map(a => [
        `${a.nombres || ''} ${a.apellidos || ''}`.trim(),
        a.email        || '',
        a.tituloEmpleo || '',
        a.fechaPostulacion ? new Date(a.fechaPostulacion).toLocaleDateString('es-SV') : '',
        a.estado       || '',
        a.urlCV        ? 'Sí' : 'No',
    ]);
    const csv = [cols, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aplicaciones_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}
 
// ── Utils ────────────────────────────────────────────────────────────────────
function setContainer(html) {
    const c = document.getElementById('aplicantes-container') || document.getElementById('aplicaciones-container');
    if (c) c.innerHTML = html;
}
function iniciales(n, a) { return ((n||'').charAt(0) + (a||'').charAt(0)).toUpperCase() || '?'; }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }