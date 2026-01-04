import { Router, json, urlencoded } from "express";
import { userModel } from "../models/usersModel.js";
import { createHash } from "../../utils.js";


const router = Router();
router.use(json())
router.use(urlencoded({extended: true}))

router.get("/read", async (req,res) => {
    try {
        let users = await userModel.find()
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
})

router.post("/register", async (req, res) => {
    try {
        const {first_name, last_name, email, password } = req.body;
        const newUser = await userModel.create({first_name, last_name, email, password: createHash(password)})

        res.json(newUser)
    } catch (error) {
        console.log(error.message);
    }
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