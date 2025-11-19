const { generateHash, storeUser, getHash, validatePassword, generateJWT, getUser, verifyJWT } = require('../models/authModel');

const registerUser = async (req, res, next) => {
    try {
        const data = req.body;
        console.log("where are you??")
        
        if (await getUser(data.user_name) != 'NOT_FOUND') {
            const error = new Error('User Name Already In Use!');
            error.statusCode = 400;
            throw error;
        }

        const hash = await generateHash(data.password);
        const user = await storeUser(data.user_name, hash);
        console.log("where are you2??")
        if (user) {
            res.json(req.body).status(200);
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
        res.authorization = 
        res.json({token: token}).status(200);

    } catch(err) {
        next(err);
    }
};

const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const JWT = authHeader?.split('Bearer ');
    console.log(JWT);
    const user = verifyJWT(JWT);
    console.log(user);
    res.user = user;
    next();
}

module.exports = { registerUser, loginUser, verifyUser }