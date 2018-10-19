const mongoose = require('mongoose')
const config = require('./config')
mongoose.connect(config.getDBString(), { useNewUrlParser: true })
        .then(() => {
            console.log('MongoDB is connected !')
        })
        .catch(err => console.error(err))