// foroController.js — Controlador del Foro
import * as ForoService from '../services/foroService.js';
 
// GET /api/foro — Lista todas las publicaciones (con autor por JOIN con Usuario)
export const getPublicaciones = async (req, res, next) => {
    try {
        const data = await ForoService.getPublicaciones({ busqueda: req.query.busqueda });
        res.json({ status: 'success', data });
    } catch (e) { next(e); }
};
 
// GET /api/foro/:id — Detalle de una publicación con sus comentarios
export const getPublicacion = async (req, res, next) => {
    try {
        const data = await ForoService.getPublicacionPorId(req.params.id);
        if (!data) return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
        res.json({ status: 'success', data });
    } catch (e) { next(e); }
};
 
// POST /api/foro — Crear nueva publicación
export const crearPublicacion = async (req, res, next) => {
    try {
        const { idUsuario, titulo, contenido } = req.body;
        if (!idUsuario || !titulo?.trim() || !contenido?.trim()) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios: idUsuario, titulo, contenido.' });
        }
        await ForoService.crearPublicacion(idUsuario, { titulo: titulo.trim(), contenido: contenido.trim() });
        res.status(201).json({ status: 'success', message: 'Publicación creada exitosamente.' });
    } catch (e) { next(e); }
};
 
// POST /api/foro/comentario — Agregar comentario a una publicación
export const crearComentario = async (req, res, next) => {
    try {
        const { idPublicacion, idUsuario, contenido } = req.body;
        if (!idPublicacion || !idUsuario || !contenido?.trim()) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios.' });
        }
        await ForoService.crearComentario(idUsuario, idPublicacion, contenido.trim());
        res.status(201).json({ status: 'success', message: 'Respuesta publicada.' });
    } catch (e) { next(e); }
};
 
// DELETE /api/foro/:id — Eliminar publicación (solo Admin)
export const eliminarPublicacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminado = await ForoService.eliminarPublicacion(id);
        if (!eliminado) {
            return res.status(404).json({ status: 'error', message: 'Publicación no encontrada o ya eliminada.' });
        }
        res.json({ status: 'success', message: 'Publicación eliminada correctamente.' });
    } catch (e) { next(e); }
};
 
// PATCH /api/foro/:id/like — Incrementar likes de una publicación
export const darLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ForoService.incrementarLike(id);
        res.json({ status: 'success', message: 'Like registrado.' });
    } catch (e) { next(e); }
};