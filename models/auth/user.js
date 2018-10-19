const mongoose = require('mongoose')
const admin = require('./admin')
const bcrypt = require('bcrypt-nodejs')
const user = mongoose.Schema({
    type: {
        type: Number,
        require: true,
        default: 1 // 1 : student 2: teacher
    },
    cardID: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: tue
    },
    fullName: {
        type: String,
        require: true
    },
    VNUMail: {
        type: String,
        require: true
    },
    course:{
        type: String,
        require: true,
        default: null
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        require: true
    },
    createByAdmin:{type: mongoose.Types.ObjectId, ref: 'admin'}
});

//generate hash  password
student.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

student.method.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('user', user)