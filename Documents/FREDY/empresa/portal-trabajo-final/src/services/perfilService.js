// perfilService.js
import db from '../config/db.js';
 
// ── POSTULANTE ────────────────────────────────────────────────────────────────
 
export const getPerfilPostulante = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(u.id)    AS id,
            u.nombres,
            u.apellidos,
            u.email,
            u.urlFoto,
            u.creadoEl,
            BIN_TO_UUID(pc.id)   AS idCandidato,
            pc.dui,
            pc.fechaNacimiento,
            pc.direccion,
            pc.titulo,
            pc.profesion,
            pc.anosExperiencia,
            pc.resumen,
            pc.telefono,
            pc.urlCV
        FROM Usuario u
        LEFT JOIN Perfil_Candidato pc ON pc.idUsuario = u.id
        WHERE u.id = UUID_TO_BIN(?)
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows[0] || null;
};
 
export const updatePerfilPostulante = async (idUsuario, datos) => {
    const {
        nombres, apellidos,
        dui, fechaNacimiento, direccion,
        titulo, profesion, anosExperiencia,
        resumen, telefono
    } = datos;
 
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
 
        // Actualizar tabla Usuario
        await connection.execute(
            `UPDATE Usuario SET nombres=?, apellidos=?
             WHERE id = UUID_TO_BIN(?)`,
            [nombres || '', apellidos || '', idUsuario]
        );
 
        // Verificar que exista el perfil candidato
        const [check] = await connection.execute(
            `SELECT id FROM Perfil_Candidato WHERE idUsuario = UUID_TO_BIN(?)`,
            [idUsuario]
        );
 
        if (check.length === 0) {
            // Crear perfil si no existe (registro incompleto)
            await connection.execute(
                `INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion,
                    titulo, profesion, anosExperiencia, resumen, telefono)
                 VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?)`,
                [idUsuario, dui || '00000000-0', fechaNacimiento || '1990-01-01',
                 direccion || '', titulo || null, profesion || null,
                 anosExperiencia || 0, resumen || null, telefono || null]
            );
        } else {
            // UPDATE con manejo de columnas que pueden no existir
            await connection.execute(
                `UPDATE Perfil_Candidato
                 SET dui=?, fechaNacimiento=?, direccion=?,
                     titulo=?, profesion=?, anosExperiencia=?,
                     resumen=?, telefono=?
                 WHERE idUsuario = UUID_TO_BIN(?)`,
                [dui || '00000000-0', fechaNacimiento || '1990-01-01',
                 direccion || '', titulo || null, profesion || null,
                 anosExperiencia || 0, resumen || null, telefono || null,
                 idUsuario]
            );
        }
 
        await connection.commit();
        return { ok: true };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};
 // ── URL CV ────────────────────────────────────────────────────────────────────
 
export const updateUrlCV = async (idUsuario, urlCV) => {
    await db.query(
        `UPDATE Perfil_Candidato SET urlCV = ? WHERE idUsuario = UUID_TO_BIN(?)`,
        [urlCV, idUsuario]
    );
    return { ok: true };
};
 
// ── EMPRESA ───────────────────────────────────────────────────────────────────
 
export const getPerfilEmpresa = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(u.id)    AS idUsuario,
            u.nombres,
            u.apellidos,
            u.email,
            BIN_TO_UUID(pe.id)   AS idEmpresa,
            pe.nombreComercial,
            pe.razonSocial,
            pe.nit,
            pe.ubicacion,
            pe.telefono,
            pe.correoContacto,
            pe.sector,
            pe.tipoEmpresa,
            pe.descripcion,
            pe.urlLogo,
            pe.urlBanner,
            pe.creadoEl
        FROM Usuario u
        INNER JOIN Perfil_Empresa pe ON pe.idUsuario = u.id
        WHERE u.id = UUID_TO_BIN(?)
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows[0] || null;
};
 
