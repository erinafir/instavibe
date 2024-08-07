const bcrypt = require('bcryptjs');

function hashPassword(password) {
    let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return hash
}

function comparePassword(password, dataPassword) {
    let compare = bcrypt.compareSync(password, dataPassword)
    return compare
}

module.exports = {hashPassword, comparePassword}