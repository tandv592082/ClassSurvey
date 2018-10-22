/**
 * Handle All Error of project
 * @param {Error} err as error need handle
 * @param {Request} req 
 * @param {Respone} res
 * @param {*} next as next middleware
 * @return {object} respone when handle is done
 * @public
 */


module.exports = (err, req, res, next) => {
    if(!err.statusCode) err.statusCode = 400
    console.log(`${err}`)
    return res.status(err.statusCode).json({
        success: false,
        message: err.message+ ""
    })
};