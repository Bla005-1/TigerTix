const { parseTextWithLLM, bookingConfirmation, bookEvent, getEvents, getEvent } = require('../models/llmModel');
//const { confirmationButton } = require('../../../frontend/src/')


/**
 * Handles request for parsing data with llm.
 * @param {object} req - Express request with event ID in params.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const llmParse = async (req, res, next) => {
  try {
    const events = await getEvents();
    const bookingData = await parseTextWithLLM(req.body, JSON.stringify(events));
    if (bookingData.event === "NOT_FOUND") {
      const error = new Error('Cannot find event!');
      error.statusCode = 400;
      throw error;
    }
    
    const confirm = await bookingConfirmation();
    if (confirm === "CANCELED") {
      res.status(200).json({ success: true, message: 'Booking Canceled!' });
    }
    else {
      const event = await getEvent(bookingData.event);
      const id = event.id;
      const booked = await bookEvent(id, bookingData.tickets);


      if (booked.changes !== 1) {
        const error = new Error('Could not book event!');
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({ success: true, message: `Successfully booked` });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { llmParse }; 
