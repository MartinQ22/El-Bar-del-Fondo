import { UserService } from "../services/users.service.js";
import { UsersDTO } from "../DTO/UsersDTO.js";
import { createError } from "../utils/createError.utils.js";
import { successResponse } from "../utils/apiResponse.utils.js";

const userService = new UserService();

export const getUsers = async (req, res, next) => {
    try {
        let users = await userService.getUsers();
        return successResponse(res, { message: "Usuarios recuperados con éxito", payload: users });
    } catch (error) {
        console.error(error.message);
        return next(createError(error.message, 500));
    }
};

export const getUserByEmail = async (req, res, next) => {
    try {
        let user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return next(createError("Usuario no encontrado", 404));
        }

        const userDTO = new UsersDTO().setSessionUser(user);
        return successResponse(res, { message: "Usuario obtenido con éxito", payload: userDTO });
    } catch (error) {
        console.error(error.message);
        return next(createError(error.message, 500));
    }
};

export const createUser = async (req, res, next) => {
    try {
        let result = await userService.createUser(req.body);
        return successResponse(res, { statusCode: 201, message: "Usuario creado con éxito", payload: result });
    } catch (error) {
        if (error.message === "El email no tiene un formato válido" || error.message === "La contraseña no cumple con los requisitos de seguridad") {
            return next(createError(error.message, 400));
        }
        return next(createError(error.message, 500));
    }
};

export const updateUser = async (req, res, next) => {
    const { email } = req.body;
    try {
        let userUpdated = await userService.updateUser(email, req.body);

        if (!userUpdated) {
            return next(createError("Usuario no encontrado", 404));
        }

        return successResponse(res, { message: "Usuario modificado con éxito", payload: userUpdated });
    } catch (error) {
        if (error.message === "La contraseña no cumple con los requisitos de seguridad") {
            return next(createError(error.message, 400));
        }
        console.error(error.message);
        return next(createError(error.message, 500));
    }
};

export const deleteUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        let users = await userService.deleteUser(email);
        if (!users) {
            return next(createError("Usuario no encontrado", 404));
        }
        return successResponse(res, { message: "Usuario eliminado con éxito", payload: users });
    } catch (error) {
        console.error(error.message);
        return next(createError(error.message, 500));
    }
};

export const failRegister = async (req, res, next) => {
    return next(createError("Registro fallido", 400));
};

