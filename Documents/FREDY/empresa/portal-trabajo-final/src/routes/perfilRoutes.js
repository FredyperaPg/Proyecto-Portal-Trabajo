import { Router }       from 'express';
import multer           from 'multer';
import path             from 'path';
import { fileURLToPath } from 'url';
import fs               from 'fs';
import * as PerfilController from '../controllers/perfilController.js';
 
const router = Router();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
 
function mkdirSafe(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
 
// ── Multer: CVs (PDF) ─────────────────────────────────────────────────────────
const CV_DIR = path.join(__dirname, '../../uploads/cvs');
mkdirSafe(CV_DIR);
 
const storageCV = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, CV_DIR),
    filename:    (req, _file, cb) => cb(null, `cv_${req.params.idUsuario}.pdf`),
});
const uploadCV = multer({
    storage: storageCV,
    limits:  { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') return cb(null, true);
        cb(new Error('Solo se permiten archivos PDF'));
    },
});
 
// ── Multer: Imágenes empresa (logo / banner) ──────────────────────────────────
const IMG_DIR = path.join(__dirname, '../../uploads/empresa');
mkdirSafe(IMG_DIR);
 
const storageImg = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, IMG_DIR),
    filename: (req, file, cb) => {
        const ext  = path.extname(file.originalname).toLowerCase() || '.jpg';
        const tipo = file.fieldname; // 'logo' o 'banner'
        cb(null, `${tipo}_${req.params.idUsuario}${ext}`);
    },
});
const uploadImg = multer({
    storage: storageImg,
    limits:  { fileSize: 3 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) return cb(null, true);
        cb(new Error('Solo se permiten imágenes'));
    },
});
 
// ── Postulante ────────────────────────────────────────────────────────────────
router.get('/postulante/:idUsuario',              PerfilController.getPerfilPostulante);
router.put('/postulante/:idUsuario',              PerfilController.updatePerfilPostulante);
router.post('/upload-cv/:idUsuario',              uploadCV.single('cv'),      PerfilController.uploadCV);
 
// ── Experiencia Laboral ───────────────────────────────────────────────────────
router.get('/postulante/:idUsuario/experiencia',  PerfilController.getExperienciaPostulante);
router.post('/postulante/:idUsuario/experiencia', PerfilController.addExperiencia);
 
// ── Empresa ───────────────────────────────────────────────────────────────────
router.get('/empresa/:idUsuario',                 PerfilController.getPerfilEmpresa);
router.put('/empresa/:idUsuario',                 PerfilController.updatePerfilEmpresa);
router.post('/upload-logo/:idUsuario',            uploadImg.single('logo'),   PerfilController.uploadLogo);
router.post('/upload-banner/:idUsuario',          uploadImg.single('banner'), PerfilController.uploadBanner);
 
// ── Admin Stats ───────────────────────────────────────────────────────────────
router.get('/admin/stats',                        PerfilController.getAdminStats);
 
// ── Empresa Pública (VISTA_07) ────────────────────────────────────────────────
router.get('/empresa-publica/:idEmpresa', async (req, res, next) => {
    try {
        const db = (await import('../config/db.js')).default;
        const [rows] = await db.query(
            `SELECT BIN_TO_UUID(pe.id) AS idEmpresa, pe.nombreComercial, pe.razonSocial,
                    pe.sector, pe.tipoEmpresa, pe.descripcion, pe.ubicacion,
                    pe.telefono, pe.correoContacto, pe.urlLogo
             FROM Perfil_Empresa pe WHERE pe.id = UUID_TO_BIN(?) LIMIT 1`,
            [req.params.idEmpresa]
        );
        if (!rows || rows.length === 0)
            return res.status(404).json({ status: 'error', message: 'Empresa no encontrada' });
        res.json({ status: 'success', data: rows[0] });
    } catch (e) { next(e); }
});
 
export default router;