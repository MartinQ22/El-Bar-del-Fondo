import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
})

export const userModel = mongoose.model("user", usersSchema);

