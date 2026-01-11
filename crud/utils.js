import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";

// ENCRIPTACION BRCYPT
export function createHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //GenSalt define la cantidad de veces que se multipplica la cadena de hasheo
}

export function isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}
//JSON WEB TOKENS
export function generateToken(payload) {
    return jwt.sign(payload, "screto jwt")
}

export function verifyToken(token) {
    return jwt.verify(token, "screto jwt")
}
//TESTING



export const serverRoot = dirname(fileURLToPath(import.meta.url));