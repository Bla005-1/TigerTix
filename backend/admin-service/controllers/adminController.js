const { getEvents, addEvent, updateEvent } = require('../models/adminModel'); 

/**
 * Validates event input data for required fields and formats.
 * @param {object} details - The event object containing name, date, and available_tickets.
 * @param {boolean} hasId - Whether the event is expected to include an id field.
 */
const validateInput = (details, hasId) => {
  let eventDetails = null;
  try {
    eventDetails = details;
    eventDetails.hasOwnProperty('name');
    eventDetails.hasOwnProperty('date');
    eventDetails.hasOwnProperty('available_tickets');
    if (hasId == true) {
      console.log(hasId);
      eventDetails.hasOwnProperty('id');
    }
  } catch(err) {
    res.status(400).send('400: Missing variables! Need id, name, date, available_tickets');
  }
  
  if (eventDetails != null) {
    let errorMessage = '';
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if ((!Number.isInteger(eventDetails.id) || eventDetails.id <= 0) && hasId == true) {
      errorMessage = '400: Invalid ID'
    }
    else if (eventDetails.available_tickets < 0) {
      errorMessage = '400: Invalid ticket amount'
    }
    else if (!regex.test(eventDetails.date)) {
      errorMessage = '400: Invalid date formatting'
    }
    if (errorMessage != '') {
      res.status(400).send(errorMessage);
    }
  }
}

/**
 * Retrieves all events from the database and returns them as JSON.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const listEvents = async (req, res, next) => {
  try {
    const events = await getEvents();
    res.status(200).send('200: Successfully Pulled From Database');
  } catch(err) {
    console.log(err);
    res.status(500).send('500: Internal Server Error');
  }
};

/**
 * Creates a new event in the database based on validated data.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const newEvent = async (req, res, next) => {
  try {
    validateInput(req.body);
    const event = await addEvent(req.body);
    res.status(200).send('200: Successfully Added Event');
  } catch(err) {
    console.log('ERROR',err);
    res.status(500).send('500: Internal Server Error');
  }
  
}

/**
 * Updates an event in the database based on validated data.
 * @param {object} req - Express request.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const patchEvent = async (req, res, next) => {
  try {
    validateInput(req.body, true);
    const event = await updateEvent(res);
    if (event.changes == 1) {
      res.status(200).send('200: Successfully Updated Event');
    }
    else {
      res.status(404).send('404: Event Not Found');
    }
  } catch(err) {
    console.log(err);
    res.status(500).send('500: Internal Server Error');
  }
}
 
module.exports = { listEvents, newEvent, patchEvent}; 
