import app from "../app.js";
import { env } from "./config/enviroment.js";
import mongoConnect from "../database/mongoConnection.js";
import http from "http";

const PORT = process.env.PORT || env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
    mongoConnect().then(() => console.log("Base de datos conectada"));
    console.log(`Server running on port ${PORT}`);
    console.log(`Maintanence: ${process.env.MAINTENANCE || "false"}`);
    console.log(`Current enviroment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Store: ${process.env.TIENDA || "Tienda El Bar del Fondo"}`);
});

