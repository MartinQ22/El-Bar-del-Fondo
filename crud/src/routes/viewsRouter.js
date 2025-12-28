import {  Router } from "express"
import handleSession from "../middlewares/sessions.middlewares.js";


const router = Router();

router.get("login", handleSession, async (res, req, next) => {
    res.render("login,handlebars")
})

router.get("/profile", async (req, res, next) => {
    if(!req.session.user){
        res.redirect("/login")
    }
    const {first_name, last_name, email} = req.session.user;
    req.render("profile.handlebars", {
        first_name, last_name, email
    })
})
export default router
