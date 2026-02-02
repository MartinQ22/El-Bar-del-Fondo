import Cart from "../models/cartModel.js";

export class CartsDAO {
    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        return await Cart.findById(id).populate("products.product");
    }

    async updateCart(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async findById(id) {
        return await Cart.findById(id);
    }
}
