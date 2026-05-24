import { createError } from "../utils/createError.utils.js";

export const checkHealth = async (req, res, next) => {
    try {
        const isMaintenance = process.env.MAINTENANCE === 'true';
        
        const healthStatus = {
            status: isMaintenance ? "maintenance" : "OK",
            environment: process.env.NODE_ENV || "development",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage()
        };

        return res.status(200).json(healthStatus);
    } catch (error) {
        return next(createError("Error al verificar el estado de salud", 500));
    }
};
