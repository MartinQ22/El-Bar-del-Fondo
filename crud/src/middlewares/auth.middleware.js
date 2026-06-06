import { errorResponse } from "../utils/apiResponse.utils.js";

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return errorResponse(res, {
        statusCode: 403,
        message: "Acceso denegado: Se requieren permisos de administrador"
    });
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return errorResponse(res, {
        statusCode: 403,
        message: "Debes iniciar sesion para poder continuar"
    });
};
