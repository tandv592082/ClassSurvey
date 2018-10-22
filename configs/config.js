const _ = require('lodash')
var config = {
    VERSION: 1,
    BUILD: 1,
    SECRET_TOKEN: 'eyJhbGciOiJIUzM4NCIsInR5cCI6IlJlZ2lzdGVyIGFkbWluaXN0cmF0b3IgYWNjb3VudCBwcm90ZWN0ZWQgYnkgSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.uH3pqqCOEAv8vyHifqO_yhsqitSL5iL0hvX9rJmdw6J4Aevae9mEe2MZZ-_ZwKwC',
    API_PATH: '/api',
    URL: 'http://localhost',
    PORT: process.env.PORT || 8000,
    DB: {
        HOST: 'localhost',
        PORT: '27017',
        DATABASE: 'ClassServey'
    },
    getDBString: function(){
        return `mongodb://${this.DB.HOST}:${this.DB.PORT}/${this.DB.DATABASE}`
    },
    //get the HTTp URL
    getHTTPUrl: function(){
        return `${this.URL}:${this.PORT}`
    },
    isIncludesSecretToken: function(email){
        return _.includes(email, this.SECRET_TOKEN)
    } 
}

module.exports = config