const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_2, {expiresIn: '20d'});
}

module.exports = {createToken};