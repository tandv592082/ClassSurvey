var config = {
    VERSION: 1,
    BUILD: 1,
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
    }
}

module.exports = config