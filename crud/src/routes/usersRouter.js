import { Router, json, urlencoded } from "express";
import passport from "passport";
import { getUsers, getUserByEmail, failRegister, registerUser, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);

router.get("/failure-register", failRegister);

router.use(json());
router.use(urlencoded({ extended: true }));

router.post("/register", passport.authenticate("register", { failureRedirect: "/failure-register" }), registerUser);

router.post("/create", createUser);

// PUT /update - MEJORADO
router.put("/email", updateUser);

router.delete("/email", deleteUser);

router.get("/mail/:email", getUserByEmail);

//Ruta de error generico 
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
});

export default router;