(function () {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
 
    if (!user) {
        window.location.href = '/VISTA_01_Login.html';
        return;
    }
 
    const path = window.location.pathname.toLowerCase();
    const rol  = user.rol.toLowerCase();
 
    // ── REGLAS DE ACCESO POR ROL ──────────────────────────────────────────────
 
    // Vistas de empresa (VISTA_22 al 29) → solo empleadores y admin
    const esVistaEmpresa = /\/vista_2[2-9]/i.test(path);
    if (esVistaEmpresa && rol !== 'empleador' && rol !== 'empresa' && rol !== 'admin') {
        alert('Acceso denegado: zona exclusiva para empresas.');
        window.location.href = '/VISTA_13_InicioPostulante.html';
        return;
    }
 
    // Vistas de admin (VISTA_30 al 38) → solo admin
    const esVistaAdmin = /\/vista_3[0-8]/i.test(path);
    if (esVistaAdmin && rol !== 'admin') {
        alert('Acceso denegado: zona exclusiva para administradores.');
        window.location.href = (rol === 'empleador' || rol === 'empresa')
            ? '/VISTA_22_InicioEmpresa.html'
            : '/VISTA_13_InicioPostulante.html';
        return;
    }
 
    // Si un empleador intenta entrar al dashboard de postulante (VISTA_13)
    // lo redirigimos, pero dejamos pasar VISTA_14-21 (foro, recursos, etc.)
    if (path === '/vista_13_iniciopostulante.html' && (rol === 'empleador' || rol === 'empresa')) {
        window.location.href = '/VISTA_22_InicioEmpresa.html';
        return;
    }
})();