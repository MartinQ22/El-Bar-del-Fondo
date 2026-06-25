import { userModel } from "../models/usersModel.js";

/**
 * Data Access Object (DAO) para la colección de Usuarios.
 * Provee los métodos de lectura, creación, actualización y borrado en la base de datos de MongoDB para la entidad User.
 */
export class UsersDAO {
    /**
     * Obtiene la lista completa de usuarios registrados.
     * @returns {Promise<Array>} Lista de usuarios.
     */
    async getAllUsers() {
        return await userModel.find({});
    }

    /**
     * Busca un usuario específico por su identificador único (ID).
     * @param {string} id - ID del usuario.
     * @returns {Promise<Object|null>} El usuario encontrado o null.
     */
    async getUserById(id) {
        return await userModel.findById(id);
    }

    /**
     * Busca un usuario por su dirección de correo electrónico.
     * @param {string} email - Correo del usuario.
     * @returns {Promise<Object|null>} El usuario encontrado o null.
     */
    async getUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    /**
     * Crea y guarda un nuevo usuario en la base de datos.
     * @param {Object} user - Datos del nuevo usuario.
     * @returns {Promise<Object>} El usuario creado.
     */
    async createUser(user) {
        return await userModel.create(user);
    }

    /**
     * Actualiza los datos de un usuario buscando por ID.
     * @param {string} id - ID del usuario.
     * @param {Object} updatedUser - Nuevos datos.
     * @returns {Promise<Object|null>} El usuario actualizado o null.
     */
    async updateUser(id, updatedUser) {
        return await userModel.findByIdAndUpdate(id, updatedUser, { new: true });
    }

    /**
     * Actualiza los datos de un usuario buscando por su dirección de correo electrónico.
     * @param {string} email - Correo del usuario.
     * @param {Object} updatedUser - Nuevos datos.
     * @returns {Promise<Object|null>} El usuario actualizado o null.
     */
    async updateUserByEmail(email, updatedUser) {
        return await userModel.findOneAndUpdate({ email }, updatedUser, { new: true });
    }

    /**
     * Elimina un usuario de la base de datos por su ID.
     * @param {string} id - ID del usuario.
     * @returns {Promise<Object|null>} El usuario eliminado o null.
     */
    async deleteUser(id) {
        return await userModel.findByIdAndDelete(id);
    }

    /**
     * Elimina un usuario de la base de datos buscando por su dirección de correo electrónico.
     * @param {string} email - Correo del usuario.
     * @returns {Promise<Object|null>} El usuario eliminado o null.
     */
    async deleteUserByEmail(email) {
        return await userModel.findOneAndDelete({ email });
    }
}