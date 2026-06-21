import { logger } from "../utils/logger.utils.js";
import { requestCounter, requestDuration } from "../utils/metrics.utils.js";

export function getLogLevel(statusCode){
    if (statusCode >= 500) return "error";
    if (statusCode >= 400 && statusCode < 500) return "warn";
    return "info";
}

export function requestLogger(req, res, next) {
    requestCounter.inc()

    const start = Date.now();
   
    res.on("finish", () => {
        requestCounter.labels(req.method, res.statusCode)

        const responseTimeMs = Date.now() - start;

        requestDuration.observe(responseTimeMs / 1000)

        const logLevel = getLogLevel(res.statusCode)

        logger[logLevel]({
            msg: "HTTP Request",
            reqId: req.reqId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            responseTimeMs
        })
    })
    next();
}
    