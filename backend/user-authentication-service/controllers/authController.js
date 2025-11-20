const { generateHash, storeUser, getHash, validatePassword, generateJWT, getUser, verifyJWT } = require('../models/authModel');

/**
 * Registers user and adds them to the database.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const registerUser = async (req, res, next) => {
    try {
        const data = req.body;
        
        if (await getUser(data.user_name) != 'NOT_FOUND') {
            const error = new Error('User Name Already In Use!');
            error.statusCode = 400;
            throw error;
        }

        const hash = await generateHash(data.password);
        const user = await storeUser(data.user_name, hash);
        if (user) {
            res.status(200).json(req.body);
        }
        else {
            const error = new Error('Failed To Register User');
            error.statusCode = 500;
            throw error;
        }
    } catch(err) {
        next(err);
    }
};

/**
 * Logs the user into the system.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const loginUser = async (req, res, next) => {
    try {
        const data = req.body;
        const hash = await getHash(data.user_name);
        const valid = await validatePassword(data.password, hash);
        const token = await generateJWT(data.user_name);
        if (!hash) {
            const error = new Error('Hash Error');
            error.statusCode = 500;
            throw error;
        }
        if (!valid) {
            const error = new Error('Invalid Credentials');
            error.statusCode = 400;
            throw error;
        }
        if (!token) {
            const error = new Error('Token Error');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({token: token});
    } catch(err) {
        next(err);
    }
};

/**
 * Middleware for protected routes.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const JWT = authHeader?.split('Bearer ')[1];
        const user = await verifyJWT(JWT);
        res.user = user;
        next();
    } catch(err) {

        next(err);
    }
}

module.exports = { registerUser, loginUser, verifyUser }