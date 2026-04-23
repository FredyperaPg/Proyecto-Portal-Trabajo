// detalleOfertaEmpresa.js — VISTA_24_DetallesOfertaEmpresa
// Fuente de verdad: bd-datos.sql
// Columnas reales: descripcion_puesto (alias descripcion), requisitos, beneficios, funciones, vacantes, fechaCierre (alias fechaVencimiento)
const API = 'http://localhost:3000/api';
 
let ofertaActual = null;
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    // Sidebar dinámico
    const sidebarNombre = document.getElementById('empresa-nombre-sidebar');
    if (sidebarNombre)
        sidebarNombre.textContent = user.nombreComercial || user.nombre || 'Mi Empresa';
 
    // ── Captura correcta del parámetro id ────────────────────────────────────
    const params   = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('id') || params.get('idEmpleo');
 
    if (!idEmpleo) {
        mostrarError('No se especificó una oferta. <a href="/VISTA_23_OfertasEmpresa.html">Volver a Mis Ofertas</a>');
        return;
    }
 
    // Link "Ver aplicantes"
    const btnAplicantes = document.getElementById('btn-ver-aplicantes');
    if (btnAplicantes) btnAplicantes.href = `/VISTA_25_AplicacionesOfertaEmpresa.html?idEmpleo=${idEmpleo}`;
 
    await cargarOferta(idEmpleo);
 
    document.getElementById('formEditarEmpleo')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarEdicion(idEmpleo);
    });
});
 
// ── Carga y renderiza ────────────────────────────────────────────────────────
async function cargarOferta(id) {
    try {
        const res  = await fetch(`${API}/empleos/${id}`, { credentials: 'include' });
        const json = await res.json();
        if (!res.ok || !json.data) throw new Error(json.message || 'No encontrado');
        ofertaActual = json.data;
        renderOferta(ofertaActual);
    } catch (err) {
        console.error(err);
        mostrarError('No se pudo cargar la oferta. ' + err.message);
    }
}
 
function renderOferta(o) {
    // Ocultar spinner
    const overlay = document.getElementById('loading-overlay');
    const content = document.getElementById('oferta-content');
    if (overlay) overlay.style.display = 'none';
    if (content) content.style.display = 'block';
 
    // Breadcrumb / topbar
    setText('topbar-titulo',     o.titulo);
    setText('breadcrumb-titulo', o.titulo);
 
    // Header
    setText('oferta-titulo',        o.titulo);
    setText('oferta-empresa',       o.nombreEmpresa || '—');
    setText('oferta-ubicacion',     o.ubicacion     || '—');
    setText('oferta-jornada',       o.tipoContrato  || o.modalidad || '—');
    setText('oferta-modalidad',     o.modalidad     || '—');
    setText('oferta-postulaciones', String(o.totalPostulaciones || 0));
 
    // Vacantes — columna real del SQL
    const vacantesEl = document.getElementById('oferta-vacantes');
    if (vacantesEl) vacantesEl.textContent = `${o.vacantes || 1} vacante${(o.vacantes || 1) !== 1 ? 's' : ''}`;
 
    // Estado badge
    const estadoBadge = document.getElementById('oferta-estado-badge');
    if (estadoBadge) {
        const mapa = { abierta:'estado-badge-abierta', cerrada:'estado-badge-cerrada', pausada:'estado-badge-pausada' };
        estadoBadge.className   = `badge ${mapa[o.estado] || 'bg-secondary'}`;
        estadoBadge.textContent = capitalize(o.estado || 'abierta');
    }
 
    // Salario
    const salarioEl = document.getElementById('oferta-salario');
    if (salarioEl) {
        salarioEl.textContent = (o.salarioMin || o.salarioMax)
            ? `$${fmt(o.salarioMin)} – $${fmt(o.salarioMax)} /mes`
            : 'No especificado';
    }
 
    // Fecha cierre — usa fechaVencimiento (alias de fechaCierre en el SQL)
    const cierreEl = document.getElementById('oferta-cierre');
    if (cierreEl) {
        cierreEl.innerHTML = o.fechaVencimiento
            ? `<i class="bi bi-calendar-event me-1"></i>${new Date(o.fechaVencimiento)
                .toLocaleDateString('es-SV', { day:'numeric', month:'long', year:'numeric' })}`
            : '<i class="bi bi-calendar-event me-1"></i>Sin fecha límite';
    }
 
    // Cuerpo — campos exactos del SQL
    // descripcion_puesto → alias "descripcion" devuelto por el servicio
    setText('oferta-descripcion', o.descripcion    || 'No especificado');
    setText('oferta-requisitos',  o.requisitos     || 'No especificado');
    setText('oferta-funciones',   o.funciones      || 'No especificado');
 
    // Beneficios — mostrar sección solo si hay datos
    const cardBeneficios = document.getElementById('card-beneficios');
    if (o.beneficios) {
        setText('oferta-beneficios', o.beneficios);
        if (cardBeneficios) cardBeneficios.style.display = 'block';
    } else {
        if (cardBeneficios) cardBeneficios.style.display = 'none';
    }
 
    // Pre-llenar modal de edición
    setVal('editTitulo',        o.titulo);
    setVal('editUbicacion',     o.ubicacion);
    setVal('editModalidad',     o.modalidad);
    setVal('editCategoria',     o.categoria);
    setVal('editTipoContrato',  o.tipoContrato);
    setVal('editSalarioMin',    o.salarioMin);
    setVal('editSalarioMax',    o.salarioMax);
    setVal('editVacantes',      o.vacantes);
    setVal('editFechaCierre',   o.fechaVencimiento ? o.fechaVencimiento.split('T')[0] : '');
    setVal('editDescripcion',   o.descripcion);
    setVal('editRequisitos',    o.requisitos);
    setVal('editFunciones',     o.funciones);
    setVal('editBeneficios',    o.beneficios);
}
 
