const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const config = require('./configs/config')
const errHandler = require('./middleware/errorHandler')
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const sessionConfig = require('./configs/session')
const db = require('./configs/database')
var app = express()
require('./configs/passport')(passport)
const authenticate = require('./middleware/authenticate')
//middleleware
app.use(cookieParser(sessionConfig.secret));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errHandler)
//routers
const user = require('./routes/auth/user')
app.use('/auth', user)
app.get('/test',authenticate, (req, res) => {
    res.json('ok')
})

//server setup
app.listen(config.PORT, () => {
    console.log(`Server running on ${config.getHTTPUrl()}`)
})