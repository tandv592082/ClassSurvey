const mongoose = require('mongoose')
const user = require('../auth/user')
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
        cardId: Number,
        require: true,
        ref: 'user'
    },
    student:[{// danh sách sinh viên
        cardId: Number,
        require: true,
        ref: 'user'
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

module.exports = mongoose.model('Object', ObjectSchema)