// perfilEmpresaPublico.js — VISTA_07_PerfilEmpresa (vista pública)
// Fuente de verdad: bd-datos.sql — tablas Perfil_Empresa, Empleo
const API = 'http://localhost:3000/api';
 
document.addEventListener('DOMContentLoaded', async () => {
    const params    = new URLSearchParams(window.location.search);
    const idEmpresa = params.get('id') || params.get('idEmpresa');
 
    if (!idEmpresa) {
        mostrarError('No se especificó una empresa. Vuelve al <a href="/VISTA_05_Empleos.html">listado de empleos</a>.');
        return;
    }
 
    try {
        // ── 1. Datos de la empresa ────────────────────────────────────────────
        const res  = await fetch(`${API}/perfil/empresa-publica/${idEmpresa}`);
        const data = await res.json();
 
        if (!res.ok || !data.data) {
            mostrarError('Empresa no encontrada o no disponible.');
            return;
        }
 
        const e = Array.isArray(data.data) ? data.data[0] : data.data;
        if (!e) { mostrarError('Empresa no encontrada.'); return; }
 
        // Título de página y header
        document.title = `${e.nombreComercial || 'Empresa'} — PortalEmpleos`;
        setTxt('empresa-nombre', e.nombreComercial);
 
        // Sección "Sobre X" — reemplaza el texto hardcodeado de TechCorp
        const sobreH5 = document.querySelector('.content-card h5');
        if (sobreH5) sobreH5.innerHTML =
            `<i class="bi bi-building me-2" style="color:var(--primary);"></i>Sobre ${esc(e.nombreComercial)}`;
 
        setTxt('empresa-sector',      e.sector);
        setTxt('empresa-descripcion', e.descripcion);
        setTxt('empresa-ubicacion',   e.ubicacion);
        setTxt('empresa-telefono',    e.telefono);
        setTxt('empresa-correo',      e.correoContacto);
        setTxt('empresa-tipo',        e.tipoEmpresa);
 
        // Sidebar de info dinámica
        setTxt('info-ubicacion',  e.ubicacion    || '—');
        setTxt('info-sector',     e.sector        || '—');
        setTxt('info-tipo',       e.tipoEmpresa   || '—');
        setTxt('info-correo',     e.correoContacto|| '—');
        setTxt('info-telefono',   e.telefono      || '—');
 
        // Quitar links estáticos hardcodeados (www.techcorp.sv)
        const sitioWebA = document.querySelector('a[href="#"]');
        if (sitioWebA && sitioWebA.textContent.includes('techcorp')) {
            sitioWebA.textContent = e.correoContacto || '—';
            sitioWebA.removeAttribute('href');
        }
 
        // Logo
        const logoEl = document.getElementById('empresa-logo');
        if (logoEl) {
            if (e.urlLogo) {
                logoEl.src = e.urlLogo;
                logoEl.style.display = 'block';
            } else {
                // Mostrar iniciales si no hay logo
                const iniciales = (e.nombreComercial || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                logoEl.outerHTML = `<div id="empresa-logo" style="width:80px;height:80px;border-radius:16px;
                    background:linear-gradient(135deg,#2563EB,#60a5fa);display:flex;align-items:center;
                    justify-content:center;color:#fff;font-size:1.8rem;font-weight:700;flex-shrink:0;">
                    ${iniciales}</div>`;
            }
        }
 
        // ── 2. Vacantes de la empresa ─────────────────────────────────────────
        const jobContainer = document.getElementById('empresa-jobs-container');
        if (jobContainer) {
            const resJ  = await fetch(`${API}/empleos/empresa/${e.idEmpresa || idEmpresa}`);
            const dataJ = await resJ.json();
            const jobs  = dataJ.data || [];
 
            if (jobs.length === 0) {
                jobContainer.innerHTML = '<p class="text-muted small py-3">Esta empresa no tiene vacantes activas en este momento.</p>';
            } else {
                jobContainer.innerHTML = `
                <h6 class="fw-bold mt-3 mb-3">
                    <i class="bi bi-briefcase me-2" style="color:var(--primary);"></i>
                    Vacantes activas (${jobs.length})
                </h6>
                ${jobs.map(j => {
                    const salario = j.salarioMin
                        ? `$${Number(j.salarioMin).toLocaleString()} – $${Number(j.salarioMax).toLocaleString()}/mes`
                        : 'A convenir';
                    return `
                    <div class="d-flex align-items-center justify-content-between p-3 border rounded-3 mb-2 bg-white"
                         style="border-color:#e2e8f0!important;">
                        <div>
                            <div class="fw-semibold">${esc(j.titulo)}</div>
                            <div class="text-muted small mt-1">
                                <span class="badge me-1" style="background:#eff6ff;color:#1d4ed8;">${esc(j.modalidad)}</span>
                                ${esc(j.ubicacion)} · <span class="text-success fw-semibold">${salario}</span>
                            </div>
                        </div>
                        <a href="/VISTA_06_DetallesEmpleo.html?id=${j.id}" class="btn btn-outline-primary btn-sm flex-shrink-0 ms-2">
                            Ver oferta
                        </a>
                    </div>`;
                }).join('')}`;
            }
        }
 
    } catch (err) {
        console.error('[perfilEmpresaPublico]', err);
        mostrarError('Ocurrió un error al cargar el perfil de la empresa.');
    }
});
 
function setTxt(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '—';
}
function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function mostrarError(msg) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `<div class="alert alert-warning mt-5 mx-auto" style="max-width:540px;">${msg}</div>`;
    }
}