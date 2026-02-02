import { ProductService } from "../services/products.service.js";

const productService = new ProductService();

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await productService.getProducts({}, { limit, page });
        const products = data.docs;
        delete data.docs;

        res.status(200).json({ status: "success", payload: products, ...data });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al recuperar el producto" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el producto" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const updatedProduct = await productService.updateProduct(pid, updates);
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

        res.status(200).json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al modificar el producto" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const deletedProduct = await productService.deleteProduct(pid);
        if (!deletedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

        res.status(200).json({ status: "success", message: "↓↓↓ Producto eliminado ↓↓↓", payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al borrar el producto" });
    }
};
