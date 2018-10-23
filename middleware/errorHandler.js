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
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 400 // If err has no specified error code, set error code to 'Internal Server Error (500)'
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    }) // All HTTP requests must have a response, so let's send back an error with its status code and message

};