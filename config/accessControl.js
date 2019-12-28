'use strict'
const { rights } = require("./registeredUrls");

class AccessControl {
    constructor(_url, _method, _role) {
        this.url = _url;
        this.method = _method;
        this.role = _role || 'guest';
    }
    static isSimpleUrl(url, method) {
        if(url in rights.guest.method) {
            return true;
        }
        else {
            return false;
        }    
    }
    static isAuthUrl(url, method) {
        if(this.url in rights.admin.method){
            return true;
        }
        else {
            return false;
        }    
    }
    findRights() {
        return rights[this.role][this.method];
    }
    isAllowed() {
        let userRights = this.findRights();
        if (this.url in userRights){
            return true;
        }
        else {
            return false;
        }    
    }
}

module.exports = { AccessControl };