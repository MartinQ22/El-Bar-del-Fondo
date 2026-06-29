# El Bar del Fondo - Backend API (Sistema de Gestión y Autenticación)

**URL del repositorio completo:** `https://github.com/MartinQ22/El-Bar-del-Fondo.git`
**URL pública de la imagen en DockerHub:** `https://hub.docker.com/r/martinquiroga/el-bar-del-fondo`

Este proyecto es una aplicación web robusta construida con **Node.js** y **Express**, diseñada para gestionar productos, incluyendo un catálogo de productos, carrito de compras y un sistema de autenticación completo.

---

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

### 5. Documentación Interactiva (Swagger)
* **Especificación OpenAPI**: Centralización y tipado de esquemas para entidades principales (Productos, Carritos, Usuarios).
* **Pruebas en Vivo**: Panel interactivo integrado que permite testear las respuestas

---

## 📖 Documentación de la API

Una vez que el proyecto esté corriendo localmente, podés acceder a la interfaz interactiva de Swagger para examinar y probar todos los endpoints disponibles.

* **Ruta local estándar:** `http://localhost:8080/api-docs`

* **Desde Docker:** Si levantaste la aplicación mediante el contenedor, la documentación estará accesible de igual manera mapeando el puerto configurado:

    ```text

    http://localhost:8080/api-docs

    ```
    
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

## 1. Estructura del proyecto

El proyecto sigue una arquitectura de capas bien definida:

```text
crud/
├── src/
│   ├── config/      # Archivos de configuración (Passport, Mailing, Variables de entorno)
│   ├── controllers/ # Lógica de control para los endpoints
│   ├── DAO/         # Data Access Objects (Capa de acceso a base de datos)
│   ├── DTO/         # Data Transfer Objects (Filtro y formateo de datos)
│   ├── middlewares/ # Middlewares de Express (Autenticación, validación, etc.)
│   ├── models/      # Esquemas de Mongoose
│   ├── routes/      # Definición de rutas y endpoints de la API
│   ├── seeds/       # Archivos para poblar la BD en desarrollo
│   └── services/    # Capa de servicios (Lógica de negocio principal)
├── Tests/           # Pruebas funcionales e integración (Jest + Supertest)
├── Dockerfile       # Instrucciones para generar la imagen Docker
└── app.js           # Punto de entrada de la aplicación Express
```

**Propósito de las carpetas principales:**
- **`src/routes` y `src/controllers`**: Reciben la petición del cliente y manejan el flujo HTTP (req, res).
- **`src/services` y `src/DAO`**: Aíslan la lógica de negocio y la interacción con MongoDB.
- **`Tests/`**: Contiene la validación automatizada de calidad, cubriendo casos de éxito y de error para todas las funcionalidades.

---

## 2. Tests Funcionales

Se desarrollaron pruebas funcionales e integrales utilizando **Jest** y **Supertest**. 

### ¿Qué valida cada grupo de tests?
1. **`users.test.js`**: Valida la creación, obtención, actualización y borrado de usuarios. Comprueba restricciones como contraseñas débiles, fallos al enviar datos inválidos y búsqueda de usuarios no existentes.
2. **`products.test.js`**: Asegura que el catálogo de productos funcione. Verifica validación de permisos (solo `admin` puede crear/borrar), paginación y manejo de errores 404/500.
3. **`carts.test.js`**: Verifica la lógica de compra. Valida la creación de carritos vacíos, agregación de productos con tokens válidos, eliminación de ítems y vaciado de carritos.
4. **`auth.test.js`**: Comprueba el registro, login (generación de JWT), logout y acceso a la ruta protegida `/api/current`.

### Código de los tests

1. **`users.test.js`**

<details>
<summary>▶️ Ver logs de ejecución de users.test.js (27 passed)</summary>

```text
$ npm test -- Tests/users.test.js

> el-bar-del-fondo@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit Tests/users.test.js

  console.log
    [dotenv@17.2.3] injecting env (15) from .env -- tip: ⚙️  enable debug logging with { debug: true }

      at _log (node_modules/dotenv/lib/main.js:142:11)

(node:24392) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782641603177,"pid":24392,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782641604551,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"2bb1c498-1873-4c5b-bfa8-0738b1eeeabe","method":"POST","path":"/api/users/create","statusCode":201,"responseTimeMs":242}
{"level":40,"time":1782641604634,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3d2f1c82-9eb4-4eb7-bc88-2e67e000a41d","method":"POST","path":"/api/users/create","statusCode":400,"responseTimeMs":73}
{"level":30,"time":1782641604777,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a3acb0bc-f7f5-47d2-a67b-bb311c271c79","method":"GET","path":"/api/users/mail/controlleruser@example.com","statusCode":200,"responseTimeMs":136}
{"level":40,"time":1782641604922,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"739bda5a-8db7-41d1-b339-f7268fc54723","method":"GET","path":"/api/users/mail/nonexistent@example.com","statusCode":404,"responseTimeMs":137}
{"level":30,"time":1782641605068,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"4f2f4829-15ef-4e8c-9ded-9d95ef69b1f5","method":"GET","path":"/api/users","statusCode":200,"responseTimeMs":137}
{"level":30,"time":1782641605279,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"537336b4-fe94-4e41-ae37-1bb9bfe11d82","method":"PUT","path":"/api/users/email","statusCode":200,"responseTimeMs":202}
{"level":40,"time":1782641605355,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a427c562-9083-4641-85cc-9538541ace7d","method":"PUT","path":"/api/users/email","statusCode":400,"responseTimeMs":67}
{"level":40,"time":1782641605492,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7cce35b2-be3e-4d91-854f-59856839f142","method":"PUT","path":"/api/users/email","statusCode":404,"responseTimeMs":128}
{"level":30,"time":1782641605659,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"19bdce19-c3f5-459f-b5eb-de49ed4a6c09","method":"DELETE","path":"/api/users/email","statusCode":200,"responseTimeMs":157}
{"level":40,"time":1782641605828,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"683202f1-0200-45ce-81bb-d491e5ee1c5e","method":"DELETE","path":"/api/users/email","statusCode":404,"responseTimeMs":130}
{"level":40,"time":1782641605905,"pid":24392,"hostname":"AleCompu","msg":"HTTP Request","reqId":"ab3eb0ea-9e32-4e4c-b39d-6587078fc4b7","method":"GET","path":"/api/users/failure-register","statusCode":400,"responseTimeMs":68}
  console.error
    Service error

      12 |     } catch (error) {
      13 |         console.error(error.message);
    > 14 |         return next(createError(error.message, 500));
         |             ^
      15 |     }
      16 | };
      17 |

      at getUsers (crud/src/controllers/users.controller.js:14:13)
      at Object.<anonymous> (crud/Tests/users.test.js:291:13)

  console.error
    Service error

      28 |         console.error(error.message);
      29 |         return next(createError(error.message, 500));
    > 30 |     }
         |      ^
      31 | };
      32 |
      33 | export const createUser = async (req, res, next) => {

      at getUserByEmail (crud/src/controllers/users.controller.js:30:13)
      at Object.<anonymous> (crud/Tests/users.test.js:299:13)

  console.error
    Service error

      64 | export const deleteUser = async (req, res, next) => {
      65 |     const { email } = req.body;
    > 66 |
         | ^
      67 |     try {
      68 |         let users = await userService.deleteUser(email);
      69 |         if (!users) {

      at updateUser (crud/src/controllers/users.controller.js:66:13)
      at Object.<anonymous> (crud/Tests/users.test.js:313:13)

  console.error
    Service error

      82 |
      83 |

      at deleteUser (crud/src/controllers/users.controller.js:84:13)
      at Object.<anonymous> (crud/Tests/users.test.js:320:13)

PASS  crud/Tests/users.test.js (7.599 s)
  Users Module (DAO, Service, DTO, Controller)
    UsersDTO Unit Tests
      √ setSessionUser deberia retornar solo first_name, email y role (4 ms)
    UsersDAO & UserService Unit Tests
      √ createUser deberia crear usuario con password hasheado si pasa validaciones (236 ms)
      √ createUser deberia fallar ante email invalido (28 ms)
      √ createUser deberia fallar ante password debil (1 ms)
      √ getUsers deberia listar usuarios (158 ms)
      √ getUserByEmail deberia encontrar el usuario creado (65 ms)
      √ getUserById deberia encontrar el usuario por id (64 ms)
      √ updateUser deberia actualizar el usuario (149 ms)
      √ updateUser deberia fallar al actualizar con password debil (2 ms)
      √ deleteUser deberia eliminar usuario por email (132 ms)
      √ deleteUserById deberia eliminar usuario por id (261 ms)
    Controller Integration Tests
      √ POST /api/users/create deberia crear usuario con exito (263 ms)
      √ POST /api/users/create deberia fallar ante email invalido (400) (80 ms)
      √ GET /api/users/mail/:email deberia devolver DTO del usuario (143 ms)
      √ GET /api/users/mail/:email 404 si el usuario no existe (144 ms)
      √ GET /api/users deberia obtener todos los usuarios (145 ms)
      √ PUT /api/users/email deberia actualizar usuario (210 ms)
      √ PUT /api/users/email 400 si la contraseña es debil (75 ms)
      √ PUT /api/users/email 404 si el usuario no existe (136 ms)
      √ DELETE /api/users/email deberia eliminar el usuario (195 ms)
      √ DELETE /api/users/email 404 si el usuario no existe (139 ms)
      √ GET /api/users/failure-register deberia retornar 400 (76 ms)
    Users Controller Unit Tests (Edge Cases)
      √ getUsers - Error interno (28 ms)
      √ getUserByEmail - Error interno (7 ms)
      √ createUser - Error interno (1 ms)
      √ updateUser - Error interno (6 ms)
      √ deleteUser - Error interno (7 ms)

Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        7.774 s, estimated 14 s
Ran all test suites matching Tests/users.test.js.
```
</details>

