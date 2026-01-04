function handleSession(req, res, next) {
    if (req.session.user){
        next()
    } else{
        res.redirect("/login")
    }
}

export function avoidLoginView(req,res, next) {
    if (!req.session.user) {
        next()
    } else {
        res.redirect()
    }
}

export default handleSession;