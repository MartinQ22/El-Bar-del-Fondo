export function successResponse(res, { statusCode = 200, message, payload }) {
    return res.status(statusCode).json({
        status: "success",
        message,
        payload,
    });
}

export function errorResponse(res, { statusCode = 500, message= null, }) {
    return res.status(statusCode).json({
        status: "error",
        message: message || "internal server error"
    });
}