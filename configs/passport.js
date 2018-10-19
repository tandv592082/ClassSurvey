var LocalStrategy = require('passport-local').Strategy
var User          = require('../models/auth/user')
var Admin         = require('../models/auth/admin')
const _           = require('lodash')
var myLocalConfig = (passport) => {

    //admin local
    passport.use('admin-local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    })),
    function(req, email, password, done) {
        if(email)
            email = email.toLowerCase();
        
        //asynchronous
        process.nextTick( function(){
            Admin.findOne({'email': email}, (err, user)=>{
                if(err)
                    return done(err)
                if(!user)
                    return done(null, false, {
                        success: false,
                        message: `Sai tên tài khoản`
                    })
                if(!user.validPassword(password))
                    return done(null, false, {
                        success: false,
                        message: `Sai mật khẩu`
                    });
                else{
                    user.lastLogin = Date.now().valueOf()
                    user.save(err => {
                        if(err)
                            return done(err);
                        console.log('Saved lastLogin!');
                    })
                    return done(null, user, {
                        success: true,
                        message: `Logged in!`,
                        userInfo: user
                    })
                }

            })
        })
    }
    //Authenticate user local
    passport.use('user-local', new LocalStrategy({
        usernameField: 'cardID',
        passwordField: 'password',
        passReqToCallback: true,
    })),
    function(req,cardID, password, done) {
        process.nextTick(() => {
            User.findOne({'cardID': cardID}, (err, user) => {
                if(err)
                    return done(err)
                else if(!user)
                    return done(null, false,{
                        success: false,
                        message: `Sai tên tài khoản!`
                    })
                else if(!user.validPassword(passport)){
                    return done(null, false, {
                        success: false,
                        message: `Sai mật khẩu`
                    })
                }
                else{
                    user.lastLogin = Date.now().valueOf()
                    user.save(err => {
                        if(err)
                            return done(err)
                        console.log(`Saved LastLogin!`)
                    })
                    return done(null, user, {
                        success: true,
                        message: `Logged In!`,
                        user: user
                    })
                }
            })
        })
    }

    passport.use('user-signup', new LocalStrategy({
        usernameField: 'cardID',
        passwordField: 'password',
        passReqToCallback: true,
    })),
    function(req, cardID, password, done){
        if(!_.isNumber(cardID))
            return done(null, false, {
                success: false,
                message: `Not a card id!`
            })
        process.nextTick(()=>{
            if(!req.user) {
                User.findOne({'cardID': cardID}, (err, user) =>{
                    if(err)
                        return done(err);
                    else if(user)
                        return done(null, false, {
                            success: false,
                            message: `Đã tồn tại tên tài khoản!`
                        })
                    else{
                        var newUser = new User()
                        newUser.cardID = cardID
                        newUser.password = newUser.generateHash(password)

                        newUser.save(err => {
                            if(err)
                                return done(err)
                            return done(nul, newUser, {
                                success: true,
                                message: `Đăng ký thành công!`,
                                user: newUser
                            })
                        })
                    }
                })
            }
            else if( !req.user.cardID) {
                User.findOne({'cardID': cardID}, (err, user) =>{
                    if(err)
                        return done(err)
                    if(user)
                        return done(null, false,{
                            success: false,
                            message: `Đã tồn tại tên tài khoản`
                        })
                    else{
                        var user = req.user
                        user.cardID = cardID
                        user.password = user.generateHash(password)
                        user.save((err) => {
                            if(err)
                                return done(err)
                            return done(null, user, {
                                success: true,
                                message: `Đăng kí tài khoản thành công`,
                                user: user
                            })
                        })
                    }
                })
            }
            else{
                return done(null, req.user, {
                    success: false,
                    message: ` Bạn cần logout trước khi đăng kí tài khoản mới!`
                })
            }
        })
    }
}