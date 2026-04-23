// perfilEmpresa.js — VISTA_29_PerfilEmpresa
const API = 'http://localhost:3000/api';
 
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/VISTA_01_Login.html'; return; }
 
    // ── 1. Cargar datos del perfil desde la API ───────────────────────────────
    try {
        const res  = await fetch(`${API}/perfil/empresa/${user.id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const p = data.data;
 
        // Rellenar campos del formulario
        setVal('nombreComercial', p.nombreComercial);
        setVal('razonSocial',     p.razonSocial);
        setVal('nit',             p.nit);
        setVal('ubicacion',       p.ubicacion);
        setVal('sector',          p.sector);
        setVal('tipoEmpresa',     p.tipoEmpresa);
        setVal('descripcion',     p.descripcion);
        setVal('telefono',        p.telefono);
        setVal('correoContacto',  p.correoContacto);
 
        // Datos de display
        setDisplay('perfil-nombre-empresa',  p.nombreComercial);
        setDisplay('perfil-sector',          p.sector);
        setDisplay('empresa-nombre-sidebar', p.nombreComercial);
 
        // Logo: mostrar imagen si existe
        if (p.urlLogo) {
            const logoBox = document.getElementById('logo-upload-box');
            if (logoBox) {
                logoBox.innerHTML = `<img src="${p.urlLogo}" alt="Logo empresa"
                    style="width:100%;height:100%;object-fit:cover;border-radius:13px;">`;
            }
            // Sidebar logo
            const sidebarLogo = document.querySelector('.company-mini .logo-sm');
            if (sidebarLogo) {
                sidebarLogo.innerHTML = `<img src="${p.urlLogo}" alt="Logo"
                    style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;
            }
        }
 
        // Banner: mostrar imagen si existe
        if (p.urlBanner) {
            const coverEl = document.getElementById('cover-upload');
            if (coverEl) {
                coverEl.style.backgroundImage = `url('${p.urlBanner}')`;
                coverEl.style.backgroundSize  = 'cover';
                coverEl.style.backgroundPosition = 'center';
                const camIcon = coverEl.querySelector('i, span');
                if (camIcon) camIcon.style.opacity = '0';
            }
        }
 
        // Actualizar localStorage con datos frescos de empresa
        const userActualizado = { ...user, nombreComercial: p.nombreComercial, urlLogo: p.urlLogo };
        localStorage.setItem('user', JSON.stringify(userActualizado));
 
    } catch (err) {
        console.error('Error cargando perfil empresa:', err);
        mostrarToast('danger', 'No se pudo cargar el perfil de la empresa.');
    }
 
    // ── 2. Upload de Portada (Banner) ────────────────────────────────────────
    const coverEl    = document.getElementById('cover-upload');
    const inputBanner = document.getElementById('inputBanner');
 
    if (coverEl && inputBanner) {
        coverEl.addEventListener('click', () => inputBanner.click());
 
        inputBanner.addEventListener('change', () => {
            const file = inputBanner.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                mostrarToast('warning', 'Solo se permiten imágenes.');
                return;
            }
 
            // Previsualizar
            const reader = new FileReader();
            reader.onload = (e) => {
                coverEl.style.backgroundImage    = `url('${e.target.result}')`;
                coverEl.style.backgroundSize     = 'cover';
                coverEl.style.backgroundPosition = 'center';
                const hints = coverEl.querySelectorAll('i, span');
                hints.forEach(h => h.style.opacity = '0.6');
            };
            reader.readAsDataURL(file);
 
            // Habilitar botón guardar con indicador
            const btnGuardar = document.getElementById('btn-guardar');
            if (btnGuardar) {
                btnGuardar.classList.add('btn-warning');
                btnGuardar.classList.remove('btn-primary');
                btnGuardar.innerHTML = '<i class="bi bi-upload me-1"></i>Guardar (con nueva portada)';
            }
        });
    }
 
    // ── 3. Upload de Logo ────────────────────────────────────────────────────
    const logoBox   = document.getElementById('logo-upload-box');
    const inputLogo = document.getElementById('inputLogo');
 
    if (logoBox && inputLogo) {
        logoBox.addEventListener('click', () => inputLogo.click());
 
        inputLogo.addEventListener('change', () => {
            const file = inputLogo.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                mostrarToast('warning', 'Solo se permiten imágenes.');
                return;
            }
 
            // Previsualizar
            const reader = new FileReader();
            reader.onload = (e) => {
                logoBox.innerHTML = `<img src="${e.target.result}" alt="Logo preview"
                    style="width:100%;height:100%;object-fit:cover;border-radius:13px;">`;
            };
            reader.readAsDataURL(file);
 
            // Habilitar botón guardar
            const btnGuardar = document.getElementById('btn-guardar');
            if (btnGuardar) {
                btnGuardar.classList.add('btn-warning');
                btnGuardar.classList.remove('btn-primary');
                btnGuardar.innerHTML = '<i class="bi bi-upload me-1"></i>Guardar (con nuevo logo)';
            }
        });
    }
 
    // ── 4. Guardar cambios (datos + archivos) ─────────────────────────────────
    const form = document.getElementById('formPerfilEmpresa');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-guardar');
            if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...'; }
 
            const user = JSON.parse(localStorage.getItem('user') || 'null');
 
            try {
                // 4a. Guardar datos de texto
                const payload = {
                    nombreComercial: getVal('nombreComercial'),
                    razonSocial:     getVal('razonSocial'),
                    nit:             getVal('nit'),
                    ubicacion:       getVal('ubicacion'),
                    sector:          getVal('sector'),
                    tipoEmpresa:     getVal('tipoEmpresa'),
                    descripcion:     getVal('descripcion'),
                    telefono:        getVal('telefono'),
                    correoContacto:  getVal('correoContacto'),
                };
 
                const res  = await fetch(`${API}/perfil/empresa/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Error al guardar datos.');
 
                setDisplay('perfil-nombre-empresa',  payload.nombreComercial);
                setDisplay('empresa-nombre-sidebar', payload.nombreComercial);
 
                // 4b. Subir banner si fue seleccionado
                const bannerFile = document.getElementById('inputBanner')?.files[0];
                if (bannerFile) {
                    const fd = new FormData();
                    fd.append('banner', bannerFile);
                    await fetch(`${API}/perfil/upload-banner/${user.id}`, {
                        method: 'POST', credentials: 'include', body: fd
                    });
                }
 
                // 4c. Subir logo si fue seleccionado
                const logoFile = document.getElementById('inputLogo')?.files[0];
                if (logoFile) {
                    const fd = new FormData();
                    fd.append('logo', logoFile);
                    const resLogo = await fetch(`${API}/perfil/upload-logo/${user.id}`, {
                        method: 'POST', credentials: 'include', body: fd
                    });
                    if (resLogo.ok) {
                        const logoData = await resLogo.json();
                        // Actualizar localStorage con nuevo logo
                        const u = JSON.parse(localStorage.getItem('user') || '{}');
                        localStorage.setItem('user', JSON.stringify({ ...u, urlLogo: logoData.urlLogo, nombreComercial: payload.nombreComercial }));
                    }
                } else {
                    // Actualizar nombre en localStorage aunque no haya logo nuevo
                    const u = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({ ...u, nombreComercial: payload.nombreComercial }));
                }
 
                mostrarToast('success', '✅ Perfil actualizado correctamente.');
 
                // Restaurar botón a estado normal
                if (btn) {
                    btn.classList.remove('btn-warning');
                    btn.classList.add('btn-primary');
                    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Guardar cambios';
                }
 
            } catch (err) {
                console.error(err);
                mostrarToast('danger', err.message || 'Error al guardar.');
            } finally {
                if (btn) { btn.disabled = false; }
            }
        });
    }
});
 
function setVal(id, value)    { const el = document.getElementById(id); if (el) el.value = value || ''; }
function getVal(id)           { return document.getElementById(id)?.value.trim() || ''; }
function setDisplay(id, text) { const el = document.getElementById(id); if (el) el.textContent = text || ''; }
 
function mostrarToast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:280px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 4500);
}
 
