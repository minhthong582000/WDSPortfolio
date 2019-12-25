'use strict'
const { rights } = require("./registeredUrls");

class AccessControl {
    constructor(_url, _method, _role) {
        this.url = _url;
        this.method = _method;
        this.role = _role || 'guest';
    }
    static simpleUrl(url) {
        if(url in rights.guest[this.method])
            return true;
        return false;
    }
    static authUrl(url) {
        if(this.url in rights.admin[this.method])
            return true;
        return false;
    }
    findRights() {
        return rights[this.role][this.method];
    }
    isAllowed() {
        let userRights = this.findRights();
        if (this.url in userRights)
            return true;
        else 
            return false;
    }
}

module.exports = {AccessControl};