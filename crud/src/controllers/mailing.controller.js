
import { welcomeMessage, sendPasswordResetEmail } from "../services/mailing.service.js";
import { generateToken } from "../../utils.js";

export async function sendWelcomeMessage(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "No hay una sesión de usuario activa" });
        }

        const { first_name, email } = req.session.user;

        await welcomeMessage(email, first_name);
        res.status(200).json({ message: "Email de bienvenida enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar mensaje de bienvenida:", error);
        res.status(500).json({ message: "Error al enviar el email de bienvenida", error: error.toString() });
    }
}

export async function sendPasswordReset(req, res) {
    try {
        const { email } = req.body;

        const userEmail = req.session.user ? req.session.user.email : email;

        if (!userEmail) {
            console.error("SendPasswordReset: No email provided or found in session.");
            return res.status(400).json({ message: "No se encontró email para enviar el correo." });
        }

        // Token con duracion de 1 hora
        const token = generateToken({ email: userEmail }, "1h");

        await sendPasswordResetEmail(userEmail, token);
        res.status(200).json({ message: "Correo de restablecimiento enviado" });

    } catch (error) {
        console.error("DEBUG - SendPasswordReset Error Details:", {
            message: error.message,
            stack: error.stack,
            env_user_g: !!env.USER_G,
            env_mail_app: !!env.MAIL_APP
        });
        res.status(500).json({ message: "Error al enviar correo", error: error.toString() });
    }
}