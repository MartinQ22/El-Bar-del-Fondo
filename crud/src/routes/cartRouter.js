import express from "express";
import Cart from "../models/cartModel.js";

const cartRouter = express.Router()

// Crear carritos vacios
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart;
    
    await cart.save();
    res.status(201).json({ status: "success", payload: cart })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el carrito" })
  }
});

//Eliminar un producto por id del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
      const { cid, pid } = req.params; 
      const cart = await Cart.findById(cid); 

      if (!cart) { return res.status(404).json({ status: "error", message: "Carrito no encontrado" });};

      const initialLength = cart.products.length;
      cart.products = cart.products.filter(p => p.product.toString() !== pid);

      if (cart.products.length === initialLength) {
           return res.status(404).json({ status: "error", message: "Producto no encontrado en este carrito" });
      }

      await cart.save(); 
      res.status(200).json({ status: "success", message: "Producto eliminado del carrito", payload: cart });
  } catch (error) {
      res.status(500).json({ status: "error", message: "Error al borrar el producto", error: error.message });
  }
});

//Eliminar todos los productos del carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const updatedCart = await Cart.findByIdAndUpdate( cid,{ products: [] },{ new: true } );
    
    if (!updatedCart) { return res.status(404).json({ status: "error", message: "Carrito no encontrado" });}
    res.status(200).json({ status: "success", message: "Todos los productos eliminados del carrito", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al vaciar el carrito" });
  }
});

//Agregar productos al carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid , quantity } } }, { new: true, runValidators: true });
    if(!updatedCart) return res.status(404).json({ status: "error", message: "Error al agregar el producto" });
    res.status(200).json({ message: "Producto Añadido", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al añadir el producto al carrito" })
  }
});

//Traer productos del carrito 
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product")
    if(!cart) return res.status(404).json({ status: "error", message: "Error al buscar el carrito" });
    res.status(200).json({status: "success", message: "Productos Encontrado", payload: cart.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter