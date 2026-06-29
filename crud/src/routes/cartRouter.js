import express from "express";
import { createCart, deleteProductFromCart, clearCart, addProductToCart, getCart } from "../controllers/carts.controller.js";
import { isUser } from "../middlewares/auth.middleware.js";
import { passportCall } from "../config/passport.config.js";

const cartRouter = express.Router();

// Crear carritos vacios
cartRouter.post("/", createCart);
/**
 * @swagger
 * /api/carts:
 *  post:
 *      summary: Crear un carrito vacío
 *      description: Crea un nuevo carrito vacío en la base de datos
 *      tags: 
 *          - Carts
 *      responses: 
 *          201:
 *              description: Carrito creado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CartResponse"
 *          500:
 *              description: Error interno del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

//Eliminar un producto por id del carrito
cartRouter.delete("/:cid/products/:pid", deleteProductFromCart);
/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *  delete:
 *      summary: Eliminar un producto del carrito
 *      description: Elimina un producto específico de un carrito por sus respectivos IDs
 *      tags: 
 *          - Carts
 *      parameters:
 *        - in: path
 *          name: cid
 *          required: true
 *          description: ID del carrito
 *          schema:
 *            type: string
 *          example: 6a3d076e82047a1d9a1f48ce
 *        - in: path
 *          name: pid
 *          required: true
 *          description: ID del producto
 *          schema:
 *            type: string
 *          example: 68ecb6f99407b0e3e0bf3096
 *      responses: 
 *          200:
 *              description: Producto eliminado del carrito
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CartResponse"
 *          404:
 *              description: Carrito o producto no encontrado
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

//Eliminar todos los productos del carrito
cartRouter.delete("/:cid", clearCart);
/**
 * @swagger
 * /api/carts/{cid}:
 *  delete:
 *      summary: Vaciar carrito
 *      description: Elimina todos los productos de un carrito específico
 *      tags: 
 *          - Carts
 *      parameters:
 *        - in: path
 *          name: cid
 *          required: true
 *          description: ID del carrito a vaciar
 *          schema:
 *            type: string
 *          example: 6a3d076e82047a1d9a1f48ce
 *      responses: 
 *          200:
 *              description: Carrito vaciado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CartResponse"
 *          404:
 *              description: Carrito no encontrado
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

//Agregar productos al carrito
cartRouter.post("/:cid/product/:pid", passportCall(), isUser, addProductToCart);
/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *  post:
 *      summary: Agregar producto al carrito
 *      description: Agrega un producto a un carrito específico. Requiere permisos de usuario.
 *      tags: 
 *          - Carts
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: cid
 *          required: true
 *          description: ID del carrito
 *          schema:
 *            type: string
 *          example: 6a3d076e82047a1d9a1f48ce
 *        - in: path
 *          name: pid
 *          required: true
 *          description: ID del producto a agregar
 *          schema:
 *            type: string
 *          example: 68ecb6f99407b0e3e0bf3096
 *      responses: 
 *          200:
 *              description: Producto agregado al carrito correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CartResponse"
 *          401:
 *              description: Token requerido o no autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          403:
 *              description: Prohibido (solo usuarios pueden agregar productos)
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

//Traer productos del carrito 
cartRouter.get("/:cid", getCart);
/**
 * @swagger
 * /api/carts/{cid}:
 *  get:
 *      summary: Obtener carrito
 *      description: Obtiene un carrito y los productos en él por su ID
 *      tags: 
 *          - Carts
 *      parameters:
 *        - in: path
 *          name: cid
 *          required: true
 *          description: ID del carrito a consultar
 *          schema:
 *            type: string
 *          example: 6a3d076e82047a1d9a1f48ce
 *      responses: 
 *          200:
 *              description: Carrito obtenido correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CartResponse"
 *          404:
 *              description: Carrito no encontrado
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

export default cartRouter;