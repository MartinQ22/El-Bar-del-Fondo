import { Router } from "express"
import handleSession, { avoidLoginView } from "../middlewares/sessions.middlewares.js";
import { renderLogin, renderProfile, renderRegister, renderHome, renderProductDetail } from "../controllers/views.controller.js";

const router = Router();

//Login 
router.get("/login", avoidLoginView, renderLogin)

router.get("/profile", handleSession, renderProfile)

router.get('/register', avoidLoginView, renderRegister);

// Home - requires authentication
router.get("/", handleSession, renderHome)

// Product Detail - requires authentication
router.get("/product/:pid", handleSession, renderProductDetail)

//Ruta de error generico - debe ir al final para no interceptar otras rutas
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
})

export default router
