const express = require('express')
const router = express.Router()
const teacher = require('../../controllers/auth/teacher.controller')
const authenticate = require('../../middleware/authenticate')
router.post('/signup',teacher.signUp)

router.post('/login', teacher.logIn)

router.delete('/deleteTeacherById/:id', authenticate.isLoggedIn, authenticate.isAdmin, teacher.removeTeacher)

router.put('/updateTeacherById/:id', teacher.updateTeacher)

router.get('/getAllTeacher', teacher.getAllTeacher)

router.put('/changPassWordTeacher/:id', teacher.changePasswordTeacher)

module.exports = router