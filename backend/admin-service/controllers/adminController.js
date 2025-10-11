const { getEvents, addEvent, updateEvent } = require('../models/adminModel'); 
 
const listEvents = (req, res) => { 
  const events = getEvents(); 
  res.json(events); 
};

const newEvent = (req, res) => {
  console.log(req.body)
  const event = addEvent(req.body);
  res.json(event);
}

const patchEvent = (req, res) => {
  const event = updateEvent();
  res.json(event);
}
 
module.exports = { listEvents, newEvent, patchEvent}; 
