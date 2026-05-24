export function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal server error"
    })
};