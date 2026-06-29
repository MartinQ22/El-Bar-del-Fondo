import { Router } from "express";
import { sendWelcomeMessage, sendPasswordReset } from "../controllers/mailing.controller.js";

const router = Router();

router.get("/welcome", sendWelcomeMessage)
/**
 * @swagger
 * /api/mailing/welcome:
 *  get:
 *      summary: Enviar correo de bienvenida
 *      description: Envía un correo electrónico de bienvenida al usuario logueado
 *      tags: 
 *          - Mailing
 *      security:
 *          - bearerAuth: []
 *      responses: 
 *          200:
 *              description: Correo enviado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          401:
 *              description: Token requerido o no autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor al enviar correo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

router.post("/reset-password-request", sendPasswordReset)
/**
 * @swagger
 * /api/mailing/reset-password-request:
 *  post:
 *      summary: Solicitar restablecimiento de contraseña
 *      description: Envía un correo electrónico con un enlace para restablecer la contraseña
 *      tags: 
 *          - Mailing
 *      responses: 
 *          200:
 *              description: Correo de restablecimiento enviado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          400:
 *              description: Correo electrónico inválido o no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error interno del servidor al enviar correo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

export default router