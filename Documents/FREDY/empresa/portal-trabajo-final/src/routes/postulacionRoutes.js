import { Router } from 'express';
import * as PostulacionController from '../controllers/postulacionController.js';

const router = Router();

// POST /api/postulaciones                          → postulante aplica a empleo
router.post('/', PostulacionController.crearPostulacion);

// GET  /api/postulaciones/candidato/:idCandidato  → Mis Aplicaciones (VISTA_17)
router.get('/candidato/:idCandidato', PostulacionController.getMisPostulaciones);

// GET  /api/postulaciones/empresa/aplicaciones/:idEmpresa → JOIN completo (VISTA_26)
// ⚠️  Debe ir ANTES de /empresa/:idEmpresa para evitar captura incorrecta
router.get('/empresa/aplicaciones/:idEmpresa', PostulacionController.getAplicacionesEmpresa);

// GET  /api/postulaciones/empresa/:idEmpresa      → postulaciones recibidas (VISTA_25/26)
// GET  /api/postulaciones/empresa/:idEmpresa?idEmpleo=xxx → por oferta específica
router.get('/empresa/:idEmpresa', PostulacionController.getPostulacionesPorEmpresa);

// PATCH /api/postulaciones/:id                    → empresa cambia estado
router.patch('/:id', PostulacionController.updateEstadoPostulacion);

export default router;
