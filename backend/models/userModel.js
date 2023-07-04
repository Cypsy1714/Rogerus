const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

// custom scripts
const {stableHash} = require('../scripts/stableHash');
const {delay} = require('../scripts/delay');
const {randomRange} = require('../scripts/randomRange');

// declare the schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
});

// static signup method
userSchema.statics.signup = async function (tag, username, password, key) {
    
    // validation
    if(!username || !password || !tag) {
        throw Error('All fields must be filled');
    }
    if(tag === username) {
        throw Error('Username and your tag cannot be the same');
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    // use stable hash function on username so it will be possible to match it in the database since salted hashes dont produce the same result
    // much more security is provided with the password hash so not a huge security flaw, still might improve it in the future if i can think of something better
    const u_hash = await stableHash(username);

    // check if username or tag already exists
    const u_exists = await this.findOne({ username: u_hash });
    const t_exists = await this.findOne({ tag });
    
    if (u_exists || t_exists) {
        throw Error(`${u_exists ? 'Username' : 'Tag'} already exists`);
    }

    // hash username and password before saving it to the database
    const p_hash = await bcrypt.hash(password, 10);

    // add user to the database
    const user = await this.create({password: p_hash, username: u_hash, tag, key});
    return user;

}

// static login method
userSchema.statics.login = async function (username, password) {

    // validation
    if(!username || !password) {
        throw Error('All fields must be filled');
    }

    // match the username
    const u_hash = await stableHash(username);
    const user = await this.findOne({ username: u_hash })
    
    // add a random delay to make it harder for an attacker to figure out if username is valid when brute-forcing by looking at the response time
    await delay(randomRange(50, 300))

    if (!user) {
        throw Error('Incorrect credentials /u');
    }

    // check the password
    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect credentials');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);