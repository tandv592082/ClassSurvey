/**
 * module dependences
 */
const fs          = require('fs')
const multer      = require('multer')
const excelToJson = require('convert-excel-to-json')
const _           = require('lodash')
module.exports = {
    /**
     * Sync file from path
     * @param {String} path path of image
     * @return {object} data return when read done
     * @public
     */
    readPath: (path) => {
        var content = fs.readFileSync(path);
        return JSON.parse(content)
    },

    /**
     * Remove file from path
     * @param {String} path path of image
     * @return {*} result when delete by path
     * @public
     */

    unlinks: path => {
        fs.unlink('.' + path, err => {
            if(err)
                console.log(`Lõi delete: ${err}`)
            console.log(`Deleted file from folder: ${path}`)
        })
    },

    /**
     * Set up upload
     * Return folder upload and name of file export, Only accept JSON
     * @public
     */

    storageFiles: multer.diskStorage({
        destination: (req,file,cb) => cb(null,'./public/files'), //diem den
        filename: (req,file,cb) => cb(null,file.fieldname + '-' + Date.now() + file.originalname.replace(/ /g,'')),//ten file export 
    }),


    /**
     * convert exel to json from path
     * @param {string} path path of exel file
     * @return {object} result when read done
     * @public
     */
    jsonFromExel: (path) => {
        const result = excelToJson({
            sourceFile: path
        })
        return result
    },

    /**
     * Sync result from convert excel
     * @param {object} result result of convert exel to json
     * @return {object} result when sync done
     * @public
     */
    syncResult: (result) => {
        let newResult = _.drop(result,4)
        let teacherID = newResult[0].E
        
        let object = {
            credit: newResult[2].F,
            code: newResult[2].C,
            lectureRoom: newResult[1].F,
            dayOfTheWeek: newResult[1].C.charAt(0),
            classes: _.trim(newResult[1].C.substring(2,8))
        }
        let onlyStudent = _.dropRight(_.drop(newResult,5),5)
        let studentsID = new Array()
        onlyStudent.map(el => studentsID.push(el.B))
        return {
            teacherID: teacherID,
            object: object,
            studentsID: studentsID
        }
    }
}