export function successResponse(res, { statusCode = 200, message, payload }) {
    return res.status(statusCode).json({
        status: "success",
        message,
        payload,
    });
}