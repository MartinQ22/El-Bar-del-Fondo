
import { welcomeMessage, sendPasswordResetEmail } from "../services/mailing.service.js";
import { generateToken } from "../../utils.js";

export async function sendWelcomeMessage(req, res) {
    //agregar funcion para sacar el mail desde la sesion para agregarlo al welcomeMessage ahora esta harcodeado
    await welcomeMessage("quirogamartin@live.com", "aqui deberia ir nombre de user");
    res.send("email de bienvenida enviado con exito!")
}

export async function sendPasswordReset(req, res) {
    try {
        const { email } = req.body;

        const userEmail = req.session.user ? req.session.user.email : email;

        if (!userEmail) return res.status(400).json({ message: "No se encontró email" });

        // Token con duracion de 1 hora
        const token = generateToken({ email: userEmail }, "1h");

        await sendPasswordResetEmail(userEmail, token);
        res.status(200).json({ message: "Correo de restablecimiento enviado" });

    } catch (error) {
        res.status(500).json({ message: "Error al enviar correo", error: error.message });
    }
}