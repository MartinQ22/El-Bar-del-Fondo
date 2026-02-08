import { Router, urlencoded } from "express"
import passport from "passport"
import { passportCall } from "../config/passport.config.js";
import { register, login, logout, githubCallback, getCurrentUser, resetPassword } from "../controllers/sessions.controller.js";

const router = Router();

router.use(urlencoded({ extended: true }))

router.post("/register", register)

router.post("/login", login)

router.get("/logout", logout)

router.post("/reset-password", resetPassword);

//Rutas de autenticacion GitHubb
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

router.get("/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    githubCallback
)

// Ruta current para validar al usuario logueado y devuelve datos asociados al JWT
router.get("/current",
    passportCall(),
    getCurrentUser
);

//Ruta de error generico 
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
})

export default router
