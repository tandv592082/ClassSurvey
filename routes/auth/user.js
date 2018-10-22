const express = require('express')
const router = express.Router()
const user = require('../../controllers/auth/user.controller')
const authenticate = require('../../middleware/authenticate')
router.post('/signup',user.signUp)

router.post('/login', user.logIn)

router.delete('/deleteUserById', authenticate.isLoggedIn, authenticate.isAdmin, user.removeUser)

module.exports = router