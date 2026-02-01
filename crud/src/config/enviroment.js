import { config } from "dotenv"

config()

export const env = {
    PORT: process.env.PORT,
    URI_MONGO_CONNECT: process.env.URI_MONGO_CONNECT,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
}