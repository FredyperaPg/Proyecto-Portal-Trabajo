-- ============================================================
-- BD_Datos_ElSalvador.sql - Portal de Empleos El Salvador
-- DATOS DE PRUEBA COMPLETOS
-- Ejecutar DESPUÉS de BD_Script.sql
-- ============================================================

USE portal_trabajos;

-- ============================================================
-- 1. OBTENER IDs DE ROLES
-- ============================================================
SET @rol_admin = (SELECT id FROM Roles WHERE nombreRol = 'admin' LIMIT 1);
SET @rol_empleador = (SELECT id FROM Roles WHERE nombreRol = 'empleador' LIMIT 1);
SET @rol_postulante = (SELECT id FROM Roles WHERE nombreRol = 'postulante' LIMIT 1);

-- ============================================================
-- 2. USUARIO ADMINISTRADOR
-- ============================================================
SET @id_u_admin = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_admin, @rol_admin, 'Administrador', 'del Sistema', 'admin@portal.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'admin', 'activo');

-- ============================================================
-- 3. EMPRESAS (9 empresas)
-- ============================================================

-- Tigo El Salvador
SET @id_u_tigo = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_tigo, @rol_empleador, 'Reclutamiento', 'Tigo SV', 'reclutamiento@tigo.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_tigo = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_tigo, @id_u_tigo, 'Tigo El Salvador', 'Tigo El Salvador S.A. de C.V.', '0614-050300-101-2', 'San Salvador', '2200-5000', 'reclutamiento@tigo.com.sv', 'Telecomunicaciones', 'Privada', 'Tigo es líder en telecomunicaciones en El Salvador.');

-- Avianca
SET @id_u_avianca = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_avianca, @rol_empleador, 'Talento', 'Avianca', 'talento@avianca.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_avianca = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_avianca, @id_u_avianca, 'Avianca', 'Avianca El Salvador S.A. de C.V.', '0614-040500-102-8', 'San Salvador', '2270-6000', 'talento@avianca.com.sv', 'Aviación', 'Privada', 'Avianca es la aerolínea más importante de Centroamérica.');

-- Sherwin-Williams
SET @id_u_sw = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_sw, @rol_empleador, 'Recursos', 'Humanos SW', 'rrhh@sherwin.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_sw = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_sw, @id_u_sw, 'Sherwin-Williams', 'Sherwin-Williams El Salvador S.A. de C.V.', '0614-150700-103-6', 'San Salvador', '2243-8000', 'rrhh@sherwin.com.sv', 'Química', 'Privada', 'Sherwin-Williams es líder mundial en pinturas.');

-- Holcim El Salvador
SET @id_u_holcim = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_holcim, @rol_empleador, 'Gestión', 'Talento Holcim', 'talento@holcim.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_holcim = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_holcim, @id_u_holcim, 'Holcim El Salvador', 'Holcim El Salvador S.A. de C.V.', '0614-060400-104-2', 'San Miguel', '2600-4500', 'talento@holcim.com.sv', 'Construcción', 'Privada', 'Holcim es líder en materiales de construcción.');

-- Banco Agrícola
SET @id_u_agricola = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_agricola, @rol_empleador, 'Recursos', 'Humanos Agrícola', 'rrhh@bancoagricola.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_agricola = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_agricola, @id_u_agricola, 'Banco Agrícola', 'Banco Agrícola S.A.', '0614-010188-101-5', 'San Salvador', '2234-5000', 'rrhh@bancoagricola.com.sv', 'Banca', 'Privada', 'Banco Agrícola es el banco líder de El Salvador.');

-- Telus International
SET @id_u_telus = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_telus, @rol_empleador, 'Talent', 'Acquisition Telus', 'careers@telusinternational.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_telus = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_telus, @id_u_telus, 'Telus International', 'Telus International El Salvador S.A. de C.V.', '0614-280615-102-8', 'San Salvador', '2244-6100', 'careers@telusinternational.com', 'Tecnología BPO', 'Privada', 'Telus International es centro de experiencia del cliente.');

-- Super Selectos
SET @id_u_selectos = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_selectos, @rol_empleador, 'Gestión', 'Talento Selectos', 'empleo@superselectos.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_selectos = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_selectos, @id_u_selectos, 'Super Selectos', 'Corporación de Supermercados Unidos S.A. de C.V.', '0614-010196-103-1', 'San Salvador', '2200-7000', 'empleo@superselectos.com', 'Retail', 'Privada', 'Super Selectos es la cadena #1 de supermercados.');

-- Grupo Roble
SET @id_u_roble = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_roble, @rol_empleador, 'RRHH', 'Grupo Roble', 'empleos@gruporoble.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_roble = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_roble, @id_u_roble, 'Grupo Roble', 'Inmobiliaria Roble S.A. de C.V.', '0614-120198-104-7', 'Santa Ana', '2245-8000', 'empleos@gruporoble.com', 'Inmobiliaria', 'Privada', 'Grupo Roble es importante conglomerado centroamericano.');

-- Claro El Salvador
SET @id_u_claro = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_claro, @rol_empleador, 'Reclutamiento', 'Claro SV', 'reclutamiento@claro.com.sv', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'empleador', 'activo');
SET @id_pe_claro = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion)
VALUES (@id_pe_claro, @id_u_claro, 'Claro El Salvador', 'América Móvil El Salvador S.A. de C.V.', '0614-150200-105-3', 'San Miguel', '2271-0000', 'reclutamiento@claro.com.sv', 'Telecomunicaciones', 'Privada', 'Claro es importante operador de telecomunicaciones.');

-- ============================================================
-- 4. EMPLEOS (62 empleos)
-- ============================================================

-- ============================================================
-- CATEGORÍA: Tecnología (10 empleos)
-- ============================================================

INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes)
VALUES
(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Tigo El Salvador' LIMIT 1), 'Desarrollador Full Stack Java', 'Tecnología', 'Tiempo completo', 'Híbrido', 'San Salvador, El Salvador', 1200.00, 1800.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Buscamos desarrollador Full Stack con experiencia en Java y frameworks modernos para el equipo de innovación digital.', 'Título en Ingeniería en Sistemas. 2+ años en Java, Spring Boot, Angular/React. Conocimientos en MySQL, Git. Inglés intermedio.', 'Seguro médico, bonos por rendimiento, internet pagado, formación continua.', 'Desarrollar aplicaciones web. Mantener APIs REST. Colaborar con equipo de producto. Realizar code reviews.', 3),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Telus International' LIMIT 1), 'Especialista en Ciberseguridad', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 1500.00, 2200.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Protegemos la información de clientes globales. Buscamos especialista en ciberseguridad con experiencia en análisis de vulnerabilidades.', 'Certificación en Ciberseguridad (CompTIA Security+, CEH). 3+ años. Conocimiento en firewalls, SIEM. Inglés avanzado.', 'Bono nocturno, seguro de vida, gimnasio, certificaciones pagadas.', 'Monitorear amenazas. Implementar políticas. Realizar pruebas de penetración.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Banco Agrícola' LIMIT 1), 'Analista de Datos', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 1000.00, 1500.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Analista de datos para área de inteligencia de negocio del banco líder.', 'Título en Ingeniería o Estadística. 1+ año en SQL, Python/Pandas, Power BI. Conocimientos en ETL.', 'Bonificación anual, seguro médico, comedor subsidiado.', 'Extraer y limpiar datos. Crear dashboards. Identificar patrones.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Grupo Roble' LIMIT 1), 'DevOps Engineer', 'Tecnología', 'Tiempo completo', 'Remoto', 'Santa Ana, El Salvador', 1300.00, 1900.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Automatizar infraestructura de los proyectos digitales del Grupo Roble.', 'Experiencia en AWS/Azure, Docker, Kubernetes, Jenkins, Terraform. Inglés técnico.', 'Internet pagado, bonos por proyectos, seguro médico.', 'Configurar pipelines CI/CD. Administrar servidores cloud. Automatizar despliegues.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Sherwin-Williams' LIMIT 1), 'Soporte Técnico IT', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 700.00, 950.00, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Soporte técnico para usuarios internos en todas las sucursales a nivel nacional.', 'Bachillerato técnico en informática. Conocimientos en Windows, Office 365, redes básicas.', 'Almuerzo subsidiado, transporte, seguro médico.', 'Atender tickets. Instalar y configurar equipos. Mantener inventario.', 4),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Avianca' LIMIT 1), 'Desarrollador Mobile', 'Tecnología', 'Tiempo completo', 'Híbrido', 'San Salvador, El Salvador', 1100.00, 1600.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Desarrollo y mantenimiento de la app móvil de Avianca para pasajeros.', 'Experiencia en Swift (iOS) o Kotlin (Android). Conocimientos en APIs REST, Git. Inglés intermedio.', 'Pases aéreos, seguro de viaje, horarios flexibles.', 'Implementar funcionalidades. Optimizar rendimiento. Publicar en stores.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Super Selectos' LIMIT 1), 'Administrador de Base de Datos', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 1400.00, 2000.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'Administración de bases de datos críticas para el negocio de retail.', 'Certificación en SQL Server u Oracle. 3+ años como DBA. Conocimientos en backup, tuning.', 'Seguro médico, bono anual, vales de despensa.', 'Optimizar consultas. Gestionar backups. Implementar alta disponibilidad.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Holcim El Salvador' LIMIT 1), 'Ingeniero de Automatización', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Miguel, El Salvador', 1300.00, 1800.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Automatización de procesos de producción en planta cementera.', 'Ingeniería eléctrica o mecatrónica. Conocimientos en PLC, SCADA, instrumentación.', 'Seguro médico familiar, bonos de producción, comedor.', 'Programar PLCs. Mantener SCADA. Mejorar eficiencia.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Claro El Salvador' LIMIT 1), 'Arquitecto de Soluciones Cloud', 'Tecnología', 'Tiempo completo', 'Híbrido', 'San Miguel, El Salvador', 2000.00, 2800.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Diseño y migración de servicios a la nube para transformación digital.', 'Certificación AWS Solutions Architect. 5+ años en infraestructura cloud.', 'Auto del año, bonos trimestrales, seguro premium.', 'Diseñar arquitecturas cloud. Migrar aplicaciones. Optimizar costos.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Telus International' LIMIT 1), 'QA Automation Engineer', 'Tecnología', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 900.00, 1300.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Automatización de pruebas para aplicaciones de clientes internacionales.', 'Experiencia en Selenium, Cypress, Postman. Java/Python. Inglés intermedio.', 'Certificaciones pagadas, bonos por calidad, seguro médico.', 'Diseñar casos de prueba. Ejecutar regresión. Reportar bugs.', 3);

-- ============================================================
-- CATEGORÍA: Marketing (10 empleos)
-- ============================================================

INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes)
VALUES
(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Tigo El Salvador' LIMIT 1), 'Especialista en Marketing Digital', 'Marketing', 'Tiempo completo', 'Híbrido', 'San Salvador, El Salvador', 800.00, 1200.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Gestión de campañas digitales para productos de telecomunicaciones.', 'Licenciatura en Mercadeo. 2+ años en Google Ads, Meta Ads, SEO/SEM.', 'Seguro médico, bonos por resultados, internet pagado.', 'Planificar campañas. Optimizar inversión. Analizar ROI.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Super Selectos' LIMIT 1), 'Community Manager', 'Marketing', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 600.00, 850.00, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Gestión de redes sociales para la marca líder de retail.', 'Bachillerato con experiencia. Creatividad. Canva, programación de posts.', 'Vales de despensa, productos gratis.', 'Crear contenido. Responder comentarios. Gestionar comunidad.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Banco Agrícola' LIMIT 1), 'Analista de Mercadeo', 'Marketing', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 900.00, 1300.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Análisis de mercado y competencia para lanzamiento de productos.', 'Título en Mercadeo o Administración. 2+ años en investigación. SPSS.', 'Bonificación anual, seguro médico.', 'Realizar estudios. Analizar competencia. Proponer estrategias.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Sherwin-Williams' LIMIT 1), 'Coordinador de Branding', 'Marketing', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 750.00, 1100.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Coordinación de estrategia de marca y posicionamiento.', 'Licenciatura en Diseño o Publicidad. Portafolio. Experiencia en manejo de marca.', 'Seguro médico, bonos, productos gratis.', 'Desarrollar manual de marca. Coordinar campañas. Gestionar proveedores.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Grupo Roble' LIMIT 1), 'Email Marketing Specialist', 'Marketing', 'Tiempo completo', 'Remoto', 'Santa Ana, El Salvador', 650.00, 900.00, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Gestión de campañas de email marketing para captación.', 'Experiencia en Mailchimp, HubSpot. Copywriting, segmentación.', 'Internet pagado, horario flexible.', 'Crear newsletters. Segmentar bases. Analizar métricas.', 2),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Avianca' LIMIT 1), 'Social Media Strategist', 'Marketing', 'Tiempo completo', 'Híbrido', 'San Salvador, El Salvador', 850.00, 1250.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Estrategia de redes sociales para aumentar engagement y ventas.', 'Experiencia en Meta Business Suite, TikTok Ads. Inglés intermedio.', 'Pases aéreos, seguro de viaje.', 'Diseñar calendario. Crear campañas virales. Analizar tendencias.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Telus International' LIMIT 1), 'Growth Marketing Analyst', 'Marketing', 'Tiempo completo', 'Presencial', 'San Salvador, El Salvador', 1000.00, 1400.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Análisis de datos para impulsar crecimiento de clientes.', 'Inglés avanzado. Google Analytics, Mixpanel, CRM. SQL básico.', 'Bonos trimestrales, seguro médico.', 'Optimizar embudos. Ejecutar A/B testing. Reportar KPIs.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Holcim El Salvador' LIMIT 1), 'Content Creator B2B', 'Marketing', 'Tiempo completo', 'Híbrido', 'San Miguel, El Salvador', 700.00, 1000.00, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Creación de contenido técnico para arquitectos e ingenieros.', 'Portafolio de escritura. Conocimiento en construcción. WordPress.', 'Seguro médico, bonos.', 'Escribir blogs. Crear whitepapers. Gestionar web.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Claro El Salvador' LIMIT 1), 'Product Marketing Manager', 'Marketing', 'Tiempo completo', 'Presencial', 'San Miguel, El Salvador', 1300.00, 1800.00, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'Lanzamiento y posicionamiento de nuevos productos.', '5+ años en marketing de productos. Inglés avanzado.', 'Auto, seguro premium, bonos anuales.', 'Definir go-to-market. Coordinar lanzamientos.', 1),

