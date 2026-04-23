// ============================================================
// detalleEmpleo.js — VISTA_16_DetallesEmpleo_Postulante
//
// PROBLEMA CORREGIDO: descripcion, funciones y requisitos
// siempre mostraban datos de "Desarrollador Java" porque
// estaban HARDCODEADOS en el HTML — el JS no los sobreescribía.
//
// SOLUCIÓN APLICADA:
//   1. El HTML fue limpiado — contenedores con IDs vacíos.
//   2. Este JS captura el ?id= real de la URL.
//   3. Hace fetch a GET /api/empleos/:id.
//   4. Mapea TODOS los campos del empleo específico:
//      descripcion_puesto, funciones, requisitos, beneficios,
//      nombreComercial (empresa real), urlLogo, idEmpresa.
// ============================================================
const API = 'http://localhost:3000/api';
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    // ── 1. CAPTURAR ID REAL DE LA URL ────────────────────────────────────────
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');   // UUID string → backend usa UUID_TO_BIN(?)
 
    if (!id) {
        mostrarError('No se especificó una oferta. Vuelve a la lista de empleos.');
        return;
    }
 
    // ── 2. FETCH DINÁMICO — GET /api/empleos/:id ─────────────────────────────
    let empleo;
    try {
        const res  = await fetch(`${API}/empleos/${id}`, { credentials: 'include' });
        const data = await res.json();
 
        if (!res.ok || !data.data) {
            mostrarError('Esta oferta no existe o ya fue cerrada.');
            return;
        }
        empleo = data.data;
    } catch (err) {
        console.error('[detalleEmpleo] fetch:', err);
        mostrarError('Error de conexión. Verifica que el servidor esté activo.');
        return;
    }
 
    // ── 3. LIMPIAR CONTENEDORES (eliminar texto residual del HTML) ───────────
    ['detalle-titulo','detalle-empresa','detalle-empresa-card','detalle-empresa-sub',
     'detalle-categoria','detalle-ubicacion','detalle-modalidad','detalle-vacantes',
     'detalle-salario','detalle-vencimiento','detalle-descripcion',
     'detalle-funciones','detalle-requisitos','detalle-beneficios'
    ].forEach(elId => {
        const el = document.getElementById(elId);
        if (el) el.innerHTML = '';
    });
 
    // ── 4. CABECERA ──────────────────────────────────────────────────────────
    setTxt('detalle-titulo',    empleo.titulo);
    setTxt('detalle-empresa',   empleo.nombreEmpresa || empleo.nombreComercial);
    setTxt('detalle-categoria', empleo.categoria);
    setTxt('detalle-ubicacion', empleo.ubicacion);
    setTxt('detalle-modalidad', empleo.modalidad);
    setTxt('detalle-vacantes',
        empleo.vacantes ? `${empleo.vacantes} vacante${empleo.vacantes !== 1 ? 's' : ''}` : '1 vacante');
    document.title = `${empleo.titulo} — Portal Empleos`;
 
    // Salario
    if (empleo.salarioMin && empleo.salarioMax) {
        setTxt('detalle-salario',
            `$${Number(empleo.salarioMin).toLocaleString('es-SV')} – $${Number(empleo.salarioMax).toLocaleString('es-SV')}/mes`);
    } else if (empleo.salarioMin) {
        setTxt('detalle-salario', `Desde $${Number(empleo.salarioMin).toLocaleString('es-SV')}/mes`);
    } else {
        setTxt('detalle-salario', 'A convenir');
    }
 
    // Fecha de cierre
    const fechaRaw = empleo.fechaVencimiento || empleo.fechaCierre;
    if (fechaRaw) {
        const fecha = new Date(fechaRaw).toLocaleDateString('es-SV',
            { year:'numeric', month:'long', day:'numeric' });
        setTxt('detalle-vencimiento', `Cierra el ${fecha}`);
    } else {
        setTxt('detalle-vencimiento', 'Sin fecha límite');
    }
 
    // ── 5. CUERPO DEL EMPLEO — DINÁMICO SEGÚN EL ID ─────────────────────────
    //
    // Estos campos vienen del empleo ESPECÍFICO cargado por ID.
    // Si el empleo es "Coordinador de Bienestar" (Salud) → muestra
    // la descripción, funciones y requisitos de Salud que la empresa ingresó.
    // Si es "Desarrollador Java" → los de Java.
    // NUNCA comparte datos entre empleos distintos.
 
    // Descripción del puesto
    setHtml('detalle-descripcion', formatearTexto(empleo.descripcion || empleo.descripcion_puesto));
 
    // Funciones (renderizadas como lista si vienen con guiones o saltos)
    setHtml('detalle-funciones', formatearTexto(empleo.funciones));
 
    // Requisitos
    setHtml('detalle-requisitos', formatearTexto(empleo.requisitos));
 
    // Beneficios — ocultar sección si no hay datos
    if (empleo.beneficios && empleo.beneficios.trim()) {
        setHtml('detalle-beneficios', formatearTexto(empleo.beneficios));
    } else {
        const cardB = document.getElementById('card-beneficios');
        if (cardB) cardB.style.display = 'none';
    }
 
    // ── 6. TARJETA LATERAL DE EMPRESA (datos reales de Perfil_Empresa) ───────
    // Elimina "TechCorp S.A." y "Tecnología · San Salvador" hardcodeados
 
    const nombreEmpresa = empleo.nombreEmpresa || empleo.nombreComercial || '—';
    const sector        = empleo.sector || '';
    const ubicEmpresa   = empleo.ubicacionEmpresa || empleo.ubicacion || '';
 
    setTxt('detalle-empresa-card', nombreEmpresa);
    setTxt('detalle-empresa-sub',
        [sector, ubicEmpresa.split(',')[0]].filter(Boolean).join(' · ') || '—');
 
    // Logo real de la empresa
    const logoEl = document.getElementById('detalle-logo-empresa');
    if (logoEl && empleo.logoEmpresa) {
        logoEl.innerHTML = `<img src="${empleo.logoEmpresa}" alt="Logo ${esc(nombreEmpresa)}"
            style="width:100%;height:100%;object-fit:contain;border-radius:6px;">`;
    }
 
    // "Ver perfil de empresa" → enlace con idEmpresa real
    const btnVer = document.getElementById('btn-ver-empresa');
    if (btnVer && empleo.idEmpresa) {
        btnVer.href = `/VISTA_29_PerfilEmpresa.html?id=${empleo.idEmpresa}`;
    }
 
    // ── 7. BOTÓN APLICAR ─────────────────────────────────────────────────────
    const btnAplicar = document.getElementById('btn-aplicar');
    if (!btnAplicar) return;
 
    if (!user.idCandidato) {
        btnAplicar.textContent = 'Solo postulantes pueden aplicar';
        btnAplicar.disabled    = true;
        btnAplicar.className   = 'btn btn-secondary w-100 mb-2';
        return;
    }
 
    btnAplicar.addEventListener('click', async () => {
        btnAplicar.disabled  = true;
        btnAplicar.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Enviando...';
        try {
            const r    = await fetch(`${API}/postulaciones`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idCandidato: user.idCandidato, idEmpleo: id })
            });
            const resp = await r.json();
            if (r.ok) {
                btnAplicar.innerHTML = '✅ Aplicación enviada';
                btnAplicar.className = 'btn btn-success w-100 mb-2';
                mostrarToast('success', '¡Tu aplicación fue enviada exitosamente!');
            } else if (r.status === 409) {
                btnAplicar.innerHTML = 'Ya aplicaste a esta oferta';
                btnAplicar.className = 'btn btn-secondary w-100 mb-2';
                btnAplicar.disabled  = true;
            } else {
                mostrarToast('danger', resp.message || 'Error al enviar.');
                btnAplicar.disabled  = false;
                btnAplicar.innerHTML = 'Aplicar ahora';
            }
        } catch {
            mostrarToast('danger', 'Error de conexión. Intenta de nuevo.');
            btnAplicar.disabled  = false;
            btnAplicar.innerHTML = 'Aplicar ahora';
        }
    });
});
 
// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════
 
function setTxt(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '—';
}
 
function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html || '<em class="text-muted">No especificado.</em>';
}
 
/**
 * Convierte el texto plano de la BD en HTML legible.
 * Funciona para CUALQUIER categoría:
 * - Líneas con "-", "•" o "*" → <ul><li>
 * - Texto continuo           → <p> por párrafo
 */
function formatearTexto(texto) {
    if (!texto || !texto.trim()) return '';
    const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
    const esLista = lineas.filter(l => /^[-•*]/.test(l)).length >= lineas.length / 2;
 
    if (esLista) {
        return `<ul class="ps-3 mb-0 lh-lg">
            ${lineas.map(l => `<li>${esc(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}
        </ul>`;
    }
    return lineas.map(l => `<p class="mb-2">${esc(l)}</p>`).join('');
}
 
function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                          .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
 
function mostrarError(msg) {
    const target = document.querySelector('#detalle-container, .page-content, main, body');
    target?.insertAdjacentHTML('afterbegin', `
        <div class="alert alert-warning m-4 d-flex align-items-center gap-3">
            <i class="bi bi-exclamation-triangle fs-4 flex-shrink-0"></i>
            <div><strong>No se pudo cargar la oferta</strong><br><small>${msg}</small></div>
            <a href="/VISTA_15_Empleos_Postulante.html"
               class="btn btn-sm btn-outline-secondary ms-auto">← Volver</a>
        </div>`);
}
 
function mostrarToast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:300px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show">
        <i class="bi bi-${tipo==='success'?'check-circle':'x-circle'} me-2"></i>${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    setTimeout(() => { box.innerHTML = ''; }, 4500);
}