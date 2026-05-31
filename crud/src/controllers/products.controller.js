import { ProductService } from "../services/products.service.js";
import { createError } from "../utils/createError.utils.js";
import { successResponse } from "../utils/apiResponse.utils.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await productService.getProducts({}, { limit, page });
        const products = data.docs;
        delete data.docs;

        return successResponse(res, { message: "Lista de productos", payload: { products, ...data } });
    } catch (error) {
        return next(createError("Error al obtener los productos", 500));
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        return successResponse(res, { statusCode: 201, message: "Producto creado", payload: product });
    } catch (error) {
        return next(createError("Error al crear el producto", 500));
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const updatedProduct = await productService.updateProduct(pid, updates);
        if (!updatedProduct) {
            return next(createError("Error al encontrar el producto", 404));
        }

        return successResponse(res, { message: "Producto modificado", payload: updatedProduct });
    } catch (error) {
        return next(createError("Error al modificar el producto", 500));
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const deletedProduct = await productService.deleteProduct(pid);
        if (!deletedProduct) {
            return next(createError("Error al encontrar el producto", 404));
        }

        return successResponse(res, { message: "↓↓↓ Producto eliminado ↓↓↓", payload: deletedProduct });
    } catch (error) {
        return next(createError("Error al borrar el producto", 500));
    }
};

