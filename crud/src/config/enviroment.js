import { config } from "dotenv"

config()

export const env = {
    PORT: process.env.PORT,
    URI_MONGO_CONNECT: process.env.URI_MONGO_CONNECT,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    MAIL_APP: process.env.MAIL_APP,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    USER_G: process.env.USER_G,
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
    BASE_URL: process.env.BASE_URL || "http://localhost:8080"
}