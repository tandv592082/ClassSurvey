var passport = require('passport');
const User = require('../../models/auth/user')
const validInput = require('../../libs/validate')
module.exports = {
    signUp : async (req, res, next) =>{
        await passport.authenticate('user-signup', (err, user, info) => {
            if(err){
                let err = new Error(`${err}`)
                err.statusCode = 400
                return next(err)
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
                return next(err)
            }
            else if(!user){
                return res.status(404).json(info)
            }
            else{
                
                req.login(user, (err) => {
                    if(err)
                        return next(err)
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
                return next(err)
            }
            else if(err)
                return next(err)
            res.status(200).json({
                success: true,
                message: `Deleted user id: ${req.params.id} !`
            })
        })
    },
    updateUser: async(req, res, next) => {
        await User.findOne({_id : req.params.id}, (err, user) =>{
            if(!validInput.isID(req.params.id)){
                let err = new Error('Params is not a mongoose Id!')
                err.statusCode = 422
                return next(err)
            }
            else if(err){
                return next(err)
            }
            else if(!user){
                let err = new Error(` Không tìm thấy user với id ${req.params.id}!`)
                err.statusCode = 404
                return next(err)
            }
            if(req.body.fullName !== undefined){
                if(!validInput.isFullName(req.body.fullName)){
                    return res.status(422).json({
                        success: false,
                        message: 'Họ và tên sai định dạng!'
                    })
                }
               user.fullName = req.body.fullName
               user.firstCharOfLastName = user.getFirstCharOfLastName(req.body.fullName)
            }
            if(req.body.type !== undefined){
                var check = validInput.isValidType(req.body.type)
                if(!check){
                    return res.status(422).json({
                        success: false,
                        message: `Invalid type!`
                    })
                }
                user.type = validInput.convertType(req.body.type)

            }
            if(req.body.course !== undefined){
                user.course = req.body.course
            }
            user.save(err => {
                if(err)
                    return next(err)
                return  res.status(200).json({
                    success: true,
                    message: `User id ${req.params.id} has been updated!`
                })
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