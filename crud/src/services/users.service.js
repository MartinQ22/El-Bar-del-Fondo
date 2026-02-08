import { UsersDAO } from "../DAO/UsersDAO.js";
import { createHash } from "../../utils.js";
import { UsersDTO } from "../DTO/UsersDTO.js";

const usersDao = new UsersDAO();

export class UserService {
    async getUsers() {
        return await usersDao.getAllUsers();
    }

    async createUser(userData) {
        const { email, password } = userData;

        // Regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!emailRegex.test(email)) {
            throw new Error("El email no tiene un formato válido");
        }

        if (!passwordRegex.test(password)) {
            throw new Error("La contraseña no cumple con los requisitos de seguridad");
        }

        const newUser = {
            ...userData,
            password: createHash(password)
        };

        return await usersDao.createUser(newUser);
    }

    async updateUser(email, updateData) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (updateData.password) {
            if (!passwordRegex.test(updateData.password)) {
                throw new Error("La contraseña no cumple con los requisitos de seguridad");
            }
            updateData.password = createHash(updateData.password);
        }

        return await usersDao.updateUserByEmail(email, updateData);
    }

    async getUserByEmail(email) {
        return await usersDao.getUserByEmail(email);
    }

     async getUserById(id) {
         return await usersDao.getUserById(id);
     }

    async deleteUser(email) {
        return await usersDao.deleteUserByEmail(email);
    }

      async deleteUserById(id) {
        return await usersDao.deleteUserById(id);
     }
}
