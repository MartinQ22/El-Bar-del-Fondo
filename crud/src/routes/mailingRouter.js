import { Router } from "express";
import { sendWelcomeMessage, sendPasswordReset } from "../controllers/mailing.controller.js";


const router = Router();

//chequear esta ruta
// "/", getUsers
router.get("/welcome", sendWelcomeMessage)

router.post("/reset-password-request", sendPasswordReset)

export default router