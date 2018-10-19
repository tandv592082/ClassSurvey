const MemoryStore = require('express-session').MemoryStore
const ONE_HOUR = 1000*60*60
module.exports = {
    secret: 'classservey',
	saveUninitialized: true,
    resave: true,
    rolling: true,
    store: new MemoryStore(),
    cookie: {
        secure: false,
        maxAge: ONE_HOUR
    }    
}