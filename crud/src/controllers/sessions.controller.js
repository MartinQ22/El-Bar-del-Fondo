import { userModel } from "../models/usersModel.js";
import { isValidPassword, createHash, generateToken } from "../../utils.js";

export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body

    try {
        if (req.session.user) {
            return res.status(200).json({ success: true, redirect: "/profile" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashedPassword = createHash(password)
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: "user"
        })

        // Generar JWT token
        const token = generateToken({ id: newUser._id, email: newUser.email });

        // Guardar token en cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        req.session.user = newUser;

        res.status(200).json({ success: true, redirect: "/" });
    } catch (error) {
        console.log(error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }
        res.status(500).json({ message: "Error al registrar usuario", error: error.message })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" })
        }
        if (isValidPassword(password, user.password)) {
            // Generar JWT token
            const token = generateToken({ id: user._id, email: user.email });

            // Guardar token en cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 horas
            });

            req.session.user = user
            res.status(200).redirect("/profile")
        } else {
            res.status(403).json({ message: "No se puede loguear, intentelo nuevamente" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error en el servidor" })
    }
};

export const githubCallback = async (req, res) => {
    // Generar JWT token para GitHub login
    const token = generateToken({ id: req.user._id, email: req.user.email });

    // Guardar token en cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horass
    });

    req.session.user = req.user;
    res.redirect("/profile");
};

export const getCurrentUser = async (req, res) => {
    try {
        // Retornar datos del usuario (sin password)
        const userData = {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        res.status(200).json({ status: "success", user: userData });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
