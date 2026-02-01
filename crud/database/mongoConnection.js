import mongoose from "mongoose";

// async function mongoConnection(){
//     await mongoose.connect("mongodb://localhost:27017/El-bar-del-Fondo")
// }

async function mongoConnection(){
    await mongoose.connect(process.env.URI_MONGO_CONNECT)
}

// async function mongoConnection(){
//     await mongoose.connect("mongodb+srv://MartinUser:Martin123q@martin-cluster.h06t6tm.mongodb.net/")
// // }
// async function mongoConnection(){
//     await mongoose.connect("mongodb+srv://MartinUser:Martin123q@martin-cluster.h06t6tm.mongodb.net/ElBarDelFondo?retryWrites=true&w=majority&appName=Martin-Cluster")

// }

export default mongoConnection

