import express from "express";
import { createCart, deleteProductFromCart, clearCart, addProductToCart, getCart } from "../controllers/carts.controller.js";
import { isUser } from "../middlewares/auth.middleware.js";
import { passportCall } from "../config/passport.config.js";

const cartRouter = express.Router();

// Crear carritos vacios
cartRouter.post("/", createCart);

//Eliminar un producto por id del carrito
cartRouter.delete("/:cid/products/:pid", deleteProductFromCart);

//Eliminar todos los productos del carrito
cartRouter.delete("/:cid", clearCart);

//Agregar productos al carrito
cartRouter.post("/:cid/product/:pid", passportCall(), isUser, addProductToCart);

//Traer productos del carrito 
cartRouter.get("/:cid", getCart);

export default cartRouter;