import { CartsDAO } from "../DAO/CartsDAO.js";

const cartsDao = new CartsDAO();

/**
 * Servicio encargado de gestionar las operaciones de negocio relacionadas con los carritos de compras.
 * Conecta el controlador (capa de presentación/rutas) con la capa DAO (capa de acceso a datos).
 */
export class CartService {
    /**
     * Crea un nuevo carrito vacío en la base de datos.
     * @returns {Promise<Object>} El carrito creado.
     */
    async createCart() {
        return await cartsDao.createCart();
    }

    /**
     * Recupera un carrito por su identificador único, poblando la información de los productos relacionados.
     * @param {string} id - ID del carrito.
     * @returns {Promise<Object|null>} El carrito encontrado o null.
     */
    async getCart(id) {
        return await cartsDao.getCartById(id);
    }

    /**
     * Agrega un producto a un carrito específico o incrementa su cantidad si ya existe.
     * @param {string} cid - ID del carrito.
     * @param {string} pid - ID del producto.
     * @param {number} quantity - Cantidad a añadir.
     * @returns {Promise<Object>} El carrito actualizado.
     */
    async addProductToCart(cid, pid, quantity) {
        const update = { $push: { products: { product: pid, quantity } } };
        return await cartsDao.updateCart(cid, update);
    }

    /**
     * Elimina por completo un producto de un carrito.
     * @param {string} cid - ID del carrito.
     * @param {string} pid - ID del producto a eliminar.
     * @throws {Error} Si el carrito no existe o si el producto no está en el carrito.
     * @returns {Promise<Object>} El carrito actualizado y guardado.
     */
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

    /**
     * Vacía por completo todos los productos contenidos en un carrito.
     * @param {string} cid - ID del carrito.
     * @returns {Promise<Object>} El carrito actualizado y sin productos.
     */
    async clearCart(cid) {
        return await cartsDao.updateCart(cid, { products: [] });
    }
}

