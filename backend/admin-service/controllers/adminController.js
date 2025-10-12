const { getEvents, addEvent, updateEvent } = require('../models/adminModel'); 

//need to add error logging
//need to actually return the events

const listEvents = async (req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch(err) {
    console.log(err);
    next(err);
  }
};

const newEvent = async (req, res, next) => {
  try {
    const event = await addEvent(req.body);
    res.json(event);
  } catch(err) {
    console.log(err);
    next(err);
  }
  
}

const patchEvent = async (req, res, next) => {
  try {
    /*let eventDetails;
    try {
      eventDetails = JSON.parse(req.body);
    } catch(err) {
      eventDetails = null;
      res.status(400).json({success: false, message: 'JSON formatting issue!'});
    }
    
    if (eventDetails != null) {
      
    }*/

    const event = await updateEvent(req.body);
    res.json(event);
    if (event.changes === 0) {

    }
  } catch(err) {
    console.log(err);
    next(err);
  }
}
 
module.exports = { listEvents, newEvent, patchEvent}; 
