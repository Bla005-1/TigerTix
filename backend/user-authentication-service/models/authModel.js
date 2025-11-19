const { get, run } = require('../../shared-db/setup')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
require('dotenv').config()

const validatePassword = async (password, hash) => {
    const valid = bcrypt.compare(password, hash);

    console.log(valid);
    return valid;
}

const generateHash = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    console.log(hash);
    return hash;
};

const generateJWT = async (user_name) => {

    const token = JWT.sign(
        { username: user_name},
        process.env.HASH_KEY,
        { expiresIn: "1m" }
    )
    return token;
}

const verifyJWT = async (token) => {
    return JWT.verify(token, process.env.HASH_KEY);
}

const storeUser = async (user_name, hash) => {
    let sql = `INSERT INTO users (user_name, hash) VALUES(?,?)`;
    const post = await run(sql, [user_name, hash])
    return post;
}

const getUser = async (user_name) => {
    const user = await get('SELECT user_name FROM users WHERE user_name = ?;', [user_name,]);
    console.log(user);
    if (!user) return 'NOT_FOUND';
    return user;
}

const getHash = async (user_name) => {
    console.log(user_name)
    const hash = await get('SELECT hash FROM users WHERE user_name = ?;', [user_name,]);
    if (!hash) return 'NOT_FOUND';

    console.log(hash);
    return hash.hash;
}

module.exports = { validatePassword, generateHash, storeUser, getHash, getUser, generateJWT, verifyJWT }
