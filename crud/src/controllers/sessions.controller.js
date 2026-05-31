import { userModel } from "../models/usersModel.js";
import { isValidPassword, createHash, generateToken, serverRoot } from "../../utils.js";
import { env } from "../config/enviroment.js";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.utils.js";
import { successResponse } from "../utils/apiResponse.utils.js";

export const register = async (req, res, next) => {
    const { first_name, last_name, email, age, password } = req.body

    try {
        if (req.session.user) {
            return successResponse(res, { message: "Sesión ya activa", payload: { redirect: "/profile" } });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(createError("El email ya está registrado", 400));
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

        return successResponse(res, { message: "Usuario registrado con éxito", payload: { redirect: "/" } });
    } catch (error) {
        console.error(error.message);
        if (error.code === 11000) {
            return next(createError("El email ya está registrado", 400));
        }
        return next(createError("Error al registrar usuario", 500));
    }
};

export const login = async (req, res, next) => {
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
            return next(createError("Usuario no encontrado", 401));
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
            return res.status(200).redirect("/profile");
        } else {
            return next(createError("No se puede loguear, intentelo nuevamente", 403));
        }
    } catch (error) {
        console.error(error.message);
        return next(createError("Error en el servidor", 500));
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
export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const email = decoded.email;

        const user = await userModel.findOne({ email });
        if (!user) {
            return next(createError("Usuario no encontrado", 404));
        }

        if (isValidPassword(password, user.password)) {
            return next(createError("La nueva contraseña no puede ser igual a la anterior", 400));
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

        return successResponse(res, { message: "Contraseña restablecida exitosamente" });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError("El enlace ha expirado. Solicita uno nuevo.", 400));
        }
        return next(createError("Error al restablecer contraseña", 500));
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const userData = {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        return successResponse(res, { message: "Usuario actual obtenido con éxito", payload: userData });
    } catch (error) {
        return next(createError(error.message, 500));
    }
};

export const logout = (req, res, next) => {
    res.clearCookie("jwt");
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return next(createError("Error al cerrar sesión", 500));
        }
        return res.redirect("/login");
    });
};

