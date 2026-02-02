import { UserService } from "../services/users.service.js";
import { UsersDTO } from "../DTO/UsersDTO.js";

const userService = new UserService();

export const getUsers = async (req, res) => {
    try {
        let users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        let user = await userService.getUserByEmail(req.params.email);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const userDTO = new UsersDTO().setSessionUser(user);
        res.json(userDTO);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const registerUser = async (req, res) => {
    res.status(200).json({ message: "Registro exitoso" });
};

export const createUser = async (req, res) => {
    try {
        let result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === "El email no tiene un formato válido" || error.message === "La contraseña no cumple con los requisitos de seguridad") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { email } = req.body;
    try {
        let userUpdated = await userService.updateUser(email, req.body);

        if (!userUpdated) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(userUpdated);
    } catch (error) {
        if (error.message === "La contraseña no cumple con los requisitos de seguridad") {
            return res.status(400).json({ message: error.message });
        }
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { email } = req.body;

    try {
        let users = await userService.deleteUser(email);
        if (!users) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const failRegister = async (req, res) => {
    res.status(400).json({ message: "Registro fallido" });
};
