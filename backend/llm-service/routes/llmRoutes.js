const express = require('express'); 
const router = express.Router(); 
const { llmParse } = require('../controllers/llmController');
const { verifyUser } = require('../../user-authentication-service/controllers/authController')

//router.use(verifyUser);
 
router.post('/parse', llmParse); 

module.exports = router; 