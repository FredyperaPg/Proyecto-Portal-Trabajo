import * as PerfilService from '../services/perfilService.js';
 
// ── POSTULANTE ────────────────────────────────────────────────────────────────
 
export const getPerfilPostulante = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const perfil = await PerfilService.getPerfilPostulante(idUsuario);
        if (!perfil) return res.status(404).json({ status: 'error', message: 'Perfil no encontrado' });
        res.json({ status: 'success', data: perfil });
    } catch (error) { next(error); }
};
 
export const updatePerfilPostulante = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        
        // Esto asegura que capturemos los nuevos campos que agregamos a la DB
        const datosActualizados = {
            ...req.body, // Trae todo lo que envíe el formulario
            resumen: req.body.resumen || null,
            telefono: req.body.telefono || null
        };
 
        await PerfilService.updatePerfilPostulante(idUsuario, datosActualizados);
        res.json({ status: 'success', message: 'Perfil actualizado correctamente' });
    } catch (error) { 
        console.error("❌ Error al actualizar perfil:", error);
        next(error); 
    }
};
 
// ── UPLOAD CV ────────────────────────────────────────────────────────────────
 
export const uploadCV = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No se recibió ningún archivo.' });
        }
 
        // La URL pública del CV — el servidor sirve /uploads como estático
        const urlCV = `/uploads/cvs/${req.file.filename}`;
        await PerfilService.updateUrlCV(idUsuario, urlCV);
 
        res.json({ status: 'success', message: 'CV subido correctamente.', urlCV });
    } catch (error) {
        console.error('❌ Error al subir CV:', error);
        next(error);
    }
};
 
 
 
// ── EMPRESA ───────────────────────────────────────────────────────────────────
 
export const getPerfilEmpresa = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const perfil = await PerfilService.getPerfilEmpresa(idUsuario);
        if (!perfil) return res.status(404).json({ status: 'error', message: 'Perfil de empresa no encontrado' });
        res.json({ status: 'success', data: perfil });
    } catch (error) { next(error); }
};
 
export const updatePerfilEmpresa = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        await PerfilService.updatePerfilEmpresa(idUsuario, req.body);
        res.json({ status: 'success', message: 'Perfil de empresa actualizado' });
    } catch (error) { next(error); }
};
 
// ── EXPERIENCIA LABORAL ───────────────────────────────────────────────────────
 
export const getExperienciaPostulante = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const data = await PerfilService.getExperienciaPostulante(idUsuario);
        res.json({ status: 'success', data });
    } catch (error) { next(error); }
};
 
export const addExperiencia = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const { puesto, empresa, fechaInicio, fechaFin, trabajoActual, descripcion } = req.body;
 
        if (!puesto || !empresa || !fechaInicio) {
            return res.status(400).json({
                status: 'error',
                message: 'Puesto, empresa y fecha de inicio son obligatorios.'
            });
        }
 
        await PerfilService.addExperiencia(idUsuario, {
            puesto, empresa, fechaInicio, fechaFin, trabajoActual, descripcion
        });
        res.status(201).json({ status: 'success', message: 'Experiencia agregada correctamente.' });
    } catch (error) {
        console.error('❌ Error al agregar experiencia:', error);
        next(error);
    }
};
 
// ── ADMIN ─────────────────────────────────────────────────────────────────────
 
export const getAdminStats = async (req, res, next) => {
    try {
        const stats = await PerfilService.getAdminStats();
        res.json({ status: 'success', data: stats });
    } catch (error) { next(error); }
};
// ── UPLOAD LOGO ───────────────────────────────────────────────────────────────
 
export const uploadLogo = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        if (!req.file) return res.status(400).json({ status: 'error', message: 'No se recibió ningún archivo.' });
        const urlLogo = `/uploads/empresa/${req.file.filename}`;
        await PerfilService.updateUrlLogo(idUsuario, urlLogo);
        res.json({ status: 'success', message: 'Logo actualizado.', urlLogo });
    } catch (error) {
        console.error('❌ Error al subir logo:', error);
        next(error);
    }
};
 
// ── UPLOAD BANNER ─────────────────────────────────────────────────────────────
 
export const uploadBanner = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        if (!req.file) return res.status(400).json({ status: 'error', message: 'No se recibió ningún archivo.' });
        const urlBanner = `/uploads/empresa/${req.file.filename}`;
        await PerfilService.updateUrlBanner(idUsuario, urlBanner);
        res.json({ status: 'success', message: 'Banner actualizado.', urlBanner });
    } catch (error) {
        console.error('❌ Error al subir banner:', error);
        next(error);
    }
};