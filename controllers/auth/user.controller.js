var passport = require('passport');
const User = require('../../models/auth/user')
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
    },
    removeUser: async(req, res, next) =>{
        await User.findByIdAndRemove(req.params.id, (err,data) =>{
            if(err)
                next(err)
            res.status(200).json({
                success: true,
                message: `Deleted user id: ${req.params.id} !`
            })
        })
    }
}