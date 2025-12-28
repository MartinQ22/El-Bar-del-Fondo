function handleSession(req, res, next) {
    if (req.session.user){
        res.redirect("/profile")
    } else{
        next()
    }
}

export default handleSession;