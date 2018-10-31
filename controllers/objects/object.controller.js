const object     = require('../../models/objects/object')
const student     = require('../../models/auth/student')
const teacher     = require('../../models/auth/teacher')
const validInput  = require('../../libs/validate')
const multer      = require('multer')
const fileHandler = require('../../libs/fileHandler')
const _           = require('lodash')

module.exports = {
    initObject: async(req, res, next) => {
        var upload = multer({
            storage:  fileHandler.storageFiles,
            fileFilter: (req,file,cb) => {
                if (!file.originalname.toLowerCase().match(/\.(xlsx)$/)) {
                    return cb(new Error('Chỉ được upload file exell có định dạng /'.xlsx/'!'));
                }
                cb(null, true);
            }
        }).fields([
            {
                name: 'files',
                maxCount: 1
            }
        ])

        upload(req, res, (err) => {
            if(err)
                return res.status(400).json(err)
            else if(_.isEmpty(req.files)){
                return res.status(400).json({
                    success: false,
                    message: `No files selected!`
                })
            }
            else{
                let path = `./public/files/${req.files.files[0].filename}`
                let removePath = `/public/files/${req.files.files[0].filename}`
                let result = fileHandler.jsonFromExel(path)

                //remove file
                fileHandler.unlinks(removePath)
                let returnData = fileHandler.syncResult(result.DSLMH)
                object.find({'code': returnData.object.code}, (err, object) => {
                    if(err)
                        return next(err)
                    else if(object) {
                        res.status(400).json({
                            success: false,
                            message: 'Môn học đã tồn tại!'
                        })
                    }
                    else{
                        let newObject = new object(returnData.object)
                        //sync teacher
                        teacher.find({'cardID': returnData.teacherID},(err, teacher) =>{
                            if(err)
                                return next(err)
                            else if(!teacher){
                                let err = new Error(`ID giáo viên ${returnData.teacherID} không tồn tại!`)
                                err.statusCode = 404
                                return next(err)
                            }
                            else{
                                newObject.teacher = teacher._id
                                teacher.teachObject.push(newObject._id)
                                teacher.save(err => {
                                    if(err)
                                        return next(err)
                                    console.log('teacher saved!')
                                })
                            }
                        })

                        returnData.studentsID.map(el => {
                            student.find({'cardID': el}, (err, student) =>{
                                if(err)
                                    return next(err)
                                else if(!student){
                                    let err = new Error(`ID student ${el} không tồn tại!`)
                                    err.statusCode = 404
                                    return next(err)
                                }
                                else{
                                    newObject.teacher = student._id
                                    student.learnObject.push(newObject._id)
                                    student.save(err => {
                                        if(err)
                                            return next(err)
                                        console.log('student save!')
                                    })
                                }
                            })
                        })

                        newObject.save(err => {
                            if(err)
                                return next(err)
                            return res.status(200).json({
                                success: true,
                                message: `Create new object successfully!`,
                                data: newObject
                            })
                        })

                    }
                })
            }
        })
    }
}