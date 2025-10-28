const express = require('express'); 
const router = express.Router(); 
const { llmParse } = require('../controllers/llmController'); 
 
router.post('/parse', llmParse); 

module.exports = router; 