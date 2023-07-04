// returns the sha512 hash of the value using a secret in the .env file without a salt so it will return the same value with the same string provided
// use bcrypt instead of this if possible to be safer, this is just used to hash the usernames so it will be faster to find in the database since the real important hash is the password which is using a salted bcrypt hash
var crypto = require('crypto');

async function stableHash(value) {
    const secret = process.env.SECRET_1;
    const hash = crypto.createHmac('sha512', secret)
        .update(value)
        .digest('hex');
    return hash;
}

module.exports = {stableHash}