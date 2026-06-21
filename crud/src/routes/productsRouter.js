import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const productsRouter = express.Router();

//Traer productos
productsRouter.get("/", getProducts);
/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Obtener todos los productos
 *      description: Devuelve el listado de todos los productos
 *      tags: 
 *          - Products
 *      responses: 
 *          200:
 *              description: Lista de productos obtenida correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ProductsResponse"
 *          404:
 *              description: No se encontraron productos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
//Obtener producto por ID
productsRouter.get("/:pid", getProductById);
/**
 * @swagger
 * /api/products/{pid}:
 *  get:
 *      summary: Obtener un producto por ID
 *      description: Devuelve el producto con el ID especificado
 *      tags: 
 *          - Products
 *      parameters:
 *        - in: path
 *          name: pid
 *          required: true
 *          description: ID del producto
 *          schema:
 *            type: string
 *          example: 68ecb6f99407b0e3e0bf3096
 *      responses: 
 *          200:
 *              description: Producto obtenido correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ProductResponse"
 *          404:
 *              description: No se pudó encontrar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
// Crear producto
productsRouter.post("/", authenticate, authorizeAdmin, createProduct);
/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Crear un producto
 *      description: Crea un nuevo producto
 *      tags: 
 *          - Products
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ProductInput"
 *      responses: 
 *          201:
 *              description: Producto creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ProductResponse"
 *          401:
 *              description: Token is required
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          500:
 *              description: Error al crear el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
//Modificar Producto
productsRouter.put("/:pid", authenticate, authorizeAdmin, updateProduct);
/**
 * @swagger
 * /api/products/{pid}:
 *  put:
 *      summary: Modificar un producto
 *      description: Modifica un producto existente por su ID
 *      tags: 
 *          - Products
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: pid
 *          required: true
 *          description: ID del producto a modificar
 *          schema:
 *            type: string
 *          example: 68ecb6f99407b0e3e0bf3096
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ProductInput"
 *      responses: 
 *          200:
 *              description: Producto modificado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ProductResponse"
 *          401:
 *              description: Token is required
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          404:
 *              description: Error al encontrar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error al modificar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

//Borrar Producto
productsRouter.delete("/:pid", authenticate, authorizeAdmin, deleteProduct);
/**
 * @swagger
 * /api/products/{pid}:
 *  delete:
 *      summary: Borrar un producto
 *      description: Elimina un producto por su ID
 *      tags: 
 *          - Products
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: pid
 *          required: true
 *          description: ID del producto a eliminar
 *          schema:
 *            type: string
 *          example: 68ecb6f99407b0e3e0bf3096
 *      responses: 
 *          200:
 *              description: Producto eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ProductResponse"
 *          401:
 *              description: Token is required
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *          404:
 *              description: Error al encontrar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 *          500:
 *              description: Error al borrar el producto
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */

export default productsRouter;