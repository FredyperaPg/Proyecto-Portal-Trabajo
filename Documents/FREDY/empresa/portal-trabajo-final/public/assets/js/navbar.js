// navbar.js — Menú dinámico del navbar según sesión del usuario
document.addEventListener('DOMContentLoaded', () => {
    const user          = JSON.parse(localStorage.getItem('user') || 'null');
    const menuContainer = document.getElementById('menu-dinamico');
    if (!menuContainer) return;

    if (user) {
        const rol = user.rol.toLowerCase();

        // Dashboard según el rol
        const dashURL = rol === 'admin'
            ? '/VISTA_30_InicioAdmin.html'
            : (rol === 'empleador' || rol === 'empresa')
                ? '/VISTA_22_InicioEmpresa.html'
                : '/VISTA_13_InicioPostulante.html';

        menuContainer.innerHTML = `
            <a class="nav-link fw-medium" href="${dashURL}">Mi Dashboard</a>
            <div class="d-flex align-items-center ms-lg-3 gap-2">
                <span class="navbar-text">Hola, <strong>${esc(user.nombre)}</strong></span>
                <button class="btn btn-outline-danger btn-sm" id="logoutBtnNav">Cerrar Sesión</button>
            </div>`;

        document.getElementById('logoutBtnNav')?.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:3000/api/auth/logout', {
                    method: 'POST', credentials: 'include'
                });
            } catch (_) {}
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/';
        });

    } else {
        menuContainer.innerHTML = `
            <div class="d-flex align-items-center gap-2 ms-lg-2">
                <a class="btn btn-outline-primary btn-sm px-3" href="/VISTA_01_Login.html">Iniciar Sesión</a>
                <a class="btn btn-primary btn-sm px-3" href="/VISTA_03_Register_Postulante.html">Registrarse</a>
            </div>`;
    }
});

function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
