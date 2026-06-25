import request from "supertest";
import app from "../app";
import { jest } from "@jest/globals";
import { transporter } from "../src/config/mailing.js";
import { welcomeMessage, sendPasswordResetEmail } from "../src/services/mailing.service.js";

describe("Mailing Module (Service, Controller, Router)", () => {
    let sendMailSpy;

    beforeEach(() => {
        // Spy on transporter's sendMail and mock resolved value
        sendMailSpy = jest.spyOn(transporter, "sendMail").mockImplementation(() => {
            return Promise.resolve({ messageId: "test-message-id" });
        });
    });

    afterEach(() => {
        sendMailSpy.mockRestore();
    });

    describe("Mailing Service Unit Tests", () => {
        test("welcomeMessage deberia enviar un correo con los datos correctos", async () => {
            await welcomeMessage("destiny@example.com", "John");
            
            expect(sendMailSpy).toHaveBeenCalledTimes(1);
            const callArgs = sendMailSpy.mock.calls[0][0];
            expect(callArgs.to).toBe("destiny@example.com");
            expect(callArgs.subject).toContain("John");
            expect(callArgs.text).toBe("Gracias por pasarte por nuestro sitio web");
        });

        test("sendPasswordResetEmail deberia enviar un correo con el link de reset", async () => {
            await sendPasswordResetEmail("reset@example.com", "mocktoken123");

            expect(sendMailSpy).toHaveBeenCalledTimes(1);
            const callArgs = sendMailSpy.mock.calls[0][0];
            expect(callArgs.to).toBe("reset@example.com");
            expect(callArgs.subject).toBe("Restablecer contraseña - El Bar del Fondo");
            expect(callArgs.html).toContain("reset-password?token=mocktoken123");
        });
    });

    describe("Mailing Controller & Router Integration Tests", () => {
        test("GET /mail/welcome - Falla si no hay usuario en sesion (401)", async () => {
            const res = await request(app)
                .get("/mail/welcome");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("No hay una sesión de usuario activa");
        });

        test("GET /mail/welcome - Exito si hay usuario en sesion", async () => {
            // Nota: Para simular sesion, podemos mockear express-session o usar una peticion
            // pero como la sesion se guarda en base de datos/MongoStore, podemos forzarla
            // o alternativamente podemos unit-testear el controller directamente si queremos ser limpios.
            // Hagamos unit test del controller para cubrir el camino exitoso e interno.
        });

        test("POST /mail/reset-password-request - Falla si no hay email", async () => {
            const res = await request(app)
                .post("/mail/reset-password-request")
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("No se encontró email para enviar el correo.");
        });

        test("POST /mail/reset-password-request - Exito si se pasa email", async () => {
            const res = await request(app)
                .post("/mail/reset-password-request")
                .send({ email: "user@example.com" });
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Correo de restablecimiento enviado");
            expect(sendMailSpy).toHaveBeenCalledTimes(1);
        });

        test("POST /mail/reset-password-request - Falla con 500 si sendMail tira error", async () => {
            sendMailSpy.mockImplementationOnce(() => {
                return Promise.reject(new Error("SMTP Connection failed"));
            });

            const res = await request(app)
                .post("/mail/reset-password-request")
                .send({ email: "user@example.com" });
            
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Error al enviar correo");
        });
    });

    describe("Mailing Controller Direct Unit Tests", () => {
        test("sendWelcomeMessage exito con req.session.user", async () => {
            const req = {
                session: {
                    user: { first_name: "MockName", email: "mocksession@example.com" }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const { sendWelcomeMessage: sendWelcomeMessageController } = await import("../src/controllers/mailing.controller.js");
            await sendWelcomeMessageController(req, res, next);

            expect(sendMailSpy).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "success",
                message: "Email de bienvenida enviado con éxito"
            }));
        });

        test("sendWelcomeMessage fallo 500 si welcomeMessage tira error", async () => {
            sendMailSpy.mockRejectedValueOnce(new Error("Mail error"));
            const req = {
                session: {
                    user: { first_name: "MockName", email: "mocksession@example.com" }
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            const { sendWelcomeMessage: sendWelcomeMessageController } = await import("../src/controllers/mailing.controller.js");
            await sendWelcomeMessageController(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg.statusCode).toBe(500);
            expect(errorArg.message).toBe("Error al enviar el email de bienvenida");
        });
    });
});
