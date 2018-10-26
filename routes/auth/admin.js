const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/auth/admin.controller')
const authenticate = require('../../middleware/authenticate')
router.post('/login', adminController.logIn)

router.post('/signup', adminController.signUp)

router.delete('/deleteAdminById/:id', authenticate.isLoggedIn, authenticate.isAdmin, adminController.removeAdmin)

module.exports = router