/**
 * Module dependence
 */

const ADMIN = require('../models/auth/admin')
const mongoose = require('mongoose')

/**
 * Check user authenticate
 * @param {Request} req request of user
 * @param {Response} res response of user
 * @param {*} next as next middleware
 * @public
 */
exports.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated())
       return next()
    return res.status(401).json('Unauthorized!')
}

/**
 * Check user is admin account
 * @param {Request} req request of user
 * @param {Response} res response of user
 * @param {*} next as next middleware
 * @return check user login is admin or not
 * @public
 */

exports.isAdmin = async(req, res, next) =>{
    await ADMIN.findById(mongoose.Types.ObjectId(req.user._id),(err, admin) =>{
        if(err){
            next(err)
        }
        else if(!admin){
            return res.status(403).json({
                success: false,
                message:'Forbidden!'
            })
        }
        next()
    })
        
}