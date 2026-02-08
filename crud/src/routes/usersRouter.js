import { Router } from "express";
import { getUsers, getUserByEmail, failRegister, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);

router.get("/failure-register", failRegister);

router.post("/create", createUser);

router.put("/email", updateUser);

router.delete("/email", deleteUser);

router.get("/mail/:email", getUserByEmail);

//Ruta de error generico 
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
});

export default router;