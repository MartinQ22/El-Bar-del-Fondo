import { errorResponse } from "../utils/apiResponse.utils.js";

export function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;

    return errorResponse(res, {
        statusCode,
        message: err.message
    });
};