module.exports = {
    islogged: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg', "You need to log in to view the projects")
        res.redirect('/')
    }
}