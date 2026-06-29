import { Router, urlencoded } from "express"
import passport from "passport"
import { passportCall } from "../config/passport.config.js";
import { register, login, logout, githubCallback, getCurrentUser, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.use(urlencoded({ extended: true }))

router.post("/register", register)
/**
 * @swagger
 * /api/register:
 *  post:
 *      summary: Registrar un nuevo usuario
 *      description: Registra un nuevo usuario con email y contraseña
 *      tags: 
 *          - Authentication
 *      responses: 
 *          201:
 *              description: Usuario creado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          409:
 *              description: Usuario ya registrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/login", login)
/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: Iniciar sesión
 *      description: Inicia sesión con email y contraseña
 *      tags: 
 *          - Authentication
 *      responses: 
 *          200:
 *              description: Sesión iniciada correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          401:
 *              description: Credenciales inválidas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/logout", logout)
/**
 * @swagger
 * /api/logout:
 *  get:
 *      summary: Cerrar sesión
 *      description: Cierra la sesión del usuario
 *      tags: 
 *          - Authentication
 *      responses: 
 *          200:
 *              description: Sesión cerrada correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/reset-password", resetPassword);
/**
 * @swagger
 * /api/reset-password:
 *  post:
 *      summary: Restablecer contraseña
 *      description: Restablece la contraseña del usuario
 *      tags: 
 *          - Authentication
 *      responses: 
 *          200:
 *              description: Contraseña restablecida correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

// Rutas de autenticacion GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))
/**
 * @swagger
 * /api/github:
 *  get:
 *      summary: Iniciar sesión con GitHub
 *      description: Redirige a GitHub para iniciar sesión
 *      tags: 
 *          - Authentication
 *      responses: 
 *          302:
 *              description: Redirección exitosa hacia GitHub login o fallo
 */
router.get("/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    githubCallback
)
/**
 * @swagger
 * /api/githubcallback:
 *  get:
 *      summary: Callback de GitHub
 *      description: Recibe la respuesta de GitHub y gestiona la sesión, redirigiendo a la ruta principal
 *      tags: 
 *          - Authentication
 *      responses: 
 *          302:
 *              description: Redirección exitosa o fallida
 */

// Ruta current para validar al usuario logueado y devuelve datos asociados al JWT
router.get("/current",
    passportCall(),
    getCurrentUser
);
/**
 * @swagger
 * /api/current:
 *  get:
 *      summary: Obtener usuario actual
 *      description: Obtiene el usuario actual
 *      tags: 
 *          - Authentication
 *      responses: 
 *          200:
 *              description: Usuario obtenido correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          401:
 *              description: Credenciales inválidas
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

export default router;
