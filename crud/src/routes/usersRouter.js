import { Router } from "express";
import { getUsers, getUserByEmail, failRegister, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Obtener todos los usuarios
 *      description: Obtiene una lista de todos los usuarios registrados
 *      tags: 
 *          - Users
 *      responses: 
 *          200:
 *              description: Lista de usuarios obtenida correctamente
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

router.get("/failure-register", failRegister);
/**
 * @swagger
 * /api/users/failure-register:
 *  get:
 *      summary: Error de registro
 *      description: Endpoint utilizado cuando falla el registro de un usuario
 *      tags: 
 *          - Users
 *      responses: 
 *          400:
 *              description: Fallo al registrar el usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

router.post("/create", createUser);
/**
 * @swagger
 * /api/users/create:
 *  post:
 *      summary: Crear un usuario
 *      description: Crea un nuevo usuario en la base de datos
 *      tags: 
 *          - Users
 *      responses: 
 *          201:
 *              description: Usuario creado exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          400:
 *              description: Faltan datos requeridos o error de validación
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

router.put("/email", updateUser);
/**
 * @swagger
 * /api/users/email:
 *  put:
 *      summary: Actualizar email del usuario
 *      description: Actualiza el correo electrónico de un usuario proporcionado en el body
 *      tags: 
 *          - Users
 *      responses: 
 *          200:
 *              description: Usuario actualizado exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          400:
 *              description: Datos inválidos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          404:
 *              description: Usuario no encontrado
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

router.delete("/email", deleteUser);
/**
 * @swagger
 * /api/users/email:
 *  delete:
 *      summary: Eliminar un usuario por email
 *      description: Elimina de la base de datos a un usuario por su correo electrónico
 *      tags: 
 *          - Users
 *      responses: 
 *          200:
 *              description: Usuario eliminado exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          404:
 *              description: Usuario no encontrado
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

router.get("/mail/:email", getUserByEmail);
/**
 * @swagger
 * /api/users/mail/{email}:
 *  get:
 *      summary: Obtener usuario por email
 *      description: Obtiene un usuario específico mediante su correo electrónico
 *      tags: 
 *          - Users
 *      parameters:
 *        - in: path
 *          name: email
 *          required: true
 *          description: Email del usuario
 *          schema:
 *            type: string
 *          example: user@example.com
 *      responses: 
 *          200:
 *              description: Usuario encontrado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UserResponse"
 *          404:
 *              description: Usuario no encontrado
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

//Ruta de error generico 
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
});

export default router;