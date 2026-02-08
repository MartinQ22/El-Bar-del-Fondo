import { Router } from "express";
import { sendWelcomeMessage, sendPasswordReset } from "../controllers/mailing.controller.js";

const router = Router();

router.get("/welcome", sendWelcomeMessage)

router.post("/reset-password-request", sendPasswordReset)

export default router