2. **`products.test.js`**:$ npm test -- Tests/products.test.js

<details>
<summary>▶️ Ver logs de ejecución de products.test.js (17 passed)</summary>

```text

> el-bar-del-fondo@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit Tests/products.test.js

  console.log
    [dotenv@17.2.3] injecting env (15) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

(node:16676) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782641753318,"pid":16676,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782641753814,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"656a46b2-2bfe-4ba8-91f4-813f7782b0cf","method":"GET","path":"/api/products","statusCode":200,"responseTimeMs":264}
{"level":30,"time":1782641753965,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"27ce2f81-7b08-493c-bebe-2e78a8a81c75","method":"GET","path":"/api/products/68ecb6f99407b0e3e0bf3096","statusCode":200,"responseTimeMs":135}
{"level":40,"time":1782641754044,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5f7c2c9e-99a3-4173-95fe-21fddad4b3c9","method":"GET","path":"/api/products/productoFalso","statusCode":404,"responseTimeMs":69}
{"level":30,"time":1782641754224,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"b6cc915a-d37f-4bba-840d-8eae1bf18e3f","method":"POST","path":"/api/products","statusCode":201,"responseTimeMs":165}
{"level":40,"time":1782641754300,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"ae0e6109-4506-44be-bb46-dd65ed1ba51a","method":"POST","path":"/api/products","statusCode":401,"responseTimeMs":68}
{"level":40,"time":1782641754376,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6c7ce12b-212b-403e-8619-0d325bab4cbe","method":"POST","path":"/api/products","statusCode":403,"responseTimeMs":68}
{"level":50,"time":1782641754523,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"d59bb655-8131-4d71-9c85-c5ab45580e00","method":"POST","path":"/api/products","statusCode":500,"responseTimeMs":138}
{"level":30,"time":1782641754679,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"9eb2fac3-a0bf-4653-b5cc-59bd99ff7fed","method":"PUT","path":"/api/products/6a40f45afe19b2693e781795","statusCode":200,"responseTimeMs":146}
{"level":40,"time":1782641754757,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"190f2f07-3894-47cc-a7dc-8ca914e3262d","method":"PUT","path":"/api/products/6a40f45afe19b2693e781795","statusCode":401,"responseTimeMs":69}
{"level":40,"time":1782641754836,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"269fb496-a7cb-4117-b06e-b97e698ea3fc","method":"PUT","path":"/api/products/6a40f45afe19b2693e781795","statusCode":403,"responseTimeMs":71}
{"level":40,"time":1782641754975,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"36ff622e-f322-45e5-acb2-bd495aff4e86","method":"PUT","path":"/api/products/6a40f45afe19b2693e78179a","statusCode":404,"responseTimeMs":132}
{"level":50,"time":1782641755052,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"9115ac20-0ab6-4860-a74a-14596d79d1a3","method":"PUT","path":"/api/products/idInvalido","statusCode":500,"responseTimeMs":70}
{"level":40,"time":1782641755148,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"bf024f85-ffba-477b-989e-1cf284f7b7ae","method":"DELETE","path":"/api/products/6a40f45afe19b2693e781795","statusCode":401,"responseTimeMs":90}
{"level":40,"time":1782641755224,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"b84eaa67-ca53-40ff-9acb-3d9119a86617","method":"DELETE","path":"/api/products/6a40f45afe19b2693e781795","statusCode":403,"responseTimeMs":68}
{"level":40,"time":1782641755385,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"c3174025-07d9-4361-b077-097e9d5f49ad","method":"DELETE","path":"/api/products/6a40f45bfe19b2693e78179c","statusCode":404,"responseTimeMs":155}
{"level":50,"time":1782641755462,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"c314e841-f21f-47a2-a191-40c0c50d1565","method":"DELETE","path":"/api/products/idInvalido","statusCode":500,"responseTimeMs":70}
{"level":30,"time":1782641755614,"pid":16676,"hostname":"AleCompu","msg":"HTTP Request","reqId":"1d9951e3-471f-46bb-9026-91f26de90e8e","method":"DELETE","path":"/api/products/6a40f45afe19b2693e781795","statusCode":200,"responseTimeMs":145}
 PASS  crud/Tests/products.test.js (7.387 s)
  Products API
    GET /api/products
      √ deberia devolver status 200 y un array de productos (300 ms)
      √ deberia devolver un producto por ID 68ecb6f99407b0e3e0bf3096 (145 ms)
      √ deberia devolver un error 404 si el producto no existe (79 ms)
    POST /api/products
      √ deberia crear un nuevo producto y devolver status 201 (178 ms)
      √ deberia devolver 401 si no hay token (75 ms)
      √ deberia devolver 403 si el rol no es admin (76 ms)
      √ deberia devolver 500 si hay un error en los datos (codigo duplicado) (145 ms)
    PUT /api/products/:pid
      √ deberia actualizar un producto y devolver status 200 (155 ms)
      √ deberia devolver 401 si no hay token (77 ms)
      √ deberia devolver 403 si el rol no es admin (78 ms)
      √ deberia devolver 404 si el ID no existe en la BD (138 ms)
      √ deberia devolver 500 si el ID es invalido (76 ms)
    DELETE /api/products/:pid
      √ deberia devolver 401 si no hay token (96 ms)
      √ deberia devolver 403 si el rol no es admin (74 ms)
      √ DELETE /api/products/:pid deberia devolver 404 si el ID no existe en la BD (161 ms)
      √ deberia devolver 500 si el ID es invalido (76 ms)
      √ deberia eliminar un producto y devolver status 200 (151 ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        7.591 s, estimated 8 s
Ran all test suites matching Tests/products.test.js.
```
</details>

3. **`carts.test.js`**:$ npm test -- Tests/carts.test.js

<details>
<summary>▶️ Ver logs de ejecución de carts.test.js (20 passed)</summary>

