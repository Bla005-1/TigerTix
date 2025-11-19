const express = require('express'); 
const router = express.Router(); 
const { listEvents, purchaseTicket } = require('../controllers/clientController');
const { verifyUser } = require('../../user-authentication-service/controllers/authController')

//router.use(verifyUser);
 
router.get('/events', listEvents); 

router.post('/events/:id/purchase', purchaseTicket);

module.exports = router; 