const User = require('../models/userModel');
const {createToken} = require('../scripts/createToken');

const userSignup = async (req, res) => {
    // deconstruct variables
    const {tag, username, password, key} = req.body;

    try{
        // attempt to sign up
        const user = await User.signup(tag, username, password, key);
        const token = createToken(user._id);
        res.status(200).json({tag, token});
    } catch (e) {
        // send back error if fails to sign up
        res.status(400).json({error: e.message});
    }
}

const userLogin = async (req, res) => {
    // deconstruct variables
    const {username, password} = req.body;

    try{
        // attempt to log in
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({tag: user.tag, token});
    } catch (e) {
        // send back error if fails to log in
        res.status(400).json({error: e.message});
    }
}

module.exports = {
    userSignup,
    userLogin
}