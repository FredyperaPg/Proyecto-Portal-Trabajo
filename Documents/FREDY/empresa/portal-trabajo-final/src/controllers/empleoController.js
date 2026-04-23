// empleoController.js — Controlador de Empleos
// El JOIN con Perfil_Empresa garantiza que nombreComercial llegue al frontend
import * as EmpleoService from '../services/empleoService.js';
 
// GET /api/empleos — Lista de empleos activos (con filtros opcionales)
export const getEmpleos = async (req, res, next) => {
    try {
        const { categoria, modalidad, ubicacion, busqueda } = req.query;
        const empleos = await EmpleoService.getEmpleosActivos({ categoria, modalidad, ubicacion, busqueda });
        res.json({ status: 'success', data: empleos });
    } catch (error) { next(error); }
};
 
// GET /api/empleos/stats-categorias — Conteo de empleos por categoría (home público)
// ⚠️ DEBE IR ANTES DE /:id en las rutas para que Express no lo capture como parámetro
export const getStatsCategorias = async (req, res, next) => {
    try {
        const data = await EmpleoService.getStatsCategorias();
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};
 
// GET /api/empleos/empresa/:idEmpresa — Empleos publicados por una empresa
export const getEmpleosDeEmpresa = async (req, res, next) => {
    try {
        const { idEmpresa } = req.params;
        const data = await EmpleoService.getEmpleosDeEmpresa(idEmpresa);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};
 
// GET /api/empleos/:id — Detalle completo de un empleo (VISTA_16)
// Incluye: titulo, descripcion_puesto, requisitos, funciones, beneficios,
//          nombreComercial (JOIN Perfil_Empresa), sector, logoEmpresa
export const getEmpleo = async (req, res, next) => {
    try {
        const empleo = await EmpleoService.getEmpleoPorId(req.params.id);
        if (!empleo) {
            return res.status(404).json({ status: 'error', message: 'Empleo no encontrado o ya cerrado.' });
        }
        res.json({ status: 'success', data: empleo });
    } catch (error) { next(error); }
};
 
// POST /api/empleos — Publicar nuevo empleo (empresa autenticada)
export const crearEmpleo = async (req, res, next) => {
    try {
        const data = await EmpleoService.crearEmpleo(req.body);
        res.status(201).json({ status: 'success', message: 'Empleo publicado con éxito.', data });
    } catch (error) { next(error); }
};
 
// PATCH /api/empleos/:id/estado — Cambiar estado del empleo (abierta/cerrada/pausada)
export const updateEstadoEmpleo = async (req, res, next) => {
    try {
        const { id }     = req.params;
        const { estado } = req.body;
        if (!['abierta', 'cerrada', 'pausada'].includes(estado)) {
            return res.status(400).json({ status: 'error', message: 'Estado inválido. Use: abierta, cerrada o pausada.' });
        }
        await EmpleoService.updateEstadoEmpleo(id, estado);
        res.json({ status: 'success', message: `Estado del empleo actualizado a "${estado}".` });
    } catch (error) { next(error); }
};