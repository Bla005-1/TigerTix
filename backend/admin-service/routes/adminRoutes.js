const express = require('express'); 
const router = express.Router(); 
const { listEvents, newEvent, patchEvent } = require('../controllers/adminController');
const { verifyUser } = require('../../user-authentication-service/controllers/authController')

//router.use(verifyUser);

router.get('/events', listEvents);

router.post('/events', newEvent);

router.put('/events', patchEvent);
 
module.exports = router; 
