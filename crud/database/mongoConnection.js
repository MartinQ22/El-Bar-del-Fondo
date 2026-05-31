import mongoose from "mongoose";
import { env } from "../src/config/enviroment.js";

async function mongoConnection(){
    await mongoose.connect(env.URI_MONGO_CONNECT)
}

export default mongoConnection