// ── Guardar edición ──────────────────────────────────────────────────────────
async function guardarEdicion(id) {
    const btn      = document.getElementById('btn-guardar-edicion');
    const alertEl  = document.getElementById('edit-alert');
    if (alertEl) alertEl.innerHTML = '';
    setLoading(btn, true);
 
    const payload = {
        titulo:           getVal('editTitulo'),
        ubicacion:        getVal('editUbicacion'),
        modalidad:        getVal('editModalidad'),
        categoria:        getVal('editCategoria'),
        tipoContrato:     getVal('editTipoContrato'),
        salarioMin:       Number(getVal('editSalarioMin'))  || null,
        salarioMax:       Number(getVal('editSalarioMax'))  || null,
        vacantes:         Number(getVal('editVacantes'))    || 1,
        fechaVencimiento: getVal('editFechaCierre')         || null,
        // descripcion_puesto — el servicio acepta "descripcion" en el payload
        descripcion:      getVal('editDescripcion'),
        requisitos:       getVal('editRequisitos'),
        funciones:        getVal('editFunciones'),
        beneficios:       getVal('editBeneficios'),
    };
 
    if (!payload.titulo) {
        if (alertEl) alertEl.innerHTML = '<div class="alert alert-warning py-2">El título es obligatorio.</div>';
        setLoading(btn, false); return;
    }
 
    try {
        const res  = await fetch(`${API}/empleos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
        const json = await res.json();
 
        if (res.ok) {
            ofertaActual = { ...ofertaActual, ...payload };
            renderOferta(ofertaActual);
            bootstrap.Modal.getInstance(document.getElementById('modalEditarEmpleo'))?.hide();
            toast('success', '✅ Vacante actualizada correctamente.');
        } else {
            if (alertEl) alertEl.innerHTML = `<div class="alert alert-danger py-2">${json.message || 'Error al guardar.'}</div>`;
        }
    } catch (err) {
        console.error(err);
        if (alertEl) alertEl.innerHTML = '<div class="alert alert-danger py-2">Error de conexión.</div>';
    } finally {
        setLoading(btn, false);
    }
}
 
// ── Helpers ──────────────────────────────────────────────────────────────────
function setText(id, val)  { const el = document.getElementById(id); if (el) el.textContent = val ?? ''; }
function setVal(id, val)   { const el = document.getElementById(id); if (el) el.value = val ?? ''; }
function getVal(id)        { return (document.getElementById(id)?.value || '').trim(); }
function fmt(n)            { return n ? Number(n).toLocaleString('es-SV') : '0'; }
function capitalize(s)     { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function setLoading(btn, on) {
    if (!btn) return;
    btn.disabled  = on;
    btn.innerHTML = on
        ? '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...'
        : '<i class="bi bi-save me-1"></i>Guardar cambios';
}
function mostrarError(msg) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.innerHTML =
        `<div class="alert alert-danger mx-auto mt-4" style="max-width:500px;">${msg}</div>`;
}
function toast(tipo, msg) {
    const box = document.getElementById('toast-global');
    if (!box) return;
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show" role="alert">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 5000);
}