import { CartsDAO } from "../DAO/CartsDAO.js";

const cartsDao = new CartsDAO();

export class CartService {
    async createCart() {
        return await cartsDao.createCart();
    }

    async getCart(id) {
        return await cartsDao.getCartById(id);
    }

    async addProductToCart(cid, pid, quantity) {
        const update = { $push: { products: { product: pid, quantity } } };
        return await cartsDao.updateCart(cid, update);
    }

    async removeProductFromCart(cid, pid) {
        
        const cart = await cartsDao.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        const initialLength = cart.products.length;
        // Filter
        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        if (cart.products.length === initialLength) {
            throw new Error("Producto no encontrado en este carrito");
        }

        return await cart.save();
    }

    async clearCart(cid) {
        return await cartsDao.updateCart(cid, { products: [] });
    }
}
