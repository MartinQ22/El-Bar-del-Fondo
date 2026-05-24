import { CartService } from "../services/carts.service.js";
import { createError } from "../utils/createError.utils.js";
import { successResponse } from "../utils/apiResonse.utils.js";

const cartService = new CartService();

export const createCart = async (req, res, next) => {
    try {
        const cart = await cartService.createCart();
        return successResponse(res, { statusCode: 201, message: "Carrito creado", payload: cart });
    } catch (error) {
        return next(createError("Error al crear el carrito", 500));
    }
};

export const deleteProductFromCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.removeProductFromCart(cid, pid);

        return successResponse(res, { message: "Producto eliminado del carrito", payload: cart });
    } catch (error) {
        if (error.message === "Carrito no encontrado" || error.message === "Producto no encontrado en este carrito") {
            return next(createError(error.message, 404));
        }
        return next(createError("Error al borrar el producto", 500));
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;

        const updatedCart = await cartService.clearCart(cid);

        if (!updatedCart) {
            return next(createError("Carrito no encontrado", 404));
        }
        return successResponse(res, { message: "Todos los productos eliminados del carrito", payload: updatedCart });
    } catch (error) {
        return next(createError("Error al vaciar el carrito", 500));
    }
};

export const addProductToCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
        if (!updatedCart) {
            return next(createError("Error al agregar el producto", 404));
        }
        return successResponse(res, { message: "Producto Añadido", payload: updatedCart });
    } catch (error) {
        return next(createError("Error al añadir el producto al carrito", 500));
    }
};

export const getCart = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
        if (!cart) {
            return next(createError("Error al buscar el carrito", 404));
        }
        return successResponse(res, { message: "Productos Encontrado", payload: cart.products });
    } catch (error) {
        return next(createError(error.message, 500));
    }
};

