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
    password: {
        type: String,
        required: true
    }, 
})

export const userModel = mongoose.model("user", usersSchema);

