/**
 * module dependence
 */
const _  = require('lodash')
/**
 * check params cardID
 * @param {string} cardID
 * @return {boolean} result when check cardID
 * @public
 */
exports.isCardID = (cardID) => {
    if(_.size(_.trim(cardID)) !== 8) return false
    return !Array.from(_.trim(cardID)).some(x => !_.isFinite(parseInt(x))) 
}