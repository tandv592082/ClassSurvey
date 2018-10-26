const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const student = require('./student')
const teacher = require('./teacher')
const admin = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        require: true
    },
    createStudent:[{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }],
    createTeacher:[{ type: mongoose.Schema.Types.ObjectId, ref: 'teacher' }]
});

//generating a hash
admin.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

admin.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('admin', admin)