(UUID_TO_BIN(UUID()), (SELECT id FROM Perfil_Empresa WHERE nombreComercial = 'Super Selectos' LIMIT 1), 'Trade Marketing Analyst', 'Marketing', 'Tiempo completo', 'Presencial', 'Santa Ana, El Salvador', 750.00, 1100.00, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Ejecución de estrategias en puntos de venta.', 'Experiencia en retail. Visual merchandising.', 'Vales, bonos, seguro médico.', 'Coordinar promociones. Analizar sell-out. Capacitar personal.', 2);

-- ===== CATEGORÍA: Finanzas (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Analista Riesgo Crediticio', 'Finanzas', 'Completo', 'Presencial', 'San Salvador', 1100, 1600, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Evaluación riesgos cartera créditos.', 'Finanzas o Economía. 2+ años.', 'Seguro, bonificación.', 'Evaluar solicitudes. Provisiones.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Auditor Interno', 'Finanzas', 'Completo', 'Híbrido', 'San Salvador', 1200, 1700, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Auditoría financiera.', 'CPA. 3+ años. NIIF.', 'Seguro, bonos.', 'Auditorías. Hallazgos.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_holcim, 'Especialista Tesorería', 'Finanzas', 'Completo', 'Presencial', 'San Miguel', 1300, 1800, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Gestión liquidez.', 'Finanzas. 2+ años.', 'Seguro familiar.', 'Flujo caja. Negociar comisiones.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_sw, 'Analista Cuentas Pagar', 'Finanzas', 'Completo', 'Presencial', 'San Salvador', 600, 850, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Procesamiento facturas.', 'Contabilidad. Excel.', 'Seguro, vales.', 'Revisar facturas. Pagos.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_avianca, 'Analista Presupuesto', 'Finanzas', 'Completo', 'Híbrido', 'San Salvador', 900, 1300, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Control presupuesto anual.', 'Contabilidad. Excel.', 'Pases aéreos.', 'Ejecución presupuestaria.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Analista Financiero Senior', 'Finanzas', 'Completo', 'Presencial', 'Santa Ana', 1500, 2200, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Modelamiento financiero.', 'MBA. 5+ años. Power BI.', 'Auto, seguro premium.', 'Modelos. Evaluar rentabilidad.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Accounts Receivable', 'Finanzas', 'Completo', 'Presencial', 'San Salvador', 700, 1000, 'Básico', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Cuentas por cobrar internacional.', 'Inglés medio. Facturación.', 'Seguro, bonos.', 'Facturar. Cobranza.', 2, 'abierta');

-- ===== CATEGORÍA: Diseño (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_sw, 'Diseñador Gráfico Senior', 'Diseño', 'Completo', 'Presencial', 'San Salvador', 800, 1200, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Diseño piezas publicitarias.', 'Portafolio. Adobe. 3+ años.', 'Seguro, bonos.', 'Empaques. Material POP.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Diseñador UI/UX', 'Diseño', 'Completo', 'Híbrido', 'Santa Ana', 900, 1400, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Diseño interfaces apps.', 'Figma, Adobe XD. Portafolio.', 'Seguro, internet.', 'Wireframes. Usabilidad.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Motion Graphics', 'Diseño', 'Completo', 'Híbrido', 'San Salvador', 850, 1250, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Videos animados campañas.', 'After Effects, Premiere.', 'Seguro, bonos.', 'Animar gráficos. Editar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_avianca, 'Diseñador Editorial', 'Diseño', 'Completo', 'Presencial', 'San Salvador', 700, 1000, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Revistas a bordo.', 'InDesign, Illustrator.', 'Pases aéreos.', 'Maquetar. Impresión.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_selectos, 'Visual Merchandiser', 'Diseño', 'Completo', 'Presencial', 'San Salvador', 600, 850, 'Básico', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'Displays puntos venta.', 'Diseño o mercadeo.', 'Vales, productos.', 'Diseñar displays.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Diseñador Experiencia CX', 'Diseño', 'Completo', 'Presencial', 'San Salvador', 1000, 1500, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Experiencia omnicanal.', 'Inglés avanzado. Journey mapping.', 'Seguro, bonos.', 'Mapear journeys.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Diseñador Productos Digitales', 'Diseño', 'Completo', 'Presencial', 'San Salvador', 950, 1400, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'App banca móvil.', 'Figma, Sketch. Portafolio.', 'Seguro, bonos.', 'Flujos. User testing.', 2, 'abierta');

-- ===== CATEGORÍA: Salud (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_holcim, 'Enfermero Planta', 'Salud', 'Completo', 'Presencial', 'San Miguel', 600, 850, 'Básico', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Primeros auxilios planta.', 'Enfermería. Emergencias.', 'Seguro, bonos.', 'Emergencias. Botiquín.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Médico Ocupacional', 'Salud', 'Completo', 'Presencial', 'San Salvador', 1200, 1700, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Salud ocupacional.', 'Medicina. Especialidad salud ocupacional.', 'Seguro premium.', 'Exámenes. Ausentismo.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Coordinador Bienestar', 'Salud', 'Completo', 'Híbrido', 'San Salvador', 900, 1300, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Bienestar y salud mental.', 'Psicólogo. Salud ocupacional.', 'Seguro, bonos.', 'Programas bienestar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Especialista SST', 'Salud', 'Completo', 'Presencial', 'Santa Ana', 800, 1200, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Sistema gestión SST.', 'Técnico SST. Construcción.', 'Seguro, bonos.', 'Inspeccionar. Capacitar.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_selectos, 'Nutricionista', 'Salud', 'Completo', 'Presencial', 'San Salvador', 700, 1000, 'Básico', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Asesoría nutricional.', 'Nutrición. Registro.', 'Vales, seguro.', 'Asesorar. Menús.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Fisioterapeuta', 'Salud', 'Completo', 'Presencial', 'San Salvador', 750, 1100, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Atención fisioterapéutica.', 'Fisioterapia. Pausas activas.', 'Seguro, bonos.', 'Lesiones. Ergonómico.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_avianca, 'Asistente Enfermería', 'Salud', 'Completo', 'Presencial', 'San Salvador', 450, 600, 'Básico', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'Apoyo consultorio.', 'Auxiliar enfermería.', 'Pases aéreos.', 'Apoyar consultas.', 2, 'abierta');

-- ===== CATEGORÍA: Legal (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Abogado Corporativo', 'Legal', 'Completo', 'Presencial', 'San Salvador', 1300, 1900, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'Asesoría legal bancaria.', 'Abogado. 3+ años corporativo.', 'Seguro premium, bonos.', 'Revisar contratos. Normativa.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Especialista Compliance', 'Legal', 'Completo', 'Híbrido', 'San Salvador', 1200, 1700, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Riesgos legales.', 'Derecho. 2+ años compliance.', 'Seguro, bonos.', 'Políticas. Capacitar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_holcim, 'Abogado Laboral', 'Legal', 'Completo', 'Presencial', 'San Miguel', 1100, 1600, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Procesos laborales.', 'Abogado. 2+ años laboral.', 'Seguro, bonos.', 'Procesos. Asesorar RRHH.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_selectos, 'Analista Contratos', 'Legal', 'Completo', 'Presencial', 'San Salvador', 800, 1150, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Revisión contratos.', 'Técnico derecho. Estudiante.', 'Vales, seguro.', 'Revisar. Seguimiento.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_sw, 'Abogado Ambiental', 'Legal', 'Completo', 'Presencial', 'San Salvador', 1000, 1450, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Cumplimiento ambiental.', 'Derecho. Legislación ambiental.', 'Seguro, bonos.', 'Permisos. Capacitar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Data Privacy Officer', 'Legal', 'Completo', 'Presencial', 'San Salvador', 1600, 2300, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Protección datos.', 'Derecho o TI. Certificación.', 'Seguro premium.', 'Políticas privacidad.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Asistente Legal', 'Legal', 'Completo', 'Presencial', 'Santa Ana', 600, 850, 'Básico', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Apoyo gestión documental.', 'Derecho 3er año.', 'Seguro, bonos.', 'Expedientes. Escritos.', 2, 'abierta');

-- ===== CATEGORÍA: Educación (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Instructor Inglés', 'Educación', 'Parcial', 'Remoto', 'San Salvador', 500, 700, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Cursos inglés empleados.', 'Inglés C1. Enseñanza.', 'Bonos, horario flexible.', 'Planificar clases.', 3, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Coordinador Capacitación', 'Educación', 'Completo', 'Presencial', 'San Salvador', 850, 1250, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'Plan capacitación anual.', 'Educación o RRHH. 2+ años.', 'Seguro, bonos.', 'Detectar necesidades. Cursos.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Diseñador Instruccional', 'Educación', 'Completo', 'Híbrido', 'San Salvador', 800, 1200, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Cursos e-learning.', 'Pedagogía. LMS.', 'Seguro, internet.', 'Contenidos. Videos.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_selectos, 'Instructor Técnico Retail', 'Educación', 'Completo', 'Presencial', 'Santa Ana', 600, 850, 'Básico', DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Capacitación ventas.', 'Experiencia retail. Facilitación.', 'Vales, bonos.', 'Capacitar. Evaluar.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_avianca, 'Entrenador Tripulantes', 'Educación', 'Completo', 'Presencial', 'San Salvador', 900, 1350, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Formación tripulantes.', 'Inglés avanzado. Aviación.', 'Pases aéreos.', 'Cursos. Evaluar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_holcim, 'Instructor Seguridad', 'Educación', 'Completo', 'Presencial', 'San Miguel', 750, 1100, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Capacitación seguridad industrial.', 'Seguridad. Certificación.', 'Seguro, bonos.', 'Cursos. Evaluar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Tutor Marketing Digital', 'Educación', 'Consultoría', 'Remoto', 'Santa Ana', 400, 650, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Talleres marketing.', 'Experiencia marketing.', 'Bonos, horario flexible.', 'Preparar material. Talleres.', 2, 'abierta');

-- ===== CATEGORÍA: Ingeniería (7 empleos) =====
INSERT INTO Empleo (id, idEmpresa, titulo, categoria, tipoContrato, modalidad, ubicacion, salarioMin, salarioMax, nivelExperiencia, fechaCierre, descripcion_puesto, requisitos, beneficios, funciones, vacantes, estado)
VALUES
(UUID_TO_BIN(UUID()), @id_pe_holcim, 'Ingeniero Procesos', 'Ingeniería', 'Completo', 'Presencial', 'San Miguel', 1400, 2000, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'Optimización producción.', 'Industrial o química. 3+ años.', 'Seguro premium.', 'Analizar procesos. Mejoras.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_roble, 'Ingeniero Civil Residente', 'Ingeniería', 'Completo', 'Presencial', 'Santa Ana', 1300, 1900, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Supervisión construcción.', 'Civil. 3+ años.', 'Seguro, auto.', 'Supervisar. Control avance.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_tigo, 'Ingeniero Redes', 'Ingeniería', 'Completo', 'Presencial', 'San Salvador', 1200, 1750, 'Intermedio', DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'Diseño redes telecom.', 'Eléctrica o telecom.', 'Seguro, bonos.', 'Configurar equipos.', 2, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_sw, 'Ingeniero Químico', 'Ingeniería', 'Completo', 'Presencial', 'San Salvador', 1300, 1850, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 55 DAY), 'Desarrollo pinturas.', 'Química. 3+ años I+D.', 'Seguro premium.', 'Formular. Pruebas.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_agricola, 'Ingeniero Seguridad Informática', 'Ingeniería', 'Completo', 'Presencial', 'San Salvador', 1500, 2200, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'Protección información.', 'CISSP. 5+ años.', 'Seguro premium.', 'Políticas. Incidentes.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_avianca, 'Ingeniero Aeronáutico', 'Ingeniería', 'Completo', 'Presencial', 'San Salvador', 1600, 2400, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Mantenimiento aeronaves.', 'Aeronáutica. DGAC.', 'Pases aéreos.', 'Supervisar. Diagnosticar.', 1, 'abierta'),
(UUID_TO_BIN(UUID()), @id_pe_telus, 'Ingeniero Datos', 'Ingeniería', 'Completo', 'Híbrido', 'San Salvador', 1400, 2000, 'Avanzado', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Pipelines datos.', 'Python, SQL, Spark. Inglés.', 'Seguro premium.', 'ETL. Optimizar BD.', 2, 'abierta');

-- ============================================================
-- 5. POSTULANTES (7 candidatos)
-- ============================================================

-- Postulante 1: Fredy Martínez
SET @id_u_fredy = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_fredy, @rol_postulante, 'Fredy Alexander', 'Martínez López', 'fredy.martinez@gmail.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_fredy = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_fredy, @id_u_fredy, '05892341-7', '1998-03-15', 'Col. Escalón, San Salvador', 'Ingeniero en Sistemas', 'Desarrollador Web', 2);

-- Postulante 2: María José Hernández
SET @id_u_maria = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_maria, @rol_postulante, 'María José', 'Hernández Ramos', 'mariajose.hernandez@outlook.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_maria = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_maria, @id_u_maria, '04781256-3', '2000-07-22', 'Metapán, Santa Ana', 'Licenciada en Contaduría', 'Contadora', 1);

-- Postulante 3: Carlos Portillo
SET @id_u_carlos = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_carlos, @rol_postulante, 'Carlos Eduardo', 'Portillo Vásquez', 'carlos.portillo@yahoo.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_carlos = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_carlos, @id_u_carlos, '03456789-1', '1995-11-08', 'Col. Miraflores, San Miguel', 'Bachiller en Comercio', 'Vendedor', 4);

-- Postulante 4: Ana Flores
SET @id_u_ana = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_ana, @rol_postulante, 'Ana Lucía', 'Flores Menjívar', 'ana.flores@gmail.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_ana = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_ana, @id_u_ana, '02345678-9', '1997-12-10', 'Santa Tecla', 'Diseñadora Gráfica', 'Diseñadora UI/UX', 3);

-- Postulante 5: José Rivera
SET @id_u_jose = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_jose, @rol_postulante, 'José Miguel', 'Rivera Gómez', 'jose.rivera@hotmail.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_jose = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_jose, @id_u_jose, '05678912-3', '1993-05-20', 'San Miguel', 'Ingeniero Industrial', 'Supervisor', 5);

-- Postulante 6: Karla Mejía
SET @id_u_karla = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_karla, @rol_postulante, 'Karla Patricia', 'Mejía Reyes', 'karla.mejia@gmail.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_karla = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_karla, @id_u_karla, '08912345-6', '1999-09-03', 'Santa Ana', 'Licenciada en Mercadeo', 'Marketing', 2);

-- Postulante 7: Roberto Zelaya
SET @id_u_roberto = UUID_TO_BIN(UUID());
INSERT INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, rol, estado)
VALUES (@id_u_roberto, @rol_postulante, 'Roberto Antonio', 'Zelaya Molina', 'roberto.zelaya@yahoo.com', '$2b$10$gXBu.9e.0uB3OZNr9i3e3.utZyRdu6/P5S6X4d1EwlRIfum.NwbPW', 'postulante', 'activo');
SET @id_pc_roberto = UUID_TO_BIN(UUID());
INSERT INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia)
VALUES (@id_pc_roberto, @id_u_roberto, '01234567-8', '1992-02-28', 'Soyapango', 'Ingeniero en Redes', 'Administrador Redes', 6);

-- ============================================================
-- 6. POSTULACIONES (muestras)
-- ============================================================
INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_fredy, e.id, 'pendiente'
FROM Empleo e WHERE e.titulo LIKE '%Desarrollador%' AND e.idEmpresa = @id_pe_telus LIMIT 1;

INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_fredy, e.id, 'revisando'
FROM Empleo e WHERE e.titulo LIKE '%Cajero%' AND e.idEmpresa = @id_pe_agricola LIMIT 1;

INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_maria, e.id, 'pendiente'
FROM Empleo e WHERE e.titulo LIKE '%Cajero%' AND e.idEmpresa = @id_pe_selectos LIMIT 1;

INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_carlos, e.id, 'aceptada'
FROM Empleo e WHERE e.titulo LIKE '%Asesor%' AND e.idEmpresa = @id_pe_claro LIMIT 1;

INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_ana, e.id, 'revisando'
FROM Empleo e WHERE e.titulo = 'Diseñador UI/UX' LIMIT 1;

INSERT INTO Postulacion (id, idCandidato, idEmpleo, estado)
SELECT UUID_TO_BIN(UUID()), @id_pc_karla, e.id, 'aceptada'
FROM Empleo e WHERE e.titulo = 'Especialista Marketing Digital' LIMIT 1;

-- ============================================================
-- 7. RECURSOS (BLOG) - 6 artículos
-- ============================================================
INSERT INTO Recurso (id, idUsuario, titulo, contenido, tipo, estado, fechaPublicacion)
VALUES
(UUID_TO_BIN(UUID()), @id_u_admin, '5 Consejos para destacar en tu entrevista laboral', 'La entrevista es tu oportunidad de brillar. Prepara respuestas concretas, investiga la empresa, viste apropiadamente, llega temprano y haz preguntas inteligentes.', 'Articulo', 'publicado', NOW()),
(UUID_TO_BIN(UUID()), @id_u_admin, 'Las profesiones mejor pagadas en El Salvador 2024', 'Tecnología, finanzas e ingeniería lideran los salarios más altos. Descubre qué carreras tienen mayor demanda en el país.', 'Articulo', 'publicado', NOW()),
(UUID_TO_BIN(UUID()), @id_u_admin, 'Cómo crear un currículum vitae efectivo', 'Tu CV es tu carta de presentación. Aprende a estructurarlo correctamente y cómo hacer que destaque ante los reclutadores.', 'Guia', 'publicado', NOW()),
(UUID_TO_BIN(UUID()), @id_u_admin, 'Trabajo remoto vs presencial: ventajas y desventajas', 'El trabajo remoto llegó para quedarse. Analizamos los pros y contras de cada modalidad.', 'Articulo', 'publicado', NOW()),
(UUID_TO_BIN(UUID()), @id_u_admin, 'Habilidades blandas más valoradas por las empresas', 'La comunicación, trabajo en equipo y liderazgo son habilidades clave. Descubre cómo desarrollarlas.', 'Articulo', 'publicado', NOW()),
(UUID_TO_BIN(UUID()), @id_u_admin, 'Networking: cómo conectar con reclutadores en LinkedIn', 'Aprende a optimizar tu perfil y conectar con reclutadores para aumentar tus oportunidades.', 'Articulo', 'publicado', NOW());

-- ============================================================
-- 8. PUBLICACIONES FORO (6 publicaciones)
-- ============================================================
INSERT INTO Publicacion_Foro (id, idUsuario, titulo, contenido, cantidadLikes)
VALUES
(UUID_TO_BIN(UUID()), @id_u_fredy, '¿Alguien ha trabajado en Telus?', 'Estoy considerando aplicar a Telus. ¿Cómo es el ambiente laboral?', 5),
(UUID_TO_BIN(UUID()), @id_u_maria, 'Tips para entrevista en Banco Agrícola', 'Tengo entrevista próxima semana. ¿Qué preguntas hacen?', 3),
(UUID_TO_BIN(UUID()), @id_u_carlos, '¿Vale la pena estudiar desarrollo web?', '¿Hay demanda en El Salvador? ¿Qué salarios?', 8),
(UUID_TO_BIN(UUID()), @id_u_ana, 'Buscando trabajo remoto', '¿Qué plataformas recomiendan para trabajo remoto?', 6),
(UUID_TO_BIN(UUID()), @id_u_karla, '¿Cómo preparar CV sin experiencia?', 'Soy recién graduado. ¿Qué pongo en mi CV?', 7),
(UUID_TO_BIN(UUID()), @id_u_roberto, 'Recomienden cursos de inglés', 'Necesito mejorar mi inglés B2. ¿Qué academia?', 9);

-- ============================================================
-- 9. COMENTARIOS FORO (6 comentarios)
-- ============================================================
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), @id_u_carlos, p.id, 'Yo trabajé 2 años en Telus. El ambiente es bueno, pagan puntual.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%Telus%' LIMIT 1
UNION ALL
SELECT UUID_TO_BIN(UUID()), @id_u_ana, p.id, 'En Banco Agrícola son estrictos con puntualidad. Prepárate.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%Banco%' LIMIT 1
UNION ALL
SELECT UUID_TO_BIN(UUID()), @id_u_jose, p.id, 'Definitivamente sí. Yo estudié por mi cuenta y conseguí trabajo.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%desarrollo web%' LIMIT 1
UNION ALL
SELECT UUID_TO_BIN(UUID()), @id_u_karla, p.id, 'Además de LinkedIn, prueba GetOnBoard y Torre.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%remoto%' LIMIT 1
UNION ALL
SELECT UUID_TO_BIN(UUID()), @id_u_fredy, p.id, 'Puedes poner proyectos universitarios y cursos.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%sin experiencia%' LIMIT 1
UNION ALL
SELECT UUID_TO_BIN(UUID()), @id_u_maria, p.id, 'Recomiendo el Centro Cultural Salvadoreño Americano.'
FROM Publicacion_Foro p WHERE p.titulo LIKE '%inglés%' LIMIT 1;

-- ============================================================
-- 10. VERIFICACIÓN FINAL
-- ============================================================
SELECT '=== DATOS INSERTADOS CORRECTAMENTE ===' AS Mensaje;
SELECT 'Empresas' AS tabla, COUNT(*) AS total FROM Perfil_Empresa
UNION ALL
SELECT 'Empleos activos', COUNT(*) FROM Empleo WHERE estado = 'abierta'
UNION ALL
SELECT 'Postulantes', COUNT(*) FROM Usuario WHERE rol = 'postulante'
UNION ALL
SELECT 'Postulaciones', COUNT(*) FROM Postulacion
UNION ALL
SELECT 'Recursos', COUNT(*) FROM Recurso
UNION ALL
SELECT 'Publicaciones Foro', COUNT(*) FROM Publicacion_Foro
UNION ALL
SELECT 'Comentarios Foro', COUNT(*) FROM Comentario_Foro;

-- ============================================================
-- 11. CREDENCIALES DE PRUEBA
-- ============================================================
SELECT '=== CREDENCIALES (password: 12345678) ===' AS Mensaje;
SELECT email AS Email, rol AS Rol FROM Usuario ORDER BY rol;




-- ============================================================
-- ACTUALIZAR PUBLICACIONES Y COMENTARIOS DEL FORO
-- Contenido único y diferente para cada uno
-- ============================================================
USE portal_trabajos;

-- ============================================================
-- 1. ACTUALIZAR PUBLICACIONES (6 publicaciones únicas)
-- ============================================================

-- Publicación 1: Experiencia en Telus
UPDATE Publicacion_Foro 
SET titulo = 'Experiencia trabajando en Telus International El Salvador',
    contenido = 'Hola a todos. Estoy pensando en aplicar a Telus como agente bilingüe para el proyecto de soporte técnico. He escuchado opiniones mixtas y quería preguntarles a quienes han trabajado ahí:

1. ¿Cómo es el ambiente laboral en general?
2. ¿Son flexibles con los horarios de estudio?
3. ¿Los bonos son alcanzables o solo para unos pocos?
4. ¿Qué tan estricto es el control de calidad?

Agradecería mucho sus respuestas. Saludos.',
    cantidadLikes = 12
WHERE titulo LIKE '%Telus%' LIMIT 1;

-- Publicación 2: Entrevista en Banco Agrícola
UPDATE Publicacion_Foro 
SET titulo = 'Proceso de selección en Banco Agrícola - Tips y experiencias',
    contenido = 'El próximo martes tengo entrevista para el puesto de Ejecutivo de Cuenta Empresarial en Banco Agrícola. Alguien que haya pasado por el proceso podría compartir:

- ¿Qué tipo de preguntas hacen en la primera entrevista?
- ¿Hay pruebas psicométricas o técnicas?
- ¿Cuánto tiempo tarda todo el proceso?
- ¿Qué valoran más: experiencia en ventas o conocimientos bancarios?

Cualquier tip es bienvenido. Muchas gracias.',
    cantidadLikes = 8
WHERE titulo LIKE '%Banco%' LIMIT 1;

-- Publicación 3: Estudiar desarrollo web
UPDATE Publicacion_Foro 
SET titulo = '¿Conviene estudiar desarrollo web en 2024? Salarios y demanda real',
    contenido = 'Estoy considerando dejar mi trabajo actual (asistente administrativo) para estudiar desarrollo web de forma intensiva. Tengo 28 años y me preocupa si ya es tarde para empezar.

Mis preguntas para los que ya están en el rubro:

1. ¿Hay suficiente demanda para juniors en El Salvador?
2. ¿Qué salario puedo esperar al empezar?
3. ¿Qué tecnología recomiendan aprender primero (JavaScript, Python, Java)?
4. ¿Las empresas contratan bootcamps o piden sí o sí título universitario?

Gracias de antemano por sus consejos.',
    cantidadLikes = 24
WHERE titulo LIKE '%desarrollo web%' LIMIT 1;

-- Publicación 4: Trabajo remoto desde El Salvador
UPDATE Publicacion_Foro 
SET titulo = 'Plataformas para encontrar trabajo remoto internacional desde El Salvador',
    contenido = 'Llevo 2 años como desarrollador Junior en una empresa local y quiero dar el salto al trabajo remoto para empresas extranjeras (US, Canadá, Europa).

He probado LinkedIn, pero siento que compito con mucha gente. Qué otras plataformas recomiendan?

Escuché de:
- GetOnBoard
- Torre
- WeWorkRemotely
- RemoteOK
- Arc.dev

Cuál ha sido su experiencia con estas? Cuál les ha dado mejores resultados? También acepto consejos para destacar en el proceso. Gracias!',
    cantidadLikes = 18
WHERE titulo LIKE '%remoto%' LIMIT 1;

-- Publicación 5: CV sin experiencia
UPDATE Publicacion_Foro 
SET titulo = 'Recién graduado: cómo armar el primer CV sin experiencia laboral',
    contenido = 'Hola. Me acabo de graduar de Licenciatura en Mercadeo y todas las ofertas piden 2-3 años de experiencia. Me siento frustrado porque no sé cómo llenar mi CV.

Qué puedo poner en la sección de experiencia si nunca he trabajado formalmente?

Tengo:
- Prácticas universitarias (3 meses)
- Voluntariado en una ONG
- Cursos de Google y HubSpot
- Manejo avanzado de Excel y Meta Ads

Cómo puedo presentar esto para que los reclutadores me tomen en cuenta? Agradezco sus consejos.',
    cantidadLikes = 31
WHERE titulo LIKE '%sin experiencia%' LIMIT 1;

-- Publicación 6: Cursos de inglés
UPDATE Publicacion_Foro 
SET titulo = 'Mejores opciones para aprender inglés en El Salvador (precio - calidad)',
    contenido = 'Necesito mejorar mi inglés de B1 a C1 para poder optar a mejores puestos (especialmente en Telus y Avianca). Estoy evaluando opciones:

1. Centro Cultural Salvadoreño Americano (CCSA) - Clásico pero caro
2. Instituto Técnico de Idiomas (ITI) - Más económico
3. Open English - Virtual pero dicen que es básico
4. Academia Europea - No conozco mucho
5. Autoaprendizaje (Duolingo + YouTube + tandem)

Alguien ha probado alguna de estas? Cuál recomiendan para llegar a nivel C1 en menos de 1 año? También me interesa si hay opciones gratuitas o con becas.',
    cantidadLikes = 42
WHERE titulo LIKE '%inglés%' LIMIT 1;

-- ============================================================
-- 2. LIMPIAR COMENTARIOS EXISTENTES
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Comentario_Foro;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 3. INSERTAR COMENTARIOS ÚNICOS PARA CADA PUBLICACIÓN
-- ============================================================

-- COMENTARIOS para publicación 1 (Telus)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Yo trabajé en Telus por 3 años en el proyecto de Apple. El ambiente es bueno, la paga es puntual y hay bonos mensuales de hasta $200. El contra: los turnos rotativos son pesados al principio, pero te acostumbras. Sí recomiendo la empresa si hablás inglés C1.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'carlos.portillo@yahoo.com' AND p.titulo LIKE '%Telus%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Mi hermana trabaja en Telus ahora mismo. Los bonos sí son alcanzables, solo necesitas cumplir las métricas básicas. Para horarios de estudio, puedes negociar turno fijo después de 3 meses. Eso sí, prepárate para hablar inglés todo el día.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'ana.flores@gmail.com' AND p.titulo LIKE '%Telus%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Telus fue mi primer trabajo. El training es pagado y te dan todas las herramientas. Lo que más me gustó es que hay oportunidad de crecer: empecé como agente y en 2 años me ascendieron a QA. Eso sí, tenés que demostrar resultados.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'karla.mejia@gmail.com' AND p.titulo LIKE '%Telus%' LIMIT 1;

-- COMENTARIOS para publicación 2 (Banco Agrícola)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Yo pasé por el proceso de Banco Agrícola hace 6 meses, quedé pero al final acepté otra oferta. En la primera entrevista te piden que hables de tu experiencia y por qué quieres trabajar ahí. Sí hay prueba psicométrica (como 100 preguntas de situaciones). El proceso duró 3 semanas en total.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'jose.rivera@hotmail.com' AND p.titulo LIKE '%Banco%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Trabajo actualmente en Banco Agrícola como ejecutivo de cuentas. Valoran muchísimo la experiencia en ventas, más que el conocimiento bancario. Si tienes cartera de clientes propia, eso es un gran plus. Prepárate para metas mensuales exigentes pero alcanzables.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'roberto.zelaya@yahoo.com' AND p.titulo LIKE '%Banco%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Mi consejo: investiga los productos del banco antes de la entrevista (préstamos, tarjetas, seguros). A mí me preguntaron cuál producto vendería primero y por qué. También lleva ejemplos concretos de metas que hayas cumplido en trabajos anteriores.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'mariajose.hernandez@outlook.com' AND p.titulo LIKE '%Banco%' LIMIT 1;

-- COMENTARIOS para publicación 3 (Desarrollo web)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Nunca es tarde. Yo empecé a los 30 años y hoy soy desarrollador senior en Tigo. El mercado para juniors está competitivo pero sí hay oportunidades. Te recomiendo empezar con JavaScript y luego React. El salario inicial ronda los $800-1000. Los bootcamps sirven si son buenos, pero el título no es obligatorio si tienes portafolio.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'fredy.martinez@gmail.com' AND p.titulo LIKE '%desarrollo web%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Trabajo en Telus como desarrollador. La empresa está contratando juniors para proyectos nuevos. Lo que más buscan es lógica de programación y ganas de aprender. El salario inicial es de $900 + bonos. Te recomiendo hacer cursos en freeCodeCamp y armar un GitHub con proyectos.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'carlos.portillo@yahoo.com' AND p.titulo LIKE '%desarrollo web%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Si quieres un camino más estructurado, te recomiendo el programa Generation El Salvador (gratuito) o el bootcamp de Kodigo. Ambos tienen buena salida laboral. Eso sí, prepárate para estudiar 6-8 horas diarias. Yo estudié Python y conseguí trabajo en 4 meses.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'ana.flores@gmail.com' AND p.titulo LIKE '%desarrollo web%' LIMIT 1;

-- COMENTARIOS para publicación 4 (Trabajo remoto)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'He usado GetOnBoard y Torre. GetOnBoard tiene buenas ofertas para Latinoamérica, pero mucha competencia. Torre es más amigable y puedes filtrar por "remote worldwide". Mi recomendación: arma un perfil en inglés, aunque no lo pidan, y aplica a por lo menos 10 trabajos al día.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'karla.mejia@gmail.com' AND p.titulo LIKE '%remoto%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Yo conseguí trabajo remoto por WeWorkRemotely. Es una plataforma más orientada a tecnología. Lo que me funcionó: personalizar cada aplicación, no enviar CV genérico. También meterme a Discord de tecnología donde comparten ofertas. Ahora gano en dólares y trabajo desde Santa Ana.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'jose.rivera@hotmail.com' AND p.titulo LIKE '%remoto%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'No olvides el networking. Unete a comunidades como "Desarrolladores El Salvador" en Facebook o "Tech Chat SV" en Telegram. Ahí comparten ofertas remotas. A mí me contrataron por una recomendación de un grupo de Discord.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'roberto.zelaya@yahoo.com' AND p.titulo LIKE '%remoto%' LIMIT 1;

-- COMENTARIOS para publicación 5 (CV sin experiencia)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Pon las prácticas como experiencia laboral, pero detalla logros concretos: "Diseñé campaña que aumentó engagement 15%". Los cursos y voluntariado también cuentan. Crea un portafolio digital (Canva o un sitio sencillo). Los reclutadores valoran que muestres iniciativa.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'fredy.martinez@gmail.com' AND p.titulo LIKE '%sin experiencia%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Yo también empecé sin experiencia. Lo que hice fue hacer proyectos personales: creé un blog, una landing page para un negocio ficticio, y los subí a GitHub. En la entrevista, hablé de esos proyectos como si fuera trabajo real. Conseguí empleo en 2 meses.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'mariajose.hernandez@outlook.com' AND p.titulo LIKE '%sin experiencia%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Escribe una carta de presentación explicando tu situación. Las empresas grandes tienen programas "trainee" o "junior" para recién graduados. Aplica a esos. Super Selectos, por ejemplo, tiene programa de desarrollo de talento joven.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'carlos.portillo@yahoo.com' AND p.titulo LIKE '%sin experiencia%' LIMIT 1;

-- COMENTARIOS para publicación 6 (Cursos de inglés)
INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Yo estudié en CCSA y saqué certificación hasta C1. Es caro pero vale la pena para trabajar en empresas bilingües. También complementé con Duolingo y viendo series en inglés sin subtítulos. Llegar a C1 en 1 año es posible si practicas 2 horas diarias.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'ana.flores@gmail.com' AND p.titulo LIKE '%inglés%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Recomiendo el ITI de la UES (muy económico pero hay lista de espera). Para autoaprendizaje: la app ELSA Speak para pronunciación, Cambly para conversación con nativos, y ver youtubers como "English with Lucy". En 8 meses pasé de B1 a C1.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'jose.rivera@hotmail.com' AND p.titulo LIKE '%inglés%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Si tu objetivo es trabajar en Telus o call centers bilingües, con B2 es suficiente. Pero si quieres trabajar para empresas extranjeras directamente, sí necesitas C1. Open English me sirvió para mejorar fluidez, pero no lo recomiendo como único recurso.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'karla.mejia@gmail.com' AND p.titulo LIKE '%inglés%' LIMIT 1;

INSERT INTO Comentario_Foro (id, idUsuario, idPublicacion, contenido)
SELECT UUID_TO_BIN(UUID()), u.id, p.id, 'Algo que me funcionó: unirme a servidores de Discord de intercambio de idiomas. Practicas gratis con nativos y ellos practican español. Además, Cambly tiene planes asequibles si pagas anual. Llegar a C1 requiere constancia, pero es posible sin gastar tanto.'
FROM Usuario u, Publicacion_Foro p
WHERE u.email = 'roberto.zelaya@yahoo.com' AND p.titulo LIKE '%inglés%' LIMIT 1;

-- ============================================================
-- 4. VERIFICACIÓN FINAL
-- ============================================================
SELECT '=== FORO ACTUALIZADO CORRECTAMENTE ===' AS Mensaje;

SELECT 'Publicaciones actualizadas:' AS Mensaje;
SELECT id, titulo, cantidadLikes FROM Publicacion_Foro;

SELECT 'Comentarios insertados:' AS Mensaje;
SELECT COUNT(*) AS total_comentarios FROM Comentario_Foro;

SELECT 'Distribución de comentarios por publicación:' AS Mensaje;
SELECT p.titulo, COUNT(c.id) AS comentarios
FROM Publicacion_Foro p
LEFT JOIN Comentario_Foro c ON p.id = c.idPublicacion
GROUP BY p.id;

-- ============================================================
-- ACTUALIZAR RECURSOS - QUITAR ETIQUETAS HTML
-- Convertir a texto plano con saltos de línea
-- ============================================================
USE portal_trabajos;

-- Actualizar Recurso 1: Consejos para entrevista
UPDATE Recurso 
SET contenido = 
'5 CONSEJOS PARA DESTACAR EN TU ENTREVISTA LABORAL EN EL SALVADOR

===========================================

La entrevista es tu oportunidad de brillar. En el competitivo mercado laboral salvadoreño, una entrevista puede marcar la diferencia entre conseguir el trabajo o seguir buscando. Aquí te comparto 5 consejos prácticos:


1. INVESTIGA LA EMPRESA A FONDO

Antes de tu entrevista en Banco Agrícola, Telus, Super Selectos o cualquier empresa, investiga su misión, visión, valores y noticias recientes. Los reclutadores salvadoreños valoran mucho que el candidato demuestre interés genuino.


2. PREPARA RESPUESTAS CON MÉTODO STAR

Situación, Tarea, Acción, Resultado. Esta técnica es muy valorada por empresas como Grupo Roble y Sherwin-Williams. Practica ejemplos concretos de logros en tus experiencias anteriores.


3. VISTE APROPIADAMENTE

En El Salvador, el código de vestimenta varía: para banca y finanzas (Banco Agrícola) se espera traje formal; para tecnología (Telus, Tigo) negocio casual es aceptable. Cuando tengas duda, viste más formal.


4. LLEGA TEMPRANO

En la cultura salvadoreña, la puntualidad es señal de respeto y responsabilidad. Llega 15 minutos antes. Si la entrevista es virtual (Zoom/Teams), prueba tu conexión con anticipación.


5. HAZ PREGUNTAS INTELIGENTES

Prepara 3-4 preguntas sobre el puesto, el equipo o los desafíos del rol. Demuestra que has pensado en cómo puedes aportar valor a la empresa.


BONUS: Envía un email de agradecimiento dentro de las 24 horas posteriores a la entrevista. Muchos candidatos no lo hacen, y esto te hará destacar.'

WHERE titulo LIKE '%Consejos para destacar%' LIMIT 1;

-- Actualizar Recurso 2: Profesiones mejor pagadas
UPDATE Recurso 
SET contenido = 
'LAS PROFESIONES MEJOR PAGADAS EN EL SALVADOR 2024

===========================================

¿Cuánto ganan los profesionales en El Salvador?

El mercado laboral salvadoreño ha evolucionado significativamente. Basado en datos de empleo real de empresas como Tigo, Banco Agrícola, Telus y Holcim, estos son los rangos salariales actuales:


TECNOLOGÍA (Sector con mayor crecimiento)
-----------------------------------------
• Desarrollador Full Stack Junior: $800 - $1,200
• Desarrollador Full Stack Senior: $1,800 - $2,500
• Ingeniero de Datos: $1,400 - $2,200
• Especialista en Ciberseguridad: $1,500 - $2,500
• DevOps Engineer: $1,300 - $2,000


FINANZAS Y BANCA
-----------------------------------------
• Analista de Riesgo: $1,100 - $1,600
• Ejecutivo de Cuentas: $900 - $1,800 (más comisiones)
• Controller Financiero: $2,000 - $3,000
• Auditor Interno: $1,200 - $1,700


INGENIERÍA
-----------------------------------------
• Ingeniero de Procesos: $1,400 - $2,000
• Ingeniero Civil Residente: $1,300 - $1,900
• Ingeniero de Redes: $1,200 - $1,750


BPO / CALL CENTER (Inglés)
-----------------------------------------
• Agente Bilingüe: $700 - $950
• QA Analyst: $750 - $1,000
• Team Leader: $1,000 - $1,400


NOTA: Estos salarios son aproximados y pueden variar según experiencia, ubicación y empresa. Empresas como Avianca ofrecen beneficios adicionales como pases aéreos.'

WHERE titulo LIKE '%profesiones mejor pagadas%' LIMIT 1;

-- Actualizar Recurso 3: Cómo crear un CV efectivo
UPDATE Recurso 
SET contenido = 
'CÓMO CREAR UN CURRÍCULUM VITAE EFECTIVO PARA EL MERCADO SALVADOREÑO

===========================================

Tu CV es tu carta de presentación. Un buen CV puede abrirte las puertas en empresas como Super Selectos, Claro, o Grupo Roble. Aquí te enseñamos a estructurarlo correctamente:


ESTRUCTURA RECOMENDADA (máximo 2 páginas)
-----------------------------------------

1. DATOS DE CONTACTO
   Nombre completo, teléfono, email, LinkedIn (importante), y ubicación (San Salvador, Santa Ana, San Miguel).

2. PERFIL PROFESIONAL
   3-4 líneas resumiendo quién eres y qué buscas. Ejemplo: "Ingeniero en Sistemas con 3 años de experiencia en desarrollo Java, buscando oportunidad en sector financiero".

3. EXPERIENCIA LABORAL
   Lista tus últimos 3-5 empleos en orden cronológico inverso. Usa verbos de acción (Desarrollé, Implementé, Lideré).

4. EDUCACIÓN
   Títulos, universidad, año de graduación. Si estás estudiando, indica porcentaje de avance.

5. HABILIDADES TÉCNICAS
   Herramientas, lenguajes, certificaciones (AWS, Scrum, Excel avanzado).

6. IDIOMAS
   ¡Crucial para Telus y Avianca! Especifica nivel (A1, B2, C1).


QUÉ HACER (✓)
-----------------------------------------
• Personaliza el CV para cada oferta (destaca habilidades relevantes)
• Incluye logros cuantificables ("Aumenté ventas 20%")
• Usa un diseño limpio y profesional
• Guarda como PDF con nombre profesional: "Carlos_Portillo_CV_2024.pdf"


QUÉ EVITAR (✗)
-----------------------------------------
• Fotos informales o no profesionales
• Errores ortográficos (revisa con Grammarly o Word)
• Información personal innecesaria (DUI, NIT, fecha nacimiento)
• Más de 2 páginas


EJEMPLO PARA POSTULANTE DE TELUS:
Destaca tu nivel de inglés, certificaciones y experiencia en servicio al cliente.'

WHERE titulo LIKE '%currículum vitae efectivo%' LIMIT 1;

-- Actualizar Recurso 4: Trabajo remoto vs presencial
UPDATE Recurso 
SET contenido = 
'TRABAJO REMOTO VS PRESENCIAL: ¿CUÁL ELEGIR EN EL SALVADOR?

===========================================

La nueva realidad laboral

Desde la pandemia, el mercado laboral salvadoreño se ha transformado. Empresas como Telus, Tigo y Grupo Roble ofrecen modalidades híbridas y remotas. Analizamos las ventajas y desventajas:


TRABAJO REMOTO (🏠)
-----------------------------------------

VENTAJAS:
• Ahorro en transporte y tiempo (hasta 2 horas diarias en San Salvador)
• Flexibilidad para vivir en cualquier zona del país (Santa Ana, San Miguel, La Libertad)
• Mayor conciliación familiar
• Empresas como Telus y Grupo Roble ofrecen internet pagado como beneficio

DESVENTAJAS:
• Aislamiento social (menor contacto con compañeros)
• Dificultad para separar trabajo/casa
• Requiere autodisciplina


TRABAJO PRESENCIAL (🏢)
-----------------------------------------

VENTAJAS:
• Mayor interacción social y trabajo en equipo
• Más fácil para aprender de colegas
• Ideal para roles operativos (cajeros, técnicos, personal de tienda)

DESVENTAJAS:
• Gastos de transporte y tiempo de desplazamiento
• Menos flexibilidad horaria


MODALIDAD HÍBRIDA (🔄)
-----------------------------------------
La preferida por empresas como Tigo. Combina lo mejor de ambos mundos: 2-3 días presenciales y el resto remoto. Permite interacción social manteniendo flexibilidad.

CONSEJO: Antes de postular, evalúa qué modalidad se adapta mejor a tu estilo de vida y necesidades.'

WHERE titulo LIKE '%Trabajo remoto vs presencial%' LIMIT 1;

-- Actualizar Recurso 5: Habilidades blandas
UPDATE Recurso 
SET contenido = 
'HABILIDADES BLANDAS MÁS VALORADAS POR EMPRESAS EN EL SALVADOR

===========================================

No todo es técnica: las soft skills que marcan la diferencia

Empresas como Banco Agrícola, Super Selectos y Claro buscan candidatos que no solo tengan conocimiento técnico, sino también habilidades interpersonales. Estas son las más valoradas:


1. COMUNICACIÓN EFECTIVA (🗣️)
   Saber expresar ideas claramente, escuchar activamente y adaptar el mensaje según la audiencia. Crucial en roles de atención al cliente, ventas y liderazgo.

2. TRABAJO EN EQUIPO (🤝)
   La capacidad de colaborar, dar y recibir retroalimentación, y contribuir a metas comunes. Empresas como Grupo Roble valoran mucho el compañerismo.

3. RESOLUCIÓN DE PROBLEMAS (🧩)
   Analizar situaciones complejas, identificar causas raíz y proponer soluciones efectivas. Esencial en tecnología, ingeniería y operaciones.

4. ADAPTABILIDAD (🔄)
   El mercado cambia rápido. Quienes aprenden nuevas herramientas y se ajustan a procesos distintos tienen más oportunidades. Telus y Tigo valoran esto enormemente.

5. LIDERAZGO (👑)
   No solo para gerentes: liderazgo es influir positivamente, tomar iniciativa y motivar al equipo. Ideal para aspiraciones de crecimiento.

6. INTELIGENCIA EMOCIONAL (💖)
   Manejar el estrés, empatizar con clientes/compañeros y mantener calma bajo presión. Banco Agrícola valora esto en cajeros y ejecutivos.


CÓMO DESARROLLARLAS:
Voluntariados, cursos online (Coursera, LinkedIn Learning), práctica diaria y buscar retroalimentación.'

WHERE titulo LIKE '%Habilidades blandas%' LIMIT 1;

-- Actualizar Recurso 6: Networking en LinkedIn
UPDATE Recurso 
SET contenido = 
'NETWORKING: CÓMO CONECTAR CON RECLUTADORES EN LINKEDIN

===========================================

LinkedIn es tu mejor aliado para encontrar trabajo en El Salvador

Más del 80% de reclutadores en empresas como Avianca, Sherwin-Williams y Holcim usan LinkedIn para buscar candidatos. Aquí te enseñamos a optimizar tu perfil:


1. FOTO PROFESIONAL (📸)
   Usa una foto reciente, sonriente, con fondo neutro. La primera impresión cuenta.

2. TÍTULO ATRACTIVO (📝)
   No pongas solo "Desempleado". Ejemplo: "Ingeniero en Sistemas | Buscando oportunidad en Desarrollo Web | Disponible inmediatamente".

3. RESUMEN (ACERCA DE) (📖)
   Cuenta tu historia profesional: qué haces, qué buscas, qué valor aportas. Incluye palabras clave como "bilingüe", "Java", "marketing digital".

4. CONECTA ESTRATÉGICAMENTE (🔗)
   No agregues a cualquiera. Prioriza: reclutadores de empresas que te interesan, empleados de tu industria, excompañeros. Siempre escribe un mensaje personalizado.

5. EJEMPLO DE MENSAJE PARA CONECTAR (💬)
   "Hola [nombre], vi que trabajas en RRHH de Banco Agrícola. Estoy interesado en oportunidades como Analista de Datos. ¿Podríamos conectar? Me encantaría conocer más sobre la cultura de la empresa. Gracias."

6. MANTENTE ACTIVO (🎯)
   Comparte artículos relevantes, comenta publicaciones de reclutadores, felicita a contactos por nuevos logros. La visibilidad aumenta tus oportunidades.


BONUS: Activa la opción "Open to Work" (buscando trabajo) para que reclutadores te encuentren más fácilmente.'

WHERE titulo LIKE '%Networking%' LIMIT 1;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT '=== RECURSOS ACTUALIZADOS CORRECTAMENTE ===' AS Mensaje;
SELECT id, titulo, LEFT(contenido, 100) AS preview FROM Recurso;


-- ============================================================
-- ACTUALIZAR EMPLEOS CON DESCRIPCIONES ENRIQUECIDAS
-- Descripción del puesto, requisitos y funciones más detalladas
-- ============================================================
USE portal_trabajos;

-- ============================================================
-- CATEGORÍA: Tecnología (10 empleos)
-- ============================================================

-- 1. Desarrollador Full Stack Java - Tigo
UPDATE Empleo 
SET descripcion_puesto = 
'Buscamos un Desarrollador Full Stack apasionado por la tecnología para unirse al equipo de innovación digital de Tigo El Salvador. Serás responsable del desarrollo y mantenimiento de aplicaciones web críticas para la gestión de clientes y servicios de telecomunicaciones. Trabajarás en un ambiente ágil con metodologías Scrum, colaborando con equipos multidisciplinarios para entregar soluciones de alta calidad que impactan a millones de salvadoreños.

Lo que ofrecemos:
- Proyectos desafiantes con tecnologías de vanguardia
- Oportunidad de crecimiento profesional y certificaciones
- Ambiente colaborativo con mentores senior
- Beneficios competitivos y flexibilidad horaria',
requisitos = 
'Requisitos indispensables:
• Título universitario en Ingeniería en Sistemas, Informática o carreras afines (graduado o estudiante último año)
• Mínimo 2 años de experiencia comprobable en desarrollo con Java y Spring Boot
• Experiencia con frameworks frontend modernos (Angular o React)
• Conocimientos sólidos en bases de datos relacionales (MySQL, PostgreSQL)
• Manejo de control de versiones Git (GitFlow)
• Inglés técnico - nivel intermedio (capacidad de leer documentación técnica)

Deseable:
• Conocimientos en arquitectura de microservicios
• Experiencia con Docker y Kubernetes
• Certificación en Java (OCP) o Spring Professional',
funciones = 
'Funciones principales:
• Diseñar, desarrollar e implementar aplicaciones web full stack utilizando Java, Spring Boot y Angular/React
• Crear y mantener APIs RESTful para integración con sistemas internos y externos
• Participar activamente en ceremonias ágiles (daily, planning, retrospective, sprint review)
• Realizar code reviews constructivos y asegurar la calidad del código
• Identificar y corregir bugs, así como optimizar el rendimiento de las aplicaciones
• Documentar el código y los procesos técnicos para el equipo
• Colaborar con el equipo de QA para asegurar la calidad del software
• Investigar e implementar nuevas tecnologías que mejoren el desarrollo'
WHERE titulo = 'Desarrollador Full Stack Java' LIMIT 1;

-- 2. Especialista en Ciberseguridad - Telus
UPDATE Empleo 
SET descripcion_puesto = 
'En Telus International protegemos la información de clientes globales. Buscamos un Especialista en Ciberseguridad apasionado por la seguridad ofensiva y defensiva. Serás responsable de identificar vulnerabilidades, implementar controles de seguridad y responder a incidentes en una infraestructura que soporta operaciones 24/7 para clientes Fortune 500.

Trabajarás con tecnologías de última generación en un ambiente de aprendizaje continuo con certificaciones pagadas. Ideal para profesionales que desean crecer en el mundo de la ciberseguridad mientras protegen datos sensibles a escala internacional.',
requisitos = 
'Requisitos indispensables:
• Certificación en Ciberseguridad (CompTIA Security+, CEH, CISSP o equivalente)
• Mínimo 3 años de experiencia en análisis de vulnerabilidades o monitoreo de seguridad
• Conocimientos sólidos en firewalls (Palo Alto, Fortinet), SIEM (Splunk, QRadar)
• Inglés avanzado (C1) - entrevista técnica en inglés
• Experiencia con herramientas de pentesting (Metasploit, Burp Suite, Nmap)

Deseable:
• Certificación OSCP u OSWP
• Conocimiento en frameworks de compliance (ISO 27001, NIST, PCI-DSS)
• Experiencia en entornos cloud (AWS, Azure)',
funciones = 
'Funciones principales:
• Monitorear proactivamente la infraestructura en busca de amenazas de seguridad
• Realizar pruebas de penetración y evaluaciones de vulnerabilidad en aplicaciones y redes
• Implementar y mantener políticas de seguridad (firewall, acceso, cifrado)
• Investigar y responder a incidentes de seguridad, realizando análisis forense cuando sea necesario
• Participar en auditorías internas y externas de seguridad
• Capacitar al personal en buenas prácticas de seguridad
• Mantener actualizada la documentación de procedimientos de seguridad
• Evaluar nuevas herramientas y tecnologías de seguridad'
WHERE titulo = 'Especialista en Ciberseguridad' LIMIT 1;

-- 3. Analista de Datos - Banco Agrícola
UPDATE Empleo 
SET descripcion_puesto = 
'Banco Agrícola, líder financiero de El Salvador, busca un Analista de Datos apasionado por convertir datos en insights estratégicos. Te unirás al área de Inteligencia de Negocio, donde trabajarás con grandes volúmenes de información de clientes, transacciones y productos financieros.

Tu análisis será clave para la toma de decisiones en marketing, riesgo crediticio y desarrollo de productos. Tendrás la oportunidad de influir directamente en la estrategia del banco, identificando oportunidades de negocio y optimizando procesos internos.',
requisitos = 
'Requisitos indispensables:
• Título universitario en Ingeniería, Estadística, Matemáticas, Economía o afines
• Mínimo 1 año de experiencia en análisis de datos (puede ser prácticas)
• Dominio de SQL para extracción y manipulación de datos
• Experiencia con Python (pandas, numpy) o R
• Conocimientos en herramientas de visualización (Power BI o Tableau)
• Inglés intermedio para lectura de documentación técnica

Deseable:
• Conocimiento en ETL (Informatica, Talend o SSIS)
• Experiencia en sector financiero o bancario
• Certificación en Power BI o Tableau',
funciones = 
'Funciones principales:
• Extraer, limpiar y transformar datos desde múltiples fuentes (SQL, APIs, archivos planos)
• Desarrollar dashboards interactivos para áreas de negocio (riesgo, marketing, finanzas)
• Identificar patrones y tendencias en el comportamiento de clientes
• Realizar análisis de segmentación de clientes para campañas específicas
• Generar reportes ejecutivos con insights accionables
• Colaborar con el equipo de Data Science para modelos predictivos
• Documentar procesos y metodologías de análisis
• Asegurar la calidad y consistencia de los datos utilizados'
WHERE titulo = 'Analista de Datos' LIMIT 1;

-- 4. DevOps Engineer - Grupo Roble
UPDATE Empleo 
SET descripcion_puesto = 
'Grupo Roble busca un DevOps Engineer para revolucionar nuestra infraestructura digital. Serás responsable de diseñar, implementar y mantener la plataforma cloud que soporta nuestros proyectos inmobiliarios en Centroamérica.

Trabajarás en un entorno 100% remoto con un equipo de alto rendimiento, automatizando despliegues, optimizando costos cloud y mejorando la confiabilidad de nuestros sistemas. Ideal para profesionales que aman la automatización y las mejores prácticas de ingeniería de software.',
requisitos = 
'Requisitos indispensables:
• Experiencia comprobable con proveedores cloud (AWS certificación deseable)
• Dominio de contenedores (Docker) y orquestación (Kubernetes)
• Experiencia en CI/CD (Jenkins, GitLab CI o GitHub Actions)
• Conocimientos en Infrastructure as Code (Terraform o CloudFormation)
• Manejo de Linux y scripting (Bash, Python)
• Inglés técnico para documentación y troubleshooting

Deseable:
• Certificación CKA (Certified Kubernetes Administrator)
• Experiencia con monitoreo (Prometheus, Grafana, Datadog)
• Conocimiento en herramientas de logging (ELK Stack)',
funciones = 
'Funciones principales:
• Diseñar, implementar y mantener pipelines CI/CD automatizados
• Administrar infraestructura cloud (AWS) usando Terraform
• Monitorear el rendimiento y disponibilidad de los sistemas (99.9% uptime)
• Automatizar tareas de despliegue, backup y recovery
• Colaborar con equipos de desarrollo para optimizar aplicaciones para cloud
• Implementar políticas de seguridad y compliance en la infraestructura
• Gestionar la escalabilidad automática de recursos según demanda
• Documentar arquitecturas, procedimientos y troubleshooting guides'
WHERE titulo = 'DevOps Engineer' LIMIT 1;

-- 5. Soporte Técnico IT - Sherwin-Williams
UPDATE Empleo 
SET descripcion_puesto = 
'Sherwin-Williams busca un Técnico de Soporte IT para brindar asistencia a todos los colaboradores a nivel nacional. Serás el primer punto de contacto para incidentes técnicos, asegurando que los equipos funcionen correctamente en todas nuestras sucursales.

Ideal para profesionales con habilidades de servicio al cliente y conocimientos técnicos sólidos. Tendrás la oportunidad de crecer en el área de infraestructura y redes mientras resuelves problemas reales en una empresa global.',
requisitos = 
'Requisitos indispensables:
• Bachillerato técnico en informática o estudiante universitario de sistemas
• Conocimientos en sistemas operativos Windows (instalación, configuración, troubleshooting)
• Experiencia con suite Microsoft Office 365 (gestión de usuarios, correo, SharePoint)
• Conocimientos básicos de redes (TCP/IP, DNS, DHCP)
• Buena comunicación y orientación al servicio al cliente

Deseable:
• Certificación CompTIA A+ o Microsoft Fundamentals
• Experiencia en soporte remoto y presencial
• Conocimiento en gestión de inventario de hardware',
funciones = 
'Funciones principales:
• Atender tickets de soporte técnico de usuarios (presencial y remoto)
• Instalar, configurar y mantener equipos de cómputo y periféricos
• Gestionar el inventario de hardware y software en sucursales
• Resolver problemas de conectividad y acceso a recursos de red
• Configurar cuentas de usuario en Active Directory
• Realizar mantenimiento preventivo de equipos
• Capacitar a usuarios en el uso de herramientas corporativas
• Escalar incidentes complejos al equipo de infraestructura'
WHERE titulo = 'Soporte Técnico IT' LIMIT 1;

-- 6. Desarrollador Mobile - Avianca
UPDATE Empleo 
SET descripcion_puesto = 
'Avianca, la aerolínea más importante de Centroamérica, busca un Desarrollador Mobile apasionado por crear experiencias excepcionales para nuestros pasajeros. Serás responsable de la app móvil que usan miles de viajeros para comprar boletos, hacer check-in y gestionar sus viajes.

Trabajarás en un ambiente dinámico con equipos internacionales, implementando funcionalidades innovadoras que mejoren la experiencia de viaje. Si te apasiona el desarrollo mobile y quieres que tu trabajo sea usado por millones de personas, esta es tu oportunidad.',
requisitos = 
'Requisitos indispensables:
• Experiencia comprobable en desarrollo nativo iOS (Swift) o Android (Kotlin)
• Conocimientos en consumo de APIs REST y manejo de JSON
• Manejo de Git y control de versiones
• Inglés intermedio para comunicación con equipos internacionales
• Capacidad de trabajar en equipo y metodologías ágiles

Deseable:
• Experiencia con ambos plataformas (iOS y Android)
• Conocimiento en CI/CD para mobile (Fastlane, Bitrise)
• Publicaciones en App Store o Play Store
• Conocimientos en arquitectura MVVM y testing unitario',
funciones = 
'Funciones principales:
• Desarrollar nuevas funcionalidades para la app de pasajeros (compra de boletos, check-in, gestión de vuelos)
• Optimizar el rendimiento y consumo de recursos de la app
• Corregir bugs y mejorar la estabilidad de la aplicación
• Colaborar con diseñadores UX/UI para implementar interfaces atractivas
• Realizar pruebas unitarias y de integración
• Mantener documentación técnica actualizada
• Participar en el proceso de publicación en App Store y Play Store
• Investigar nuevas tecnologías y frameworks para mejorar el desarrollo'
WHERE titulo = 'Desarrollador Mobile' LIMIT 1;

-- 7. Administrador de Base de Datos - Super Selectos
UPDATE Empleo 
SET descripcion_puesto = 
'Super Selectos, la cadena de supermercados #1 de El Salvador, busca un Administrador de Base de Datos (DBA) para gestionar la información crítica que soporta nuestras 100+ tiendas a nivel nacional. Serás responsable de garantizar la disponibilidad, integridad y rendimiento de los datos que alimentan nuestros sistemas de inventario, ventas, facturación y logística.

Trabajarás con equipos de desarrollo, infraestructura y negocio para optimizar el ecosistema de datos. Ideal para profesionales con experiencia en alta disponibilidad y grandes volúmenes de información.',
requisitos = 
'Requisitos indispensables:
• Certificación en SQL Server (MCSA, MCSE) u Oracle (OCP)
• Mínimo 3 años de experiencia como DBA en entornos corporativos
• Conocimientos sólidos en backup, recovery, replicación y clustering
• Experiencia en tuning de queries y optimización de índices
• Dominio de T-SQL o PL/SQL avanzado
• Conocimientos en Windows Server o Linux

Deseable:
• Experiencia en migraciones de base de datos
• Conocimiento en bases de datos NoSQL (MongoDB, Redis)
• Certificación en cloud (Azure SQL, AWS RDS)',
funciones = 
'Funciones principales:
• Administrar y monitorear el rendimiento de bases de datos productivas
• Optimizar queries lentos y mejorar el performance general
• Implementar y mantener estrategias de backup y disaster recovery
• Gestionar alta disponibilidad (AlwaysOn, Log Shipping, Replication)
• Asegurar la integridad y consistencia de los datos
• Colaborar con desarrolladores en diseño de esquemas y consultas eficientes
• Implementar políticas de seguridad (permisos, encriptación, auditoría)
• Automatizar tareas rutinarias con scripts (PowerShell, Python)'
WHERE titulo = 'Administrador de Base de Datos' LIMIT 1;

-- 8. Ingeniero de Automatización - Holcim
UPDATE Empleo 
SET descripcion_puesto = 
'Holcim El Salvador, líder en materiales de construcción, busca un Ingeniero de Automatización para optimizar nuestra planta cementera en San Miguel. Serás responsable de modernizar sistemas de control, implementar mejoras de eficiencia y reducir costos operativos mediante la automatización de procesos industriales.

Trabajarás con tecnologías de clase mundial en un ambiente desafiante que combina operaciones 24/7 con proyectos de mejora continua. Ideal para ingenieros apasionados por la automatización y la industria 4.0.',
requisitos = 
'Requisitos indispensables:
• Título en Ingeniería Eléctrica, Electrónica, Mecatrónica o afín
• Mínimo 2 años de experiencia en automatización industrial
• Conocimientos sólidos en programación de PLC (Siemens, Allen Bradley, Schneider)
• Experiencia con sistemas SCADA (WinCC, FactoryTalk, Citect)
• Conocimientos en instrumentación industrial (sensores, transmisores, actuadores)
• Disponibilidad para trabajo presencial en planta

Deseable:
• Conocimientos en robótica y visión artificial
• Experiencia en sistemas MES o ERP
• Certificación en seguridad funcional (SIL, PL)',
funciones = 
'Funciones principales:
• Programar y mantener PLCs para control de procesos productivos
• Desarrollar y mantener interfaces SCADA para monitoreo de planta
• Diagnosticar y solucionar fallas en sistemas automatizados
• Proponer e implementar mejoras para aumentar eficiencia y reducir paradas
• Colaborar con mantenimiento en planes predictivos y preventivos
• Capacitar a operadores y técnicos en nuevos sistemas
• Documentar programas, configuraciones y procedimientos
• Participar en proyectos de expansión y modernización de planta'
WHERE titulo = 'Ingeniero de Automatización' LIMIT 1;

-- 9. Arquitecto de Soluciones Cloud - Claro
UPDATE Empleo 
SET descripcion_puesto = 
'Claro El Salvador busca un Arquitecto de Soluciones Cloud con visión estratégica para liderar nuestra transformación digital. Serás el responsable de diseñar la arquitectura cloud que soportará nuestros servicios de telecomunicaciones, migrando aplicaciones legacy a la nube y optimizando costos.

Trabajarás con tecnologías de vanguardia definiendo estándares, mejores prácticas y gobernanza cloud para toda la organización. Ideal para profesionales con experiencia en arquitecturas empresariales a gran escala.',
requisitos = 
'Requisitos indispensables:
• Certificación AWS Solutions Architect (Associate o Professional)
• Mínimo 5 años de experiencia en infraestructura cloud y arquitectura de soluciones
• Experiencia en migraciones de on-premise a cloud (lift & shift, re-platforming, re-architecting)
• Conocimientos en microservicios, serverless (Lambda, API Gateway), containers (ECS, EKS)
• Inglés avanzado para documentación y comunicación con equipos globales

Deseable:
• Certificaciones adicionales (Azure Solutions Architect, GCP)
• Experiencia en FinOps y optimización de costos cloud
• Conocimiento en DevOps y metodologías ágiles',
funciones = 
'Funciones principales:
• Diseñar arquitecturas cloud escalables, resilientes y seguras para servicios de telecomunicaciones
• Liderar proyectos de migración de aplicaciones legacy a la nube
• Definir estándares, políticas y gobernanza cloud para la organización
• Optimizar costos cloud implementando right-sizing, savings plans y spot instances
• Colaborar con equipos de desarrollo para modernizar aplicaciones usando cloud-native
• Realizar assessments de cargas de trabajo y recomendar mejores prácticas
• Implementar estrategias de disaster recovery y alta disponibilidad
• Mantener documentación de arquitecturas y decisiones técnicas'
WHERE titulo = 'Arquitecto de Soluciones Cloud' LIMIT 1;

-- 10. QA Automation Engineer - Telus
UPDATE Empleo 
SET descripcion_puesto = 
'Telus International busca un QA Automation Engineer apasionado por la calidad de software. Serás responsable de diseñar y ejecutar pruebas automatizadas para aplicaciones de clientes internacionales, garantizando que nuestros productos cumplan los más altos estándares antes de llegar a producción.

Trabajarás en un ambiente multicultural con equipos en múltiples países, utilizando frameworks modernos y prácticas de testing continuo. Ideal para profesionales con ojo para el detalle y pasión por la calidad.',
requisitos = 
'Requisitos indispensables:
• Experiencia comprobable en automatización de pruebas (Selenium, Cypress, Playwright)
• Conocimientos en lenguajes de programación (Java, Python o JavaScript)
• Experiencia con herramientas de API testing (Postman, REST Assured, SoapUI)
• Conocimientos en metodologías ágiles y pruebas continuas
• Inglés intermedio (B2) para comunicación con equipos internacionales

Deseable:
• Certificación ISTQB Foundation Level
• Experiencia con CI/CD integración de pruebas (Jenkins, GitHub Actions)
• Conocimiento en pruebas de rendimiento (JMeter, K6)
• Experiencia en BDD (Cucumber, SpecFlow)',
funciones = 
'Funciones principales:
• Diseñar, desarrollar y mantener suites de pruebas automatizadas (UI, API, integración)
• Ejecutar pruebas de regresión en cada ciclo de release
• Documentar y reportar bugs con pasos claros para reproducción
• Colaborar con desarrolladores en la resolución de defectos
• Participar en revisión de requerimientos y criterios de aceptación
• Mantener la infraestructura de pruebas actualizada
• Investigar e implementar nuevas herramientas y frameworks de testing
• Contribuir a la mejora continua de procesos de calidad'
WHERE titulo = 'QA Automation Engineer' LIMIT 1;

-- ============================================================
-- Continuaré con el resto de categorías en el siguiente mensaje
-- debido a la longitud. Ejecuta este bloque primero.
-- ============================================================

SELECT 'Tecnología actualizada (10 empleos)' AS Mensaje;

-- ============================================================
-- CATEGORÍA: MARKETING (10 empleos actualizados)
-- ============================================================

-- 1. Especialista en Marketing Digital - Tigo El Salvador
UPDATE Empleo 
SET descripcion_puesto = 
'Tigo El Salvador busca un Especialista en Marketing Digital apasionado por las tendencias digitales y la analítica. Serás responsable de planificar, ejecutar y optimizar campañas digitales para promover nuestros productos de telecomunicaciones (internet, televisión, telefonía móvil) a nivel nacional.

Trabajarás con presupuestos significativos en plataformas como Google Ads y Meta Ads, midiendo y mejorando continuamente el ROI. Ideal para profesionales con mentalidad analítica y creativa que quieran impactar en la estrategia digital de una empresa líder en El Salvador.

Lo que ofrecemos:
• Presupuesto competitivo para campañas
• Acceso a herramientas premium (SEMrush, HubSpot, Google Analytics 4)
• Certificaciones patrocinadas (Google, Meta, HubSpot)
• Ambiente dinámico con equipo multidisciplinario',
requisitos = 
'Requisitos indispensables:
• Licenciatura en Mercadeo, Comunicaciones, Publicidad o carreras afines
• Mínimo 2 años de experiencia gestionando campañas digitales
• Dominio de Google Ads (Search, Display, Video) y Meta Ads Manager
• Conocimientos en SEO/SEM, medición de KPIs y ROI
• Experiencia con Google Analytics 4 y Tag Manager
• Capacidad analítica para interpretar datos y optimizar campañas

Deseable:
• Certificaciones Google Ads o Meta Blueprint
• Conocimiento en herramientas de automatización de marketing (HubSpot, Mailchimp)
• Experiencia en sector telecomunicaciones o retail
• Inglés intermedio para documentación técnica',
funciones = 
'Funciones principales:
• Planificar, ejecutar y optimizar campañas digitales en Google Ads y Meta Ads
• Definir estrategias de segmentación de audiencias basadas en datos
• Monitorear KPIs diarios (CTR, CPC, CPA, ROAS, conversiones)
• Realizar A/B testing de creatividades, copys y segmentaciones
• Analizar el rendimiento de campañas y proponer mejoras continuas
• Gestionar el presupuesto asignado para maximizar el ROI
• Generar reportes ejecutivos con insights accionables
• Mantenerse actualizado sobre tendencias y nuevas features de plataformas'
WHERE titulo = 'Especialista en Marketing Digital' LIMIT 1;

-- 2. Community Manager - Super Selectos
UPDATE Empleo 
SET descripcion_puesto = 
'Super Selectos, la cadena de supermercados #1 de El Salvador, busca un Community Manager apasionado por las redes sociales y la conexión con clientes. Serás la voz de nuestra marca en plataformas como Facebook, Instagram, TikTok y LinkedIn, gestionando la comunidad y creando contenido relevante que genere engagement y fidelización.

Trabajarás con un equipo creativo desarrollando estrategias de contenido que reflejen nuestra cercanía con los salvadoreños. Ideal para profesionales con creatividad, empatía y conocimiento de tendencias digitales.

Lo que ofrecemos:
• Productos gratis para degustación y promociones
• Ambiente creativo y dinámico
• Oportunidad de crecimiento en el área de comunicaciones
• Colaboración con marcas reconocidas',
requisitos = 
'Requisitos indispensables:
• Bachillerato completo con experiencia demostrable en gestión de redes sociales
• Creatividad excepcional y habilidad para redactar copy atractivo
• Conocimiento en herramientas de diseño (Canva, Adobe Spark, Photoshop básico)
• Experiencia en programación de posts (Meta Business Suite, Hootsuite, Later)
• Capacidad para identificar tendencias y adaptarlas a la marca
• Excelente redacción y ortografía

Deseable:
• Conocimiento en edición de video básica (Reels, TikTok, Shorts)
• Experiencia en community management para marcas de retail o consumo masivo
• Habilidad básica de fotografía para contenido de productos
• Conocimiento en métricas de redes sociales',
funciones = 
'Funciones principales:
• Crear calendario editorial mensual alineado a estrategia de marca
• Desarrollar contenido atractivo (posts, stories, reels) para Facebook, Instagram y TikTok
• Responder comentarios y mensajes de clientes con empatía y rapidez
• Monitorear menciones de marca y gestionar crisis en redes sociales
• Colaborar con el equipo de diseño para crear piezas gráficas
• Analizar métricas (alcance, engagement, crecimiento) y reportar resultados
• Interactuar con seguidores para construir comunidad fiel
• Mantenerse actualizado sobre tendencias y features de cada plataforma'
WHERE titulo = 'Community Manager' LIMIT 1;

-- 3. Analista de Mercadeo - Banco Agrícola
UPDATE Empleo 
SET descripcion_puesto = 
'Banco Agrícola, líder financiero en El Salvador, busca un Analista de Mercadeo con habilidades analíticas y estratégicas. Serás responsable de investigar el mercado, analizar la competencia y generar insights que guíen el lanzamiento de nuevos productos financieros (tarjetas de crédito, préstamos, seguros, cuentas de ahorro).

Trabajarás con datos de clientes, estudios de mercado y herramientas de inteligencia de negocios para recomendar estrategias que aumenten la participación de mercado. Ideal para profesionales con curiosidad analítica y pasión por entender al consumidor.

Lo que ofrecemos:
• Bonificación anual por desempeño
• Acceso a estudios de mercado de agencias internacionales
• Ambiente profesional con oportunidades de crecimiento
• Beneficios bancarios exclusivos para colaboradores',
requisitos = 
'Requisitos indispensables:
• Título universitario en Mercadeo, Administración de Empresas, Economía o afines
• Mínimo 2 años de experiencia en investigación de mercados o análisis comercial
• Dominio de herramientas de análisis estadístico (SPSS, Excel avanzado, Power BI)
• Capacidad para interpretar datos y convertirlos en insights accionables
• Conocimiento en metodologías de investigación (encuestas, focus groups, entrevistas)

Deseable:
• Experiencia en sector financiero o bancario
• Conocimiento en herramientas de CRM y segmentación de clientes
• Inglés intermedio para lectura de reportes internacionales
• Maestría o especialización en mercadeo estratégico',
funciones = 
'Funciones principales:
• Realizar estudios de mercado para identificar oportunidades de negocio
• Analizar estrategias de competencia (precios, promociones, posicionamiento)
• Segmentar clientes por comportamiento, perfil y necesidades
• Evaluar el desempeño de campañas y productos lanzados
• Proponer estrategias de posicionamiento para nuevos productos financieros
• Coordinar focus groups y entrevistas con clientes
• Elaborar reportes ejecutivos con recomendaciones para la gerencia
• Mantener base de datos de inteligencia competitiva actualizada'
WHERE titulo = 'Analista de Mercadeo' LIMIT 1;

-- 4. Coordinador de Branding - Sherwin-Williams
UPDATE Empleo 
SET descripcion_puesto = 
'Sherwin-Williams busca un Coordinador de Branding apasionado por la construcción de marcas. Serás responsable de desarrollar, implementar y monitorear la estrategia de marca a nivel nacional, asegurando consistencia en todos los puntos de contacto con el cliente (tiendas, redes sociales, publicidad, empaques).

Trabajarás con agencias creativas y equipos internos para posicionar nuestra marca como líder en el mercado de pinturas. Ideal para profesionales con visión estratégica y sensibilidad para la comunicación visual.

Lo que ofrecemos:
• Productos gratis para proyectos personales
• Bonos por cumplimiento de objetivos de marca
• Oportunidad de trabajar con agencias internacionales
• Ambiente colaborativo y creativo',
requisitos = 
'Requisitos indispensables:
• Licenciatura en Diseño Gráfico, Publicidad, Comunicaciones o afines
• Portafolio que demuestre experiencia en branding o manejo de marca
• Mínimo 3 años de experiencia en posiciones de branding o publicidad
• Conocimiento en desarrollo de manuales de marca y lineamientos visuales
• Dominio de Adobe Creative Suite (Illustrator, Photoshop, InDesign)
• Capacidad de gestión de proveedores (agencias, imprentas)

Deseable:
• Experiencia en industria de retail o consumo masivo
• Conocimiento en investigación de percepción de marca
• Inglés intermedio para comunicación con casa matriz
• Maestría en marketing o branding',
funciones = 
'Funciones principales:
• Desarrollar y actualizar manual de identidad de marca (colores, tipografías, usos)
• Asegurar consistencia de marca en todos los materiales (digitales e impresos)
• Coordinar campañas publicitarias con agencias creativas
• Gestionar la producción de materiales promocionales y POP
• Monitorear la percepción de marca a través de estudios cualitativos
• Capacitar a equipos internos en uso correcto de la marca
• Evaluar sponsorship y alianzas de marca
• Reportar indicadores de salud de marca (awareness, consideración, preferencia)'
WHERE titulo = 'Coordinador de Branding' LIMIT 1;

-- 5. Email Marketing Specialist - Grupo Roble
UPDATE Empleo 
SET descripcion_puesto = 
'Grupo Roble busca un Email Marketing Specialist para gestionar y optimizar nuestras campañas de email marketing. Serás responsable de diseñar estrategias de captación, nurturing y conversión para promover nuestros proyectos inmobiliarios residenciales y comerciales.

Trabajarás 100% remoto con plataformas líderes de marketing automation, segmentando audiencias y midiendo el rendimiento de cada campaña. Ideal para profesionales con habilidades analíticas y creatividad en copywriting.

Lo que ofrecemos:
• Horario flexible y trabajo 100% remoto
• Internet pagado como beneficio
• Bonos por metas de conversión alcanzadas
• Formación continua en marketing digital',
requisitos = 
'Requisitos indispensables:
• Experiencia comprobable en plataformas de email marketing (Mailchimp, HubSpot, Klaviyo, ActiveCampaign)
• Habilidades de copywriting para escribir asuntos y contenido persuasivo
• Conocimiento en segmentación de bases de datos y personalización
• Capacidad para analizar métricas (open rate, CTR, conversión, bounce rate)
• Experiencia en A/B testing de emails

Deseable:
• Conocimiento en HTML/CSS básico para diseño de emails
• Experiencia en automatización de flujos (bienvenida, abandono, post-venta)
• Certificación en HubSpot o Mailchimp
• Experiencia en sector inmobiliario o bienes raíces',
funciones = 
'Funciones principales:
• Diseñar y ejecutar campañas de email marketing para leads y clientes
• Segmentar bases de datos por comportamiento, intereses y etapa del funnel
• Crear flujos de automatización (bienvenida, nurturing, reactivación)
• Escribir copy atractivo para asuntos, preheaders y contenido
• Realizar A/B testing de asuntos, horarios y contenido
• Monitorear métricas clave y optimizar continuamente
• Mantener la base de datos limpia (validar emails, gestionar bounce)
• Colaborar con diseño para crear templates atractivos y responsive'
WHERE titulo = 'Email Marketing Specialist' LIMIT 1;

-- 6. Social Media Strategist - Avianca
UPDATE Empleo 
SET descripcion_puesto = 
'Avianca busca un Social Media Strategist con visión estratégica para liderar nuestra presencia en redes sociales. Serás responsable de desarrollar la estrategia de contenido, engagement y crecimiento en plataformas como Instagram, TikTok, Facebook, LinkedIn y X (Twitter), conectando emocionalmente con viajeros en toda Latinoamérica.

Trabajarás en un ambiente multicultural con equipos en múltiples países, desarrollando campañas virales que inspiren a volar. Ideal para profesionales creativos con pasión por las tendencias digitales y la estrategia.

Lo que ofrecemos:
• Pases aéreos para empleado y familia
• Seguro de viaje internacional
• Oportunidad de trabajar con influencers y celebridades
• Ambiente creativo con estándares globales',
requisitos = 
'Requisitos indispensables:
• Experiencia comprobable en estrategia de redes sociales para marcas (preferiblemente de consumo o turismo)
• Conocimiento profundo de Meta Business Suite, TikTok Ads Manager
• Capacidad para identificar tendencias y convertirlas en oportunidades
• Inglés intermedio para colaboración con equipos internacionales
• Excelentes habilidades de comunicación y storytelling

Deseable:
• Experiencia en industria aérea, turismo o viajes
• Conocimiento en herramientas de escucha social (Brand24, Talkwalker)
• Certificación Meta Blueprint o TikTok Marketing
• Portafolio de campañas exitosas',
funciones = 
'Funciones principales:
• Desarrollar estrategia de contenido para redes sociales alineada a objetivos de negocio
• Planificar calendario editorial mensual con temas relevantes para viajeros
• Identificar tendencias y oportunidades de contenido viral
• Colaborar con creadores de contenido e influencers
• Coordinar con equipos de CRM y marketing para campañas integradas
• Analizar métricas de cada plataforma y ajustar estrategia
• Monitorear conversaciones de marca y gestionar crisis
• Reportar KPIs a gerencia con insights estratégicos'
WHERE titulo = 'Social Media Strategist' LIMIT 1;

-- 7. Growth Marketing Analyst - Telus International
UPDATE Empleo 
SET descripcion_puesto = 
'Telus International busca un Growth Marketing Analyst apasionado por el análisis de datos y la experimentación. Serás responsable de impulsar el crecimiento de clientes internacionales mediante experimentos A/B, optimización de embudos y análisis profundo de comportamiento de usuarios.

Trabajarás con herramientas de analytics y CRM, colaborando con equipos de producto y marketing para identificar palancas de crecimiento. Ideal para profesionales con mentalidad científica y obsesión por la mejora continua.

Lo que ofrecemos:
• Bonos trimestrales por logros de crecimiento
• Seguro de gastos médicos mayores
• Certificaciones en Growth Marketing pagadas
• Ambiente multicultural con equipos en Norteamérica, Europa y Asia',
requisitos = 
'Requisitos indispensables:
• Inglés avanzado (C1) - entrevista en inglés
• Experiencia en Google Analytics, Mixpanel, Amplitude o herramientas similares
• Conocimiento en CRM y herramientas de automatización (HubSpot, Salesforce)
• SQL básico para extracción de datos
• Experiencia en experimentación A/B y testing de hipótesis

Deseable:
• Conocimiento en SEO/SEM para optimización de canales
• Experiencia en growth hacking y estrategias de adquisición
• Certificación en Growth Marketing (CXL, Reforge)
• Conocimiento en Python o R para análisis avanzado',
funciones = 
'Funciones principales:
• Analizar el comportamiento de usuarios en toda la experiencia digital
• Identificar cuellos de botella en embudos de conversión
• Diseñar y ejecutar experimentos A/B para optimizar tasas de conversión
• Proponer estrategias para mejorar retención y lifetime value
• Segmentar usuarios por comportamiento para campañas personalizadas
• Crear dashboards de seguimiento de KPIs de crecimiento
• Analizar canales de adquisición y recomendar asignación de presupuesto
• Colaborar con producto para priorizar features de alto impacto'
WHERE titulo = 'Growth Marketing Analyst' LIMIT 1;

-- 8. Content Creator B2B - Holcim El Salvador
UPDATE Empleo 
SET descripcion_puesto = 
'Holcim El Salvador busca un Content Creator especializado en contenido B2B (arquitectos, ingenieros, constructores). Serás responsable de crear contenido técnico y educativo que posicione nuestra marca como referente en materiales de construcción.

Trabajarás con expertos técnicos para crear blogs, whitepapers, case studies, infografías y videos que eduquen a profesionales del sector. Ideal para redactores con conocimiento en construcción o capacidad de traducir temas técnicos a contenido atractivo.

Lo que ofrecemos:
• Seguro médico para empleado y familia directa
• Bonos por leads generados a través de contenido
• Oportunidad de asistir a ferias y eventos del sector
• Trabajo híbrido con flexibilidad',
requisitos = 
'Requisitos indispensables:
• Portafolio de contenido B2B o técnico (blogs, whitepapers, case studies)
• Excelente redacción y capacidad de síntesis
• Conocimiento básico de WordPress para gestión de contenidos
• Capacidad para entrevistar a expertos técnicos y traducir a lenguaje sencillo
• Habilidad para adaptar contenido a diferentes formatos (blog, whitepaper, infografía)

Deseable:
• Conocimiento en construcción, arquitectura o ingeniería
• Experiencia en marketing de contenidos para industria manufacturera
• Habilidades básicas de SEO para optimizar contenido
• Conocimiento en herramientas de diseño (Canva, Illustrator)',
funciones = 
'Funciones principales:
• Investigar y escribir artículos técnicos sobre construcción y materiales
• Desarrollar whitepapers y ebooks sobre tendencias del sector
• Crear case studies mostrando proyectos exitosos con productos Holcim
• Generar contenido para LinkedIn orientado a profesionales B2B
• Colaborar con el equipo técnico para validar información
• Optimizar contenido para SEO (palabras clave, meta descripciones)
• Mantener el blog corporativo actualizado con contenido de valor
• Medir el rendimiento del contenido (visitas, leads, tiempo en página)'
WHERE titulo = 'Content Creator B2B' LIMIT 1;

-- 9. Product Marketing Manager - Claro El Salvador
UPDATE Empleo 
SET descripcion_puesto = 
'Claro El Salvador busca un Product Marketing Manager con visión estratégica para liderar el lanzamiento y posicionamiento de nuevos productos de telecomunicaciones (5G, fibra óptica, servicios digitales). Serás el puente entre producto, ventas y marketing, asegurando que nuestros productos lleguen al mercado con mensajes claros y diferenciados.

Trabajarás en un ambiente dinámico con equipos de producto, precios, comunicaciones y ventas. Ideal para profesionales con experiencia en marketing de productos y pasión por la tecnología.

Lo que ofrecemos:
• Auto del año para ejecutivos
• Seguro de gastos médicos premium
• Bonos anuales por desempeño
• Oportunidad de crecimiento a posiciones regionales',
requisitos = 
'Requisitos indispensables:
• Mínimo 5 años de experiencia en marketing de productos (preferiblemente tecnología o telecomunicaciones)
• Experiencia en lanzamientos de productos end-to-end
• Capacidad para desarrollar estrategias de go-to-market y posicionamiento
• Inglés avanzado para comunicación con casa matriz
• Excelentes habilidades de presentación y storytelling

Deseable:
• MBA o maestría en marketing
• Experiencia en análisis de mercados y competencia
• Conocimiento en investigación de usuarios y diseño centrado en cliente
• Certificación en Product Marketing (PMA)',
funciones = 
'Funciones principales:
• Definir estrategia de go-to-market para nuevos productos
• Desarrollar mensajes clave y propuesta de valor diferenciada
• Investigar competencia y posicionamiento en el mercado
• Colaborar con producto en definición de features y hoja de ruta
• Capacitar al equipo de ventas en los nuevos productos
• Crear materiales de venta (pitch decks, fichas técnicas, FAQs)
• Monitorear el desempeño de productos post-lanzamiento
• Recopilar feedback de clientes para iterar la propuesta de valor'
WHERE titulo = 'Product Marketing Manager' LIMIT 1;

-- 10. Trade Marketing Analyst - Super Selectos
UPDATE Empleo 
SET descripcion_puesto = 
'Super Selectos busca un Trade Marketing Analyst para ejecutar estrategias en puntos de venta que maximicen las ventas. Serás responsable de coordinar promociones, optimizar la exhibición de productos y analizar el sell-out en nuestras 100+ tiendas a nivel nacional.

Trabajarás de la mano con equipos de ventas, proveedores y visual merchandising para asegurar que nuestros clientes encuentren productos atractivos y bien posicionados. Ideal para profesionales con experiencia en retail y pasión por la ejecución en tienda.

Lo que ofrecemos:
• Vales de despensa y bonos por cumplimiento
• Seguro médico para empleado
• Oportunidad de crecer a posiciones de category management
• Productos gratis para pruebas y degustaciones',
requisitos = 
'Requisitos indispensables:
• Experiencia mínima de 2 años en trade marketing o ejecución en retail
• Conocimiento en visual merchandising y disposición de productos en tienda
• Capacidad analítica para evaluar sell-out e indicadores de performance
• Excelentes habilidades de negociación y comunicación
• Disponibilidad para visitar tiendas a nivel nacional

Deseable:
• Conocimiento en herramientas de análisis de datos (Power BI)
• Experiencia en manejo de presupuesto de trade marketing
• Relaciones establecidas con proveedores de materiales POP
• Carrera en mercadeo, administración o afines',
funciones = 
'Funciones principales:
• Coordinar la ejecución de promociones y activaciones en puntos de venta
• Analizar sell-out por tienda, categoría y promoción
• Optimizar la disposición de productos en anaqueles (planogramas)
• Negociar espacios y materiales POP con proveedores
• Capacitar a personal de tienda en técnicas de exhibición
• Realizar visitas a tiendas para verificar ejecución
• Evaluar el ROI de activaciones y promociones
• Colaborar con marketing en el diseño de materiales para punto de venta'
WHERE titulo = 'Trade Marketing Analyst' LIMIT 1;


-- ============================================================
-- CATEGORÍA: SALUD (7 empleos actualizados)
-- ============================================================

-- 1. Enfermero/a de Planta - Holcim El Salvador
UPDATE Empleo 
SET descripcion_puesto = 
'Holcim El Salvador busca un Enfermero/a de Planta para brindar atención médica de primeros auxilios y respuesta a emergencias en nuestra planta cementera en San Miguel. Serás el profesional de salud responsable de atender a más de 300 colaboradores en turnos rotativos, gestionando consultas médicas menores, emergencias y coordinando con hospitales para casos que requieran mayor complejidad.

Trabajarás en un entorno industrial con riesgos específicos, donde la rapidez y asertividad en la atención pueden marcar la diferencia. Ideal para profesionales con experiencia en emergencias industriales y habilidades de gestión.

Lo que ofrecemos:
• Seguro médico privado para empleado y familia
• Bonos por cumplimiento de indicadores de salud ocupacional
• Comedor subsidiado en planta
• Oportunidad de certificación en primeros auxilios avanzados',
requisitos = 
'Requisitos indispensables:
• Título de Enfermería (Licenciatura o Técnico Universitario)
• Registro profesional activo en Junta de Vigilancia
• Mínimo 1 año de experiencia en enfermería ocupacional o servicios de emergencia
• Conocimiento en primeros auxilios, RCP y manejo de emergencias
• Disponibilidad para trabajar en turnos rotativos (incluyendo noche, fines de semana)

Deseable:
• Curso de Soporte Vital Básico (BLS) o Avanzado (ALS)
• Experiencia en industria manufacturera o construcción
• Conocimiento en administración de botiquines y gestión de insumos médicos
• Excelentes habilidades de comunicación para capacitaciones',
funciones = 
'Funciones principales:
• Atender consultas médicas de colaboradores en servicio médico de planta
• Brindar primeros auxilios en caso de emergencias o accidentes laborales
• Coordinar traslados a centros asistenciales cuando sea necesario
• Mantener actualizado el botiquín y equipo de emergencia
• Realizar seguimiento a casos de ausentismo por enfermedad
• Participar en capacitaciones de primeros auxilios para colaboradores
• Llevar registro estadístico de atenciones y reportar a medicina ocupacional
• Apoyar en campañas de vacunación y programas de salud preventiva'
WHERE titulo = 'Enfermero Planta' LIMIT 1;

-- 2. Médico Ocupacional - Banco Agrícola
UPDATE Empleo 
SET descripcion_puesto = 
'Banco Agrícola busca un Médico Ocupacional para gestionar la salud de nuestros colaboradores en oficinas centrales y sucursales a nivel nacional. Serás responsable de los exámenes ocupacionales (pre-ingreso, periódicos, post-incapacidad y retiro), vigilancia de ausentismo y promoción de hábitos saludables.

Trabajarás en un entorno corporativo promoviendo el bienestar integral de más de 3,000 empleados, diseñando programas preventivos y asegurando el cumplimiento de normativa de salud ocupacional. Ideal para médicos apasionados por la medicina preventiva y la atención integral.

Lo que ofrecemos:
• Seguro médico premium para empleado y familia directa
• Bonificación anual por desempeño
• Comedor ejecutivo en oficinas centrales
• Oportunidad de especialización en salud ocupacional patrocinada',
requisitos = 
'Requisitos indispensables:
• Título de Doctor en Medicina (MD), con especialidad en Salud Ocupacional o Medicina del Trabajo
• Registro profesional activo en Junta de Vigilancia
• Mínimo 2 años de experiencia en salud ocupacional o medicina corporativa
• Conocimiento en normativa de salud ocupacional (Código de Trabajo, leyes aplicables)
• Habilidad para interpretar exámenes clínicos y de laboratorio

Deseable:
• Curso de ergonomía básica y riesgos psicosociales
• Experiencia en sector bancario o financiero
• Conocimiento en programas de bienestar y prevención de enfermedades crónicas
• Capacidad para desarrollar políticas y procedimientos de salud',
funciones = 
'Funciones principales:
• Realizar exámenes ocupacionales (pre-empleo, periódicos, post-incapacidad)
• Vigilar indicadores de ausentismo por enfermedad y proponer acciones preventivas
• Evaluar casos de incapacidad y recomendar reubicación laboral si es necesario
• Diseñar e implementar programas de promoción de salud (vacunación, prevención)
• Asesorar al área de RRHH en políticas de salud y bienestar
• Coordinar con EPS y seguro médico la atención de colaboradores
• Capacitar a colaboradores en temas de salud preventiva
• Mantener estadísticas médicas y reportes para la gerencia'
WHERE titulo = 'Médico Ocupacional' LIMIT 1;

-- 3. Coordinador de Bienestar y Salud Mental - Telus International
UPDATE Empleo 
SET descripcion_puesto = 
'Telus International busca un Coordinador de Bienestar y Salud Mental para diseñar e implementar programas que promuevan el bienestar emocional de nuestros más de 2,000 colaboradores en El Salvador. Serás responsable de gestionar iniciativas de salud mental, manejo de estrés, trabajo en casa saludable y prevención de burnout en un entorno BPO de alta exigencia.

Trabajarás en un ambiente dinámico con equipos multidisciplinarios, desarrollando intervenciones basadas en evidencia y midiendo su impacto en el clima laboral. Ideal para psicólogos con experiencia en salud ocupacional y programas de bienestar.

Lo que ofrecemos:
• Seguro médico privado
• Bonos por alcanzar metas de bienestar
• Horario flexible con modalidad híbrida
• Certificaciones en salud mental y bienestar corporativo',
requisitos = 
'Requisitos indispensables:
• Título de Psicólogo (Licenciatura o Maestría en Psicología Clínica o Organizacional)
• Registro profesional activo (si aplica en El Salvador)
• Mínimo 2 años de experiencia en programas de bienestar o salud mental corporativa
• Conocimiento en manejo de estrés, ansiedad, burnout y resiliencia
• Excelentes habilidades de comunicación y liderazgo de equipos

Deseable:
• Especialización en Psicología Ocupacional o Salud Mental
• Certificación en Primeros Auxilios Psicológicos (PAP)
• Experiencia en sector BPO, call center o ambientes de alta presión
• Conocimiento en programas Employee Assistance Program (EAP)',
funciones = 
'Funciones principales:
• Diseñar e implementar programas de bienestar emocional y salud mental
• Realizar talleres de manejo de estrés, resiliencia, inteligencia emocional
• Coordinar atención psicológica para colaboradores (sesiones breves, referencias)
• Implementar estrategias de prevención de burnout y desgaste laboral
• Realizar campañas de concientización sobre salud mental
• Medir clima laboral y factores psicosociales periódicamente
• Capacitar a líderes en detección temprana de problemas de salud mental
• Gestionar red de especialistas externos para referencias'
WHERE titulo = 'Coordinador Bienestar' LIMIT 1;

-- 4. Especialista en Seguridad y Salud Ocupacional - Grupo Roble
UPDATE Empleo 
SET descripcion_puesto = 
'Grupo Roble busca un Especialista en Seguridad y Salud Ocupacional (SST) para implementar y mantener el Sistema de Gestión de SST en nuestros proyectos de construcción en Santa Ana y todo El Salvador. Serás responsable de inspeccionar obras, investigar incidentes, capacitar al personal y asegurar el cumplimiento de normativa de seguridad en trabajos de construcción de alto riesgo.

Trabajarás en terreno, visitando obras en diferentes etapas de construcción, identificando peligros y proponiendo controles efectivos. Ideal para técnicos o ingenieros apasionados por la prevención de accidentes en construcción.

Lo que ofrecemos:
• Seguro médico para empleado y familia
• Bonos por cumplimiento de metas de seguridad (cero accidentes)
• Equipo de protección personal completo
• Oportunidad de certificación en seguridad en construcción',
requisitos = 
'Requisitos indispensables:
• Técnico Universitario o Ingeniería en SST, Ingeniería Industrial o carreras afines
• Mínimo 2 años de experiencia en seguridad en construcción
• Conocimiento en normativa de SST aplicable a construcción en El Salvador
• Capacidad para realizar inspecciones técnicas y análisis de riesgos
• Disponibilidad para visitar obras en diferentes ubicaciones del país

Deseable:
• Certificación en Seguridad en Construcción (OSHA, NEBOSH)
• Experiencia en manejo de trabajo en alturas, excavaciones, equipos pesados
• Conocimiento en investigación de accidentes (metodología árbol de causas)
• Licencia de conducir vigente y vehículo propio',
funciones = 
'Funciones principales:
• Inspeccionar obras de construcción para identificar condiciones inseguras
• Investigar accidentes e incidentes, determinando causas raíz
• Proponer medidas correctivas y preventivas según hallazgos
• Capacitar a trabajadores y supervisores en prácticas seguras
• Asegurar el uso correcto de equipo de protección personal (EPP)
• Elaborar y mantener actualizados planes de emergencia por obra
• Realizar análisis de riesgo por puesto de trabajo (ARPT)
• Reportar indicadores de seguridad a la gerencia de proyectos'
WHERE titulo = 'Especialista SST' LIMIT 1;

-- 5. Nutricionista - Super Selectos
UPDATE Empleo 
SET descripcion_puesto = 
'Super Selectos busca una Nutricionista para promover hábitos alimenticios saludables entre nuestros colaboradores y clientes. Serás responsable de diseñar menús saludables para comedores corporativos, asesorar a colaboradores interesados en mejorar su alimentación, y apoyar en campañas de bienestar para clientes en nuestras tiendas.

Trabajarás en un entorno de retail dinámico, colaborando con el área de bienestar y responsabilidad social. Ideal para nutricionistas con pasión por la educación alimentaria y la promoción de salud en entornos corporativos y comunitarios.

Lo que ofrecemos:
• Vales de despensa mensuales
• Seguro médico privado
• Productos de la marca con descuento especial
• Oportunidad de desarrollar programas de alimentación saludable',
requisitos = 
'Requisitos indispensables:
• Título universitario en Nutrición y Dietética
• Registro profesional activo en Junta de Vigilancia
• Mínimo 1 año de experiencia en nutrición clínica o comunitaria
• Conocimiento en valoración nutricional y planificación de menús
• Habilidad para educar y comunicar conceptos nutricionales de forma sencilla

Deseable:
• Especialización en nutrición deportiva o nutrición en el trabajo
• Experiencia en diseño de programas de bienestar corporativo
• Conocimiento en manejo de software nutricional
• Capacidad para desarrollar material educativo (recetarios, guías)',
funciones = 
'Funciones principales:
• Asesorar a colaboradores en consulta nutricional individualizada
• Diseñar menús saludables para comedores corporativos
• Realizar charlas educativas sobre alimentación saludable
• Colaborar en campañas de bienestar para clientes en tiendas
• Desarrollar material educativo (recetarios, guías, infografías)
• Evaluar el estado nutricional de colaboradores interesados
• Apoyar en programas de control de peso y manejo de enfermedades crónicas
• Mantener estadísticas de atención y reportar a bienestar'
WHERE titulo = 'Nutricionista' LIMIT 1;

-- 6. Fisioterapeuta - Tigo El Salvador
UPDATE Empleo 
SET descripcion_puesto = 
'Tigo El Salvador busca un Fisioterapeuta para prevenir y tratar lesiones musculoesqueléticas relacionadas con el trabajo, especialmente en personal administrativo que pasa largas horas frente a computadoras y colaboradores de campo técnico. Serás responsable de atender a colaboradores con lesiones, diseñar programas de ergonomía y promover pausas activas en oficinas.

Trabajarás en un entorno corporativo moderno, implementando estrategias para reducir lesiones por esfuerzo repetitivo y mejorar la calidad de vida laboral. Ideal para fisioterapeutas con experiencia en ergonomía laboral y terapia manual.

Lo que ofrecemos:
• Seguro médico privado
• Bonos por reducción de ausentismo por lesiones
• Horario flexible
• Oportunidad de crecimiento a posiciones de bienestar',
requisitos = 
'Requisitos indispensables:
• Título universitario en Fisioterapia o Terapia Física
• Registro profesional activo en Junta de Vigilancia
• Mínimo 2 años de experiencia en fisioterapia clínica o laboral
• Conocimiento en ergonomía laboral y evaluación de puestos de trabajo
• Habilidad para realizar evaluaciones musculoesqueléticas completas

Deseable:
• Especialización en ergonomía o terapia manual
• Experiencia en diseño de programas de pausas activas
• Conocimiento en manejo de lesiones por esfuerzo repetitivo
• Certificación en primeros auxilios o RCP',
funciones = 
'Funciones principales:
• Evaluar y tratar a colaboradores con lesiones musculoesqueléticas
• Realizar análisis ergonómico de puestos administrativos y técnicos
• Implementar programas de pausas activas en oficinas y campo
• Capacitar a colaboradores en posturas correctas y prevención de lesiones
• Recomendar ajustes ergonómicos de mobiliario y equipos
• Dar seguimiento a la evolución de lesiones y retorno al trabajo
• Mantener registro de atenciones y lesiones por área
• Participar en campañas de prevención de riesgos musculoesqueléticos'
WHERE titulo = 'Fisioterapeuta' LIMIT 1;

-- 7. Asistente de Enfermería - Avianca
UPDATE Empleo 
SET descripcion_puesto = 
'Avianca busca un Asistente de Enfermería para apoyar en nuestro consultorio médico aéreo, atendiendo a tripulantes (pilotos, sobrecargos) y personal de tierra. Serás responsable de asistir en consultas médicas, administrar medicamentos básicos, mantener el orden del consultorio y apoyar en emergencias médicas antes de vuelos.

Trabajarás en el aeropuerto internacional, en un ambiente dinámico con horarios rotativos según operaciones aéreas. Ideal para auxiliares de enfermería con vocación de servicio y capacidad de trabajar bajo presión en entornos de aviación.

Lo que ofrecemos:
• Pases aéreos para empleado y familia directa
• Seguro de viaje internacional
• Horario rotativo con días compensatorios
• Oportunidad de capacitación en medicina aeronáutica',
requisitos = 
'Requisitos indispensables:
• Certificado de Auxiliar de Enfermería o Técnico en Enfermería
• Registro profesional activo (si aplica en El Salvador)
• Mínimo 6 meses de experiencia en consultorio médico o clínica
• Conocimiento en administración de medicamentos básicos y RCP
• Disponibilidad para trabajar en horarios rotativos (incluyendo fines de semana)

Deseable:
• Curso de Soporte Vital Básico (BLS) vigente
• Experiencia en atención a viajeros o ambientes aeroportuarios
• Conocimiento en manejo de estrés y emergencias médicas
• Inglés básico para atención a tripulantes extranjeros',
funciones = 
'Funciones principales:
• Apoyar al médico ocupacional en consultas de tripulantes y personal de tierra
• Administrar medicamentos básicos según indicación médica
• Mantener el orden, limpieza y abastecimiento del consultorio
• Realizar toma de signos vitales y registros clínicos
• Atender emergencias médicas básicas antes de vuelos
• Coordinar traslados a centros médicos cuando sea necesario
• Apoyar en campañas de vacunación para tripulantes
• Mantener inventario de insumos médicos y medicamentos'
WHERE titulo = 'Asistente Enfermería' LIMIT 1;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT 'Categoría SALUD actualizada (7 empleos)' AS Mensaje;
SELECT titulo, LEFT(descripcion_puesto, 80) AS preview 
FROM Empleo 
WHERE categoria = 'Salud';