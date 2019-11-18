const bcrypt = require('bcryptjs')

module.exports.hashPwd = (pwd) => {
    pwd = bcrypt.hashSync(pwd, bcrypt.genSaltSync(10), null);
    return pwd;
}