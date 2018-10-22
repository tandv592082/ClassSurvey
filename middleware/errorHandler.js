module.exports = (err, req, res, next) => {
    if(!err.statusCode) err.statusCode = 400
    console.log(`${err}`)
    res.status(err.statusCode).json({
        success: false,
        message: err.message+ ""
    })
};