```text
> el-bar-del-fondo@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit Tests/carts.test.js

  console.log
    [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit

      at _log (node_modules/dotenv/lib/main.js:142:11)

(node:2012) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782641835263,"pid":2012,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782641836447,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"762e88ab-a964-495b-9d10-25b1a063133d","method":"POST","path":"/api/carts","statusCode":201,"responseTimeMs":149}
{"level":30,"time":1782641836594,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5b1cd80e-20c9-4569-ae1b-dc5d68fc2055","method":"GET","path":"/api/carts/6a40f4ac5e4764636ee380fd","statusCode":200,"responseTimeMs":135}
{"level":40,"time":1782641836734,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"0bc7518f-9862-4477-b920-1c8b018df59d","method":"GET","path":"/api/carts/6a40f4ac5e4764636ee38100","statusCode":404,"responseTimeMs":131}
{"level":40,"time":1782641836841,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5da86687-1590-4b01-a27a-3bf3f6311de5","method":"POST","path":"/api/carts/6a40f4ac5e4764636ee380fd/product/6a40f4ab5e4764636ee380e6","statusCode":401,"responseTimeMs":98}
{"level":30,"time":1782641837052,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"51f086eb-b87e-440c-bd60-7794ab7f95f8","method":"POST","path":"/api/carts/6a40f4ac5e4764636ee380fd/product/6a40f4ab5e4764636ee380e6","statusCode":200,"responseTimeMs":203}
{"level":30,"time":1782641837259,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"0ec3294b-74e1-4ded-b5f4-432087420cb7","method":"DELETE","path":"/api/carts/6a40f4ac5e4764636ee380fd/products/6a40f4ab5e4764636ee380e6","statusCode":200,"responseTimeMs":199}
{"level":40,"time":1782641837407,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"04946dcd-36b4-41c7-95a2-743469b43b45","method":"DELETE","path":"/api/carts/6a40f4ac5e4764636ee380fd/products/6a40f4ab5e4764636ee380e6","statusCode":404,"responseTimeMs":141}
{"level":30,"time":1782641837542,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"fb08813e-10ce-4c8d-b41b-464026a09c0e","method":"DELETE","path":"/api/carts/6a40f4ac5e4764636ee380fd","statusCode":200,"responseTimeMs":128}
{"level":40,"time":1782641837685,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"d2979ba7-1519-4042-9a7a-9ee590eac99f","method":"DELETE","path":"/api/carts/6a40f4ad5e4764636ee3810b","statusCode":404,"responseTimeMs":132}
{"level":50,"time":1782641837763,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7c5bc90e-a5ff-4df5-8efa-5578461df836","method":"GET","path":"/api/carts/id_invalido","statusCode":500,"responseTimeMs":69}
{"level":50,"time":1782641837903,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"512ccb04-caab-484f-873a-1dbd6c501590","method":"POST","path":"/api/carts/id_invalido/product/6a40f4ab5e4764636ee380e6","statusCode":500,"responseTimeMs":131}
{"level":50,"time":1782641837980,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"f202e0d1-cdd8-4178-9463-00f34d91d4db","method":"DELETE","path":"/api/carts/id_invalido/products/6a40f4ab5e4764636ee380e6","statusCode":500,"responseTimeMs":70}
{"level":50,"time":1782641838060,"pid":2012,"hostname":"AleCompu","msg":"HTTP Request","reqId":"f9a46895-ce93-48c8-97c9-3dc99140b3dd","method":"DELETE","path":"/api/carts/id_invalido","statusCode":500,"responseTimeMs":70}
 PASS  crud/Tests/carts.test.js (8.025 s)
  Carts Module (DAO, Service, Controller)
    DAO & Service Unit Tests
      √ Deberia crear un carrito vacio y retornarlo (79 ms)
      √ Deberia obtener un carrito por id (78 ms)
      √ Deberia agregar un producto al carrito (77 ms)
      √ Deberia lanzar error si se intenta borrar un producto de un carrito no existente (87 ms)
      √ Deberia lanzar error si se intenta borrar un producto inexistente en el carrito (67 ms)
      √ Deberia remover un producto del carrito (138 ms)
      √ Deberia vaciar el carrito (137 ms)
    Controller Integration Tests
      √ POST /api/carts deberia crear un carrito (177 ms)
      √ GET /api/carts/:cid deberia obtener el carrito (144 ms)
      √ GET /api/carts/:cid 404 si el carrito no existe (139 ms)
      √ POST /api/carts/:cid/product/:pid deberia fallar si no hay autenticacion (105 ms)
      √ POST /api/carts/:cid/product/:pid deberia agregar producto si esta autenticado (211 ms)
      √ DELETE /api/carts/:cid/products/:pid deberia eliminar producto del carrito (205 ms)
      √ DELETE /api/carts/:cid/products/:pid 404 si el producto no esta en el carrito (147 ms)
      √ DELETE /api/carts/:cid deberia vaciar el carrito (134 ms)
      √ DELETE /api/carts/:cid 404 si no existe el carrito (143 ms)
    Controller Error Catching Cases
      √ GET /api/carts/:cid deberia retornar 500 ante un ID invalido o error de BD (76 ms)
      √ POST /api/carts/:cid/product/:pid deberia retornar 500 ante ID invalido (139 ms)
      √ DELETE /api/carts/:cid/products/:pid deberia retornar 500 ante ID invalido (76 ms)
      √ DELETE /api/carts/:cid deberia retornar 500 ante ID invalido (79 ms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        8.267 s, estimated 15 s
Ran all test suites matching Tests/carts.test.js.
```
</details>

4. **`auth.test.js`**:$ npm test -- Tests/auth.test.js

<details>
<summary>▶️ Ver logs de ejecución de auth.test.js (22 passed)</summary>

