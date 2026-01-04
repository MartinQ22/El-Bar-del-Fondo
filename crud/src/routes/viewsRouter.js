import {  Router } from "express"
import handleSession from "../middlewares/sessions.middlewares.js";


const router = Router();

router.get("/login", handleSession, async (req, res, next) => {
    res.render("login")
})

router.get("/profile", async (req, res, next) => {
    if(!req.session.user){
        return res.redirect("/login")
    }
    const {first_name, last_name, email} = req.session.user;
    res.render("profile", {
        first_name, last_name, email
    })
})
export default router
