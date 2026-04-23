// Servicio: empleoService
import db from '../config/db.js';
 
/**
 * Obtiene todos los empleos activos con datos de la empresa
 */
export const getEmpleosActivos = async ({ categoria, modalidad, ubicacion, busqueda } = {}) => {
    let sql = `
        SELECT 
            BIN_TO_UUID(e.id)        AS id,
            e.titulo,
            e.descripcion_puesto     AS descripcion,
            e.categoria,
            e.modalidad,
            e.tipoContrato,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.vacantes,
            e.estado,
            e.fechaCierre            AS fechaVencimiento,
            e.creadoEl,
            BIN_TO_UUID(e.idEmpresa) AS idEmpresa,
            pe.nombreComercial       AS nombreEmpresa,
            pe.urlLogo               AS logoEmpresa
        FROM Empleo e
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.estado = 'abierta'
    `;
    const params = [];
 
    if (categoria) { sql += ' AND e.categoria = ?';              params.push(categoria); }
    if (modalidad) { sql += ' AND e.modalidad = ?';              params.push(modalidad); }
    if (ubicacion) { sql += ' AND e.ubicacion LIKE ?';           params.push(`%${ubicacion}%`); }
    if (busqueda)  { sql += ' AND (e.titulo LIKE ? OR e.descripcion_puesto LIKE ?)'; params.push(`%${busqueda}%`, `%${busqueda}%`); }
 
    sql += ' ORDER BY e.creadoEl DESC LIMIT 50';
 
    const [rows] = await db.query(sql, params);
    return rows;
};
 
/**
 * Obtiene un empleo por ID
 */
export const getEmpleoPorId = async (id) => {
    const sql = `
        SELECT 
            BIN_TO_UUID(e.id)        AS id,
            e.titulo,
            e.descripcion_puesto     AS descripcion,
            e.requisitos,
            e.funciones,
            e.beneficios,
            e.categoria,
            e.modalidad,
            e.tipoContrato,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.nivelExperiencia,
            e.vacantes,
            e.estado,
            e.fechaCierre            AS fechaVencimiento,
            e.creadoEl,
            BIN_TO_UUID(e.idEmpresa) AS idEmpresa,
            pe.nombreComercial       AS nombreEmpresa,
            pe.descripcion           AS descripcionEmpresa,
            pe.urlLogo               AS logoEmpresa,
            pe.sector,
            pe.ubicacion             AS ubicacionEmpresa
        FROM Empleo e
        INNER JOIN Perfil_Empresa pe ON e.idEmpresa = pe.id
        WHERE e.id = UUID_TO_BIN(?)
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
};
 
/**
 * Crea un nuevo empleo (usado por empresa)
 * Compatible con la nueva tabla Empleo (usa descripcion_puesto, requisitos, beneficios, tipoContrato)
 */
/**
 * Crea un nuevo empleo (usado por empresa)
 */
export const crearEmpleo = async (datos) => {
    // 1. Extraemos con nombres exactos (Desestructuración)
    // Asegúrate de que estos nombres coincidan con los 'name' de tus inputs en el HTML
    const {
        idEmpresa,
        titulo,
        descripcion,      // o descripcion_puesto
        requisitos,
        funciones,
        categoria,
        tipoContrato,
        modalidad,
        ubicacion,
        salarioMin,
        salarioMax,
        nivelExperiencia,
        vacantes,
        fechaVencimiento, // o fechaCierre
        beneficios
    } = datos;
 
    const sql = `
        INSERT INTO Empleo (
            id, idEmpresa, titulo, descripcion_puesto, requisitos, funciones,
            categoria, tipoContrato, modalidad, ubicacion,
            salarioMin, salarioMax, nivelExperiencia, vacantes, fechaCierre,
            beneficios, estado
        )
        VALUES (
            UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, 'abierta'
        )
    `;
 
    // 2. Mapeo manual para evitar que 'Remoto' caiga en vacantes
    const params = [
        idEmpresa,                      // ? 1
        titulo,                         // ? 2
        descripcion || null,            // ? 3
        requisitos || null,             // ? 4
        funciones || null,              // ? 5
        categoria || null,              // ? 6
        tipoContrato || null,           // ? 7
        modalidad || null,              // ? 8
        ubicacion || null,              // ? 9
        parseFloat(salarioMin) || 0,    // ? 10 (Aseguramos número)
        parseFloat(salarioMax) || 0,    // ? 11 (Aseguramos número)
        nivelExperiencia || null,       // ? 12
        parseInt(vacantes) || 1,        // ? 13 (ESTE ES EL QUE DABA ERROR)
        fechaVencimiento || null,       // ? 14
        beneficios || null              // ? 15
    ];
 
    try {
        const [result] = await db.query(sql, params);
        return { ok: true, titulo };
    } catch (error) {
        console.error("❌ Error real en la consulta SQL:", error.sql); // Para ver el SQL fallido
        throw error;
    }
 
};
/**
 * Empleos publicados por una empresa específica (VISTA_22 y VISTA_23)
 */
export const getEmpleosDeEmpresa = async (idEmpresa) => {
    const sql = `
        SELECT
            BIN_TO_UUID(e.id)   AS id,
            e.titulo,
            e.categoria,
            e.modalidad,
            e.tipoContrato,
            e.ubicacion,
            e.salarioMin,
            e.salarioMax,
            e.vacantes,
            e.estado,
            e.fechaCierre       AS fechaVencimiento,
            e.creadoEl,
            (SELECT COUNT(*) FROM Postulacion p WHERE p.idEmpleo = e.id) AS totalPostulaciones
        FROM Empleo e
        WHERE e.idEmpresa = UUID_TO_BIN(?)
        ORDER BY e.creadoEl DESC
    `;
    const [rows] = await db.query(sql, [idEmpresa]);
    return rows;
};
 
/**
 * Conteo de empleos activos agrupados por categoría
 * Retorna objeto plano: { "Tecnología": 12, "Finanzas": 5, ... }
 */
export const getStatsCategorias = async () => {
    const [rows] = await db.query(`
        SELECT categoria, COUNT(*) AS total
        FROM Empleo
        WHERE estado = 'abierta'
        GROUP BY categoria
        ORDER BY total DESC
    `);
    // Convertir array de filas en objeto clave→valor para facilitar el uso en el frontend
    return rows.reduce((acc, row) => {
        acc[row.categoria] = Number(row.total);
        return acc;
    }, {});
};
 
/**
 * Cambia el estado de un empleo (abierta / cerrada / pausada)
 */
export const updateEstadoEmpleo = async (id, estado) => {
    await db.query(
        "UPDATE Empleo SET estado=? WHERE id=UUID_TO_BIN(?)",
        [estado, id]
    );
    return { ok: true };
};