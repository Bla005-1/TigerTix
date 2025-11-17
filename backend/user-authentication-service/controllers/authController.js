const { generateHash, storeUser, getHash, validatePassword, generateJWT, storeJWT } = require('../models/authModel');

const registerUser = async (req, res, next) => {
    try {
        const data = req.body;
        const hash = await generateHash(data.password);
        const user = await storeUser(data.user_name, hash);

        if (user) {
            console.log(user);
            res.status(200).send(`200: User ${data.user_name} Successfully Added`);
            return user;
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
        const save = await storeJWT(token);

        if (!hash) {
            const error = new Error('Hash Error');
            error.statusCode = 500;
            throw error;
        }
        if (!valid) {
            const error = new Error('Invalid Password');
            error.statusCode = 400;
            throw error;
        }
        if (!token) {
            const error = new Error('Token Error');
            error.statusCode = 500;
            throw error;
        }
        if (save != "COOKIE LOADED") {
            const error = new Error('Cookie Error');
            error.statusCode = 500;
            throw error;
        }

        console.log(user);
        res.status(200).send(`200: User ${data.user_name} Logging In`);
        return user;

    } catch(err) {
        next(err);
    }
};

module.exports = { registerUser, loginUser }