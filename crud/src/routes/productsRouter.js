import express from "express";
import Product from "../models/productModel.js";

const productsRouter = express.Router();

//Traer productos
productsRouter.get("/", async(req, res)=>{
  try {

    const { limit = 10, page = 1 } = req.query;

    const data = await Product.paginate( {}, { limit, page } );
    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al recuperar el producto" });
  }
});

// Crear producto
productsRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, category, stock } = req.body;
    const product = new Product({ title, description, code, price, category, stock })

    await product.save();
    res.status(201).json({ status: "success", payload: product })
  } catch (error) {
         res.status(500).json({ status: "error", message: "Error al crear el producto" })
    }
})

//Modificar Producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

    res.status(200).json({ status: "success", payload: updatedProduct })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al modificar el producto" })
  }
});

//Borrar Producto
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(pid)
    if (!deletedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

    res.status(200).json({ status: "success", message: "↓↓↓ Producto eliminado ↓↓↓", payload: deletedProduct })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al borrar el producto"  });
  }
});

export default productsRouter;