import db from '../config/db.js';

export const getRecursos = async ({ tipo, busqueda } = {}) => {
    let sql = `
        SELECT BIN_TO_UUID(r.id) AS id, r.titulo, r.contenido, r.tipo,
               r.urlBanner, r.urlVideo, r.fechaPublicacion,
               u.nombres AS autorNombre, u.apellidos AS autorApellido
        FROM Recurso r
        INNER JOIN Usuario u ON r.idUsuario = u.id
        WHERE r.estado = 'publicado'
    `;
    const params = [];
    if (tipo)     { sql += ' AND r.tipo = ?';            params.push(tipo); }
    if (busqueda) { sql += ' AND r.titulo LIKE ?';       params.push(`%${busqueda}%`); }
    sql += ' ORDER BY r.fechaPublicacion DESC LIMIT 50';
    const [rows] = await db.query(sql, params);
    return rows;
};

export const getRecursoPorId = async (id) => {
    const [rows] = await db.query(
        `SELECT BIN_TO_UUID(r.id) AS id, r.titulo, r.contenido, r.tipo,
                r.urlBanner, r.urlVideo, r.fechaPublicacion,
                u.nombres AS autorNombre, u.apellidos AS autorApellido
         FROM Recurso r INNER JOIN Usuario u ON r.idUsuario = u.id
         WHERE r.id = UUID_TO_BIN(?) AND r.estado = 'publicado' LIMIT 1`, [id]
    );
    return rows[0] || null;
};

export const getStatsPublicas = async () => {
    const [[{ totalEmpleos }]]    = await db.query("SELECT COUNT(*) AS totalEmpleos FROM Empleo WHERE estado='abierta'");
    const [[{ totalEmpresas }]]   = await db.query("SELECT COUNT(*) AS totalEmpresas FROM Perfil_Empresa");
    const [[{ totalCandidatos }]] = await db.query("SELECT COUNT(*) AS totalCandidatos FROM Usuario WHERE rol='postulante' AND estado='activo'");
    const [[{ totalPostulaciones }]] = await db.query("SELECT COUNT(*) AS totalPostulaciones FROM Postulacion");
    return { totalEmpleos, totalEmpresas, totalCandidatos, totalPostulaciones };
};
