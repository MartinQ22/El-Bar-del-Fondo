import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

// ENCRIPTACION BRCYPT
export function createHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //GenSalt define la cantidad de veces que se multipplica la cadena de hasheo
}

export function isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

//TESTING



export const serverRoot = dirname(fileURLToPath(import.meta.url));