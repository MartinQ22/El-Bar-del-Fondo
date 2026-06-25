import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import passport from "passport";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import mongoConnect from "../database/mongoConnection.js";
import { userModel } from "../src/models/usersModel.js";
import { generateToken, createHash, verifyToken } from "../utils.js";
import { env } from "../src/config/enviroment.js";
import { cookieExtractor, passportCall } from "../src/config/passport.config.js";
import { register, login, githubCallback, resetPassword, getCurrentUser, logout } from "../src/controllers/auth.controller.js";
import { UserService } from "../src/services/users.service.js";
describe("Auth Module (Controllers, Routes, and Passport Config)", () => {
    let createdUser;
    let userToken;
    let createdUserEmails = [];


    beforeAll(async () => {
        await mongoConnect();

        // Limpiar restos de test users
        await userModel.deleteMany({
            email: {
                $in: [
                    "authuser@example.com",
                    "newauthuser@example.com",
                    "stratuser@example.com",
                    "stratuser_dup@example.com",
                    "githubnewuser@github.com"
                ]
            }
        });

        // Crear test de users para tests de autenticación
        createdUser = await userModel.create({
            first_name: "AuthUser",
            last_name: "Test",
            email: "authuser@example.com",
            age: 22,
            password: createHash("Password123!"),
            role: "user"
        });
        userToken = generateToken({ id: createdUser._id, email: createdUser.email, role: createdUser.role });
    });

    afterAll(async () => {
        if (createdUser) {
            await userModel.findByIdAndDelete(createdUser._id);
        }
        await userModel.deleteMany({
            email: {
                $in: [
                    "newauthuser@example.com",
                    "stratuser@example.com",
                    "stratuser_dup@example.com",
                    "githubnewuser@github.com"
                ]
            }
        });
        await mongoose.connection.close();
    });


    describe("Auth Router & Controller Integration Tests", () => {
        test("POST /api/register - Registro de nuevo usuario", async () => {
            const res = await request(app)
                .post("/api/register")
                .send({
                    first_name: "New",
                    last_name: "AuthUser",
                    email: "newauthuser@example.com",
                    age: 20,
                    password: "NewPassword123"
                });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Usuario registrado con éxito");
            expect(res.headers["set-cookie"]).toBeDefined();
        });

        test("POST /api/register - Error si el usuario ya existe", async () => {
            const res = await request(app)
                .post("/api/register")
                .send({
                    first_name: "AuthUser",
                    last_name: "Test",
                    email: "authuser@example.com",
                    age: 22,
                    password: "Password123!"
                });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("El email ya está registrado");
        });

        test("POST /api/login - Error si faltan campos", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({ email: "" });
            expect(res.status).toBe(400);
        });

        test("POST /api/login - Login de administrador exitoso", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    email: env.ADMIN_USER,
                    password: env.ADMIN_PASS
                });
            expect(res.status).toBe(200);
            expect(res.body.payload.user.role).toBe("admin");
        });

        test("POST /api/login - Login de usuario local exitoso", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    email: "authuser@example.com",
                    password: "Password123!"
                });
            expect(res.status).toBe(200);
            expect(res.body.payload.user.email).toBe("authuser@example.com");
        });

        test("POST /api/login - Login credenciales invalidas (email incorrecto)", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    email: "fakeuser@example.com",
                    password: "Password123!"
                });
            expect(res.status).toBe(401);
        });

        test("POST /api/login - Login credenciales invalidas (password incorrecto)", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    email: "authuser@example.com",
                    password: "WrongPassword"
                });
            expect(res.status).toBe(401);
        });

        test("GET /api/current - Obtener datos del usuario logueado", async () => {
            const res = await request(app)
                .get("/api/current")
                .set("Cookie", [`jwt=${userToken}`]);
            expect(res.status).toBe(200);
            expect(res.body.payload.email).toBe("authuser@example.com");
        });

        test("GET /api/current - No autorizado si no hay cookie", async () => {
            const res = await request(app)
                .get("/api/current");
            expect(res.status).toBe(401);
        });

        test("POST /api/reset-password - Cambiar contraseña con token", async () => {
            const resetToken = generateToken({ email: "authuser@example.com" });
            const res = await request(app)
                .post("/api/reset-password")
                .send({
                    token: resetToken,
                    password: "AnotherPassword123" // Diferente a Password123!
                });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Contraseña restablecida exitosamente");
        });

        test("POST /api/reset-password - Error si la contraseña es igual a la anterior", async () => {
            const resetToken = generateToken({ email: "authuser@example.com" });
            const res = await request(app)
                .post("/api/reset-password")
                .send({
                    token: resetToken,
                    password: "AnotherPassword123" // Ahora esta es la contraseña actual
                });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("La nueva contraseña no puede ser igual a la anterior");
        });

        test("POST /api/reset-password - Error si el token expiro/es invalido", async () => {
            const res = await request(app)
                .post("/api/reset-password")
                .send({
                    token: "token_invalido",
                    password: "NewPassword123"
                });
            expect(res.status).toBe(500);
        });

        test("GET /api/logout - Destruir sesion", async () => {
            const res = await request(app)
                .get("/api/logout");
            expect(res.status).toBe(302); // Redirige a /login
        });

        test("POST /api/register - Sesión ya activa", async () => {
            const agent = request.agent(app);
            await agent.post("/api/login").send({
                email: "authuser@example.com",
                password: "AnotherPassword123"
            });
            const res = await agent.post("/api/register").send({
                first_name: "New", last_name: "User", email: "something@example.com", age: 20, password: "Pass"
            });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Sesión ya activa");
        });

        test("POST /api/reset-password - Usuario no encontrado", async () => {
            const resetToken = generateToken({ email: "notfound@example.com" });
            const res = await request(app).post("/api/reset-password").send({
                token: resetToken, password: "NewPassword123"
            });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Usuario no encontrado");
        });

        test("POST /api/reset-password - Token expirado", async () => {
            const resetToken = jwt.sign({ email: "authuser@example.com" }, env.JWT_SECRET, { expiresIn: '-1s' });
            const res = await request(app).post("/api/reset-password").send({
                token: resetToken, password: "NewPassword123"
            });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("El enlace ha expirado. Solicita uno nuevo.");
        });
    });

    describe("Auth Controller Unit Tests (Edge Cases)", () => {
        test("register - Error interno", async () => {
            const req = { body: {}, session: {} };
            const res = {};
            const next = jest.fn();
            jest.spyOn(userModel, "findOne").mockRejectedValueOnce(new Error("DB error"));
            await register(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("register - Duplicate key error", async () => {
            const req = { body: {}, session: {} };
            const res = {};
            const next = jest.fn();
            const error = new Error("Duplicate");
            error.code = 11000;
            jest.spyOn(userModel, "findOne").mockRejectedValueOnce(error);
            await register(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(400);
        });

        test("login - Error interno", async () => {
            const req = { body: { email: "a@a.com", password: "p" }, session: {} };
            const res = {};
            const next = jest.fn();
            jest.spyOn(userModel, "findOne").mockRejectedValueOnce(new Error("DB error"));
            await login(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("getCurrentUser - Error interno", async () => {
            const req = { user: null }; 
            const res = {};
            const next = jest.fn();
            await getCurrentUser(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("logout - Error al destruir sesion", async () => {
            const req = { session: { destroy: jest.fn((cb) => cb(new Error("Destroy error"))) } };
            const res = { clearCookie: jest.fn() };
            const next = jest.fn();
            logout(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls[0][0].statusCode).toBe(500);
        });

        test("githubCallback - redirect con role", async () => {
            const req = { user: { _id: "123", email: "test@github.com", role: "admin" }, session: {} };
            const res = { cookie: jest.fn(), redirect: jest.fn() };
            await githubCallback(req, res);
            expect(res.redirect).toHaveBeenCalledWith("/profile");
        });

        test("githubCallback - redirect sin role", async () => {
            const req = { user: { _id: "123", email: "test@github.com" }, session: {} };
            const res = { cookie: jest.fn(), redirect: jest.fn() };
            await githubCallback(req, res);
            expect(res.redirect).toHaveBeenCalledWith("/profile");
        });
    });

    describe("Passport Config Strategy Unit Tests", () => {
        test("cookieExtractor deberia extraer cookie jwt", () => {
            const req = { cookies: { jwt: "my-jwt-token" } };
            expect(cookieExtractor(req)).toBe("my-jwt-token");
        });

        test("cookieExtractor deberia retornar null si no hay cookies", () => {
            const req = {};
            expect(cookieExtractor(req)).toBeNull();
        });

        test("serializeUser y deserializeUser", (done) => {
            const user = { _id: createdUser._id };
            passport.serializeUser((u, nextDone) => {
                expect(u._id).toBe(user._id);
                nextDone(null, u._id);
            });
            passport.deserializeUser((id, nextDone) => {
                expect(id.toString()).toBe(user._id.toString());
                nextDone(null, user);
            });

            passport.serializeUser(user, (err, id) => {
                expect(id.toString()).toBe(createdUser._id.toString());
                passport.deserializeUser(id, (err2, u) => {
                    expect(u._id.toString()).toBe(createdUser._id.toString());
                    done();
                });
            });
        });

        test("Register Strategy Callback", async () => {
            const registerStrategy = passport._strategies.register;
            expect(registerStrategy).toBeDefined();

            // Simular callback exitoso
            const req = { body: { first_name: "Strat", last_name: "User", email: "stratuser@example.com", age: 30, password: "StratPassword123" } };
            createdUserEmails.push("stratuser@example.com");

            const doneFn = jest.fn();
            await registerStrategy._verify(req, "stratuser@example.com", "StratPassword123", doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("stratuser@example.com");
        });

        test("Register Strategy Callback - Duplicate Email Error", async () => {
            const registerStrategy = passport._strategies.register;
            const req = { body: { first_name: "AuthUser", last_name: "Test", email: "authuser@example.com", age: 22, password: "Password123" } };
            
            const doneFn = jest.fn();
            await registerStrategy._verify(req, "authuser@example.com", "Password123", doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, success, info] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(success).toBe(false);
            expect(info.message).toBe("El email ya está registrado");
        });


        test("Login Strategy Callback - Success", async () => {
            const loginStrategy = passport._strategies.login;
            const doneFn = jest.fn();

            await loginStrategy._verify("authuser@example.com", "Password123!", doneFn);
            // Nota: En la prueba anterior, reset-password cambió el password de authuser a "AnotherPassword123".
            // Vamos a probar con AnotherPassword123
            const doneFn2 = jest.fn();
            await loginStrategy._verify("authuser@example.com", "AnotherPassword123", doneFn2);
            expect(doneFn2).toHaveBeenCalled();
            const [err, user] = doneFn2.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("authuser@example.com");
        });

        test("Login Strategy Callback - User Not Found", async () => {
            const loginStrategy = passport._strategies.login;
            const doneFn = jest.fn();
            await loginStrategy._verify("nonexistent@example.com", "Pass", doneFn);
            expect(doneFn).toHaveBeenCalledWith(null, false);
        });

        test("Login Strategy Callback - Wrong Password", async () => {
            const loginStrategy = passport._strategies.login;
            const doneFn = jest.fn();
            await loginStrategy._verify("authuser@example.com", "WrongPassword", doneFn);
            expect(doneFn).toHaveBeenCalledWith(null, false);
        });

        test("GitHub Strategy Callback - Existing User", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { emails: [{ value: "authuser@example.com" }] };

            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("authuser@example.com");
        });

        test("GitHub Strategy Callback - New User", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { username: "githubnewuser", displayName: "Github New User", emails: [{ value: "githubnewuser@github.com" }] };
            createdUserEmails.push("githubnewuser@github.com");

            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("githubnewuser@github.com");
        });

        test("GitHub Strategy Callback - New User sin emails ni displayName", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { username: "ghuser_noemail", emails: [] }; 
            createdUserEmails.push("ghuser_noemail@github.com");

            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("ghuser_noemail@github.com");
        });

        test("JWT Strategy Callback - Success", async () => {
            const jwtStrategy = passport._strategies.jwt;
            const doneFn = jest.fn();
            const payload = { id: createdUser._id };

            await jwtStrategy._verify(payload, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("authuser@example.com");
        });

        test("JWT Strategy Callback - User Not Found", async () => {
            const jwtStrategy = passport._strategies.jwt;
            const doneFn = jest.fn();
            const payload = { id: new mongoose.Types.ObjectId() };

            await jwtStrategy._verify(payload, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, success, info] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(success).toBe(false);
            expect(info.message).toBe("Usuario no encontrado");
        });

        test("Register Strategy Callback - Catch Generic Error", async () => {
            const registerStrategy = passport._strategies.register;
            const req = { body: {} };
            const doneFn = jest.fn();
            jest.spyOn(UserService.prototype, "createUser").mockRejectedValueOnce(new Error("Generic error"));
            
            await registerStrategy._verify(req, "auth@test", "Pass", doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err] = doneFn.mock.calls[0];
            expect(err).toBeInstanceOf(Error);
        });

        test("Login Strategy Callback - Catch Generic Error", async () => {
            const loginStrategy = passport._strategies.login;
            const doneFn = jest.fn();
            jest.spyOn(UserService.prototype, "getUserByEmail").mockRejectedValueOnce(new Error("Generic error"));
            
            await loginStrategy._verify("auth@test", "Pass", doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err] = doneFn.mock.calls[0];
            expect(err).toBeInstanceOf(Error);
        });

        test("GitHub Strategy Callback - Catch 11000 Error and User Exists", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { username: "dup", emails: [{ value: "dup@example.com" }] };
            
            let callCount = 0;
            jest.spyOn(UserService.prototype, "getUserByEmail").mockImplementation(async () => {
                callCount++;
                if (callCount === 1) return null; 
                return { email: "dup@example.com", toJSON: () => ({email: "dup@example.com"}) }; 
            });
            const error = new Error("Dup");
            error.code = 11000;
            jest.spyOn(userModel, "create").mockRejectedValueOnce(error);

            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("dup@example.com");
        });

        test("GitHub Strategy Callback - Catch 11000 Error sin emails array", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { username: "dup2", emails: [] };
            
            let callCount = 0;
            jest.spyOn(UserService.prototype, "getUserByEmail").mockImplementation(async () => {
                callCount++;
                if (callCount === 1) return null; 
                return { email: "dup2@github.com", toJSON: () => ({email: "dup2@github.com"}) }; 
            });
            const error = new Error("Dup");
            error.code = 11000;
            jest.spyOn(userModel, "create").mockRejectedValueOnce(error);

            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err, user] = doneFn.mock.calls[0];
            expect(err).toBeNull();
            expect(user.email).toBe("dup2@github.com");
        });

        test("GitHub Strategy Callback - Catch Generic Error", async () => {
            const githubStrategy = passport._strategies.github;
            const doneFn = jest.fn();
            const profile = { emails: [{ value: "error@example.com" }] };
            jest.spyOn(UserService.prototype, "getUserByEmail").mockRejectedValueOnce(new Error("Generic"));
            
            await githubStrategy._verify("accessToken", "refreshToken", profile, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err] = doneFn.mock.calls[0];
            expect(err).toBeInstanceOf(Error);
        });

        test("JWT Strategy Callback - Catch Generic Error", async () => {
            const jwtStrategy = passport._strategies.jwt;
            const doneFn = jest.fn();
            jest.spyOn(UserService.prototype, "getUserById").mockRejectedValueOnce(new Error("Generic"));
            
            await jwtStrategy._verify({ id: "123" }, doneFn);
            expect(doneFn).toHaveBeenCalled();
            const [err] = doneFn.mock.calls[0];
            expect(err).toBeInstanceOf(Error);
        });

        test("passportCall - Error next(err)", () => {
            const req = {}; const res = {}; const next = jest.fn();
            jest.spyOn(passport, "authenticate").mockImplementation((strategy, callback) => {
                return (req, res, next) => callback(new Error("Auth Error"), null, null);
            });
            const middleware = passportCall();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("passportCall - !user sin info.message", () => {
            const req = {}; 
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
            const next = jest.fn();
            jest.spyOn(passport, "authenticate").mockImplementation((strategy, callback) => {
                return (req, res, next) => callback(null, false, "Custom Info String");
            });
            const middleware = passportCall();
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        test("passportCall - !user sin info object", () => {
            const req = {}; 
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
            const next = jest.fn();
            jest.spyOn(passport, "authenticate").mockImplementation((strategy, callback) => {
                return (req, res, next) => callback(null, false, null);
            });
            const middleware = passportCall();
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });
});

