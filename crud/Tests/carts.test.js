import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import mongoConnect from "../database/mongoConnection.js";
import Cart from "../src/models/cartModel.js";
import Product from "../src/models/productModel.js";
import { userModel } from "../src/models/usersModel.js";
import { generateToken } from "../utils.js";
import { CartService } from "../src/services/carts.service.js";
import { CartsDAO } from "../src/DAO/CartsDAO.js";

describe("Carts Module (DAO, Service, Controller)", () => {
    let userToken;
    let createdUser;
    let createdProductId;
    let testCartId;
    const cartService = new CartService();
    const cartsDao = new CartsDAO();

    beforeAll(async () => {
        await mongoConnect();

        // Creacion de test de user
        createdUser = await userModel.create({
            first_name: "CartUser",
            last_name: "Test",
            email: "cartuser@example.com",
            age: 25,
            password: "TemporaryPassword123!",
            role: "user"
        });
        userToken = generateToken({ id: createdUser._id, email: createdUser.email, role: createdUser.role });

        // Crear un producto de ejemplo
        const product = await Product.create({
            title: "Cart Test Product",
            description: "Product description",
            price: 50,
            stock: 10,
            category: "Test",
            code: "CARTPROD1"
        });
        createdProductId = product._id;
    });

    afterAll(async () => {
        if (testCartId) {
            await Cart.findByIdAndDelete(testCartId);
        }
        if (createdProductId) {
            await Product.findByIdAndDelete(createdProductId);
        }
        if (createdUser) {
            await userModel.findByIdAndDelete(createdUser._id);
        }
        await mongoose.connection.close();
    });

    describe("DAO & Service Unit Tests", () => {
        test("Deberia crear un carrito vacio y retornarlo", async () => {
            const cart = await cartService.createCart();
            expect(cart).toBeDefined();
            expect(cart._id).toBeDefined();
            expect(cart.products).toEqual([]);
            testCartId = cart._id;
        });

        test("Deberia obtener un carrito por id", async () => {
            const cart = await cartService.getCart(testCartId);
            expect(cart).toBeDefined();
            expect(cart._id.toString()).toBe(testCartId.toString());
        });

        test("Deberia agregar un producto al carrito", async () => {
            const updated = await cartService.addProductToCart(testCartId, createdProductId, 2);
            expect(updated).toBeDefined();
            expect(updated.products.length).toBe(1);
            expect(updated.products[0].product.toString()).toBe(createdProductId.toString());
        });

        test("Deberia lanzar error si se intenta borrar un producto de un carrito no existente", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await expect(cartService.removeProductFromCart(fakeId, createdProductId))
                .rejects.toThrow("Carrito no encontrado");
        });

        test("Deberia lanzar error si se intenta borrar un producto inexistente en el carrito", async () => {
            const fakeProdId = new mongoose.Types.ObjectId();
            await expect(cartService.removeProductFromCart(testCartId, fakeProdId.toString()))
                .rejects.toThrow("Producto no encontrado en este carrito");
        });

        test("Deberia remover un producto del carrito", async () => {
            const updated = await cartService.removeProductFromCart(testCartId, createdProductId.toString());
            expect(updated.products.length).toBe(0);
        });

        test("Deberia vaciar el carrito", async () => {
            // Primero lo agregamos de nuevo
            await cartService.addProductToCart(testCartId, createdProductId, 5);
            // Luego vaciamos
            const cleared = await cartService.clearCart(testCartId);
            expect(cleared.products.length).toBe(0);
        });
    });

    describe("Controller Integration Tests", () => {
        let apiCartId;

        test("POST /api/carts deberia crear un carrito", async () => {
            const res = await request(app)
                .post("/api/carts")
                .send();
            
            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.payload).toBeDefined();
            apiCartId = res.body.payload._id;
        });

        test("GET /api/carts/:cid deberia obtener el carrito", async () => {
            const res = await request(app)
                .get(`/api/carts/${apiCartId}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe("success");
            expect(Array.isArray(res.body.payload)).toBe(true);
        });

        test("GET /api/carts/:cid 404 si el carrito no existe", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/carts/${fakeId}`);
            
            expect(res.status).toBe(404);
        });

        test("POST /api/carts/:cid/product/:pid deberia fallar si no hay autenticacion", async () => {
            const res = await request(app)
                .post(`/api/carts/${apiCartId}/product/${createdProductId}`)
                .send({ quantity: 3 });
            
            expect(res.status).toBe(401);
        });

        test("POST /api/carts/:cid/product/:pid deberia agregar producto si esta autenticado", async () => {
            const res = await request(app)
                .post(`/api/carts/${apiCartId}/product/${createdProductId}`)
                .set("Cookie", [`jwt=${userToken}`])
                .send({ quantity: 3 });
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Producto Añadido");
        });

        test("DELETE /api/carts/:cid/products/:pid deberia eliminar producto del carrito", async () => {
            const res = await request(app)
                .delete(`/api/carts/${apiCartId}/products/${createdProductId}`);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Producto eliminado del carrito");
        });

        test("DELETE /api/carts/:cid/products/:pid 404 si el producto no esta en el carrito", async () => {
            const res = await request(app)
                .delete(`/api/carts/${apiCartId}/products/${createdProductId}`);
            
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Producto no encontrado en este carrito");
        });

        test("DELETE /api/carts/:cid deberia vaciar el carrito", async () => {
            const res = await request(app)
                .delete(`/api/carts/${apiCartId}`);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Todos los productos eliminados del carrito");
        });

        test("DELETE /api/carts/:cid 404 si no existe el carrito", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/carts/${fakeId}`);
            
            expect(res.status).toBe(404);
        });
    });

    describe("Controller Error Catching Cases", () => {
        test("GET /api/carts/:cid deberia retornar 500 ante un ID invalido o error de BD", async () => {
            const res = await request(app)
                .get("/api/carts/id_invalido");
            expect(res.status).toBe(500);
        });

        test("POST /api/carts/:cid/product/:pid deberia retornar 500 ante ID invalido", async () => {
            const res = await request(app)
                .post(`/api/carts/id_invalido/product/${createdProductId}`)
                .set("Cookie", [`jwt=${userToken}`])
                .send({ quantity: 1 });
            expect(res.status).toBe(500);
        });

        test("DELETE /api/carts/:cid/products/:pid deberia retornar 500 ante ID invalido", async () => {
            const res = await request(app)
                .delete(`/api/carts/id_invalido/products/${createdProductId}`);
            expect(res.status).toBe(500);
        });

        test("DELETE /api/carts/:cid deberia retornar 500 ante ID invalido", async () => {
            const res = await request(app)
                .delete("/api/carts/id_invalido");
            expect(res.status).toBe(500);
        });
    });
});
