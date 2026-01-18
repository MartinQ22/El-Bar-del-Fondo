import {  Router } from "express"
import handleSession, { avoidLoginView } from "../middlewares/sessions.middlewares.js";
import Product from "../models/productModel.js";

const router = Router();

//Login 
router.get("/login", avoidLoginView, async (req, res) => {
    res.render("login")
})

router.get("/profile", handleSession, async (req, res) => {
    const {first_name, last_name, email} = req.session.user;
    res.render("profile", {
        first_name, last_name, email
    })
})

router.get('/register', avoidLoginView, (req, res) => {
    res.render('register');
});

// Home
router.get("/", async(req,res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const data = await Product.paginate({}, { limit, page, lean: true });
        const products = data.docs;
        delete data.docs;

        const links = [ ]

        for(let index = 1; index <= data.totalPages; index ++){
            links.push({ text: index, link: `?limit=${limit}&page=${index}`})
        }
        
        res.render("home", { products, links })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Product Detail 
router.get("/product/:pid", async(req,res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();
        
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }
        
        res.render("productDetail", { product });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar el producto" });
    }
})

//Ruta de error generico - debe ir al final para no interceptar otras rutas
router.use((req, res)=>{
    res.status(404).send("404 - La ruta no se encuentra")
})

export default router
