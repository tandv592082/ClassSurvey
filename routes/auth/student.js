const express = require('express')
const router = express.Router()
const student = require('../../controllers/auth/student.controller')
const authenticate = require('../../middleware/authenticate')
router.post('/signup',student.signUp)

router.post('/login', student.logIn)

router.delete('/deleteStudentById/:id', authenticate.isLoggedIn, authenticate.isAdmin, student.removeStudent)

router.put('/updateStudentById/:id', student.updateStudent)

router.get('/getAllStudent', student.getAllStudent)

router.put('/changPassWordStudent/:id', student.changePasswordStudent)

module.exports = router