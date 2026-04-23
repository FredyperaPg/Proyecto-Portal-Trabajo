-- ============================================================
-- BD_Script.sql - Portal de Empleos El Salvador
-- Creación de tablas completa
-- ============================================================

CREATE DATABASE IF NOT EXISTS portal_trabajos;
USE portal_trabajos;

-- ============================================================
-- 1. TABLA DE ROLES
-- ============================================================
CREATE TABLE Roles (
    id BINARY(16) PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL
);

-- ============================================================
-- 2. TABLA DE USUARIO
-- ============================================================
CREATE TABLE Usuario (
    id BINARY(16) PRIMARY KEY,
    idRol BINARY(16) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    rol VARCHAR(20) NOT NULL,
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol) REFERENCES Roles(id)
);

-- ============================================================
-- 3. TABLA PERFIL EMPRESA
-- ============================================================
CREATE TABLE Perfil_Empresa (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    nombreComercial VARCHAR(150) NOT NULL,
    razonSocial VARCHAR(150) NOT NULL,
    nit VARCHAR(20) NOT NULL UNIQUE,
    ubicacion VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correoContacto VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    tipoEmpresa VARCHAR(100) NOT NULL,
    descripcion TEXT,
    urlLogo VARCHAR(255),
    urlBanner VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. TABLA PERFIL CANDIDATO
-- ============================================================
CREATE TABLE Perfil_Candidato (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    dui VARCHAR(20) NOT NULL UNIQUE,
    fechaNacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    titulo VARCHAR(150),
    profesion VARCHAR(150),
    anosExperiencia INT DEFAULT 0,
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidato_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. TABLA DE EMPLEOS
-- ============================================================
CREATE TABLE Empleo (
    id                  BINARY(16)      PRIMARY KEY,
    idEmpresa           BINARY(16)      NOT NULL,
    titulo              VARCHAR(255)    NOT NULL,
    categoria           VARCHAR(100),
    tipoContrato        VARCHAR(100),
    modalidad           VARCHAR(100),
    ubicacion           VARCHAR(255),
    salarioMin          DECIMAL(10,2),
    salarioMax          DECIMAL(10,2),
    nivelExperiencia    VARCHAR(100),
    fechaCierre         DATE,
    descripcion_puesto  TEXT,
    descripcion         TEXT            AS (descripcion_puesto) VIRTUAL,
    requisitos          TEXT,
    beneficios          TEXT,
    funciones           TEXT,
    vacantes            INT             DEFAULT 1,
    fechaVencimiento    DATE            AS (fechaCierre) VIRTUAL,
    estado              ENUM('abierta','cerrada','pausada') DEFAULT 'abierta',
    creadoEl            TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl       DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_empleo_empresa_id
        FOREIGN KEY (idEmpresa) REFERENCES Perfil_Empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. TABLA DE POSTULACIONES
-- ============================================================
CREATE TABLE Postulacion (
    id BINARY(16) PRIMARY KEY,
    idCandidato BINARY(16) NOT NULL,
    idEmpleo BINARY(16) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_postulacion_candidato FOREIGN KEY (idCandidato) REFERENCES Perfil_Candidato(id),
    CONSTRAINT fk_postulacion_empleo FOREIGN KEY (idEmpleo) REFERENCES Empleo(id)
);

-- ============================================================
-- 7. TABLA DE RECURSOS (BLOG)
-- ============================================================
CREATE TABLE Recurso (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'publicado',
    urlBanner VARCHAR(255),
    urlVideo VARCHAR(255),
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recurso_autor FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. TABLA DE PUBLICACIONES DEL FORO
-- ============================================================
CREATE TABLE Publicacion_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    cantidadLikes INT DEFAULT 0,
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. TABLA DE COMENTARIOS DEL FORO
-- ============================================================
CREATE TABLE Comentario_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    idPublicacion BINARY(16) NOT NULL,
    contenido TEXT NOT NULL,
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_publicacion FOREIGN KEY (idPublicacion) REFERENCES Publicacion_Foro(id) ON DELETE CASCADE
);

-- ============================================================
-- 10. INSERCIÓN DE ROLES
-- ============================================================
INSERT INTO Roles (id, nombreRol) VALUES
    (UUID_TO_BIN(UUID()), 'admin'),
    (UUID_TO_BIN(UUID()), 'empleador'),
    (UUID_TO_BIN(UUID()), 'postulante');

-- ============================================================
-- 11. VERIFICACIÓN FINAL
-- ============================================================
SELECT '=== TABLAS CREADAS CORRECTAMENTE ===' AS Mensaje;
SELECT BIN_TO_UUID(id) AS id_rol, nombreRol FROM Roles;