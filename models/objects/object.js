const mongoose = require('mongoose')
const student = require('../auth/student')
const teacher  = require('../auth/teacher')
const ObjectSchema = new mongoose.Schema({
    credit: { //số tín chỉ
        type: Number,
        require: true
    },
    code: {//mã lớp
        type: String,
        require: true
    },
    teacher:{//cán bộ dạy
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'teacher'
    },
    students:[{// danh sách sinh viên
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'student'
    }],
    lectureRoom:{ // phòng học
        type: String,
        require: true
    },
    dayOfTheWeek: { //thứ
        type: Number,
        require: true
    },
    classes:{ //tiet mon hoc
        type: String,
        require: true
    }
})

module.exports = mongoose.model('object', ObjectSchema)