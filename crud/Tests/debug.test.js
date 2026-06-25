import request from "supertest";
import app from "../app";
import { jest } from "@jest/globals";

describe("Debug Controller & Router", () => {
    test("GET /api/debug/process - Deberia retornar la informacion del proceso", async () => {
        const res = await request(app)
            .get("/api/debug/process");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.payload.pid).toBeDefined();
        expect(res.body.payload.nodeVesion).toBeDefined();
        expect(res.body.payload.platform).toBeDefined();
    });

    test("GET /api/debug/cpu - Con duracion custom de 5ms", async () => {
        const res = await request(app)
            .get("/api/debug/cpu?duration=5");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Task Completed");
    });

    test("blockCpu - Con duracion por defecto (mockeando Date.now para salida instantanea)", async () => {
        const { blockCpu } = await import("../src/controllers/debug.controller.js");
        
        let calls = 0;
        // Mockear Date.now para simular el paso del tiempo
        const dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => {
            calls++;
            if (calls === 1) return 1000; // start
            return 5000; // next check, loops exits since 5000 - 1000 = 4000 > 3000
        });

        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        blockCpu(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: "success",
            message: "Task Completed"
        }));

        dateNowSpy.mockRestore();
    });
});
