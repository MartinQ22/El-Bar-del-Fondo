import { createError } from "../utils/createError.utils.js";
import { env } from "../config/enviroment.js";

export const checkHealth = async (req, res, next) => {
    try {
        const isMaintenance = env.MAINTENANCE;
        
        const healthStatus = {
            status: isMaintenance ? "maintenance" : "OK",
            environment: env.NODE_ENV,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage()
        };

        return res.status(200).json(healthStatus);
    } catch (error) {
        return next(createError("Error al verificar el estado de salud", 500));
    }
};
