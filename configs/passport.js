var LocalStrategy = require('passport-local').Strategy
var Student       = require('../models/auth/student')
var Teacher       = require('../models/auth/teacher')
var Admin         = require('../models/auth/admin')
const _           = require('lodash')
const validInput  = require('../libs/validate')
const config      = require('./config')
var myLocalConfig = (passport) => {
    passport.serializeUser((obj, done) => {
        if (obj instanceof Admin) {
          done(null, { id: obj.id, type: 'Admin' });
        } else if (obj instanceof Student) {
          done(null, { id: obj.id, type: 'Student' });
        }
        else{
            done(null,{ id: obj.id, type: 'Teacher' })
        }
      });
      
      passport.deserializeUser((obj, done) => {
        if (obj.type === 'Admin') {
          Admin.findById(obj.id)
            .then(admin => done(null,admin))
            .catch(err => done(err))
        } else if(obj.type === 'Student') {
            Student.findById(obj.id)
            .then(student => done(null,student))
            .catch(err => done(err))
        }
        else{
            Teacher.findById(obj.id)
            .then(teacher => done(null,teacher))
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
    passport.use('student-login', new LocalStrategy({
        usernameField: 'cardID',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req,cardID, password, done) {
        process.nextTick(function(){
            Student.findOne({'cardID': cardID}, (err, user) => {
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
                        message: `Student Logged In!`,
                        user: user,
                        timeLeft: req.session.cookie.maxAge
                    })
                }
            })
        })
    }));

    passport.use('student-signup', new LocalStrategy({
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
            else if(!validInput.isValidPassword(password)){
                return done(null, false, {
                    success: false,
                    message: 'Mật khẩu gồm ít nhất 8 kí tự, ít nhất 1 chữ cái Hoa, 1 chữ cái thường và ít nhất 1 số!'
                })
            }
            else if(req.body.fullName === undefined){
                return done(null, false, {
                    success: false,
                    message: ` Chưa nhập họ và tên !`
                })
            }
            else if(!validInput.isFullName(req.body.fullName)){
                return done(null, false,{
                    success: false,
                    message: ` Họ và Tên sai định dạng!`
                })
            }
            process.nextTick(function(){
            if(!req.user) {
                Student.findOne({'cardID': _.trim(cardID)}, (err, user) =>{
                    if(err)
                        return done(err);
                    else if(user)
                        return done(null, false, {
                            success: false,
                            message: `Đã tồn tại tên tài khoản!`
                        })
                    else{
                        var newUser = new Student()
                        if(req.body.course !== undefined){
                            newUser.course = req.body.course
                        }
                        newUser.cardID = _.trim(cardID)
                        newUser.password = newUser.generateHash(password)
                        newUser.fullName = req.body.fullName 
                        newUser.firstCharOfLastName = newUser.getFirstCharOfLastName(req.body.fullName)
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
                Student.findOne({'cardID': cardID}, (err, user) =>{
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

    //teacher
    passport.use('teacher-signup', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, userName, password, done){
            if(!validInput.isValidUserName(userName)){
                return done(null, false, {
                    success: false,
                    message:`username is require!`
                })
            }
            else if(!validInput.isCardID(req.body.cardID))
            return done(null,false,{
                success: false,
                message: `CardId is require!`
            })
            else if(!validInput.isValidPassword(password)){
                return done(null, false, {
                    success: false,
                    message: 'Mật khẩu gồm ít nhất 8 kí tự, ít nhất 1 chữ cái Hoa, 1 chữ cái thường và ít nhất 1 số!'
                })
            }
            else if(req.body.fullName === undefined){
                return done(null, false, {
                    success: false,
                    message: ` Chưa nhập họ và tên !`
                })
            }
            else if(!validInput.isFullName(req.body.fullName)){
                return done(null, false,{
                    success: false,
                    message: ` Họ và Tên sai định dạng!`
                })
            }
            process.nextTick(function(){
            if(!req.user) {
                Teacher
                    .findOne({userName: userName})
                    .exec((err, user) =>{
                        if(err)
                            return done(err);   
                        else if(user)
                            return done(null, false, {
                                success: false,
                                message: `Đã tồn tại tên tài khoản hoặc trùng cardID!`
                            })
                        else{
                            var newUser = new Teacher()
                            newUser.cardID = _.trim(req.body.cardID)
                            newUser.userName = _.trim(userName)
                            newUser.password = newUser.generateHash(password)
                            newUser.fullName = req.body.fullName 
                            newUser.firstCharOfLastName = newUser.getFirstCharOfLastName(req.body.fullName)
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
            else if( !req.user.userName) {
                Teacher.findOne({'userName': userName}, (err, user) =>{
                    if(err)
                        return done(err)
                    if(user)
                        return done(null, false,{
                            success: false,
                            message: `Đã tồn tại tên tài khoản`
                        })
                    else{
                        var user = req.user
                        user.userName = userName
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


    passport.use('teacher-login', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req,userName, password, done) {
        process.nextTick(function(){
            Teacher.findOne({'userName': userName}, (err, user) => {
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
                        message: `Teacher Logged In!`,
                        user: user,
                        timeLeft: req.session.cookie.maxAge
                    })
                }
            })
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
        else if(!validInput.isValidPassword(password)){
            return done(null, false, {
                success:false,
                message: 'Mật khẩu ít nhất :1 sô, 1 chữ hoa, 1 chữ thường!'
            })
        }
        else if(!validInput.isEmail(realEmail)){
            return done(null, false,{
                success: false,
                message: `Not a email!`
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