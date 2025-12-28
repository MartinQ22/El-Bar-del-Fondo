import { Router } from "express";
import { userModel } from "../models/usersModel.js";

const router = Router();

router.get("/read", async (req,res) => {
    try {
        let users = await userModel.find()
        res.json(users);
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