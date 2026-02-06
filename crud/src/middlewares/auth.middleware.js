export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: "Acceso denegado: Se requieren permisos de administrador" });
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: "Debes iniciar sesion para poder continuar" });
};
