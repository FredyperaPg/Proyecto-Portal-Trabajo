// Controlador: postulacionController
import * as PostulacionService from '../services/postulacionService.js';

export const crearPostulacion = async (req, res, next) => {
    try {
        const { idCandidato, idEmpleo } = req.body;
        if (!idCandidato || !idEmpleo)
            return res.status(400).json({ status: 'error', message: 'idCandidato e idEmpleo son obligatorios' });
        const data = await PostulacionService.crearPostulacion(idCandidato, idEmpleo);
        res.status(201).json({ status: 'success', message: 'Postulación enviada con éxito', data });
    } catch (error) { next(error); }
};

export const getMisPostulaciones = async (req, res, next) => {
    try {
        const { idCandidato } = req.params;
        const data = await PostulacionService.getMisPostulaciones(idCandidato);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const getPostulacionesPorEmpresa = async (req, res, next) => {
    try {
        const { idEmpresa } = req.params;
        const { idEmpleo }  = req.query;
        const data = await PostulacionService.getPostulacionesPorEmpresa(idEmpresa, idEmpleo);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

// GET /api/empresa/aplicaciones/:idEmpresa
// JOIN completo: Postulacion + Usuario + Perfil_Candidato + Empleo
export const getAplicacionesEmpresa = async (req, res, next) => {
    try {
        const { idEmpresa } = req.params;
        const { idEmpleo }  = req.query;
        const data = await PostulacionService.getAplicacionesConDetalle(idEmpresa, idEmpleo);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};

export const updateEstadoPostulacion = async (req, res, next) => {
    try {
        const { id }     = req.params;
        const { estado } = req.body;
        await PostulacionService.updateEstadoPostulacion(id, estado);
        res.json({ status: 'success', message: 'Estado actualizado' });
    } catch (error) { next(error); }
};

