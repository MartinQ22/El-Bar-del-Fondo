import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import mongoConnect from "../database/mongoConnection.js";
import { userModel } from "../src/models/usersModel.js";
import Product from "../src/models/productModel.js";
import { generateToken } from "../utils.js";

describe("Products API", () => {
    let adminToken;
    let createdAdminUser;
    let createdProductId;

    beforeAll(async () => {
        await mongoConnect();

        // Create admin temporal para test
        createdAdminUser = await userModel.create({
            first_name: "TestAdmin",
            last_name: "User",
            email: "testadmin@example.com",
            age: 30,
            password: "TemporaryPassword123!",
            role: "admin"
        });

        adminToken = generateToken({ id: createdAdminUser._id, email: createdAdminUser.email, role: createdAdminUser.role });
    });

    afterAll(async () => {
        if (createdAdminUser) {
            await userModel.findByIdAndDelete(createdAdminUser._id);
        }
        await Product.deleteOne({ code: "CODIGO1" });
        if (createdProductId) {
            await Product.findByIdAndDelete(createdProductId);
        }
        await mongoose.connection.close();
    });

    test("GET /api/products deberia devolver status 200 y un array de productos", async () => {
        const response = await request(app).get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Lista de productos");
        expect(Array.isArray(response.body.payload.products)).toBe(true);
    });

    test("GET /api/products/68ecb6f99407b0e3e0bf3096", async () => {
        const response = await request(app).get("/api/products/68ecb6f99407b0e3e0bf3096");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Producto encontrado");
        expect(response.body.payload).toBeDefined();
        expect(response.body.payload._id).toBe("68ecb6f99407b0e3e0bf3096");
    });

    test("GET /api/products/productoFalso deberia devolver un error 404", async () => {
        const response = await request(app).get("/api/products/productoFalso");

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe("Error al encontrar el producto");
    });

    test("POST /api/products deberia crear un nuevo producto y devolver status 201", async () => {
        const newProduct = {
            title: "Producto de prueba",
            description: "Descripcion de prueba",
            price: 10,
            stock: 1,
            category: "Categoria de prueba",
            code: "CODIGO1"
        };

        const response = await request(app)
            .post("/api/products")
            .set("Cookie", [`jwt=${adminToken}`])
            .send(newProduct);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Producto creado");
        expect(response.body.payload).toBeDefined();
        expect(response.body.payload.title).toBe("Producto de prueba");

        createdProductId = response.body.payload._id;
    });

    test("PUT /api/products/:pid deberia actualizar un producto y devolver status 200", async () => {
        const updateProduct = {
            title: "Producto actualizado"
        };

        const response = await request(app)
            .put(`/api/products/${createdProductId}`)
            .set("Cookie", [`jwt=${adminToken}`])
            .send(updateProduct);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.payload.title).toBe("Producto actualizado");
    });

    test("Delete /api/products/:pid deberia eliminar un producto y devolver status 200", async () => {
        const response = await request(app)
            .delete(`/api/products/${createdProductId}`)
            .set("Cookie", [`jwt=${adminToken}`]);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
    });
});
