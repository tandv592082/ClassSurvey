/**
 * Check user authenticate
 * @param {Request} req request of user
 * @param {Response} res response of user
 * @param {*} next as next middleware
 * @public
 */
module.exports = (req, res, next) =>{
    if(req.isAuthenticated())
        next()
    res.status(401).json('Unauthorized!')
}