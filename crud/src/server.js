import app from "../app.js";
import { env } from "./config/enviroment.js";
import { logger } from "./utils/logger.utils.js";
import mongoConnect from "../database/mongoConnection.js";
import http from "http";


const PORT = env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
    mongoConnect().then(() => console.log("Base de datos conectada"));
    logger.info("Server is running")
    console.log(`Server running on port ${PORT}`);
    console.log(`Maintanence: ${env.MAINTENANCE}`);
    console.log(`Current enviroment: ${env.NODE_ENV}`);
    console.log(`Store: ${env.TIENDA}`);
});