```text
> el-bar-del-fondo@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit Tests/auth.test.js

  console.log
    [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

      at _log (node_modules/dotenv/lib/main.js:142:11)

(node:19224) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782641901699,"pid":19224,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782641902409,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"416a0171-38f1-464a-9400-564310ac5c46","method":"POST","path":"/api/register","statusCode":200,"responseTimeMs":307}
{"level":40,"time":1782641902572,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"fd689f30-2b86-4724-a45b-bf7cad420ada","method":"POST","path":"/api/register","statusCode":400,"responseTimeMs":148}
{"level":40,"time":1782641902660,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7c404708-a94a-40d2-a0fe-55869ea2031e","method":"POST","path":"/api/login","statusCode":400,"responseTimeMs":73}
{"level":30,"time":1782641902737,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"9bd2a5c7-4bf9-45fe-94a7-0783a46c55a4","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":69}
{"level":30,"time":1782641902945,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"0cc0ee16-aab9-43ac-923d-82cf6848511f","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":199}
{"level":40,"time":1782641903085,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"525a1147-596f-40a3-9738-bf2ae489181c","method":"POST","path":"/api/login","statusCode":401,"responseTimeMs":132}
{"level":40,"time":1782641903293,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6c2edbfb-0204-4755-9661-d3f03b24bc86","method":"POST","path":"/api/login","statusCode":401,"responseTimeMs":201}
{"level":30,"time":1782641903447,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"e2e10baf-87d8-409e-aa0b-dfc9f385dfc5","method":"GET","path":"/api/current","statusCode":200,"responseTimeMs":146}
{"level":40,"time":1782641903528,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"b3e4abc8-0644-43d1-b71a-483e33a0d1bc","method":"GET","path":"/api/current","statusCode":401,"responseTimeMs":70}
{"level":30,"time":1782641903868,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"19253ce3-961e-4131-9521-e3785a12b5f7","method":"POST","path":"/api/reset-password","statusCode":200,"responseTimeMs":331}
{"level":40,"time":1782641904077,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6d877fc6-177f-4289-99a9-2e62390116c0","method":"POST","path":"/api/reset-password","statusCode":400,"responseTimeMs":198}
{"level":50,"time":1782641904177,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6adb476c-294c-42b6-9174-74851cc3b7b8","method":"POST","path":"/api/reset-password","statusCode":500,"responseTimeMs":93}
{"level":30,"time":1782641904265,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"972a60d9-f6e8-498f-9d2b-013b78e2d65d","method":"GET","path":"/api/logout","statusCode":302,"responseTimeMs":80}
{"level":30,"time":1782641904478,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"318ec259-b251-4ae6-81d0-64a0466fd157","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":206}
{"level":30,"time":1782641904617,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"e446db9c-f2dc-4311-9991-7b0605cb03c9","method":"POST","path":"/api/register","statusCode":200,"responseTimeMs":131}
{"level":40,"time":1782641904762,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"ec08445d-8941-40e5-94fb-e29221fc49ae","method":"POST","path":"/api/reset-password","statusCode":404,"responseTimeMs":136}
{"level":40,"time":1782641904840,"pid":19224,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7fa95b65-0aa6-445c-a61a-f285b09ece68","method":"POST","path":"/api/reset-password","statusCode":400,"responseTimeMs":70}
  console.error
    DB error

      62 |         if (email === env.ADMIN_USER && password === env.ADMIN_PASS) {
      63 |             const adminUser = {
    > 64 |                 _id: "admin_id",
         |             ^
      65 |                 first_name: "Admin",
      66 |                 last_name: "System",
      67 |                 email: email,

      at register (crud/src/controllers/auth.controller.js:64:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:237:13)

  console.error
    Duplicate

      62 |         if (email === env.ADMIN_USER && password === env.ADMIN_PASS) {
      63 |             const adminUser = {
    > 64 |                 _id: "admin_id",
         |             ^
      65 |                 first_name: "Admin",
      66 |                 last_name: "System",
      67 |                 email: email,

      at register (crud/src/controllers/auth.controller.js:64:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:249:13)

  console.error
    DB error

      152 | //Password RESET
      153 | export const resetPassword = async (req, res, next) => {
    > 154 |     const { token, password } = req.body;
          |             ^
      155 |
      156 |     try {
      157 |         const decoded = jwt.verify(token, env.JWT_SECRET);

      at login (crud/src/controllers/auth.controller.js:154:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:259:13)

  console.error
    Error al destruir la sesión: Error: Destroy error
        at Object.<anonymous> (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\Tests\auth.test.js:274:66)
        at C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:305:39
        at Object.<anonymous> (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:312:13)
        at Object.mockConstructor [as destroy] (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:57:19)
        at logout (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\src\controllers\auth.controller.js:249:15)
        at Object.logout (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\Tests\auth.test.js:277:13)
        at Promise.finally.completed (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1561:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1501:10)
        at _callCircusTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1011:40)
        at processTicksAndRejections (node:internal/process/task_queues:105:5)
        at _runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:951:3)
        at C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:853:7
        at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:866:11)
        at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
        at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
        at run (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:765:3)
        at runAndTransformResultsToJestFormat (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1993:21)
        at jestAdapter (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\runner.js:111:19)
        at runTestInternal (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\index.js:276:16)
        at runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\index.js:344:7)


      at crud/src/controllers/auth.controller.js:251:15
      at Object.cb (crud/Tests/auth.test.js:274:63)
      at logout (crud/src/controllers/auth.controller.js:249:15)
      at Object.logout (crud/Tests/auth.test.js:277:13)

 PASS  crud/Tests/auth.test.js (9.324 s)
  Auth Module (Controllers, Routes, and Passport Config)
    Auth Router & Controller Integration Tests
      √ POST /api/register - Registro de nuevo usuario (331 ms)
      √ POST /api/register - Error si el usuario ya existe (159 ms)
      √ POST /api/login - Error si faltan campos (86 ms)
      √ POST /api/login - Login de administrador exitoso (76 ms)
      √ POST /api/login - Login de usuario local exitoso (207 ms)
      √ POST /api/login - Login credenciales invalidas (email incorrecto) (139 ms)
      √ POST /api/login - Login credenciales invalidas (password incorrecto) (207 ms)
      √ GET /api/current - Obtener datos del usuario logueado (154 ms)
      √ GET /api/current - No autorizado si no hay cookie (79 ms)
      √ POST /api/reset-password - Cambiar contraseña con token (340 ms)
      √ POST /api/reset-password - Error si la contraseña es igual a la anterior (207 ms)
      √ POST /api/reset-password - Error si el token expiro/es invalido (99 ms)
      √ GET /api/logout - Destruir sesion (87 ms)
      √ POST /api/register - Sesión ya activa (351 ms)
      √ POST /api/reset-password - Usuario no encontrado (144 ms)
      √ POST /api/reset-password - Token expirado (77 ms)
    Auth Controller Unit Tests (Edge Cases)
      √ register - Error interno (32 ms)
      √ register - Duplicate key error (15 ms)
      √ login - Error interno (7 ms)
      √ getCurrentUser - Error interno (2 ms)
      √ logout - Error al destruir sesion (61 ms)
      √ githubCallback - redirect con role (4 ms)
      √ githubCallback - redirect sin role (3 ms)
    Passport Config Strategy Unit Tests
      √ cookieExtractor deberia extraer cookie jwt
      √ cookieExtractor deberia retornar null si no hay cookies (1 ms)
      √ serializeUser y deserializeUser (74 ms)
      √ Register Strategy Callback (132 ms)
      √ Register Strategy Callback - Duplicate Email Error (135 ms)
      √ Login Strategy Callback - Success (254 ms)
      √ Login Strategy Callback - User Not Found (64 ms)
      √ Login Strategy Callback - Wrong Password (129 ms)
      √ GitHub Strategy Callback - Existing User (65 ms)
      √ GitHub Strategy Callback - New User (196 ms)
      √ GitHub Strategy Callback - New User sin emails ni displayName (65 ms)
      √ JWT Strategy Callback - Success (65 ms)
      √ JWT Strategy Callback - User Not Found (63 ms)
      √ Register Strategy Callback - Catch Generic Error (1 ms)
      √ Login Strategy Callback - Catch Generic Error (1 ms)
      √ GitHub Strategy Callback - Catch 11000 Error and User Exists (65 ms)
      √ GitHub Strategy Callback - Catch 11000 Error sin emails array (64 ms)
      √ GitHub Strategy Callback - Catch Generic Error (1 ms)
      √ JWT Strategy Callback - Catch Generic Error (1 ms)
      √ passportCall - Error next(err) (2 ms)
      √ passportCall - !user sin info.message
      √ passportCall - !user sin info object (2 ms)
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        9.509 s, estimated 16 s
Ran all test suites matching Tests/auth.test.js.
```
</details>

### Evidencia de ejecución de los tests

<details>
<summary>▶️ Ver logs de ejecución de todos los tests (171 passed)</summary>

