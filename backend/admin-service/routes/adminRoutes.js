const express = require('express'); 
const router = express.Router(); 
const { listEvents, newEvent, patchEvent } = require('../controllers/adminController');

router.get('/events', listEvents);

router.post('/events', newEvent);

router.put('/events', patchEvent);
 
module.exports = router; 
