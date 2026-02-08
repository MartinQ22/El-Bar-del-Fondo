# El Bar del Fondo - Sistema de Gestión y Autenticación

Este proyecto es una aplicación web robusta construida con **Node.js** y **Express**, diseñada para gestionar productos, incluyendo un catálogo de productos, carrito de compras y un sistema de autenticación completo.

## 🚀 Funcionalidades Principales

### 1. Sistema de Autenticación y Autorización
*   **Registro de Usuarios**: Validación de campos en tiempo real y hashing de contraseñas con **bcrypt**.
*   **Login Multimodal**: 
    *   Soporte para usuarios locales.
    *   Acceso administrativo especial (perfil Admin).
    *   **OAuth con GitHub**: Integración para inicio de sesión mediante cuentas de GitHub.
*   **JWT (JSON Web Tokens)**: Manejo de sesiones seguras mediante cookies `HttpOnly`.
*   **Roles de Usuario**: Diferenciación entre `user` y `admin` para control de acceso a rutas.

### 2. Gestión de Contraseñas
*   **Restablecimiento de Contraseña**: Flujo completo de recuperación vía email utilizando **Nodemailer**.
*   **Seguridad**: Los tokens de recuperación tienen una validez limitada (1 hora).
*   **Experiencia de Usuario**: Página dedicada para cambio de contraseña con toggle de visibilidad.

### 3. Catálogo de Productos
*   **Visualización**: Listado dinámico de productos con paginación integrada.
*   **Detalle de Producto**: Vista individual para cada artículo.
*   **Administración**: Capacidad (para admins) de gestionar el inventario.

### 4. Interfaz de Usuario (UI/UX)
*   Renderizado dinámico con **Handlebars**.
*   Feedback visual inmediato (errores en rojo, alertas personalizadas).
*   Diseño responsive y moderno.

---

## 🛠️ Tecnologías y Dependencias

### Core
*   **Express**: Framework web principal.
*   **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
*   **Passport.js**: Estrategias de autenticación (Local, GitHub, JWT).

### Seguridad
*   **bcrypt**: Encriptación de contraseñas.
*   **jsonwebtoken**: Generación y validación de tokens.
*   **cookie-parser**: Manejo de cookies del lado del servidor.

### Utilidades
*   **Nodemailer**: Envío de correos electrónicos.
*   **dotenv**: Gestión de variables de entorno.
*   **Mongoose Paginate V2**: Paginación eficiente de consultas.
*   **Socket.io**: Comunicación en tiempo real (preparado para futuras implementaciones).

---

## ⚙️ Configuración del Entorno

El proyecto requiere un archivo `.env` en la raíz con las siguientes variables:

```env
PORT=8080
URI_MONGO_CONNECT=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
GITHUB_CLIENT_ID=tu_client_id
GITHUB_CLIENT_SECRET=tu_client_secret
MAIL_APP=tu_password_de_aplicacion_gmail
USER_G=tu_email_gmail
ADMIN_USER=admin
ADMIN_PASS=1234
```

---

## 🏃 Cómo Ejecutar

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar la aplicación:
   ```bash
   npm start
   ```
   *La aplicación corre por defecto en `http://localhost:8080`*

---

## 📂 Estructura del Proyecto

*   `/crud/src`: Código fuente principal.
    *   `/controllers`: Lógica de control para sesiones, productos y correos.
    *   `/models`: Esquemas de Mongoose.
    *   `/routes`: Definición de endpoints y rutas de vistas.
    *   `/views`: Plantillas de Handlebars.
    *   `/services`: Capa de servicios para lógica de negocio.
    *   `/DAO`: Data Access Objects para interacción con DB.
*   `/public`: Archivos estáticos (JS, CSS, Imágenes).
