const object = require('../../controllers/objects/object.controller')
const express = require('express')
const router = express.Router()

router.put('/initObject', object.initObject)

module.exports = router