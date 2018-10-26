const express        = require('express')
const logger         = require('morgan')
const bodyParser     = require('body-parser')
const config         = require('./configs/config')
const errHandler     = require('./middleware/errorHandler')
const session        = require('express-session')
const passport       = require('passport')
const cookieParser   = require('cookie-parser')
const sessionConfig  = require('./configs/session')
const db             = require('./configs/database')
const configPassport = require('./configs/passport')(passport)
const authenticate   = require('./middleware/authenticate')
var app              = express()
//middleleware
app.use(cookieParser(sessionConfig.secret));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))

//routers
const student  = require('./routes/auth/student')
const teacher  = require('./routes/auth/teacher')
const admin = require('./routes/auth/admin')
app.use('/auth/student', student);
app.use('/auth/teacher', teacher);
app.use('/auth/admin', admin)
app.get('/test',authenticate.isLoggedIn, (req, res) => {
    res.json('ok')
})

//error handler
app.use(errHandler)

//server setup
app.listen(config.PORT, () => {
    console.log(`Server running on ${config.getHTTPUrl()}`)
})