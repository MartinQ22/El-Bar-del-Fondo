export function cacheControl(req, res, next){
    if(req.method === "GET" && req.path.startsWith("/api/products")){
        res.set("Cache-Control","public, max-age=60")

        return next()
    }

    res.set("Cache-Control", "no-store");
    next();
}