export const updatePerfilEmpresa = async (idUsuario, datos) => {
    const {
        nombreComercial, razonSocial, nit, ubicacion, telefono,
        correoContacto, sector, tipoEmpresa, descripcion
    } = datos;
 
    await db.query(
        `UPDATE Perfil_Empresa
         SET nombreComercial=?, razonSocial=?, nit=?, ubicacion=?, telefono=?,
             correoContacto=?, sector=?, tipoEmpresa=?, descripcion=?
         WHERE idUsuario = UUID_TO_BIN(?)`,
        [nombreComercial, razonSocial, nit, ubicacion, telefono,
         correoContacto, sector, tipoEmpresa, descripcion || null, idUsuario]
    );
    return { ok: true };
};
 
// ── EXPERIENCIA LABORAL ───────────────────────────────────────────────────────
 
/**
 * Devuelve todas las experiencias laborales de un postulante, ordenadas por fecha desc.
 */
export const getExperienciaPostulante = async (idUsuario) => {
    const sql = `
        SELECT
            BIN_TO_UUID(e.id)  AS id,
            e.puesto,
            e.empresa,
            e.fechaInicio,
            e.fechaFin,
            e.trabajoActual,
            e.descripcion
        FROM Experiencia_Laboral e
        INNER JOIN Perfil_Candidato pc ON e.idCandidato = pc.id
        WHERE pc.idUsuario = UUID_TO_BIN(?)
        ORDER BY e.fechaInicio DESC
    `;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows;
};
 
/**
 * Inserta una nueva entrada de experiencia laboral para el postulante.
 * Primero obtiene el idCandidato desde Perfil_Candidato.
 */
export const addExperiencia = async (idUsuario, datos) => {
    const { puesto, empresa, fechaInicio, fechaFin, trabajoActual, descripcion } = datos;
 
    // Obtener idCandidato del perfil
    const [[pc]] = await db.query(
        `SELECT id FROM Perfil_Candidato WHERE idUsuario = UUID_TO_BIN(?) LIMIT 1`,
        [idUsuario]
    );
    if (!pc) throw new Error('Perfil de candidato no encontrado para este usuario.');
 
    await db.query(
        `INSERT INTO Experiencia_Laboral
            (id, idCandidato, puesto, empresa, fechaInicio, fechaFin, trabajoActual, descripcion)
         VALUES
            (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?)`,
        [pc.id, puesto, empresa, fechaInicio,
         trabajoActual ? null : (fechaFin || null),
         trabajoActual ? 1 : 0,
         descripcion || null]
    );
    return { ok: true };
};
 
// ── ADMIN STATS ───────────────────────────────────────────────────────────────
 
export const getAdminStats = async () => {
    const [[{ totalPostulantes }]] = await db.query(
        "SELECT COUNT(*) AS totalPostulantes FROM Usuario WHERE rol='postulante' AND estado='activo'"
    );
    const [[{ totalEmpresas }]] = await db.query(
        "SELECT COUNT(*) AS totalEmpresas FROM Usuario WHERE rol='empleador' AND estado='activo'"
    );
    const [[{ totalEmpleos }]] = await db.query(
        "SELECT COUNT(*) AS totalEmpleos FROM Empleo WHERE estado='abierta'"
    );
    const [[{ totalUsuarios }]] = await db.query(
        "SELECT COUNT(*) AS totalUsuarios FROM Usuario WHERE estado='activo'"
    );
    return { totalPostulantes, totalEmpresas, totalEmpleos, totalUsuarios };
};
// ── URL LOGO / BANNER ─────────────────────────────────────────────────────────
 
export const updateUrlLogo = async (idUsuario, urlLogo) => {
    await db.query(
        `UPDATE Perfil_Empresa SET urlLogo = ? WHERE idUsuario = UUID_TO_BIN(?)`,
        [urlLogo, idUsuario]
    );
    return { ok: true };
};
 
export const updateUrlBanner = async (idUsuario, urlBanner) => {
    await db.query(
        `UPDATE Perfil_Empresa SET urlBanner = ? WHERE idUsuario = UUID_TO_BIN(?)`,
        [urlBanner, idUsuario]
    );
    return { ok: true };
};