```text

$ npm run test

> el-bar-del-fondo@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit

(node:8872) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:13444) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:12484) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782642124586,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7383c989-f200-4f64-9eeb-f3f26a5570bb","method":"GET","path":"/api/debug/process","statusCode":200,"responseTimeMs":19}
(node:23476) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  crud/Tests/debug.test.js (8.878 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }

      at _log (node_modules/dotenv/lib/main.js:142:11)

(node:1608) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782642124820,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"4712ba05-40f8-46fc-b649-c239c894c3ae","method":"GET","path":"/api/debug/cpu?duration=5","statusCode":200,"responseTimeMs":10}
(node:11048) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:24260) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"level":30,"time":1782642125675,"pid":8872,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782642125699,"pid":13444,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":40,"time":1782642125951,"pid":23476,"hostname":"AleCompu","msg":"HTTP Request","reqId":"789d643d-772d-4e7a-b813-89c3847186e7","method":"GET","path":"/mail/welcome","statusCode":401,"responseTimeMs":999}
{"level":30,"time":1782642125954,"pid":1608,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782642126092,"pid":11048,"hostname":"AleCompu","msg":"HTTP Request","reqId":"b21e906e-c0ac-4f28-b8fe-3711c7729f6a","method":"GET","path":"/api/health","statusCode":200,"responseTimeMs":954}
{"level":40,"time":1782642126120,"pid":23476,"hostname":"AleCompu","msg":"HTTP Request","reqId":"ad898b07-f4ab-4729-b3e8-d90d2fa6ec80","method":"POST","path":"/mail/reset-password-request","statusCode":400,"responseTimeMs":144}
 PASS  crud/Tests/health.test.js (10.299 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

{"level":30,"time":1782642126199,"pid":11048,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a0a03f35-0cd2-4d6d-8433-642ef9843f36","method":"GET","path":"/api/health","statusCode":200,"responseTimeMs":82}
{"level":30,"time":1782642126210,"pid":23476,"hostname":"AleCompu","msg":"HTTP Request","reqId":"681d4351-fe9a-4924-b8b2-0f23d6e57819","method":"POST","path":"/mail/reset-password-request","statusCode":200,"responseTimeMs":80}
 PASS  crud/Tests/mailing.test.js (10.47 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

    console.error
      SendPasswordReset: No email provided or found in session.

      29 |         if (!userEmail) {
      30 |             console.error("SendPasswordReset: No email provided or found in session.");
    > 31 |             return next(createError("No se encontró email para enviar el correo.", 400));
         |               ^
      32 |         }
      33 |
      34 |         // Token con duracion de 1 hora

      at sendPasswordReset (crud/src/controllers/mailing.controller.js:31:15)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at next (node_modules/router/lib/route.js:157:13)
      at Route.dispatch (node_modules/router/lib/route.js:117:3)
      at handle (node_modules/router/index.js:435:11)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at node_modules/router/index.js:295:15
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at Function.handle (node_modules/router/index.js:186:3)
      at router (node_modules/router/index.js:60:12)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at SessionStrategy.strategy.pass (node_modules/passport/lib/middleware/authenticate.js:355:9)
      at SessionStrategy.authenticate (node_modules/passport/lib/strategies/session.js:126:10)
      at attempt (node_modules/passport/lib/middleware/authenticate.js:378:16)
      at authenticate (node_modules/passport/lib/middleware/authenticate.js:379:7)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at initialize (node_modules/passport/lib/middleware/initialize.js:98:5)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at session (node_modules/express-session/index.js:487:7)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at cookieParser (node_modules/cookie-parser/index.js:57:14)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at read (node_modules/body-parser/lib/read.js:43:5)
      at urlencodedParser (node_modules/body-parser/lib/types/urlencoded.js:58:5)
      at Layer.handleRequest (node_modules/router/lib/layer.js:152:17)
      at trimPrefix (node_modules/router/index.js:342:13)
      at node_modules/router/index.js:297:9
      at processParams (node_modules/router/index.js:582:12)
      at next (node_modules/router/index.js:291:5)
      at node_modules/body-parser/lib/read.js:172:5
      at invokeCallback (node_modules/raw-body/index.js:238:16)
      at done (node_modules/raw-body/index.js:227:7)
      at IncomingMessage.onEnd (node_modules/raw-body/index.js:287:7)

    console.error
      DEBUG - SendPasswordReset Error Details: {
        message: 'SMTP Connection failed',
        stack: 'Error: SMTP Connection failed\n' +
          '    at Mail.<anonymous> (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\crud\\Tests\\mailing.test.js:78:39)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\jest-mock\\build\\index.js:305:39\n' +
          '    at Mail.<anonymous> (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\jest-mock\\build\\index.js:312:13)\n' +
          '    at Mail.mockConstructor [as sendMail] (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\jest-mock\\build\\index.js:102:19)\n' +
          '    at sendPasswordResetEmail (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\crud\\src\\services\\mailing.service.js:13:21)\n' +
          '    at sendPasswordReset (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\crud\\src\\controllers\\mailing.controller.js:39:11)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\route.js:157:13)\n' +
          '    at Route.dispatch (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\route.js:117:3)\n' +
          '    at handle (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:435:11)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:295:15\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at Function.handle (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:186:3)\n' +
          '    at router (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:60:12)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at SessionStrategy.strategy.pass (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\passport\\lib\\middleware\\authenticate.js:355:9)\n' +
          '    at SessionStrategy.authenticate (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\passport\\lib\\strategies\\session.js:126:10)\n' +
          '    at attempt (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\passport\\lib\\middleware\\authenticate.js:378:16)\n' +
          '    at authenticate (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\passport\\lib\\middleware\\authenticate.js:379:7)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at initialize (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\passport\\lib\\middleware\\initialize.js:98:5)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at session (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\express-session\\index.js:487:7)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at cookieParser (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\cookie-parser\\index.js:57:14)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at read (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\body-parser\\lib\\read.js:43:5)\n' +
          '    at urlencodedParser (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\body-parser\\lib\\types\\urlencoded.js:58:5)\n' +
          '    at Layer.handleRequest (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\lib\\layer.js:152:17)\n' +
          '    at trimPrefix (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:342:13)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:297:9\n' +
          '    at processParams (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:582:12)\n' +
          '    at next (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\router\\index.js:291:5)\n' +
          '    at C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\body-parser\\lib\\read.js:172:5\n' +
          '    at AsyncResource.runInAsyncScope (node:async_hooks:211:14)\n' +
          '    at invokeCallback (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\raw-body\\index.js:238:16)\n' +
          '    at done (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\raw-body\\index.js:227:7)\n' +
          '    at IncomingMessage.onEnd (C:\\Users\\Tincho\\Desktop\\El Bar del Fondo\\node_modules\\raw-body\\index.js:287:7)\n' +
          '    at IncomingMessage.emit (node:events:524:28)\n' +
          '    at endReadableNT (node:internal/streams/readable:1698:12)\n' +
          '    at processTicksAndRejections (node:internal/process/task_queues:90:21)',
        env_user_g: true,
        env_mail_app: true
      }

      42 |             message: error.message,
      43 |             stack: error.stack,
    > 44 |             env_user_g: !!env.USER_G,
         |             ^
      45 |             env_mail_app: !!env.MAIL_APP
      46 |         });
      47 |         return next(createError("Error al enviar correo", 500));

      at sendPasswordReset (crud/src/controllers/mailing.controller.js:44:13)

    console.error
      Error al enviar mensaje de bienvenida: Error: Mail error
          at Object.<anonymous> (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\Tests\mailing.test.js:115:47)
          at Promise.finally.completed (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1561:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1501:10)
          at _callCircusTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1011:40)
          at processTicksAndRejections (node:internal/process/task_queues:105:5)
          at _runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:951:3)
          at C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:853:7
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:866:11)
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
          at run (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:765:3)
          at runAndTransformResultsToJestFormat (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1993:21)
          at jestAdapter (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\runner.js:111:19)
          at runTestInternal (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:276:16)
          at runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:344:7)
          at Object.worker (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:498:12)

      18 |         console.error("Error al enviar mensaje de bienvenida:", error);
      19 |         return next(createError("Error al enviar el email de bienvenida", 500));
    > 20 |     }
         |      ^
      21 | }
      22 |
      23 | export async function sendPasswordReset(req, res, next) {

      at sendWelcomeMessage (crud/src/controllers/mailing.controller.js:20:13)
      at Object.<anonymous> (crud/Tests/mailing.test.js:128:13)

{"level":30,"time":1782642126362,"pid":24260,"hostname":"AleCompu","msg":"HTTP Request","reqId":"26cc5549-1aca-4310-8275-272b64861f79","method":"GET","path":"/login","statusCode":200,"responseTimeMs":958}
{"level":50,"time":1782642126368,"pid":23476,"hostname":"AleCompu","msg":"HTTP Request","reqId":"aac55d77-3b53-4850-a6d7-e3d0e8f49571","method":"POST","path":"/mail/reset-password-request","statusCode":500,"responseTimeMs":143}
{"level":30,"time":1782642126487,"pid":24260,"hostname":"AleCompu","msg":"HTTP Request","reqId":"8c22d077-6837-4c3e-ad01-0c2f1d25c4a7","method":"GET","path":"/register","statusCode":200,"responseTimeMs":94}
 PASS  crud/Tests/views.test.js (10.716 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`

      at _log (node_modules/dotenv/lib/main.js:142:11)

