import { transporter } from "../config/mailing.js";
import { env } from "../config/enviroment.js";

export async function welcomeMessage(destiny, name) {
    await transporter.sendMail({
        from: env.MAIL_APP,
        to: destiny,
        subject: `Bienvenido ${name} a nuestro gran espacio!`,
        text: "Gracias por pasarte por nuestro sitio web"
    })
}

export async function sendPasswordResetEmail(destiny, token) {
    const link = `${env.BASE_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: env.MAIL_APP,
        to: destiny,
        subject: "Restablecer contraseña - El Bar del Fondo",
        html: `
            <h1>Restablecer Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
            <a href="${link}">Restablecer contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
        `
    })
}

