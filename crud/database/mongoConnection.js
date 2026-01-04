import mongoose from "mongoose";

async function mongoConnection(){
    await mongoose.connect("mongodb://localhost:27017/El-bar-del-Fondo")
}

// async function mongoConnection(){
//     await mongoose.connect("mongodb+srv://MartinUser:Martin123q@martin-cluster.h06t6tm.mongodb.net/")
// }

export default mongoConnection