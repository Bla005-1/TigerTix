const { getEvents, addEvent, updateEvent } = require('../models/adminModel'); 

//need to add error logging
//need to actually return the events

const listEvents = (req, res, next) => {
  try {
    const events = getEvents();
    res.json(events);
  } catch(err) {
    console.log(err);
    next(err);
  }
};

const newEvent = (req, res, next) => {
  try {
    console.log(req.body)
    const event = addEvent(req.body);
    res.json(event);
  } catch(err) {
    console.log(err);
    next(err);
  }
  
}

const patchEvent = (req, res, next) => {
  try {
    const event = updateEvent(req.body);
    res.json(event);
  } catch(err) {
    console.log(err);
    next(err);
  }
}
 
module.exports = { listEvents, newEvent, patchEvent}; 
