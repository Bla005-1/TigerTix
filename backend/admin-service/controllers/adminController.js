const { getEvents, addEvent, updateEvent } = require('../models/adminModel'); 

/**
 * Validates event input data for required fields and formats.
 * @param {object} details - The event object containing name, date, and tickets_available.
 * @param {boolean} hasId - Whether the event is expected to include an id field.
 */
const validateInput = (details, hasId) => {
  let eventDetails = details;
  if (!eventDetails.hasOwnProperty('name') ||
      !eventDetails.hasOwnProperty('date') ||
      !eventDetails.hasOwnProperty('tickets_available')) {
    const error = new Error('Event details missing a required field');
    error.statusCode = 400;
    throw error;
  }
  if (hasId == true && !eventDetails.hasOwnProperty('id')) {
    const error = new Error('Missing required ID');
    error.statusCode = 400;
    throw error;
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/
  if ((!Number.isInteger(eventDetails.id) || eventDetails.id <= 0) && hasId == true) {
    const error = new Error('Invalid ID');
    error.statusCode = 400;
    throw error;
  }
  else if (eventDetails.tickets_available < 0) {
    const error = new Error('Invalid ticket amount.');
    error.statusCode = 400;
    throw error;
  }
  else if (!regex.test(eventDetails.date)) {
    const error = new Error('Invalid date formatting');
    error.statusCode = 400;
    throw error;
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
    res.status(200).json(events);
  } catch(err) {
    next(err)
  }
};

/**
 * Creates a new event in the database based on validated data.
 * @param {object} req - Express request containing name, date, and tickets_available.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const newEvent = async (req, res, next) => {
  try {
    validateInput(req.body);
    const event = await addEvent(req.body);
    res.status(200).send('200: Successfully Added Event');
    return event;
  } catch(err) {
    next(err)
  }
}

/**
 * Updates an event in the database based on validated data.
 * @param {object} req - Express request containing id, name, date, and tickets_available.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const patchEvent = async (req, res, next) => {
  try {
    validateInput(req.body, true);
    const event = await updateEvent(req.body);
    if (event.changes == 1) {
      res.status(200).send('200: Successfully Updated Event');
    }
    else {
      const error = new Error('Event Not Found');
      error.statusCode = 404;
      throw error;
    }
  } catch(err) {
    next(err)
  }
}
 
module.exports = { listEvents, newEvent, patchEvent }; 
