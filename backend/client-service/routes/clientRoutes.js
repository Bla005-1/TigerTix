const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), "../../.env")})
const express = require('express'); 
const router = express.Router(); 
const { listEvents, purchaseTicket } = require('../controllers/clientController');
const { verifyUser } = require('../../user-authentication-service/controllers/authController')

 
router.get('/events', listEvents); 

router.post('/events/:id/purchase', verifyUser, purchaseTicket);

module.exports = router; 