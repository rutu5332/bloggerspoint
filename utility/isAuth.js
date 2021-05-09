// This middleware function used to protect routes
module.exports = isAuth = (req, res, next) => {
    if(req.session.isLoggedIn) {
        next();
    } else {
        res.send('Page not found');
    }
}
