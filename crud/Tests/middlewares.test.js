import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { env } from "../src/config/enviroment.js";
import { errorHandler } from "../src/middlewares/errorHandler.middleware.js";
import { authenticate, authorizeAdmin, isAdmin, isUser } from "../src/middlewares/auth.middleware.js";

function createMockResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe("errorHandler middleware", () => {
    test("Deberia responder con 500 y el mensaje de error si no se pasa statusCode", () => {
        const res = createMockResponse();
        const err = new Error("Test error message");
        const req = {};
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Test error message"
        });
    });

    test("Deberia responder con el statusCode provisto y el mensaje del error", () => {
        const res = createMockResponse();
        const err = new Error("Not Found");
        err.statusCode = 404;
        const req = {};
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Not Found"
        });
    });
});

describe("auth middlewares", () => {
    describe("authenticate", () => {
        test("Deberia llamar a next y establecer req.user si el token es valido", () => {
            const payload = { id: "123", role: "user" };
            const token = jwt.sign(payload, env.JWT_SECRET || "JWT secreto");
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = createMockResponse();
            const next = jest.fn();

            authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith();
            expect(req.user).toBeDefined();
            expect(req.user.id).toBe("123");
        });

        test("Deberia llamar a next con error 401 si no hay cabecera de autorizacion", () => {
            const req = { headers: {} };
            const res = createMockResponse();
            const next = jest.fn();

            authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(401);
            expect(errorArg.message).toBe("Token is required");
        });

        test("Deberia llamar a next con error 401 si el formato del token es invalido", () => {
            const req = { headers: { authorization: "invalid_format_token" } };
            const res = createMockResponse();
            const next = jest.fn();

            authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(401);
            expect(errorArg.message).toBe("Invalid auth format");
        });

        test("Deberia llamar a next con error 401 si el token expiro o es invalido", () => {
            const req = { headers: { authorization: "Bearer invalid_token" } };
            const res = createMockResponse();
            const next = jest.fn();

            authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(401);
            expect(errorArg.message).toBe("Invalid or expired token");
        });
    });

    describe("authorizeAdmin", () => {
        test("Deberia llamar a next si el usuario es admin", () => {
            const req = { user: { role: "admin" } };
            const res = createMockResponse();
            const next = jest.fn();

            authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        test("Deberia llamar a next con error 401 si el usuario no esta autenticado", () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();

            authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(401);
            expect(errorArg.message).toBe("User not authenticated");
        });

        test("Deberia llamar a next con error 403 si el usuario no es admin", () => {
            const req = { user: { role: "user" } };
            const res = createMockResponse();
            const next = jest.fn();

            authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(403);
            expect(errorArg.message).toBe("Forbidden");
        });
    });

    describe("isAdmin", () => {
        test("Deberia llamar a next si el usuario es admin", () => {
            const req = { user: { role: "admin" } };
            const res = createMockResponse();
            const next = jest.fn();

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        test("Deberia llamar a next con error 403 si el usuario no es admin", () => {
            const req = { user: { role: "user" } };
            const res = createMockResponse();
            const next = jest.fn();

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(403);
            expect(errorArg.message).toBe("Acceso denegado: Se requieren permisos de administrador");
        });

        test("Deberia llamar a next con error 401 si el usuario no esta logueado", () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorArg = next.mock.calls[0][0];
            expect(errorArg).toBeInstanceOf(Error);
            expect(errorArg.statusCode).toBe(401);
            expect(errorArg.message).toBe("User not authenticated");
        });
    });

    describe("isUser", () => {
        test("Deberia llamar a next si el usuario tiene el rol 'user'", () => {
            const req = { user: { role: "user" } };
            const res = createMockResponse();
            const next = jest.fn();

            isUser(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test("Deberia responder con 403 si el usuario no tiene el rol 'user'", () => {
            const req = { user: { role: "admin" } };
            const res = createMockResponse();
            const next = jest.fn();

            isUser(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                status: "error",
                message: "Debes iniciar sesion para poder continuar"
            });
        });
    });
});
