import request from "supertest";
import app from "../app";
import { jest } from "@jest/globals";
import Product from "../src/models/productModel.js";

describe("Views Controller & Router", () => {
    test("GET /login - Deberia renderizar vista de login", async () => {
        const res = await request(app)
            .get("/login");
        expect(res.status).toBe(200);
        // Debe contener el HTML rendered de login
        expect(res.text).toContain("login");
    });

    test("GET /register - Deberia renderizar vista de registro", async () => {
        const res = await request(app)
            .get("/register");
        expect(res.status).toBe(200);
        expect(res.text).toContain("register");
    });

    test("GET /reset-password - Deberia renderizar resetPassword", async () => {
        const res = await request(app)
            .get("/reset-password?token=some_token");
        expect(res.status).toBe(200);
        expect(res.text).toContain("some_token");
    });

    test("renderProfile - Usuario local", async () => {
        const { renderProfile } = await import("../src/controllers/views.controller.js");
        const req = {
            session: {
                user: {
                    first_name: "John",
                    last_name: "Doe",
                    email: "john@example.com",
                    provider: "local",
                    role: "user"
                }
            }
        };
        const res = {
            render: jest.fn()
        };

        await renderProfile(req, res);
        expect(res.render).toHaveBeenCalledWith("profile", expect.objectContaining({
            first_name: "John",
            isGithub: false,
            isAdmin: false
        }));
    });

    test("renderProfile - Usuario github", async () => {
        const { renderProfile } = await import("../src/controllers/views.controller.js");
        const req = {
            session: {
                user: {
                    first_name: "GitUser",
                    last_name: "Github",
                    email: "gituser@github.com",
                    provider: "github",
                    role: "admin"
                }
            }
        };
        const res = {
            render: jest.fn()
        };

        await renderProfile(req, res);
        expect(res.render).toHaveBeenCalledWith("profile", expect.objectContaining({
            first_name: "GitUser",
            isGithub: true,
            isAdmin: true
        }));
    });

    test("renderHome - Deberia renderizar home y paginar productos", async () => {
        const paginateSpy = jest.spyOn(Product, "paginate").mockResolvedValueOnce({
            docs: [
                { title: "Product 1", price: 100 },
                { title: "Product 2", price: 200 }
            ],
            totalPages: 2,
            page: 1
        });

        const { renderHome } = await import("../src/controllers/views.controller.js");
        const req = { query: { limit: 10, page: 1 } };
        const res = {
            render: jest.fn()
        };
        const next = jest.fn();

        await renderHome(req, res, next);
        expect(res.render).toHaveBeenCalledWith("home", expect.objectContaining({
            products: expect.any(Array),
            links: expect.any(Array)
        }));
        
        paginateSpy.mockRestore();
    });

    test("renderHome - Error de paginacion", async () => {
        const paginateSpy = jest.spyOn(Product, "paginate").mockRejectedValueOnce(new Error("Db error"));

        const { renderHome } = await import("../src/controllers/views.controller.js");
        const req = { query: {} };
        const res = { render: jest.fn() };
        const next = jest.fn();

        await renderHome(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err.statusCode).toBe(500);
        
        paginateSpy.mockRestore();
    });

    test("renderProductDetail - Exito", async () => {
        const findByIdSpy = jest.spyOn(Product, "findById").mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce({ _id: "123", title: "Product 1" })
        });

        const { renderProductDetail } = await import("../src/controllers/views.controller.js");
        const req = { params: { pid: "123" } };
        const res = {
            render: jest.fn()
        };

        await renderProductDetail(req, res);
        expect(res.render).toHaveBeenCalledWith("productDetail", { product: { _id: "123", title: "Product 1" } });

        findByIdSpy.mockRestore();
    });

    test("renderProductDetail - No encontrado (404)", async () => {
        const findByIdSpy = jest.spyOn(Product, "findById").mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce(null)
        });

        const { renderProductDetail } = await import("../src/controllers/views.controller.js");
        const req = { params: { pid: "123" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn()
        };

        await renderProductDetail(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.render).toHaveBeenCalledWith("error", { message: "Producto no encontrado" });

        findByIdSpy.mockRestore();
    });

    test("renderProductDetail - Error de servidor (500)", async () => {
        const findByIdSpy = jest.spyOn(Product, "findById").mockReturnValueOnce({
            lean: jest.fn().mockRejectedValueOnce(new Error("DB Connection lost"))
        });

        const { renderProductDetail } = await import("../src/controllers/views.controller.js");
        const req = { params: { pid: "123" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn()
        };

        await renderProductDetail(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.render).toHaveBeenCalledWith("error", { message: "Error al cargar el producto" });

        findByIdSpy.mockRestore();
    });
});