{"level":30,"time":1782642126598,"pid":24260,"hostname":"AleCompu","msg":"HTTP Request","reqId":"c5a1d5da-b575-4cd4-931b-274e784db008","method":"GET","path":"/reset-password?token=some_token","statusCode":200,"responseTimeMs":97}
{"level":30,"time":1782642126628,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5eb20367-6bd9-4a0a-9cbf-b62c2e843df6","method":"POST","path":"/api/register","statusCode":200,"responseTimeMs":431}
{"level":40,"time":1782642126808,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a3816ecf-19c5-4e37-8ff7-6cdf5ad17c56","method":"POST","path":"/api/register","statusCode":400,"responseTimeMs":148}
{"level":40,"time":1782642126902,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3d61e343-fda7-4b59-8627-b537d74579f1","method":"POST","path":"/api/login","statusCode":400,"responseTimeMs":78}
 PASS  crud/Tests/requestLogger.test.js
{"level":30,"time":1782642126995,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"c456a0f3-f8bd-4567-bd4e-c035d905a34a","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":81}
{"level":30,"time":1782642127061,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a96a88d3-984c-447c-81f1-472008637a8d","method":"POST","path":"/api/carts","statusCode":201,"responseTimeMs":165}
 PASS  crud/Tests/middlewares.test.js
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }

      at _log (node_modules/dotenv/lib/main.js:142:11)

 PASS  crud/Tests/env.test.js
{"level":30,"time":1782642127530,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"40494a4d-ed85-42ea-b83b-eafc2b78d34b","method":"GET","path":"/api/carts/6a40f5ce9fffce2056c64bba","statusCode":200,"responseTimeMs":452}
{"level":30,"time":1782642127587,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"4a5cee3c-af48-4ab2-b75d-114ea296385d","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":578}
 PASS  crud/Tests/smoke.test.js
{"level":40,"time":1782642127683,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"4c982030-33b3-40df-936e-97b383d010b6","method":"GET","path":"/api/carts/6a40f5cf9fffce2056c64bbd","statusCode":404,"responseTimeMs":139}
{"level":40,"time":1782642127752,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"78dda566-508b-42cc-817d-8fa164f973db","method":"POST","path":"/api/login","statusCode":401,"responseTimeMs":152}
{"level":40,"time":1782642127853,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"70bf6353-2431-4295-a9bb-5538d52112c7","method":"POST","path":"/api/carts/6a40f5ce9fffce2056c64bba/product/6a40f5cd9fffce2056c64ba3","statusCode":401,"responseTimeMs":156}
 PASS  crud/Tests/requestId.test.js
 PASS  crud/Tests/apiResponse.test.js
{"level":40,"time":1782642127994,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"290a3424-c473-495e-8e00-12dbe442e401","method":"POST","path":"/api/login","statusCode":401,"responseTimeMs":229}
{"level":30,"time":1782642128034,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"31c0f919-7982-41b2-855b-6ce2a3519c3b","method":"POST","path":"/api/users/create","statusCode":201,"responseTimeMs":377}
{"level":30,"time":1782642128108,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"c6fd49c5-665e-49ea-a74d-18f78470a4a6","method":"POST","path":"/api/carts/6a40f5ce9fffce2056c64bba/product/6a40f5cd9fffce2056c64ba3","statusCode":200,"responseTimeMs":243}
{"level":40,"time":1782642128138,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5284c02b-a2f8-45e5-9e00-3bfb4efa5530","method":"POST","path":"/api/users/create","statusCode":400,"responseTimeMs":87}
{"level":30,"time":1782642128180,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"914e066e-7573-4cb1-820f-cd136cd7f991","method":"GET","path":"/api/current","statusCode":200,"responseTimeMs":172}
{"level":40,"time":1782642128271,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"27a5e491-6df7-441c-a8fb-a6c089c653c9","method":"GET","path":"/api/current","statusCode":401,"responseTimeMs":77}
{"level":30,"time":1782642128289,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"26418367-ce68-4b8e-bcbf-8a45b7ebc4d4","method":"GET","path":"/api/users/mail/controlleruser@example.com","statusCode":200,"responseTimeMs":145}
{"level":30,"time":1782642128330,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"ca8e8fa4-0221-4271-9a56-cf7756f5137c","method":"DELETE","path":"/api/carts/6a40f5ce9fffce2056c64bba/products/6a40f5cd9fffce2056c64ba3","statusCode":200,"responseTimeMs":211}
{"level":40,"time":1782642128437,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7b1a9572-3f96-4d39-9a2b-7f9abe579385","method":"GET","path":"/api/users/mail/nonexistent@example.com","statusCode":404,"responseTimeMs":136}
{"level":40,"time":1782642128475,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"aac91a47-ea50-48b3-b98a-bde1277bc88c","method":"DELETE","path":"/api/carts/6a40f5ce9fffce2056c64bba/products/6a40f5cd9fffce2056c64ba3","statusCode":404,"responseTimeMs":136}
{"level":30,"time":1782642128588,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3bf22e68-7294-4e10-ad52-1cb877484e8f","method":"GET","path":"/api/users","statusCode":200,"responseTimeMs":140}
{"level":30,"time":1782642128623,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"d8529095-4f17-4bef-aa08-3906358f9a16","method":"DELETE","path":"/api/carts/6a40f5ce9fffce2056c64bba","statusCode":200,"responseTimeMs":138}
{"level":30,"time":1782642128651,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a6d78967-1029-4aa1-b152-a0c3461086cd","method":"POST","path":"/api/reset-password","statusCode":200,"responseTimeMs":365}
{"level":40,"time":1782642128773,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3ac935db-d111-40cf-aeed-70b42a1b43e6","method":"DELETE","path":"/api/carts/6a40f5d09fffce2056c64bc8","statusCode":404,"responseTimeMs":139}
{"level":30,"time":1782642128812,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"8c6e2f11-cd76-48cc-8f9c-74a831494e13","method":"PUT","path":"/api/users/email","statusCode":200,"responseTimeMs":216}
{"level":50,"time":1782642128855,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"e786d0c2-dcc8-46fb-b485-8565784e54b2","method":"GET","path":"/api/carts/id_invalido","statusCode":500,"responseTimeMs":70}
{"level":40,"time":1782642128876,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"e568147d-284d-4ff0-a0d7-a87f76bf5578","method":"POST","path":"/api/reset-password","statusCode":400,"responseTimeMs":216}
{"level":40,"time":1782642128900,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3e3a046b-50e6-45fe-a4be-839a68633b4f","method":"PUT","path":"/api/users/email","statusCode":400,"responseTimeMs":73}
{"level":50,"time":1782642128951,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"f6b3454b-4a6d-47cb-a4c4-2877b6b2de30","method":"POST","path":"/api/reset-password","statusCode":500,"responseTimeMs":68}
{"level":40,"time":1782642129045,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"dd055e8d-34c0-47a3-b509-079609e55b92","method":"PUT","path":"/api/users/email","statusCode":404,"responseTimeMs":133}
{"level":50,"time":1782642129024,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"5c6c3fab-8195-4457-a290-7a6d55ce3abb","method":"POST","path":"/api/carts/id_invalido/product/6a40f5cd9fffce2056c64ba3","statusCode":500,"responseTimeMs":161}
{"level":30,"time":1782642129033,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"e3b8ce77-2b97-4712-9e5f-527955ef2bc3","method":"GET","path":"/api/logout","statusCode":302,"responseTimeMs":73}
{"level":50,"time":1782642129114,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7b95f560-2513-46c2-947b-9393de56ea4b","method":"DELETE","path":"/api/carts/id_invalido/products/6a40f5cd9fffce2056c64ba3","statusCode":500,"responseTimeMs":79}
{"level":50,"time":1782642129192,"pid":13444,"hostname":"AleCompu","msg":"HTTP Request","reqId":"d73c9bce-22c1-4af6-9158-7dde4b643620","method":"DELETE","path":"/api/carts/id_invalido","statusCode":500,"responseTimeMs":71}
{"level":30,"time":1782642129207,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6ea5e6f4-1387-4a4a-94bc-b9f9f7c50352","method":"DELETE","path":"/api/users/email","statusCode":200,"responseTimeMs":150}
{"level":30,"time":1782642129269,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"36524b78-da0c-4692-8e08-2419d51c2782","method":"POST","path":"/api/login","statusCode":200,"responseTimeMs":225}
{"level":40,"time":1782642129361,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"56afe763-41b7-4516-be7e-69a0a95da425","method":"DELETE","path":"/api/users/email","statusCode":404,"responseTimeMs":144}
{"level":30,"time":1782642129421,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"6dfc9b4d-5550-420b-9411-04b5a155238c","method":"POST","path":"/api/register","statusCode":200,"responseTimeMs":144}
{"level":40,"time":1782642129447,"pid":1608,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a65a7e08-fc49-40e7-aedb-7942a791c940","method":"GET","path":"/api/users/failure-register","statusCode":400,"responseTimeMs":74}
 PASS  crud/Tests/carts.test.js (13.495 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

{"level":40,"time":1782642129594,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"a8f6895c-826d-4b49-89a0-35d784a0a2ee","method":"POST","path":"/api/reset-password","statusCode":404,"responseTimeMs":161}
{"level":40,"time":1782642129675,"pid":8872,"hostname":"AleCompu","msg":"HTTP Request","reqId":"bf92957b-c032-4ef9-a480-a8b3546f1562","method":"POST","path":"/api/reset-password","statusCode":400,"responseTimeMs":71}
 PASS  crud/Tests/users.test.js (13.841 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: ⚙️  override existing env vars with { override: true }

      at _log (node_modules/dotenv/lib/main.js:142:11)

    console.error
      Service error

      12 |     } catch (error) {
      13 |         console.error(error.message);
    > 14 |         return next(createError(error.message, 500));
         |             ^
      15 |     }
      16 | };
      17 |

      at getUsers (crud/src/controllers/users.controller.js:14:13)
      at Object.<anonymous> (crud/Tests/users.test.js:291:13)

    console.error
      Service error

      28 |         console.error(error.message);
      29 |         return next(createError(error.message, 500));
    > 30 |     }
         |      ^
      31 | };
      32 |
      33 | export const createUser = async (req, res, next) => {

      at getUserByEmail (crud/src/controllers/users.controller.js:30:13)
      at Object.<anonymous> (crud/Tests/users.test.js:299:13)

    console.error
      Service error

      64 | export const deleteUser = async (req, res, next) => {
      65 |     const { email } = req.body;
    > 66 |
         | ^
      67 |     try {
      68 |         let users = await userService.deleteUser(email);
      69 |         if (!users) {

      at updateUser (crud/src/controllers/users.controller.js:66:13)
      at Object.<anonymous> (crud/Tests/users.test.js:313:13)

    console.error
      Service error

      82 |
      83 |

      at deleteUser (crud/src/controllers/users.controller.js:84:13)
      at Object.<anonymous> (crud/Tests/users.test.js:320:13)

{"level":30,"time":1782642130073,"pid":12484,"hostname":"AleCompu","msg":"Conexion a MongoDB exitosa"}
{"level":30,"time":1782642130606,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"83333248-d0c3-4941-b3fc-c8214097c7fa","method":"GET","path":"/api/products","statusCode":200,"responseTimeMs":287}
{"level":30,"time":1782642130768,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7b697e9a-7d39-426b-b2b9-10542004bbf2","method":"GET","path":"/api/products/68ecb6f99407b0e3e0bf3096","statusCode":200,"responseTimeMs":149}
{"level":40,"time":1782642130846,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"fc94007f-3b99-4713-87e1-87d7090ce8ea","method":"GET","path":"/api/products/productoFalso","statusCode":404,"responseTimeMs":69}
{"level":30,"time":1782642131025,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3e20dfab-41c4-4cb5-9218-b25f18c2e88b","method":"POST","path":"/api/products","statusCode":201,"responseTimeMs":169}
{"level":40,"time":1782642131102,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"cbb010a0-53ca-4872-9ac2-65a1fb0b5174","method":"POST","path":"/api/products","statusCode":401,"responseTimeMs":69}
{"level":40,"time":1782642131181,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"3734db49-f515-41a4-8219-0caffd5143da","method":"POST","path":"/api/products","statusCode":403,"responseTimeMs":70}
 PASS  crud/Tests/auth.test.js (15.437 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

    console.error
      DB error

      62 |         if (email === env.ADMIN_USER && password === env.ADMIN_PASS) {
      63 |             const adminUser = {
    > 64 |                 _id: "admin_id",
         |             ^
      65 |                 first_name: "Admin",
      66 |                 last_name: "System",
      67 |                 email: email,

      at register (crud/src/controllers/auth.controller.js:64:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:237:13)

    console.error
      Duplicate

      62 |         if (email === env.ADMIN_USER && password === env.ADMIN_PASS) {
      63 |             const adminUser = {
    > 64 |                 _id: "admin_id",
         |             ^
      65 |                 first_name: "Admin",
      66 |                 last_name: "System",
      67 |                 email: email,

      at register (crud/src/controllers/auth.controller.js:64:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:249:13)

    console.error
      DB error

      152 | //Password RESET
      153 | export const resetPassword = async (req, res, next) => {
    > 154 |     const { token, password } = req.body;
          |             ^
      155 |
      156 |     try {
      157 |         const decoded = jwt.verify(token, env.JWT_SECRET);

      at login (crud/src/controllers/auth.controller.js:154:13)
      at Object.<anonymous> (crud/Tests/auth.test.js:259:13)

    console.error
      Error al destruir la sesión: Error: Destroy error
          at Object.<anonymous> (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\Tests\auth.test.js:274:66)
          at C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:305:39
          at Object.<anonymous> (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:312:13)
          at Object.mockConstructor [as destroy] (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-mock\build\index.js:57:19)
          at logout (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\src\controllers\auth.controller.js:249:15)
          at Object.logout (C:\Users\Tincho\Desktop\El Bar del Fondo\crud\Tests\auth.test.js:277:13)
          at Promise.finally.completed (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1561:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1501:10)
          at _callCircusTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1011:40)
          at processTicksAndRejections (node:internal/process/task_queues:105:5)
          at _runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:951:3)
          at C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:853:7
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:866:11)
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
          at _runTestsForDescribeBlock (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:861:11)
          at run (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:765:3)
          at runAndTransformResultsToJestFormat (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\jestAdapterInit.js:1993:21)
          at jestAdapter (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-circus\build\runner.js:111:19)
          at runTestInternal (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:276:16)
          at runTest (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:344:7)
          at Object.worker (C:\Users\Tincho\Desktop\El Bar del Fondo\node_modules\jest-runner\build\testWorker.js:498:12)

    

      at crud/src/controllers/auth.controller.js:251:15
      at Object.cb (crud/Tests/auth.test.js:274:63)
      at logout (crud/src/controllers/auth.controller.js:249:15)
      at Object.logout (crud/Tests/auth.test.js:277:13)

{"level":50,"time":1782642131325,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"9d293489-af81-4e96-960d-8c46bd068c2b","method":"POST","path":"/api/products","statusCode":500,"responseTimeMs":135}
{"level":30,"time":1782642131480,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"cf57fc26-8864-4fb8-86e6-c803f20c6b06","method":"PUT","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":200,"responseTimeMs":147}
{"level":40,"time":1782642131562,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"fc2dd1c5-2489-498b-ad7c-5cd81193c6c8","method":"PUT","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":401,"responseTimeMs":71}
{"level":40,"time":1782642131640,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"49ded884-81fb-4909-8335-4622e53e7080","method":"PUT","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":403,"responseTimeMs":71}
{"level":40,"time":1782642131786,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"42740264-95cb-4a48-bc60-f40e57e6f9a3","method":"PUT","path":"/api/products/6a40f5d34a7e1f537d6dd3f2","statusCode":404,"responseTimeMs":140}
{"level":50,"time":1782642131863,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"297c167a-84d6-41b2-baff-014a049847d3","method":"PUT","path":"/api/products/idInvalido","statusCode":500,"responseTimeMs":71}
{"level":40,"time":1782642131933,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"0997b915-5c34-43ba-bf2a-29361afdbf5c","method":"DELETE","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":401,"responseTimeMs":64}
{"level":40,"time":1782642132010,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"fe6e8389-9527-487c-9a98-c5578cb5fbe2","method":"DELETE","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":403,"responseTimeMs":71}
{"level":40,"time":1782642132147,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"7be846c5-5c08-417c-9b4a-df8c43d6ae02","method":"DELETE","path":"/api/products/6a40f5d44a7e1f537d6dd3f4","statusCode":404,"responseTimeMs":131}
{"level":50,"time":1782642132226,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"d41651a3-4a86-4c1c-a87f-5fc696ecfd97","method":"DELETE","path":"/api/products/idInvalido","statusCode":500,"responseTimeMs":72}
{"level":30,"time":1782642132368,"pid":12484,"hostname":"AleCompu","msg":"HTTP Request","reqId":"b597f119-b12d-4f64-bdb2-6f7c32cbf238","method":"DELETE","path":"/api/products/6a40f5d24a7e1f537d6dd3ed","statusCode":200,"responseTimeMs":136}
 PASS  crud/Tests/products.test.js (7.735 s)
  ● Console

    console.log
      [dotenv@17.2.3] injecting env (15) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)
```
</details>

---

## 3. Dockerización
### Dockerfile optimizado
El proyecto cuenta con un `Dockerfile` configurado para producción.
> [!NOTE]
> *Dockerfile estructura base (pegar aca para la entrega):*
```dockerfile
FROM node:18-alpine
# Crear directorio de la app
WORKDIR /usr/src/app
# Instalar dependencias (aprovechar cache copiando package.json primero)
COPY package*.json ./
RUN npm install --omit=dev
# Copiar el código fuente
COPY . .
# Exponer el puerto
EXPOSE 8080
# Comando para iniciar la aplicación
CMD ["npm", "start"]
```

### Decisiones de optimización:
1. **Base Image (`node:22-alpine`)**: Se utiliza una imagen de Alpine Linux que es considerablemente más ligera que las imágenes de Node estándar, reduciendo el tamaño final, el tiempo de descarga y la superficie de ataque.
2. **Capas (Caché de Docker)**: Se copian los `package.json` y se instalan las dependencias antes de copiar el resto del código. Esto permite que Docker use la capa cacheada de `node_modules` si no hubo cambios en las dependencias.
3. **Dependencias de Producción (`--omit=dev`)**: Se omiten paquetes como Jest o Supertest dentro de la imagen final de producción para optimizar aún más el tamaño.

### Log de construcción (Build Log)
<details>
<summary>▶️ Ver logs de build de la imagen de docker (11/11 steps finished)</summary>

```text
$ docker build -t martinquiroga/el-bar-del-fondo:1.0.0 .
[+] Building 40.1s (11/11) FINISHED                                                                                                        docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                                                                       0.1s
 => => transferring dockerfile: 215B                                                                                                                       0.0s
 => [internal] load metadata for docker.io/library/node:22-alpine                                                                                          3.1s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                0.0s
 => [internal] load .dockerignore                                                                                                                          0.0s
 => => transferring context: 76B                                                                                                                           0.0s
 => [1/5] FROM docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2                                    7.9s
 => => resolve docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2                                    0.1s
 => => sha256:1d4d101ceaad39fb56dcac0bb6cc291e6cdec3b711786f0c82b050b5b5b85690 1.26MB / 1.26MB                                                             0.5s
 => => sha256:d10ff586f6bdbdd6000a70a914e56bf05bedc78de3311d08a953643982d84e23 446B / 446B                                                                 0.5s
 => => sha256:3f4c164634d251a8b256151a9e1c1d3e5c5b21f1974f00a213875e66e3fa0801 52.31MB / 52.31MB                                                           4.7s
 => => extracting sha256:3f4c164634d251a8b256151a9e1c1d3e5c5b21f1974f00a213875e66e3fa0801                                                                  2.7s
 => => extracting sha256:1d4d101ceaad39fb56dcac0bb6cc291e6cdec3b711786f0c82b050b5b5b85690                                                                  0.1s
 => => extracting sha256:d10ff586f6bdbdd6000a70a914e56bf05bedc78de3311d08a953643982d84e23                                                                  0.0s
 => [internal] load build context                                                                                                                          0.2s
 => => transferring context: 201.30kB                                                                                                                      0.2s
 => [2/5] WORKDIR /app                                                                                                                                     0.6s
 => [3/5] COPY package*.json ./                                                                                                                            0.1s
 => [4/5] RUN npm ci --omit=dev                                                                                                                           17.4s
 => [5/5] COPY . .                                                                                                                                         0.4s 
 => exporting to image                                                                                                                                    10.0s 
 => => exporting layers                                                                                                                                    4.9s 
 => => exporting manifest sha256:3839215d42f48efe9c0422ca1d399cf1070a1daba5d89d0c83f0da8c384863ae                                                          0.0s 
 => => exporting config sha256:5781962029bd46c499fc743dad86a33ce68153a68ac2541eafa85d59b8b822fa                                                            0.0s 
 => => exporting attestation manifest sha256:792233084a6d756191d07abaf2884d57fb1d9f7d43a065fa602aadca6b362dec                                              0.0s
 => => exporting manifest list sha256:d0e643f0aad7f218e8e81a9586236d36318cbd726f582d6d55078bb68df215ee                                                     0.0s
 => => naming to docker.io/martinquiroga/el-bar-del-fondo:1.0.0                                                                                            0.0s
 => => unpacking to docker.io/martinquiroga/el-bar-del-fondo:1.0.0                                                                                         4.9s
```
</details>

---

## 4. Imagen Docker

**Nombre y tag de la imagen generada:** 
`martinquiroga/el-bar-del-fondo:1.0.0`

### Evidencia de construcción
Docker buildeado y pusheado:
<img width="1457" height="692" alt="Docker-evidenciaDeExecucion" src="https://github.com/user-attachments/assets/954184d9-b4c8-4a22-9a2a-b69361ded2e6" />

### Evidencia de ejecución del contenedor

Docker servidor conectado a MongoDB y escuchando puerto:
<img width="1001" height="362" alt="Captura de pantalla - DockerHub - Log de run exitosa con conexion a moongose" src="https://github.com/user-attachments/assets/28261369-be9b-4d52-9816-6d4b99446539" />
---

## 5. Ejecución del proyecto (Instrucciones)

A continuación se detallan los comandos necesarios para poner a prueba el proyecto.

### A) Ejecución normal (Desarrollo)
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar la aplicación
npm start
```
*La aplicación corre por defecto en `http://localhost:8080`*

### B) Correr los tests localmente
```bash
# Ejecutar suite de pruebas con Jest
npm run test
```

### C) Descargar la imagen desde DockerHub (Pull)
```bash
docker pull martinquiroga/el-bar-del-fondo:1.0.0
```

### D) Ejecutar el contenedor (Run)
Para correr la aplicación mapeando el puerto e inyectando las variables de entorno necesarias, ejecuta el siguiente comando:

```bash
docker run -d -p 8080:8080 --name el-bar-del-fondo \
  -e URI_MONGO_CONNECT="tu_cadena_de_conexion" \
  -e JWT_SECRET="tu_clave_secreta" \
  -e GITHUB_CLIENT_ID="tu_client_id" \
  -e GITHUB_CLIENT_SECRET="tu_client_secret" \
  -e MAIL_APP="tu_password_de_aplicacion" \
  -e USER_G="tu_email" \
  martinquiroga/el-bar-del-fondo:1.0.0
```
*(Nota: también puedes usar `--env-file .env` si prefieres tener todas las variables en un archivo local en lugar de inyectarlas una por una con `-e`).*

### Evidencia de ejecución exitosa

Imagen subida a DockerHUB
> 
> <img width="1852" height="957" alt="Captura de pantalla - DockerHub - Interfaz del proyecto" src="https://github.com/user-attachments/assets/596c5efd-1f7d-46a3-8910-52d44443eac0" />


Imagen de docker funcionando live localmente

> <img width="1722" height="687" alt="Docker-runImage" src="https://github.com/user-attachments/assets/85814303-d6f9-4933-9c1f-ed382d3d2f17" />


Endpoint GET para obtener productos - Exitosa

> <img width="901" height="902" alt="Postman-getProducts" src="https://github.com/user-attachments/assets/af61a9cc-df0d-48a3-bac6-f24f69de335f" />


Endpoint de login con credenciales de administrador - Exitosa

> <img width="901" height="717" alt="Postman-loginAdmin" src="https://github.com/user-attachments/assets/e9b4b0e3-7edd-4160-90df-8d55d0551598" />


Endpoint POST para subir product con credenciales de usuario -Example Error 401

> <img width="905" height="697" alt="Postman-subirProductError(noAdminToken)" src="https://github.com/user-attachments/assets/f850df96-2b29-4b9d-8aea-56982d0f043b" />


Endpoint POST para subir product con credenciales de admin -Exitosa

> <img width="907" height="792" alt="Postman-subirProductSuccess" src="https://github.com/user-attachments/assets/a6f2c35f-60b7-45a3-9992-8d2b2e94a914" />






