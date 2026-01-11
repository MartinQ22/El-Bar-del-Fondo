import { Router, json, urlencoded } from "express";
import { userModel } from "../models/usersModel.js";
import { createHash } from "../../utils.js";
import passport from "passport";


const router = Router();


router.get("/read", async (req,res) => {
    try {
        let users = await userModel.find()
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/failure-register", async (req, res, next) => {
    res.status(400).json({message: "Registro fallido"})
})

// router.post("/register", async (req, res) => {
//     try {
//         const {first_name, last_name, email, password } = req.body;
//         const newUser = await userModel.create({first_name, last_name, email, password: createHash(password)})

//         res.json(newUser)
//     } catch (error) {
//         console.log(error.message);
//     }
// })

router.use(json())
router.use(urlencoded({extended: true}))

router.post("/register",passport.authenticate("register", {failureRedirect: "/failure-register"}), async (req, res) => {
    res.status(200).json({message: "Registro exitoso"})
})

router.post("/create", async (req,res) => {
    const user = req.body

    try {
        let users = await userModel.create(user)
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
});

router.put("/update", async (req,res) => {
    const {email} = req.body;

    try {
        let users = await userModel.findOneAndUpdate({email}, {name: "Sotito"})
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/delete", async (req,res) => {
    const {email} = req.body

    try {
        let users = await userModel.findOneAndDelete({email})
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
});

export default router