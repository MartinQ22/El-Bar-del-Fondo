import { env } from "./enviroment.js";
import  nodemailer  from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user:env.USER_G,
        pass:env.MAIL_APP,
    }
});