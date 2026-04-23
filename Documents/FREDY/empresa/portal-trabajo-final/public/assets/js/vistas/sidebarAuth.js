// ============================================================
// sidebarAuth.js — SIDEBAR UNIVERSAL para todas las vistas privadas
//
// Responsabilidades:
//   1. Inyectar el nombre REAL del usuario logueado en el sidebar
//      (elimina todos los nombres por defecto "Usuario", "Mi Empresa", etc.)
//   2. Para empresas: mostrar nombreComercial y logo real
//   3. Actualizar el saludo/bienvenida con nombre y rol
//   4. Gestionar el logout limpiando localStorage y sesión del servidor
//
// Cómo funciona:
//   - Lee el objeto "user" de localStorage (guardado al hacer login)
//   - Busca TODOS los selectores conocidos de nombre/logo en el sidebar
//   - Los actualiza de forma no destructiva (no rompe vistas que no los tienen)
// ============================================================
(function () {
    'use strict';
 
    const API  = 'http://localhost:3000/api';
    const user = JSON.parse(localStorage.getItem('user') || 'null');
 
    // ── Guard: si no hay sesión, redirigir al login ──────────────────────────
    if (!user) {
        // Solo redirigir si estamos en una vista privada
        const esVistaPrivada = window.location.pathname.match(/VISTA_(1[3-9]|[2-3][0-9])_/);
        if (esVistaPrivada) {
            window.location.href = '/VISTA_01_Login.html';
        }
        return;
    }
 
    // ── 1. NOMBRE DEL USUARIO en el sidebar ─────────────────────────────────
    // Se busca por todos los IDs y clases conocidos en las vistas del portal.
    // Elimina los textos por defecto como "Usuario", "Mi Empresa", "Admin", etc.
 
    const nombreMostrar = obtenerNombreMostrar(user);
 
    // IDs conocidos donde aparece el nombre del usuario en el sidebar
    const IDS_NOMBRE = [
        'userNameDisplay',       // sidebar genérico
        'user-display-name',     // variante kebab-case
        'saludo-nombre',         // postulante
        'admin-nombre',          // admin
        'empresa-nombre-sidebar',// empresa
        'sidebar-user-name',     // variante adicional
        'nombre-usuario-sidebar',// variante en español
    ];
 
    IDS_NOMBRE.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = nombreMostrar;
    });
 
    // También actualizar por clases comunes
    document.querySelectorAll(
        '.sidebar-username, .user-name-sidebar, .nombre-sidebar, .company-name-sidebar'
    ).forEach(el => {
        el.textContent = nombreMostrar;
    });
 
    // Saludo dinámico con hora del día
    const saludoEl = document.getElementById('saludo-bienvenida') ||
                     document.querySelector('.saludo-usuario');
    if (saludoEl) {
        const hora = new Date().getHours();
        const tipo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
        saludoEl.textContent = `${tipo}, ${(user.nombres || user.nombre || '').split(' ')[0]}`;
    }
 
    // ── 2. LOGO / AVATAR ─────────────────────────────────────────────────────
    // Para empresas: reemplazar el placeholder con el logo real (urlLogo)
    // Para candidatos: usar urlFoto si existe
 
    const urlImagen = user.urlLogo || user.urlFoto || null;
 
    if (urlImagen) {
        // Selectores donde aparece el avatar/logo en el sidebar
        const SELECTORS_LOGO = [
            '.company-mini .logo-sm',
            '.sidebar-logo',
            '#sidebar-avatar',
            '.avatar-sidebar',
            '#empresa-logo-sidebar',
            '.user-avatar-sidebar',
        ];
 
        SELECTORS_LOGO.forEach(sel => {
            const el = document.querySelector(sel);
            if (!el) return;
 
            const tagName = el.tagName.toLowerCase();
            if (tagName === 'img') {
                el.src = urlImagen;
                el.alt = nombreMostrar;
            } else {
                // Es un div o span — reemplazar contenido con <img>
                el.innerHTML = `<img src="${urlImagen}" alt="${esc(nombreMostrar)}"
                    style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
            }
        });
    }
 
    // Avatar con iniciales como fallback (si no hay imagen)
    const avatarIniciales = document.querySelector('.avatar-iniciales, #avatar-iniciales');
    if (avatarIniciales && !urlImagen) {
        const nombres   = user.nombres || user.nombre || 'U';
        const apellidos = user.apellidos || '';
        const iniciales = (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase();
        avatarIniciales.textContent = iniciales;
    }
 
    // ── 3. ROL en badges/etiquetas del sidebar ───────────────────────────────
    const rolMostrar = {
        admin:      'Administrador',
        empleador:  'Empresa',
        postulante: 'Postulante',
    }[user.rol] || user.rol || '';
 
    document.querySelectorAll('#sidebar-rol, .sidebar-rol, .badge-rol-sidebar').forEach(el => {
        el.textContent = rolMostrar;
    });
 
    // ── 4. EMAIL del usuario ─────────────────────────────────────────────────
    document.querySelectorAll('#sidebar-email, .sidebar-email').forEach(el => {
        el.textContent = user.email || '';
    });
 
    // ── 5. LOGOUT ─────────────────────────────────────────────────────────────
    async function logout(e) {
        if (e) e.preventDefault();
        try {
            await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (_) { /* continuar aunque falle el servidor */ }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    }
 
    // Conectar a todos los elementos de logout posibles
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('btn-logout')?.addEventListener('click', logout);
    document.querySelector('a[data-action="logout"]')?.addEventListener('click', logout);
 
    // Detectar enlaces de "Cerrar Sesión" en la barra lateral
    document.querySelectorAll('a').forEach(a => {
        const texto = a.textContent.trim().toLowerCase();
        if (texto.includes('cerrar sesión') || texto.includes('cerrar sesion') || texto.includes('logout')) {
            a.href = '#';
            a.addEventListener('click', logout);
        }
    });
 
    // ── UTILIDADES ────────────────────────────────────────────────────────────
 
    /**
     * Determina el nombre a mostrar según el tipo de usuario:
     * - Empresa → nombreComercial (si existe)
     * - Postulante/Admin → nombres + apellidos
     * Nunca devuelve un valor por defecto genérico como "Usuario"
     */
    function obtenerNombreMostrar(u) {
        if (u.nombreComercial) return u.nombreComercial;     // empresa
        if (u.nombres && u.apellidos) return `${u.nombres} ${u.apellidos}`.trim();
        if (u.nombres) return u.nombres;
        if (u.nombre) return u.nombre;
        return u.email || 'Sin nombre';                       // fallback real
    }
 
    function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
 
})();