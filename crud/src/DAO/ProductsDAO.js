import Product from "../models/productModel.js";

export class ProductsDAO {
    async getAllProducts(query = {}, options = {}) {
        return await Product.paginate(query, options);
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async createProduct(productData) {
        return await Product.create(productData);
    }

    async updateProduct(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}
