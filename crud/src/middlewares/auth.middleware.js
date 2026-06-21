import jwt from 'jsonwebtoken';
import { env } from '../config/enviroment.js';
import { createError } from '../utils/createError.utils.js';
import { errorResponse } from "../utils/apiResponse.utils.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(createError('Token is required', 401));
    }

    // Bearer jasdkk1123123123
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return next(createError('Invalid auth format', 401));
    }

    try {
        const decodeUser = jwt.verify(token, env.JWT_SECRET);

        req.user = decodeUser;

        next();
    } catch (error) {
        return next(createError('Invalid or expired token', 401));
    }
}

export function authorizeAdmin(req, res, next) {
    if (!req.user) {
        return next(createError('User not authenticated', 401));
    }

    if (req.user.role !== 'admin') {
        return next(createError('Forbidden', 403));
    }

    next();
}

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return next(createError("User not authenticated", 401));
    }
    if (req.user.role !== 'admin') {
        return next(createError("Acceso denegado: Se requieren permisos de administrador", 403));
    }
    next();
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



