// foroService.js — Servicio del Foro
// Fuente de verdad: tabla Publicacion_Foro + Comentario_Foro + Usuario
import db from '../config/db.js';
 
/**
 * Lista todas las publicaciones con datos del autor (JOIN Usuario)
 * Devuelve: id, titulo, contenido, cantidadLikes, creadoEl,
 *           autorNombre, autorApellido, totalComentarios
 */
export const getPublicaciones = async ({ busqueda } = {}) => {
    let sql = `
        SELECT
            BIN_TO_UUID(p.id)        AS id,
            p.titulo,
            p.contenido,
            p.cantidadLikes,
            p.creadoEl,
            u.nombres                AS autorNombre,
            u.apellidos              AS autorApellido,
            u.urlFoto                AS autorFoto,
            u.rol                    AS autorRol,
            (SELECT COUNT(*)
             FROM Comentario_Foro c
             WHERE c.idPublicacion = p.id) AS totalComentarios
        FROM Publicacion_Foro p
        INNER JOIN Usuario u ON p.idUsuario = u.id
    `;
    const params = [];
 
    if (busqueda) {
        sql += ' WHERE (p.titulo LIKE ? OR p.contenido LIKE ?)';
        params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
 
    sql += ' ORDER BY p.creadoEl DESC LIMIT 100';
 
    const [rows] = await db.query(sql, params);
    return rows;
};
 
/**
 * Detalle de una publicación por ID con sus comentarios
 */
export const getPublicacionPorId = async (id) => {
    const [[pub]] = await db.query(
        `SELECT
            BIN_TO_UUID(p.id)    AS id,
            p.titulo,
            p.contenido,
            p.cantidadLikes,
            p.creadoEl,
            u.nombres            AS autorNombre,
            u.apellidos          AS autorApellido,
            u.urlFoto            AS autorFoto,
            u.rol                AS autorRol
         FROM Publicacion_Foro p
         INNER JOIN Usuario u ON p.idUsuario = u.id
         WHERE p.id = UUID_TO_BIN(?)
         LIMIT 1`,
        [id]
    );
    if (!pub) return null;
 
    const [comentarios] = await db.query(
        `SELECT
            BIN_TO_UUID(c.id)  AS id,
            c.contenido,
            c.creadoEl,
            u.nombres          AS autorNombre,
            u.apellidos        AS autorApellido,
            u.urlFoto          AS autorFoto
         FROM Comentario_Foro c
         INNER JOIN Usuario u ON c.idUsuario = u.id
         WHERE c.idPublicacion = UUID_TO_BIN(?)
         ORDER BY c.creadoEl ASC`,
        [id]
    );
 
    return { ...pub, comentarios };
};
 
/**
 * Crea una publicación nueva en el foro
 */
export const crearPublicacion = async (idUsuario, { titulo, contenido }) => {
    await db.query(
        `INSERT INTO Publicacion_Foro (id, idUsuario, titulo, contenido)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?)`,
        [idUsuario, titulo, contenido]
    );
    return { ok: true };
};
 
/**
 * Crea un comentario en una publicación
 */
export const crearComentario = async (idUsuario, idPublicacion, contenido) => {
    await db.query(
        `INSERT INTO Comentario_Foro (id, idPublicacion, idUsuario, contenido)
         VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
        [idPublicacion, idUsuario, contenido]
    );
    return { ok: true };
};
 
/**
 * Elimina una publicación y sus comentarios en cascada (Admin)
 * Retorna true si se eliminó, false si no existía
 */
export const eliminarPublicacion = async (id) => {
    const [result] = await db.query(
        `DELETE FROM Publicacion_Foro WHERE id = UUID_TO_BIN(?)`,
        [id]
    );
    return result.affectedRows > 0;
};
 
/**
 * Incrementa el contador de likes de una publicación
 */
export const incrementarLike = async (id) => {
    await db.query(
        `UPDATE Publicacion_Foro SET cantidadLikes = cantidadLikes + 1 WHERE id = UUID_TO_BIN(?)`,
        [id]
    );
    return { ok: true };
};