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
     * @param {number} type as as page
     * @return {boolean} new type when format done
     * @public
     */
    isValidType : (type) => {
        if(type ==='' || !type)
            return false
        return true
    },
    /**
     * format type of user if err
     * @param {number} type as as page
     * @return {number} new type when format done
     * @public
     */
    convertType : (type) => {
        if(parseInt(type) < 0 || parseInt(type) > 2)
            type = 1
        return type
    },
    /**
     * Check valid password
     * @param {string} password as password need check
     * @return {boolean} password check is valid password ?
     * @public
     */
    isValidPassword: (password) => {
        let regPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g)
        return regPass.test(password)
    },
    /**
     * Check valid password
     * @param {string} password as password need check
     * @return {boolean} password check is valid password ?
     * @public
     */
    isvalidObjectData: (credit, code, lectureRoom, dayOfTheWeek, classes) => {
        if(!credit || !code || !lectureRoom || !dayOfTheWeek || !classes)
            return false;
        return true
    },
    /**
     * Check valid username of teacher account
     * @param {string} userName as username of teacher when register
     * @return {boolean} check valid username
     * @public
     */
    isValidUserName: (userName) => {
        if(userName === '' || ! userName)
            return false
        return true
    }
}