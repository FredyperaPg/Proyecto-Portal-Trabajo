// perfilPostulante.js — VISTA_14_PerilPostulante
// Fuente de verdad local: `perfilActual`. Tras cada PUT exitoso se actualiza
// con spread inmutable para no perder campos.
const API = 'http://localhost:3000/api';
 
let perfilActual = null;  // datos del perfil (GET /perfil/postulante/:id)
let idUsuario    = null;  // UUID del usuario autenticado
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.id) { window.location.href = '/VISTA_01_Login.html'; return; }
    idUsuario = user.id;
 
    // Cargar perfil y experiencias en paralelo
    await Promise.all([cargarPerfil(), cargarExperiencias()]);
 
    initFotoUpload();
    initFormResumen();
    initFormInfoPersonal();
    initFormExperiencia();
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 1. CARGA DEL PERFIL — nunca se queda en "Cargando..."
// ─────────────────────────────────────────────────────────────────────────────
async function cargarPerfil() {
    try {
        const res  = await fetch(`${API}/perfil/postulante/${idUsuario}`, { credentials: 'include' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Error al cargar perfil');
        perfilActual = json.data;
    } catch (err) {
        console.error('[perfilPostulante] cargarPerfil:', err);
        // Perfil vacío para que el formulario no quede bloqueado
        perfilActual = { nombres: '', apellidos: '', email: '', resumen: null, telefono: null, direccion: '' };
        toast('warning', 'No se pudo cargar el perfil desde el servidor. Puedes editar y guardar de todas formas.');
    } finally {
        // Siempre renderizar — nunca dejar pantalla en "Cargando..."
        renderPerfil(perfilActual);
    }
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 2. RENDERIZADO
// ─────────────────────────────────────────────────────────────────────────────
function renderPerfil(p) {
    if (!p) return;
 
    setText('perfil-nombre-completo', `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Mi Perfil');
 
    const partes = [p.titulo, p.profesion].filter(Boolean);
    if (p.anosExperiencia > 0)
        partes.push(`${p.anosExperiencia} año${p.anosExperiencia !== 1 ? 's' : ''} de experiencia`);
    setText('perfil-titulo', partes.join(' · ') || 'Completa tu perfil profesional');
 
    setAvatar(p.nombres, p.apellidos);
    setText('user-display-name', p.email || '');
 
    // Resumen — si viene null/vacío, mensaje amigable (nunca "Cargando...")
    const resumenEl = document.getElementById('resumen-display');
    if (resumenEl) {
        resumenEl.textContent = p.resumen?.trim()
            || 'Haz clic en el lápiz para agregar tu resumen profesional.';
    }
 
    // Pre-llenar modales — IDs sincronizados con el HTML
    setVal('resumenTexto',  p.resumen);    // textarea #resumenTexto
    setVal('editTelefono',  p.telefono);   // input #editTelefono
    setVal('editUbicacion', p.direccion);  // input #editUbicacion
    setVal('editEmail',     p.email);
 
    // Tarjetas de info personal — null → "No registrado"
    setText('display-telefono',  p.telefono  || 'No registrado');
    setText('display-ubicacion', p.direccion || 'No registrado');
    setText('display-email',     p.email     || 'No registrado');
 
    // Redes sociales
    setText('display-linkedin',  p.linkedin  || 'No registrado');
    setText('display-github',    p.github    || 'No registrado');
    setText('display-facebook',  p.facebook  || 'No registrado');
 
    // Pre-llenar redes en modal (si existen esos campos en el formulario)
    setVal('editLinkedin',  p.linkedin);
    setVal('editGithub',    p.github);
    setVal('editFacebook',  p.facebook);
 
    // CV — mostrar enlace y color de estado
    const cvEl = document.getElementById('display-cv');
    if (cvEl) {
        if (p.urlCV) {
            const fileName = p.urlCV.split('/').pop() || 'cv.pdf';
            cvEl.innerHTML = `<a href="${p.urlCV}" target="_blank" class="text-danger fw-semibold">
                <i class="bi bi-file-earmark-pdf me-1"></i>${fileName}</a>
                <span class="badge bg-success ms-2" style="font-size:.7rem;">Cargado</span>`;
        } else {
            cvEl.innerHTML = '<span class="text-muted">No cargado</span>';
        }
    }
 
    // Icono PDF en fila CV — poner en rojo si hay, gris si no
    const cvIcon = document.querySelector('#cv-info-row i');
    if (cvIcon) {
        cvIcon.className = p.urlCV ? 'bi bi-file-earmark-pdf text-danger' : 'bi bi-file-earmark-x text-secondary';
    }
 
    // Estado en el modal
    const cvEstado = document.getElementById('cv-estado');
    if (cvEstado) {
        if (p.urlCV) {
            const fileName = p.urlCV.split('/').pop() || 'cv.pdf';
            cvEstado.innerHTML = `<span class="text-success fw-semibold">✅ CV actual: <em>${fileName}</em></span> — puedes reemplazarlo subiendo un nuevo archivo.`;
        } else {
            cvEstado.textContent = '';
        }
    }
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPERIENCIAS — carga y renderiza la lista
// ─────────────────────────────────────────────────────────────────────────────
async function cargarExperiencias() {
    const container = document.getElementById('experiencia-container');
    if (!container) return;
 
    try {
        const res  = await fetch(`${API}/perfil/postulante/${idUsuario}/experiencia`, { credentials: 'include' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        renderExperiencias(json.data || []);
    } catch (err) {
        console.error('[perfilPostulante] cargarExperiencias:', err);
        renderExperiencias([]);
    }
}
 
function renderExperiencias(lista) {
    const container = document.getElementById('experiencia-container');
    if (!container) return;
 
    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3 text-muted">
                <i class="bi bi-briefcase fs-2 d-block mb-2 opacity-50"></i>
                <p class="small mb-2">Aún no has agregado experiencia laboral.</p>
                <button class="btn btn-outline-primary btn-sm"
                        data-bs-toggle="modal" data-bs-target="#modalExperiencia">
                    + Agregar experiencia
                </button>
            </div>`;
        return;
    }
 
    container.innerHTML = lista.map(e => {
        const fechaInicio = e.fechaInicio ? new Date(e.fechaInicio).toLocaleDateString('es-SV', { month: 'short', year: 'numeric' }) : '—';
        const fechaFin    = e.trabajoActual ? 'Actualidad' : (e.fechaFin ? new Date(e.fechaFin).toLocaleDateString('es-SV', { month: 'short', year: 'numeric' }) : 'Actualidad');
        return `
        <div class="exp-item d-flex gap-3 mb-3 p-3 rounded-3" style="background:#f8fafc;border:1px solid #e2e8f0;">
            <div class="exp-icon d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                 style="width:44px;height:44px;background:var(--primary);color:#fff;font-size:1.2rem;">
                <i class="bi bi-building"></i>
            </div>
            <div class="flex-grow-1">
                <div class="fw-semibold">${esc(e.puesto)}</div>
                <div class="text-muted small">${esc(e.empresa)}</div>
                <div class="text-muted small">${fechaInicio} – ${fechaFin}</div>
                ${e.descripcion ? `<div class="small mt-1" style="color:#475569;">${esc(e.descripcion)}</div>` : ''}
            </div>
        </div>`;
    }).join('');
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 4. FOTO DE PERFIL
// ─────────────────────────────────────────────────────────────────────────────
function initFotoUpload() {
    const fotoInput  = document.getElementById('fotoInput');
    const avatarEdit = document.querySelector('.avatar-edit');
    if (avatarEdit) avatarEdit.onclick = () => fotoInput?.click();
 
    fotoInput?.addEventListener('change', () => {
        const file = fotoInput.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast('warning', 'Máximo 2 MB.'); return; }
        const reader = new FileReader();
        reader.onload = e => {
            const av = document.getElementById('perfil-avatar');
            if (!av) return;
            let img = av.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;top:0;left:0;';
            }
            img.src = e.target.result;
            const edit = av.querySelector('.avatar-edit');
            av.style.position = 'relative';
            av.style.overflow  = 'hidden';
            av.textContent     = '';
            av.appendChild(img);
            if (edit) av.appendChild(edit);
        };
        reader.readAsDataURL(file);
        toast('info', 'Vista previa lista. La subida al servidor estará disponible próximamente.');
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 5. GUARDAR RESUMEN
// ─────────────────────────────────────────────────────────────────────────────
function initFormResumen() {
    const form = document.getElementById('formResumen');
    if (!form) return;
 
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn   = form.querySelector('button[type="submit"]');
        const texto = getVal('resumenTexto').trim();
        setLoading(btn, true);
 
        try {
            const res  = await fetch(`${API}/perfil/postulante/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(buildPayload({ resumen: texto })),
            });
            const json = await res.json();
            if (res.ok) {
                perfilActual = { ...perfilActual, resumen: texto };
                const el = document.getElementById('resumen-display');
                if (el) el.textContent = texto || 'Haz clic en el lápiz para agregar tu resumen profesional.';
                bootstrap.Modal.getInstance(document.getElementById('modalResumen'))?.hide();
                toast('success', '✅ Resumen guardado correctamente.');
            } else {
                toast('danger', json.message || 'Error al guardar el resumen.');
            }
        } catch (err) {
            console.error(err);
            toast('danger', 'Error de conexión al guardar.');
        } finally {
            setLoading(btn, false, 'Guardar Cambios');
        }
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 6. GUARDAR INFO PERSONAL
// ─────────────────────────────────────────────────────────────────────────────
function initFormInfoPersonal() {
    const form = document.getElementById('formInfoPersonal');
    if (!form) return;
 
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn            = form.querySelector('button[type="submit"]');
        const nuevoTelefono  = getVal('editTelefono');
        const nuevaDireccion = getVal('editUbicacion');
        const archivoCV      = document.getElementById('inputCV')?.files[0] || null;
        setLoading(btn, true);
 
        try {
            // 1. Guardar datos personales (JSON)
            const res  = await fetch(`${API}/perfil/postulante/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(buildPayload({ telefono: nuevoTelefono, direccion: nuevaDireccion })),
            });
            const json = await res.json();
            if (!res.ok) { toast('danger', json.message || 'Error al guardar.'); return; }
 
            perfilActual = { ...perfilActual, telefono: nuevoTelefono, direccion: nuevaDireccion };
            setText('display-telefono',  nuevoTelefono  || 'No registrado');
            setText('display-ubicacion', nuevaDireccion || 'No registrado');
 
            // 2. Subir CV si hay archivo seleccionado
            if (archivoCV) {
                if (archivoCV.type !== 'application/pdf') {
                    toast('warning', 'Solo se permiten archivos PDF.');
                } else if (archivoCV.size > 5 * 1024 * 1024) {
                    toast('warning', 'El archivo supera el límite de 5MB.');
                } else {
                    const formData = new FormData();
                    formData.append('cv', archivoCV);
 
                    const resCV = await fetch(`${API}/perfil/upload-cv/${idUsuario}`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                    });
                    const jsonCV = await resCV.json();
 
                    if (resCV.ok) {
                        perfilActual = { ...perfilActual, urlCV: jsonCV.urlCV };
                        const cvEl = document.getElementById('display-cv');
                        if (cvEl) {
                            cvEl.innerHTML = `<a href="${jsonCV.urlCV}" target="_blank" class="text-danger fw-semibold">
                                <i class="bi bi-file-earmark-pdf me-1"></i>Ver CV</a>`;
                        }
                        const cvEstado = document.getElementById('cv-estado');
                        if (cvEstado) cvEstado.textContent = '✅ Ya tienes un CV cargado. Puedes reemplazarlo subiendo un nuevo archivo.';
                        toast('success', '✅ CV subido correctamente.');
                    } else {
                        toast('danger', jsonCV.message || 'Error al subir el CV.');
                    }
                }
            }
 
            bootstrap.Modal.getInstance(document.getElementById('modalInfoPersonal'))?.hide();
            toast('success', '✅ Información personal actualizada.');
 
        } catch (err) {
            console.error(err);
            toast('danger', 'Error de conexión al guardar.');
        } finally {
            setLoading(btn, false, 'Guardar cambios');
        }
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 7. GUARDAR EXPERIENCIA — POST real a la DB
// ─────────────────────────────────────────────────────────────────────────────
function initFormExperiencia() {
    const form = document.getElementById('formExperiencia');
    if (!form) return;
 
    // Checkbox "trabajo actualmente aquí" → ocultar/deshabilitar campo fechaFin
    const chkActual  = document.getElementById('trabajoActual');
    const inputFin   = document.getElementById('fechaFin');
    if (chkActual && inputFin) {
        chkActual.addEventListener('change', () => {
            inputFin.disabled = chkActual.checked;
            if (chkActual.checked) inputFin.value = '';
        });
    }
 
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        setLoading(btn, true);
 
        const payload = {
            puesto:        getVal('puesto'),
            empresa:       getVal('empresa'),
            fechaInicio:   getVal('fechaInicio'),
            fechaFin:      chkActual?.checked ? null : (getVal('fechaFin') || null),
            trabajoActual: chkActual?.checked ? true : false,
            descripcion:   getVal('descripcion'),
        };
 
        // Validación mínima en cliente
        if (!payload.puesto || !payload.empresa || !payload.fechaInicio) {
            toast('warning', 'Puesto, empresa y fecha de inicio son obligatorios.');
            setLoading(btn, false, 'Guardar Experiencia');
            return;
        }
 
        try {
            const res  = await fetch(`${API}/perfil/postulante/${idUsuario}/experiencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const json = await res.json();
 
            if (res.ok) {
                // Limpiar formulario
                form.reset();
                if (inputFin) inputFin.disabled = false;
 
                // Cerrar modal
                bootstrap.Modal.getInstance(document.getElementById('modalExperiencia'))?.hide();
 
                toast('success', '✅ Experiencia guardada correctamente.');
 
                // Refrescar lista en el DOM
                await cargarExperiencias();
            } else {
                toast('danger', json.message || 'Error al guardar la experiencia.');
            }
        } catch (err) {
            console.error(err);
            toast('danger', 'Error de conexión al guardar.');
        } finally {
            setLoading(btn, false, 'Guardar Experiencia');
        }
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// HELPER: buildPayload — perfilActual como base + overrides encima
// ─────────────────────────────────────────────────────────────────────────────
function buildPayload(overrides = {}) {
    const p = perfilActual || {};
    return {
        nombres:         p.nombres         || '',
        apellidos:       p.apellidos       || '',
        dui:             p.dui             || '00000000-0',
        fechaNacimiento: (p.fechaNacimiento || '').split('T')[0] || '1990-01-01',
        direccion:       p.direccion       || '',
        titulo:          p.titulo          || null,
        profesion:       p.profesion       || null,
        anosExperiencia: Number(p.anosExperiencia) || 0,
        resumen:         p.resumen         || null,
        telefono:        p.telefono        || null,
        ...overrides,
    };
}
 
// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = (text ?? '').toString();
}
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}
function getVal(id) {
    return (document.getElementById(id)?.value || '').trim();
}
function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function iniciales(n, a) {
    return ((n || '').charAt(0) + (a || '').charAt(0)).toUpperCase() || '??';
}
function setAvatar(nombres, apellidos) {
    const av = document.getElementById('perfil-avatar');
    if (!av) return;
    const editDiv = av.querySelector('.avatar-edit');
    const fotoInp = document.getElementById('fotoInput');
    av.textContent = iniciales(nombres, apellidos);
    if (editDiv) av.appendChild(editDiv);
    if (fotoInp) av.appendChild(fotoInp);
}
function setLoading(btn, on, label = 'Guardar') {
    if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = on
        ? '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...'
        : label;
}
function toast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:300px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show" role="alert">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 5000);
}
 