import { Router } from 'express';
import * as RecursoController from '../controllers/recursoController.js';

const router = Router();
router.get('/stats',  RecursoController.getStatsPublicas);   // GET /api/recursos/stats
router.get('/',       RecursoController.getRecursos);        // GET /api/recursos
router.get('/:id',    RecursoController.getRecurso);         // GET /api/recursos/:id
export default router;
