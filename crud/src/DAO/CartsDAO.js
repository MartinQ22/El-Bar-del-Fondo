import Cart from "../models/cartModel.js";

export class CartsDAO {
    /**
     * Crea un nuevo documento de carrito en MongoDB.
     * @returns {Promise<Object>} El carrito creado.
     */
    async createCart() {
        return await Cart.create({ products: [] });
    }

    /**
     * Busca un carrito por su ID y puebla la referencia de productos.
     * @param {string} id - ID del carrito.
     * @returns {Promise<Object|null>} El carrito populado o null.
     */
    async getCartById(id) {
        return await Cart.findById(id).populate("products.product");
    }

    /**
     * Busca un carrito y actualiza sus campos/productos.
     * @param {string} id - ID del carrito.
     * @param {Object} updateData - Datos de actualización.
     * @returns {Promise<Object|null>} El carrito modificado o null.
     */
    async updateCart(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    /**
     * Busca un carrito por su ID sin popular sus productos.
     * @param {string} id - ID del carrito.
     * @returns {Promise<Object|null>} El documento del carrito o null.
     */
    async findById(id) {
        return await Cart.findById(id);
    }
}

