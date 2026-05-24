import express from "express";
import { checkHealth } from "../controllers/health.controller.js";

const healthRouter = express.Router();

healthRouter.get("/", checkHealth);

export default healthRouter;
