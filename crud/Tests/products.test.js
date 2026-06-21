import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import mongoConnect from "../database/mongoConnection.js";
import { userModel } from "../src/models/usersModel.js";
import Product from "../src/models/productModel.js";
import { generateToken } from "../utils.js";

describe("Products API", () => {
    let adminToken;
    let userToken;
    let createdAdminUser;
    let createdProductId;

    beforeAll(async () => {
        await mongoConnect();

        createdAdminUser = await userModel.create({
            first_name: "TestAdmin",
            last_name: "User",
            email: "testadmin@example.com",
            age: 30,
            password: "TemporaryPassword123!",
            role: "admin"
        });

        adminToken = generateToken({ id: createdAdminUser._id, email: createdAdminUser.email, role: createdAdminUser.role });
        userToken = generateToken({ id: new mongoose.Types.ObjectId(), email: "testuser@example.com", role: "user" });
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

    //GET
    describe("GET /api/products", () => {
    test("deberia devolver status 200 y un array de productos", async () => {
        const response = await request(app).get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Lista de productos");
        expect(Array.isArray(response.body.payload.products)).toBe(true);
    });

    test("deberia devolver un producto por ID 68ecb6f99407b0e3e0bf3096", async () => {
        const response = await request(app).get("/api/products/68ecb6f99407b0e3e0bf3096");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Producto encontrado");
        expect(response.body.payload).toBeDefined();
        expect(response.body.payload._id).toBe("68ecb6f99407b0e3e0bf3096");
    });

    test("deberia devolver un error 404 si el producto no existe", async () => {
        const response = await request(app).get("/api/products/productoFalso");

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe("Error al encontrar el producto");
    });
});

    //POST
    describe("POST /api/products", () => {
    test("deberia crear un nuevo producto y devolver status 201", async () => {
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
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newProduct);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Producto creado");
        expect(response.body.payload).toBeDefined();
        expect(response.body.payload.title).toBe("Producto de prueba");

        createdProductId = response.body.payload._id;
    }); 
    
    test("deberia devolver 401 si no hay token", async () => {
        const response = await request(app)
            .post("/api/products")
            .send({
                title: "Error 401 POST",
                description: "Test 401",
                price: 10,
                stock: 1,
                category: "Test",
                code: "ERR401POST"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 403 si el rol no es admin", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Error 403 POST",
                description: "Test 403",
                price: 10,
                stock: 1,
                category: "Test",
                code: "ERR403POST"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 500 si hay un error en los datos (codigo duplicado)", async () => {
        const duplicateProduct = {
            title: "Producto duplicado",
            description: "Descripcion de prueba",
            price: 10,
            stock: 1,
            category: "Categoria de prueba",
            code: "CODIGO1"
        };

        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(duplicateProduct);

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe("error");
    });

    });

    //PUT
    describe("PUT /api/products/:pid", () => {
    test("deberia actualizar un producto y devolver status 200", async () => {
        const updateProduct = {
            title: "Producto actualizado"
        };

        const response = await request(app)
            .put(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updateProduct);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.payload.title).toBe("Producto actualizado");
    });

    test("deberia devolver 401 si no hay token", async () => {
        const response = await request(app)
            .put(`/api/products/${createdProductId}`)
            .send({ title: "Cambio sin token" });

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 403 si el rol no es admin", async () => {
        const response = await request(app)
            .put(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ title: "Cambio sin permisos" });

        expect(response.statusCode).toBe(403);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 404 si el ID no existe en la BD", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .put(`/api/products/${fakeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ title: "Cambio no existente" });

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 500 si el ID es invalido", async () => {
        const response = await request(app)
            .put("/api/products/idInvalido")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ title: "Cambio id invalido" });

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe("error");
    });
    })

    

    //DELETE
    describe("DELETE /api/products/:pid", () => {
    test("deberia devolver 401 si no hay token", async () => {
        const response = await request(app)
            .delete(`/api/products/${createdProductId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 403 si el rol no es admin", async () => {
        const response = await request(app)
            .delete(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.status).toBe("error");
    });

    test("DELETE /api/products/:pid deberia devolver 404 si el ID no existe en la BD", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/api/products/${fakeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe("error");
    });

    test("deberia devolver 500 si el ID es invalido", async () => {
        const response = await request(app)
            .delete("/api/products/idInvalido")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe("error");
    });

    test("deberia eliminar un producto y devolver status 200", async () => {
        const response = await request(app)
            .delete(`/api/products/${createdProductId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("↓↓↓ Producto eliminado ↓↓↓");
    });
    });

    
});
