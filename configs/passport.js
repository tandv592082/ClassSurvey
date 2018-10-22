var LocalStrategy = require('passport-local').Strategy
var User          = require('../models/auth/user')
var Admin         = require('../models/auth/admin')
const _           = require('lodash')
const validInput = require('../libs/validate')
const config = require('./config')
var myLocalConfig = (passport) => {
    passport.serializeUser((obj, done) => {
        if (obj instanceof Admin) {
          done(null, { id: obj.id, type: 'Admin' });
        } else {
          done(null, { id: obj.id, type: 'User' });
        }
      });
      
      passport.deserializeUser((obj, done) => {
        if (obj.type === 'Admin') {
          Admin.findById(obj.id)
            .then(admin => done(null,admin))
            .catch(err => done(err))
        } else {
            User.findById(obj.id)
            .then(admin => done(null,admin))
            .catch(err => done(err))
        }
      });
    //admin local
    passport.use('admin-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        if(email)
            email = _.trim(email.toLowerCase());
        
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
    }));
    //Authenticate user local
    passport.use('user-login', new LocalStrategy({
        usernameField: 'cardID',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req,cardID, password, done) {
        console.log('test:', typeof cardID)
        process.nextTick(function(){
            User.findOne({'cardID': cardID}, (err, user) => {
                if(err)
                    return done(err)
                else if(!user)
                    return done(null, false,{
                        success: false,
                        message: `Sai tên tài khoản!`
                    })
                else if(!user.validPassword(password)){
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
                        user: user,
                        timeLeft: req.session.cookie.maxAge
                    })
                }
            })
        })
    }));

    passport.use('user-signup', new LocalStrategy({
        usernameField: 'cardID',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, cardID, password, done){
            if(!validInput.isCardID(cardID))
                return done(null,false,{
                    success: false,
                    message: `Input phải là cardID`
                })
            process.nextTick(function(){
            if(!req.user) {
                User.findOne({'cardID': _.trim(cardID)}, (err, user) =>{
                    if(err)
                        return done(err);
                    else if(user)
                        return done(null, false, {
                            success: false,
                            message: `Đã tồn tại tên tài khoản!`
                        })
                    else{
                        var newUser = new User()
                        newUser.cardID = _.trim(cardID)
                        newUser.password = newUser.generateHash(password)

                        newUser.save(err => {
                            if(err)
                                return done(err)
                            return done(null, newUser, {
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
    }));

    passport.use('admin-signup', new LocalStrategy({
        usernameField:'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        var realEmail = _.replace(_.trim(email),config.SECRET_TOKEN,'')
        if(email){
           let checkEmail = config.isIncludesSecretToken(_.trim(email))
           if(!checkEmail)
                return done(null, false, {
                    success: false,
                    message: ` Bạn không có quyền register!`
                })
        }
            
        process.nextTick(function(){
            if(!req.user){
                Admin.findOne({'email': realEmail}, (err, admin)=>{
                    if(err)
                        return done(err)
                    else if(admin){
                        return done(null, false, {
                            success: false,
                            message: `Admin đã tồn tại!`
                        })
                    }
                    else{
                        var newAdmin = new Admin();
                        newAdmin.email = realEmail
                        newAdmin.password = newAdmin.generateHash(password)
                        newAdmin.save((err) => {
                            if(err)
                                return done(err)
                            return done(null,newAdmin,{
                                success:true,
                                message:   `Register successfully!`
                            })
                        })
                        
                    }
                })
            }else if(!req.user.email){
                Admin.findOne({'email': realEmail}, (err, admin) => {
                    if(err)
                        return done(err)
                    if(admin)
                        return done(null, false)
                    else{
                        var newAdmin = new Admin();
                        newAdmin.email = realEmail
                        newAdmin.password = newAdmin.generateHash(password)
                        newAdmin.save((err) => {
                            if(err)
                                return done(err)
                            return done(null,newAdmin,{
                                success:true,
                                message:   `Register successfully!`
                            })
                        })
                    }
                })
            }else{
                return done(null, req.user, {
                    success: false,
                    message: ` Bạn cần logout trước khi register!`
                })
            }
        })
    }))

}

module.exports = myLocalConfig;