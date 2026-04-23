// detalleEmpleoPublico.js — VISTA_06_DetallesEmpleo.html (vista pública)
const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const params   = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('id');

    if (!idEmpleo) return;  // sin ID: la vista queda con su diseño base

    try {
        const res  = await fetch(`${API}/empleos/${idEmpleo}`);
        const data = await res.json();
        if (!res.ok || !data.data) return;
        const e = data.data;

        setTxt('detalle-titulo',       e.titulo);
        setTxt('detalle-empresa',      e.nombreEmpresa);
        setTxt('detalle-ubicacion',    e.ubicacion);
        setTxt('detalle-modalidad',    e.modalidad);
        setTxt('detalle-categoria',    e.categoria);
        setTxt('detalle-descripcion',  e.descripcion);
        setTxt('detalle-requisitos',   e.requisitos);
        setTxt('detalle-funciones',    e.funciones);

        // ── Enlace al perfil público de la empresa con UUID ──────────────────
        // FIX VISTA_07: navegar a VISTA_07_PerfilEmpresa.html?id=<UUID_empresa>
        if (e.idEmpresa) {
            // Actualizar cualquier <a> que apunte al perfil de empresa
            document.querySelectorAll('a[data-empresa-link], #link-empresa, .link-empresa').forEach(a => {
                a.href = `/VISTA_07_PerfilEmpresa.html?id=${e.idEmpresa}`;
            });
            // Si el nombre de la empresa es un enlace directo
            const empresaEl = document.getElementById('detalle-empresa');
            if (empresaEl) {
                const wrapper = document.createElement('a');
                wrapper.href  = `/VISTA_07_PerfilEmpresa.html?id=${e.idEmpresa}`;
                wrapper.style.cssText = 'color:inherit;text-decoration:none;';
                wrapper.title = `Ver perfil de ${e.nombreEmpresa}`;
                empresaEl.parentNode.insertBefore(wrapper, empresaEl);
                wrapper.appendChild(empresaEl);
            }
        }

        if (e.salarioMin) {
            setTxt('detalle-salario',
                `$${Number(e.salarioMin).toLocaleString()} – $${Number(e.salarioMax).toLocaleString()}/mes`);
        }

        document.title = `${e.titulo} — PortalEmpleos`;

        // Botón aplicar: redirige al login si no hay sesión
        const btn = document.getElementById('btn-aplicar');
        if (btn) {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                btn.textContent = 'Inicia sesión para aplicar';
                btn.addEventListener('click', () => {
                    window.location.href = `/VISTA_01_Login.html`;
                });
            } else if (user.rol === 'postulante' && user.idCandidato) {
                btn.textContent = 'Aplicar ahora';
                btn.addEventListener('click', async () => {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Enviando...';
                    try {
                        const r = await fetch(`${API}/postulaciones`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ idCandidato: user.idCandidato, idEmpleo })
                        });
                        const d = await r.json();
                        if (r.ok) { btn.textContent = '✅ Aplicación enviada'; btn.classList.replace('btn-primary','btn-success'); }
                        else if (r.status === 409) { btn.textContent = 'Ya aplicaste'; }
                        else { btn.disabled = false; btn.textContent = 'Aplicar ahora'; }
                    } catch { btn.disabled = false; btn.textContent = 'Aplicar ahora'; }
                });
            } else {
                btn.textContent = 'Solo postulantes pueden aplicar';
                btn.disabled = true;
            }
        }
    } catch (err) {
        console.error('Error cargando detalle público:', err);
    }
});

function setTxt(id, text) { const el = document.getElementById(id); if (el) el.textContent = text || '—'; }
