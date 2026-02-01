import { Router, json, urlencoded } from "express";
import { userModel } from "../models/usersModel.js";
import { createHash } from "../../utils.js";
import passport from "passport";

const router = Router();

router.get("/read", async (req, res) => {
    try {
        let users = await userModel.find()
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/failure-register", async (req, res, next) => {
    res.status(400).json({ message: "Registro fallido" })
})

router.use(json())
router.use(urlencoded({ extended: true }))

router.post("/register", passport.authenticate("register", { failureRedirect: "/failure-register" }), async (req, res) => {
    res.status(200).json({ message: "Registro exitoso" })
})

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

router.post("/create", async (req, res) => {
    const user = req.body;

    if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: "El email no tiene un formato válido" });
    }

    if (!passwordRegex.test(user.password)) {
        return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad" });
    }

    try {
        user.password = createHash(user.password);
        let result = await userModel.create(user);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /update - MEJORADO
router.put("/update", async (req, res) => {
    const { email, password, ...rest } = req.body;
    try {
        let updateData = { ...rest };

        if (password) {
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad" });
            }
            updateData.password = createHash(password);
        }

        // Agregamos {new: true} para que te devuelva el usuario ya modificado, no el viejo
        let userUpdated = await userModel.findOneAndUpdate({ email }, updateData, { new: true });

        if (!userUpdated) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(userUpdated);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete", async (req, res) => {
    const { email } = req.body

    try {
        let users = await userModel.findOneAndDelete({ email })
        res.json(users);
    } catch (error) {
        console.log(error.message);
    }
});

//Ruta de error generico 
router.use((req, res) => {
    res.status(404).send("404 - La ruta no se encuentra")
})

//-+-+-+-+-+-+-+-+-+-+ RECORDARME IMPLEMENTAR RAGEEXP PARA RESTRINGIR MAYUSCULAS O MINUSCULAS ANTES DE LA ENTREGA FINAL

export default router