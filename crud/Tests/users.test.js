import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import mongoConnect from "../database/mongoConnection.js";
import { userModel } from "../src/models/usersModel.js";
import { UserService } from "../src/services/users.service.js";
import { UsersDAO } from "../src/DAO/UsersDAO.js";
import { UsersDTO } from "../src/DTO/UsersDTO.js";
import { getUsers, getUserByEmail, createUser, updateUser, deleteUser } from "../src/controllers/users.controller.js";

describe("Users Module (DAO, Service, DTO, Controller)", () => {
    const userService = new UserService();
    const usersDao = new UsersDAO();
    let createdUserEmails = [];
    let createdUserIds = [];

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        // Limpiador de users creados
        for (const email of createdUserEmails) {
            await userModel.deleteMany({ email });
        }
        for (const id of createdUserIds) {
            await userModel.findByIdAndDelete(id);
        }
        await mongoose.connection.close();
    });

    describe("UsersDTO Unit Tests", () => {
        test("setSessionUser deberia retornar solo first_name, email y role", () => {
            const rawUser = {
                first_name: "John",
                last_name: "Doe",
                email: "john@example.com",
                role: "user",
                password: "hashedpassword123",
                age: 30
            };
            const dto = new UsersDTO().setSessionUser(rawUser);
            expect(dto).toEqual({
                first_name: "John",
                email: "john@example.com",
                role: "user"
            });
        });
    });

    describe("UsersDAO & UserService Unit Tests", () => {
        test("createUser deberia crear usuario con password hasheado si pasa validaciones", async () => {
            const userData = {
                first_name: "ServiceUser",
                last_name: "Test",
                email: "serviceuser@example.com",
                age: 28,
                password: "ValidPassword1" // uppercase, lowercase, number, 14 chars
            };
            createdUserEmails.push(userData.email);

            const user = await userService.createUser(userData);
            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Hasheado
            createdUserIds.push(user._id);
        });

        test("createUser deberia fallar ante email invalido", async () => {
            const userData = {
                first_name: "BadEmail",
                last_name: "Test",
                email: "bad_email",
                age: 20,
                password: "ValidPassword1"
            };
            await expect(userService.createUser(userData))
                .rejects.toThrow("El email no tiene un formato válido");
        });

        test("createUser deberia fallar ante password debil", async () => {
            const userData = {
                first_name: "BadPass",
                last_name: "Test",
                email: "badpass@example.com",
                age: 20,
                password: "weak"
            };
            await expect(userService.createUser(userData))
                .rejects.toThrow("La contraseña no cumple con los requisitos de seguridad");
        });

        test("getUsers deberia listar usuarios", async () => {
            const list = await userService.getUsers();
            expect(Array.isArray(list)).toBe(true);
            expect(list.length).toBeGreaterThan(0);
        });

        test("getUserByEmail deberia encontrar el usuario creado", async () => {
            const user = await userService.getUserByEmail("serviceuser@example.com");
            expect(user).toBeDefined();
            expect(user.first_name).toBe("ServiceUser");
        });

        test("getUserById deberia encontrar el usuario por id", async () => {
            const id = createdUserIds[0];
            const user = await userService.getUserById(id);
            expect(user).toBeDefined();
            expect(user.email).toBe("serviceuser@example.com");
        });

        test("updateUser deberia actualizar el usuario", async () => {
            const updateData = {
                first_name: "ServiceUserUpdated",
                password: "NewValidPassword2"
            };
            const updated = await userService.updateUser("serviceuser@example.com", updateData);
            expect(updated).toBeDefined();
            expect(updated.first_name).toBe("ServiceUserUpdated");
        });

        test("updateUser deberia fallar al actualizar con password debil", async () => {
            const updateData = {
                password: "weak"
            };
            await expect(userService.updateUser("serviceuser@example.com", updateData))
                .rejects.toThrow("La contraseña no cumple con los requisitos de seguridad");
        });

        test("deleteUser deberia eliminar usuario por email", async () => {
            const email = "serviceuser@example.com";
            const deleted = await userService.deleteUser(email);
            expect(deleted).toBeDefined();
            
            const check = await userService.getUserByEmail(email);
            expect(check).toBeNull();
        });

        test("deleteUserById deberia eliminar usuario por id", async () => {
            // Creamos uno auxiliar para borrar por ID
            const tempUser = await userService.createUser({
                first_name: "Temp",
                last_name: "User",
                email: "tempdelete@example.com",
                age: 20,
                password: "TempPassword123"
            });
            createdUserEmails.push(tempUser.email);

            const deleted = await userService.deleteUserById(tempUser._id);
            expect(deleted).toBeDefined();

            const check = await userService.getUserById(tempUser._id);
            expect(check).toBeNull();
        });
    });

    describe("Controller Integration Tests", () => {
        const testUserEmail = "controlleruser@example.com";

        test("POST /api/users/create deberia crear usuario con exito", async () => {
            const res = await request(app)
                .post("/api/users/create")
                .send({
                    first_name: "ControllerUser",
                    last_name: "Test",
                    email: testUserEmail,
                    age: 30,
                    password: "ControllerPassword123"
                });
            
            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.message).toBe("Usuario creado con éxito");
            
            createdUserEmails.push(testUserEmail);
        });

        test("POST /api/users/create deberia fallar ante email invalido (400)", async () => {
            const res = await request(app)
                .post("/api/users/create")
                .send({
                    first_name: "BadEmail",
                    last_name: "Test",
                    email: "bademail",
                    age: 30,
                    password: "ControllerPassword123"
                });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("El email no tiene un formato válido");
        });

        test("GET /api/users/mail/:email deberia devolver DTO del usuario", async () => {
            const res = await request(app)
                .get(`/api/users/mail/${testUserEmail}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.payload).toEqual({
                first_name: "ControllerUser",
                email: testUserEmail,
                role: "user"
            });
        });

        test("GET /api/users/mail/:email 404 si el usuario no existe", async () => {
            const res = await request(app)
                .get("/api/users/mail/nonexistent@example.com");
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Usuario no encontrado");
        });

        test("GET /api/users deberia obtener todos los usuarios", async () => {
            const res = await request(app)
                .get("/api/users");
            expect(res.status).toBe(200);
            expect(res.body.status).toBe("success");
            expect(Array.isArray(res.body.payload)).toBe(true);
        });

        test("PUT /api/users/email deberia actualizar usuario", async () => {
            const res = await request(app)
                .put("/api/users/email")
                .send({
                    email: testUserEmail,
                    first_name: "ControllerUserUpdated",
                    password: "NewPassword12345"
                });
            
            expect(res.status).toBe(200);
            expect(res.body.payload.first_name).toBe("ControllerUserUpdated");
        });

        test("PUT /api/users/email 400 si la contraseña es debil", async () => {
            const res = await request(app)
                .put("/api/users/email")
                .send({
                    email: testUserEmail,
                    password: "weak"
                });
            expect(res.status).toBe(400);
        });

        test("PUT /api/users/email 404 si el usuario no existe", async () => {
            const res = await request(app)
                .put("/api/users/email")
                .send({
                    email: "nonexistent@example.com",
                    first_name: "Ghost"
                });
            expect(res.status).toBe(404);
        });

        test("DELETE /api/users/email deberia eliminar el usuario", async () => {
            const res = await request(app)
                .delete("/api/users/email")
                .send({ email: testUserEmail });
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Usuario eliminado con éxito");
        });

        test("DELETE /api/users/email 404 si el usuario no existe", async () => {
            const res = await request(app)
                .delete("/api/users/email")
                .send({ email: "nonexistent@example.com" });
            
            expect(res.status).toBe(404);
        });

        test("GET /api/users/failure-register deberia retornar 400", async () => {
            const res = await request(app)
                .get("/api/users/failure-register");
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Registro fallido");
        });
    });

    describe("Users Controller Unit Tests (Edge Cases)", () => {
        let req, res, next;

        beforeEach(() => {
            req = { body: {}, params: {} };
            res = {};
            next = jest.fn();
        });

        test("getUsers - Error interno", async () => {
            jest.spyOn(UserService.prototype, "getUsers").mockRejectedValueOnce(new Error("Service error"));
            await getUsers(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("getUserByEmail - Error interno", async () => {
            req.params.email = "test@example.com";
            jest.spyOn(UserService.prototype, "getUserByEmail").mockRejectedValueOnce(new Error("Service error"));
            await getUserByEmail(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("createUser - Error interno", async () => {
            jest.spyOn(UserService.prototype, "createUser").mockRejectedValueOnce(new Error("Service error"));
            await createUser(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("updateUser - Error interno", async () => {
            jest.spyOn(UserService.prototype, "updateUser").mockRejectedValueOnce(new Error("Service error"));
            await updateUser(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("deleteUser - Error interno", async () => {
            jest.spyOn(UserService.prototype, "deleteUser").mockRejectedValueOnce(new Error("Service error"));
            await deleteUser(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });
    });
});
