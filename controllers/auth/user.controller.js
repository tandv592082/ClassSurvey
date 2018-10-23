var passport = require('passport');
const User = require('../../models/auth/user')
const validInput = require('../../libs/validate')
module.exports = {
    signUp : async (req, res, next) =>{
        await passport.authenticate('user-signup', (err, user, info) => {
            if(err){
                let err = new Error(`${err}`)
                err.statusCode = 400
                return 
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
                return 
            }
            else if(!user){
                return res.status(404).json(info)
            }
            else{
                
                req.login(user, (err) => {
                    if(err)
                        return 
                    return res.status(200).json(info)
                })
            }
        })(req, res, next)
    },
    removeUser: async(req, res, next) =>{
        await User.findByIdAndRemove(req.params.id, (err,data) =>{
            if(!validInput.isID(req.params.id)){
                let err = new Error('Params is not a mongoose Id!')
                err.statusCode = 422
                return 
            }
            else if(err)
                return 
            res.status(200).json({
                success: true,
                message: `Deleted user id: ${req.params.id} !`
            })
        })
    },
    updateUser: async(req, res, next) => {
        await User.findByIdAndUpdate(req.params.id, req.body, (err, user) =>{
            if(!validInput.isID(req.params.id)){
                let err = new Error('Params is not a mongoose Id!')
                err.statusCode = 422
                return 
            }
            else if(err){
                return 
            }
            else if(!user){
                let err = new Error(` Không tìm thấy user với id ${req.params.id}!`)
                err.statusCode = 404
                return 
            }
            if(req.body.fullName !== undefined){
                if(!validInput.isFullName(req.body.fullName)){
                    return res.status(422).json({
                        success: false,
                        message: 'Họ và tên sai định dạng!'
                    })
                }
            }
            if(req.body.type !== undefined){
                newUser.type = validInput.convertType(req.body.type)
            }
            res.status(200).json({
                success: true,
                message: `User id ${req.params.id} has been updated!`
            })
        })
    },
    getAllStudent: async(req, res, next) =>{
        let page = req.query.page
        let limit = req.query.limit
        if(!validInput.isValidPageAndLimit(page, limit)){
            let err = new Error('Invalid query page or limit!')
            err.statusCode = 422
            return next(err)
        }
        User.find({type: 1})
            
            .exec((err, data) => {
                if(err)
                    return 
                else return res.status(200).json({
                    success: false,
                    data
                })
            })
    }
}