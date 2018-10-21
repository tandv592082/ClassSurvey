var passport = require('passport');

module.exports = {
    signUp : async (req, res, next) =>{
        await passport.authenticate('user-signup', (err, user, info) => {
            if(err){
                let err = new Error(`${err}`)
                err.statusCode = 400
                next(err)
            }
            else {
                res.status(200).json(info)
            }
        })(req, res, next)
    },
    logIn: async(req, res, next) => {
        await passport.authenticate('user-login',(err, user, info) =>{
            if(err){
                let err = new Error(`${err}`)
                err.statusCode = 400
                next(err)
            }
            else if(!user){
                return res.status(404).json(info)
            }
            else{
                req.login(user, (err) => {
                    if(err)
                        next(err)
                    return res.status(200).json(info)
                })
            }
        })(req, res, next)
    }
}