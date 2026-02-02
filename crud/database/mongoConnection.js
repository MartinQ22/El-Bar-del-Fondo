import mongoose from "mongoose";

async function mongoConnection(){
    await mongoose.connect(process.env.URI_MONGO_CONNECT)
}

export default mongoConnection

