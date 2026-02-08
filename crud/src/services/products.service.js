import { ProductsDAO } from "../DAO/ProductsDAO.js";

const productsDao = new ProductsDAO();

export class ProductService {
    async getProducts(query, options) {
        return await productsDao.getAllProducts(query, options);
    }

    async createProduct(productData) {
        return await productsDao.createProduct(productData);
    }

    async updateProduct(id, updateData) {
        return await productsDao.updateProduct(id, updateData);
    }

    async deleteProduct(id) {
        return await productsDao.deleteProduct(id);
    }
}
