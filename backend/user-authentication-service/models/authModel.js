const { get, run } = require('../../shared-db/setup')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

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
        "cheese",
        { expiresIn: "30m" }
    )
    return token;
}

const storeJWT = async (token, res) => {
    try {
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 1000 * 60 * 60 //1 hour 
        });
        return "COOKIE LOADED";

    } catch (err) {
        return err;
    }
}

const storeUser = async (user_name, hash) => {
    let sql = `INSERT INTO users (user_name, hash) VALUES(?,?)`;
    const post = await run(sql, [user_name, hash])
    return post;
}

const getHash = async (user_name) => {
    const hash = await get('SELECT hash FROM users WHERE user_name = ?;', [user_name,]);
    if (!hash) return 'NOT_FOUND';

    console.log(hash);
    return hash;
}

module.exports = { validatePassword, generateHash, storeUser, getHash, generateJWT, storeJWT }
