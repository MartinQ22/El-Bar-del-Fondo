import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const productsRouter = express.Router();

//Traer productos
productsRouter.get("/", getProducts);

// Crear producto
productsRouter.post("/", createProduct);

//Modificar Producto
productsRouter.put("/:pid", updateProduct);

//Borrar Producto
productsRouter.delete("/:pid", deleteProduct);

export default productsRouter;