import mongoose from "mongoose";
import { env } from "../src/config/enviroment.js";

// async function mongoConnection(){
//     await mongoose.connect("mongodb://localhost:27017/El-bar-del-Fondo")
// }

async function mongoConnection(){
    await mongoose.connect(env.URI_MONGO_CONNECT)
}

// async function mongoConnection(){
//     await mongoose.connect("mongodb+srv://MartinUser:Martin123q@martin-cluster.h06t6tm.mongodb.net/")
// }

export default mongoConnection

