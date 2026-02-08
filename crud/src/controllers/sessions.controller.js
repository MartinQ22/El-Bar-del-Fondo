import { userModel } from "../models/usersModel.js";
import { isValidPassword, createHash, generateToken, serverRoot } from "../../utils.js";
import { env } from "../config/enviroment.js";
import jwt from "jsonwebtoken";

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
        const token = generateToken({ id: newUser._id, email: newUser.email, role: newUser.role });

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
        if (email === env.ADMIN_USER && password === env.ADMIN_PASS) {
            const adminUser = {
                _id: "admin_id",
                first_name: "Admin",
                last_name: "System",
                email: email,
                age: 0,
                role: "admin"
            };

            const token = generateToken({ id: adminUser._id, email: adminUser.email, role: adminUser.role });

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            req.session.user = adminUser;
            return res.status(200).redirect("/profile");
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" })
        }
        if (isValidPassword(password, user.password)) {
            // Generar JWT token
            const token = generateToken({ id: user._id, email: user.email, role: user.role });

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
    const token = generateToken({ id: req.user._id, email: req.user.email, role: req.user.role || 'user' });

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


//Password RESET
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const email = decoded.email;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (isValidPassword(password, user.password)) {
            return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior" });
        }

        user.password = createHash(password);
        await user.save();

        // LOG USER IN AFTER RESET
        const tokenJWT = generateToken({ id: user._id, email: user.email, role: user.role });

        res.cookie("jwt", tokenJWT, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            provider: user.provider
        };

        res.status(200).json({ message: "Contraseña restablecida exitosamente" });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "El enlace ha expirado. Solicita uno nuevo." });
        }
        res.status(500).json({ message: "Error al restablecer contraseña", error: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
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
export const logout = (req, res) => {
    res.clearCookie("jwt");
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res.status(500).json({ status: "error", message: "Error al cerrar sesión" });
        }
        res.redirect("/login");
    });
};
