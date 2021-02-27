module.exports = {
    isAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next()
        }

        req.flash('error_msg', "You need to log as Admin to enter this Area")
        res.redirect('/')
    }
}