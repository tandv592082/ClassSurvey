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
    teacherID:{//cán bộ dạy
        type: Number,
        require: true,
    },
    studentID:[{// danh sách sinh viên
        type: Number,
        require: true,
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