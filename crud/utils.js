import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./src/config/enviroment.js";

// ENCRIPTACION BRCYPT
export function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //GenSalt define la cantidad de veces que se multipplica la cadena de hasheo
}

export function isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}
//JSON WEB TOKENS
export function generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET || "screto jwt", { expiresIn: '1d' })
}

export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET || "screto jwt")
}

export const serverRoot = dirname(fileURLToPath(import.meta.url));