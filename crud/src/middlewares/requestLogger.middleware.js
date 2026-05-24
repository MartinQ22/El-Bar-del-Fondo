function getLogLevel(statusCode){
    if (statusCode >= 500) return "error"
    if (statusCode >= 400 && statusCode < 500) return "error"
    if (statusCode >= 300 && statusCode < 400) return "warn"
    if (statusCode >= 200 && statusCode < 300) return "info"
}

export function requestLogger(req, res, next) {
    const start = Date.now();
   
    res.on("finish", () => {
        const responseTimeMs = Date.now() - start;

        const log = {
            level: getLogLevel(res.statusCode),
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            responseTimeMs,
            Timestamp: new Date().toISOString()
        }

        console.log( JSON.stringify(log) )
    })
    next();
}
    