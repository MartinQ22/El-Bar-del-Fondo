import { welcomeMessage, sendPasswordResetEmail } from "../services/mailing.service.js";
import { generateToken } from "../../utils.js";
import { env } from "../config/enviroment.js";
import { createError } from "../utils/createError.utils.js";
import { successResponse } from "../utils/apiResonse.utils.js";

export async function sendWelcomeMessage(req, res, next) {
    try {
        if (!req.session.user) {
            return next(createError("No hay una sesión de usuario activa", 401));
        }

        const { first_name, email } = req.session.user;

        await welcomeMessage(email, first_name);
        return successResponse(res, { message: "Email de bienvenida enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar mensaje de bienvenida:", error);
        return next(createError("Error al enviar el email de bienvenida", 500));
    }
}

export async function sendPasswordReset(req, res, next) {
    try {
        const { email } = req.body;

        const userEmail = req.session.user ? req.session.user.email : email;

        if (!userEmail) {
            console.error("SendPasswordReset: No email provided or found in session.");
            return next(createError("No se encontró email para enviar el correo.", 400));
        }

        // Token con duracion de 1 hora
        const token = generateToken({ email: userEmail }, "1h");

        await sendPasswordResetEmail(userEmail, token);
        return successResponse(res, { message: "Correo de restablecimiento enviado" });

    } catch (error) {
        console.error("DEBUG - SendPasswordReset Error Details:", {
            message: error.message,
            stack: error.stack,
            env_user_g: !!env.USER_G,
            env_mail_app: !!env.MAIL_APP
        });
        return next(createError("Error al enviar correo", 500));
    }
}