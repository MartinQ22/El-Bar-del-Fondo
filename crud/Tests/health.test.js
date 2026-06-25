import request from "supertest";
import app from "../app";
import { env } from "../src/config/enviroment.js";
import { jest } from "@jest/globals";


describe("Health Check API", () => {
    test("GET /api/health - Deberia retornar 200 y status OK si no esta en mantenimiento", async () => {
        const originalMaintenance = env.MAINTENANCE;
        env.MAINTENANCE = false;

        const res = await request(app)
            .get("/api/health");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("OK");
        expect(res.body.environment).toBeDefined();
        expect(res.body.uptime).toBeDefined();

        env.MAINTENANCE = originalMaintenance;
    });

    test("GET /api/health - Deberia retornar status maintenance si esta en mantenimiento", async () => {
        const originalMaintenance = env.MAINTENANCE;
        env.MAINTENANCE = true;

        const res = await request(app)
            .get("/api/health");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("maintenance");

        env.MAINTENANCE = originalMaintenance;
    });

    test("checkHealth - Caso de excepcion / error", async () => {
        // Para provocar un error, podemos llamar al controlador directamente pasando un req/res
        // donde res.status o res.json tire un error al ser invocado.
        const { checkHealth } = await import("../src/controllers/health.controller.js");
        const req = {};
        const res = {
            status: () => { throw new Error("Mocked database error"); }
        };
        const next = jest.fn();

        await checkHealth(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err.statusCode).toBe(500);
        expect(err.message).toBe("Error al verificar el estado de salud");
    });
});
