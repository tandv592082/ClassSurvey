/**
 * module dependence
 */
const _  = require('lodash')


module.exports = {
    /**
     * check params cardID
     * @param {string} cardID
     * @return {boolean} result when check cardID
     * @public
     */
    isCardID: (cardID) => {
        if(_.size(_.trim(cardID)) !== 8) return false
        return !Array.from(_.trim(cardID)).some(x => !_.isFinite(parseInt(x))) 
    },

     /**
     * check id
     * @param {string} id
     * @return {boolean} result when check id is done
     * @public
     */
    isID: (id) => {
        return id.length === 24
    },

    /**
     * check string is a email or not
     * @param {string} email as email
     * @return {boolean} result when check email is done
     * @public
     */
    isEmail: (email) => {
        var res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    },
     /**
     * check params :page and limit page is valid ?
     * @param {string} page as as page
     * @param {string} limit as limit element
     * @return {boolean} result when check done
     * @public
     */
    isValidPageAndLimit: (page, limit) =>{
        if(page === '' || limit === '' || !page || !limit)
            return false
        else if(parseInt(page) < 0 || parseInt(limit) < 0 || parseInt(limit) > 10)
            return false
        return true
    },
    /**
     * check full name is valid?
     * @param {string} fullname as as page
     * @return {boolean} result when check done
     * @public
     */
    isFullName: (fullname) => {
        var regexp = new RegExp(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/i)
        return regexp.test(fullname)
    },
    /**
     * format type of user if err
     * @param {nmuber} type as as page
     * @return {number} new type when format done
     * @public
     */
    convertType: (type) => {
        if(type !==1 || type !== 2)
            type = 1
        return type
    }
}