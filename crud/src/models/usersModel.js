import { hash } from "bcrypt";
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    age: { type: Number,
         required: true },
    password: {
        type: String,
        required: true,
    }, 
    role: { type: String, default: 'user' }
})

export const userModel = mongoose.model("user", usersSchema);

