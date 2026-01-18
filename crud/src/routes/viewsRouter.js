import {  Router } from "express"
import handleSession, { avoidLoginView } from "../middlewares/sessions.middlewares.js";

const router = Router();

//estrategia de passport jwt com,o middleware
// router.use(passport.authenticate("jwt", { session:false }));



router.get("/", avoidLoginView, async (req, res) => {
    res.render("login")
})

// router.get("/login", avoidLoginView, async (req, res) => {
//     res.render("login")
// })


router.get("/profile", handleSession, async (req, res) => {
    const {first_name, last_name, email} = req.session.user;
    res.render("profile", {
        first_name, last_name, email
    })
})

router.get('/register', avoidLoginView, (req, res) => {
    res.render('register');
});

//Ruta de error generico 
router.use((req, res)=>{
    res.status(404).send("404 - La ruta no se encuentra")
})

export default router
