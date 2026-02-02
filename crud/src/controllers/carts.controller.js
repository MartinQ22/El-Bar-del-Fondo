import { CartService } from "../services/carts.service.js";

const cartService = new CartService();

export const createCart = async (req, res) => {
    try {
        const cart = await cartService.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.removeProductFromCart(cid, pid);

        res.status(200).json({ status: "success", message: "Producto eliminado del carrito", payload: cart });
    } catch (error) {
        if (error.message === "Carrito no encontrado" || error.message === "Producto no encontrado en este carrito") {
            return res.status(404).json({ status: "error", message: error.message });
        }
        res.status(500).json({ status: "error", message: "Error al borrar el producto", error: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cid = req.params.cid;

        const updatedCart = await cartService.clearCart(cid);

        if (!updatedCart) { return res.status(404).json({ status: "error", message: "Carrito no encontrado" }); }
        res.status(200).json({ status: "success", message: "Todos los productos eliminados del carrito", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al vaciar el carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Error al agregar el producto" });
        res.status(200).json({ message: "Producto Añadido", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al añadir el producto al carrito" });
    }
};

export const getCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Error al buscar el carrito" });
        res.status(200).json({ status: "success", message: "Productos Encontrado", payload: cart.products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
