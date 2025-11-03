const { parseTextWithLLM, getEvents } = require('../models/llmModel');
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
    return res.status(200).json({
      success: true,
      data: bookingData,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { llmParse }; 
