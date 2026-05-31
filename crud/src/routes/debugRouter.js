import { getProcessInfo, blockCpu } from "../controllers/debug.controller.js";
import express from "express";

const router = express.Router()

router.get("/process", getProcessInfo)
router.get("/cpu", blockCpu)

export default router;