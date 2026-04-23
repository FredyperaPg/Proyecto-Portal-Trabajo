# 🚀 Portal de Empleos — Instrucciones de Inicio

## ✅ Requisitos
- Node.js 18+ 
- MySQL 8+
- npm

## 📦 Instalación (una sola vez)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos
# Abre MySQL Workbench y ejecuta en orden:
#   → BD_Script.sql          (crea tablas y roles)
#   → BD_Datos_ElSalvador.sql (datos reales de El Salvador)

# 3. Configurar .env (ya viene configurado, solo ajusta tu contraseña MySQL)
# DB_PASSWORD=tu_contraseña_de_mysql
```

## ▶️ Iniciar el servidor

```bash
npm start
# o: node --experimental-vm-modules src/index.js
```

## 🌐 Acceder al sitio

| URL | Vista |
|-----|-------|
| http://localhost:3000 | Página de Inicio |
| http://localhost:3000/login | Login |
| http://localhost:3000/empleos | Empleos públicos |

## 👥 Credenciales de prueba

**Password para todas las cuentas:** `password`

| Email | Rol | Empresa |
|-------|-----|---------|
| fredy.martinez@gmail.com | Postulante | — |
| mariajose.hernandez@outlook.com | Postulante | — |
| carlos.portillo@yahoo.com | Postulante | — |
| rrhh@bancoagricola.com.sv | Empresa | Banco Agrícola |
| careers@telusinternational.com | Empresa | Telus International |
| empleo@superselectos.com | Empresa | Super Selectos |
| empleos@gruporoble.com | Empresa | Grupo Roble |
| reclutamiento@claro.com.sv | Empresa | Claro El Salvador |

## 🗺️ Flujo de navegación

```
/ (Inicio) → /login → Dashboard (según rol) → Perfil / Empleos → Logout → /
```

## 📁 Estructura del proyecto

```
portal-trabajo/
├── src/
│   ├── index.js              ← Servidor Express (punto de entrada)
│   ├── config/db.js          ← Conexión MySQL
│   ├── routes/               ← Rutas API
│   ├── controllers/          ← Lógica de negocio
│   └── services/             ← Consultas SQL
├── public/
│   ├── views/
│   │   ├── Publicas/         ← HTML públicos (VISTA_01 al 12)
│   │   └── Privadas/
│   │       ├── postulante/   ← VISTA_13 al 21
│   │       ├── empresa/      ← VISTA_22 al 29
│   │       └── Admin/        ← VISTA_30 al 38
│   └── assets/js/
│       ├── auth/             ← checkAuth.js, login.js, register-*.js
│       └── vistas/           ← Un JS por vista (dashboards, perfiles, etc.)
├── BD_Script.sql             ← Esquema de base de datos
├── BD_Datos_ElSalvador.sql   ← Datos reales de El Salvador (EJECUTAR 2DO)
└── .env                      ← Configuración (DB, puerto, secreto de sesión)
```
