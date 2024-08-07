const {sign, verify} = require('jsonwebtoken')

module.exports = {
    signToken: (payload) => sign(payload, process.env.JWT_SECRET),
    verifToken: (token) => verify(token, process.env.JWT_SECRET)
}