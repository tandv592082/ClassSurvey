const express = require('express')
const router = express.Router()
const user = require('../../controllers/auth/user.controller')
const authenticate = require('../../middleware/authenticate')
router.post('/signup',user.signUp)

router.post('/login', user.logIn)

router.delete('/deleteUserById/:id', authenticate.isLoggedIn, authenticate.isAdmin, user.removeUser)

router.put('/updateUserById/:id', user.updateUser)

router.get('/getAllStudent', user.getAllStudent)

module.exports = router