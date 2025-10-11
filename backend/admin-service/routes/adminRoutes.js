const express = require('express'); 
const router = express.Router(); 
const { listEvents, newEvent, patchEvent } = require('../controllers/adminController'); 
 
router.get('/events', listEvents);

router.post('/events', newEvent);
 
module.exports = router; 
