import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { passportCall } from "../config/passport.config.js";

const productsRouter = express.Router();

//Traer productos
productsRouter.get("/", getProducts);

// Crear producto
productsRouter.post("/", passportCall(), isAdmin, createProduct);

//Modificar Producto
productsRouter.put("/:pid", passportCall(), isAdmin, updateProduct);

//Borrar Producto
productsRouter.delete("/:pid", passportCall(), isAdmin, deleteProduct);

export default productsRouter;