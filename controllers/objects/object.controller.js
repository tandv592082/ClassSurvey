const objects     = require('../../models/objects/object')
const student     = require('../../models/auth/student')
const teacher     = require('../../models/auth/teacher')
const validInput  = require('../../libs/validate')
const multer      = require('multer')
const fileHandler = require('../../libs/fileHandler')
const _           = require('lodash')
const mongoose    = require('mongoose')
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
                console.log('test', returnData.object.code)
                objects.findOne({'code': returnData.object.code}, (err, object) => {
                    if(err)
                        return next(err)
                    else if(object) {
                        return res.status(404).json({
                            success: false,
                            message: 'Môn học đã tồn tại!'
                        })
                    }
                    else{
                        
                        let stackCardError = new Array()
                        var newObject = new objects(returnData.object)
                        //sync teacher
                        newObject.teacherID = returnData.teacherID
                        teacher.findOne({'cardID': returnData.teacherID},(err, user) =>{
                            if(err)
                                return next(err)
                            else if(!user){
                                let err = new Error(`ID giáo viên ${returnData.teacherID} không tồn tại!`)
                                err.statusCode = 404
                                return next(err)
                            }
                            else{
                                user.teachObject.push(newObject._id)
                                user.save(err => {
                                    if(err)
                                        return next(err)
                                    console.log('teacher saved!')
                                })
                                
                            }
                        })

                        returnData.studentsID.map(el => {
                            newObject.studentID.push(el)
                            student.findOne({'cardID': el}, (err, student) =>{
                                if(err)
                                    return next(err)
                                else if(!student){
                                   stackCardError.push(el)
                                }
                                else{
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
                                data: newObject,
                                notFoundStudent: stackCardError
                            })
                        })

                    }
                })
            }
        })
    },


    getObjectWithPage: async(req, res, next) => {
        var page = req.query.page
        var limit = req.query.limit
        if(!validInput.isValidPageAndLimit(page, limit)){
            let err = new Error('Invalid query page or limit!')
            err.statusCode = 422
            return next(err)
        }
        var validPage = Math.max(0, parseInt(page)-1)

        objects.find()
            .limit(parseInt(limit))
            .skip(validPage*10)
            .exec((err, data) => {
                if(err)
                    return next(err)
                else return res.status(200).json({
                    success: true,
                    data: data
                })
            })
    }
}