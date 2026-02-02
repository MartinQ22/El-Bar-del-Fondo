import { userModel } from "../models/usersModel.js";

export class UsersDAO {
    async getAllUsers() {
        return await userModel.find({});
    }

    async getUserById(id) {
        return await userModel.findById(id);
    }

    async getUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    async createUser(user) {
        return await userModel.create(user);
    }

    async updateUser(id, updatedUser) {
        return await userModel.findByIdAndUpdate(id, updatedUser, { new: true });
    }

    async updateUserByEmail(email, updatedUser) {
        return await userModel.findOneAndUpdate({ email }, updatedUser, { new: true });
    }

    async deleteUser(id) {
        return await userModel.findByIdAndDelete(id);
    }

    async deleteUserByEmail(email) {
        return await userModel.findOneAndDelete({ email });
    }
}