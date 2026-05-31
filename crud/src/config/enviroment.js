import { config } from "dotenv"

config()

const cleanEnv = (value) => {
    if (typeof value === "string") {
        return value.replace(/^['"]|['"]$/g, "");
    }
    return value;
};

export const env = {
    PORT: Number(cleanEnv(process.env.PORT)) || 8080,
    URI_MONGO_CONNECT: cleanEnv(process.env.URI_MONGO_CONNECT),
    JWT_SECRET: cleanEnv(process.env.JWT_SECRET),
    GITHUB_CLIENT_ID: cleanEnv(process.env.GITHUB_CLIENT_ID),
    GITHUB_CLIENT_SECRET: cleanEnv(process.env.GITHUB_CLIENT_SECRET),
    MAIL_APP: cleanEnv(process.env.MAIL_APP),
    COOKIE_SECRET: cleanEnv(process.env.COOKIE_SECRET),
    USER_G: cleanEnv(process.env.USER_G),
    ADMIN_USER: cleanEnv(process.env.ADMIN_USER),
    ADMIN_PASS: cleanEnv(process.env.ADMIN_PASS),
    BASE_URL: cleanEnv(process.env.BASE_URL) || "http://localhost:8080",
    workers: Number(cleanEnv(process.env.CLUSTER_WORKERS)) || 2,
    MAINTENANCE: cleanEnv(process.env.MAINTENANCE) === "true",
    NODE_ENV: cleanEnv(process.env.NODE_ENV) || "development",
    TIENDA: cleanEnv(process.env.Tienda) || cleanEnv(process.env.TIENDA) || "Tienda El Bar del Fondo"
}