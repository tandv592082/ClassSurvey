const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const config = require('./configs/config')
const errHandler = require('./middleware/errorHandler')
const db = require('./configs/database')
var app = express()


//middleleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errHandler)
//routers


//server setup
app.listen(config.PORT, () => {
    console.log(`Server running on ${config.getHTTPUrl()}`)
})