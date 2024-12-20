const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        return next();  
    } else {
        return res.redirect('/login');  
    }
};

module.exports = isAuth;
