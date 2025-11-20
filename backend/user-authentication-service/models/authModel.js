const { get, run } = require('../../shared-db/setup')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

/**
 * Generates a hashed password
 * @param {string} password - The user's password
 * @param {string} hash - The string hash generation
 * @returns {Promise<Boolean>} - True or False based on if the password/hash are valid
 */
const validatePassword = async (password, hash) => {
    const valid = bcrypt.compare(password, hash);

    return valid;
}

/**
 * Generates a hashed password
 * @param {string} password - The user's password
 * @returns {Promise<string>} hash - The string hash generation
 */
const generateHash = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

/**
 * Generates a JWT
 * @param {string} user_name - The user name
 * @returns {Promise<string>} token - The token string like amountofcharacters.amountofcharacters.amountofcharacters
 */
const generateJWT = async (user_name) => {
    const token = JWT.sign(
        { username: user_name},
        process.env.HASH_KEY,
        { expiresIn: "30s" }
    )
    return token;
}

/**
 * Compares the token with the jwt secret key
 * @param {string} token - The token string like amountofcharacters.amountofcharacters.amountofcharacters
 * @returns {Promise<object>} returns json or error code
 */
const verifyJWT = async (token) => {
    return JWT.verify(token, process.env.HASH_KEY);
}

/**
 * Stores the hashed password by user name
 * @param {string} user_name - The user name
 * @param {string} hash - The full hash value
 * @returns {Promise<object>} the row entry if it isn't null
 */
const storeUser = async (user_name, hash) => {
    let sql = `INSERT INTO users (user_name, hash) VALUES(?,?)`;
    const post = await run(sql, [user_name, hash])
    return post;
}

/**
 * Pulls user from the database
 * @param {string} user_name - The user name to get the hash
 * @returns {Promise<object>} the row entry if it isn't null
 */
const getUser = async (user_name) => {
    const user = await get('SELECT user_name FROM users WHERE user_name = ?;', [user_name,]);
    if (!user) return 'NOT_FOUND';
    return user;
}

/**
 * Inserts a new event into the database.
 * @param {string} user_name - The user name to get the hash
 * @returns {Promise<object>} Actual hash
 */
const getHash = async (user_name) => {
    const hash = await get('SELECT hash FROM users WHERE user_name = ?;', [user_name,]);
    if (!hash) return 'NOT_FOUND';

    return hash.hash;
}

module.exports = { validatePassword, generateHash, storeUser, getHash, getUser, generateJWT, verifyJWT }
