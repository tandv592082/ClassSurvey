const mongoose = require('mongoose')
const admin = require('./admin')
const object = require('../objects/object')
const bcrypt = require('bcrypt-nodejs')
const student = mongoose.Schema({
    cardID: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    fullName: {
        type: String,
        require: true
    },
    VNUMail: {
        type: String,
        require: true
    },
    firstCharOfLastName:{
        type: String,
        require: true,
        default: null
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
    createByAdmin:{type:mongoose.Schema.Types.ObjectId, ref: 'admin'},
    learnObject:[{type:mongoose.Schema.Types.ObjectId, ref: 'object'}]
});

//generate hash  password
student.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

student.methods.validPassword = function(password){
    if(this.password != null) {
        return bcrypt.compareSync(password, this.password);
    } else {
        return false;
    }
}

/**
 * get first charactor of LastName from Fullname to sort
 * @param {string} fullname 
 * @return {string} result when handle done
 * @public
 */


student.methods.getFirstCharOfLastName = function(fullname){
    let temp = fullname.split(" ")
    return temp[temp.length -1].charAt(0)

}

module.exports = mongoose.model('student', student)