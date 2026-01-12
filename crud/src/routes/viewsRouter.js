import {  Router } from "express"
import handleSession, { avoidLoginView } from "../middlewares/sessions.middlewares.js";


const router = Router();

//estrategia de passport jwt com,o middleware
// router.use(passport.authenticate("jwt", { session:false }));

router.get("/login", avoidLoginView, async (req, res, next) => {
    res.render("login")
})

router.get("/profile", handleSession, async (req, res, next) => {
    const {first_name, last_name, email} = req.session.user;
    res.render("profile", {
        first_name, last_name, email
    })
})


export default router
