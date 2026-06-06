import { jest } from "@jest/globals";
import { errorHandler } from "../src/middlewares/errorHandler.middleware.js";
import { isAdmin, isUser } from "../src/middlewares/auth.middleware.js";

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
    describe("isAdmin", () => {
        test("Deberia llamar a next si el usuario es admin", () => {
            const req = { user: { role: "admin" } };
            const res = createMockResponse();
            const next = jest.fn();

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test("Deberia responder con 403 si el usuario no es admin o no esta logueado", () => {
            const req = { user: { role: "user" } };
            const res = createMockResponse();
            const next = jest.fn();

            isAdmin(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                status: "error",
                message: "Acceso denegado: Se requieren permisos de administrador"
            });
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
