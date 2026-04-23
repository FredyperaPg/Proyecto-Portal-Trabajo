import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
 
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes         from './routes/authRoutes.js';
import empleoRoutes       from './routes/empleoRoutes.js';
import perfilRoutes       from './routes/perfilRoutes.js';
import postulacionRoutes  from './routes/postulacionRoutes.js';
import foroRoutes         from './routes/foroRoutes.js';
import recursoRoutes      from './routes/recursoRoutes.js';
 
dotenv.config();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PUBLIC     = path.join(__dirname, '../public');
 
const app = express();
 
// ── 1. ARCHIVOS ESTÁTICOS ─────────────────────────────────────────────────────
// El orden importa: primero las carpetas específicas, luego la raíz de public.
// Esto permite acceder a cualquier HTML con /VISTA_XX_Nombre.html directamente.
 
app.use(express.static(PUBLIC));
app.use(express.static(path.join(PUBLIC, 'views/Publicas')));
app.use(express.static(path.join(PUBLIC, 'views/Privadas/postulante')));
app.use(express.static(path.join(PUBLIC, 'views/Privadas/empresa')));
app.use(express.static(path.join(PUBLIC, 'views/Privadas/Admin')));
 
// Servir archivos subidos (CVs, fotos) como estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
 
// ── 2. CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000',
             'http://localhost:5500',  'http://127.0.0.1:5500'],
    credentials: true
}));
 
// ── 3. PARSERS ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// ── 4. SESIÓN ─────────────────────────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_universidad_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));
 
// ── 5. RUTAS HTML NOMBRADAS (sin escribir la ruta completa) ──────────────────
// Ruta raíz → página de inicio pública
app.get('/', (_req, res) =>
    res.sendFile(path.join(PUBLIC, 'views/Publicas/VISTA_04_Inicio.html'))
);
 
// Aliases convenientes para navegación fluida
const htmlAlias = {
    '/login':             'views/Publicas/VISTA_01_Login.html',
    '/registro-empresa':  'views/Publicas/VISTA_02_Register_Empleador.html',
    '/registro':          'views/Publicas/VISTA_03_Register_Postulante.html',
    '/inicio':            'views/Publicas/VISTA_04_Inicio.html',
    '/empleos':           'views/Publicas/VISTA_05_Empleos.html',
    '/recursos':          'views/Publicas/VISTA_09_Recursos.html',
    '/foro':              'views/Publicas/VISTA_11_Foro.html',
    '/dashboard':         'views/Privadas/postulante/VISTA_13_InicioPostulante.html',
    '/mi-perfil':         'views/Privadas/postulante/VISTA_14_PerilPostulante.html',
    '/mis-aplicaciones':  'views/Privadas/postulante/VISTA_17_MisAplicaciones.html',
    '/empresa/dashboard': 'views/Privadas/empresa/VISTA_22_InicioEmpresa.html',
    '/empresa/ofertas':   'views/Privadas/empresa/VISTA_23_OfertasEmpresa.html',
    '/empresa/publicar':  'views/Privadas/empresa/VISTA_27_PublicarOfertaEmpresa.html',
    '/empresa/perfil':    'views/Privadas/empresa/VISTA_29_PerfilEmpresa.html',
    '/admin':             'views/Privadas/Admin/VISTA_30_InicioAdmin.html',
};
Object.entries(htmlAlias).forEach(([route, file]) => {
    app.get(route, (_req, res) => res.sendFile(path.join(PUBLIC, file)));
});
 
// ── 6. RUTAS API ──────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/empleos',       empleoRoutes);
app.use('/api/perfil',        perfilRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/foro',          foroRoutes);
app.use('/api/recursos',      recursoRoutes);
 
// ── 7. 404 + ERROR HANDLER ────────────────────────────────────────────────────
app.use((req, res, next) => {
    // Si es petición de API, responder JSON. Si es HTML, redirigir al inicio.
    if (req.originalUrl.startsWith('/api/')) {
        const error = new Error(`Ruta API no encontrada: ${req.originalUrl}`);
        error.statusCode = 404;
        return next(error);
    }
    res.redirect('/');
});
 
app.use(errorHandler);
 
// ── 8. ARRANQUE ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('══════════════════════════════════════════════');
    console.log(`🚀  Servidor: http://localhost:${PORT}`);
    console.log(`🏠  Inicio  : http://localhost:${PORT}/`);
    console.log(`🔑  Login   : http://localhost:${PORT}/login`);
    console.log(`📋  API     : http://localhost:${PORT}/api/empleos`);
    console.log('══════════════════════════════════════════════');
});