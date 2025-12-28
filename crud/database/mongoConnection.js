import mongoose from "mongoose";

async function mongoConnection(){
    await mongoose.connect("mongodb://localhost:27017/El-bar-del-Fondo")
}

export default mongoConnection