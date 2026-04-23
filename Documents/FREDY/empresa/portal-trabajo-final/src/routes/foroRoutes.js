// foroRoutes.js — Rutas del Foro
import { Router } from 'express';
import * as ForoController from '../controllers/foroController.js';
 
const router = Router();
 
// GET  /api/foro            → lista de publicaciones (postulante, empresa, admin)
router.get('/',              ForoController.getPublicaciones);
 
// GET  /api/foro/:id        → detalle + comentarios de una publicación
router.get('/:id',           ForoController.getPublicacion);
 
// POST /api/foro            → crear publicación
router.post('/',             ForoController.crearPublicacion);
 
// POST /api/foro/comentario → agregar comentario a una publicación
router.post('/comentario',   ForoController.crearComentario);
 
// PATCH /api/foro/:id/like  → dar like a una publicación
router.patch('/:id/like',    ForoController.darLike);
 
// DELETE /api/foro/:id      → eliminar publicación (solo Admin)
router.delete('/:id',        ForoController.eliminarPublicacion);
 
export default router;