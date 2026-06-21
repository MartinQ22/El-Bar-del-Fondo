import mongoose from "mongoose";
import { env } from "../src/config/enviroment.js";
import { logger } from "../src/utils/logger.utils.js";

async function mongoConnection(){
    try{await mongoose.connect(env.URI_MONGO_CONNECT)
    logger.info("Conexion a MongoDB exitosa");}
    catch (error){
        logger.error({
            msg: "Error al conectar a MongoDB",
            error: error.message
        })
        process.exit(1);
    }
}

export default mongoConnection

