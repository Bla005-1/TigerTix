const { externalParseLLM } = require('../models/llmModel'); 


/**
 * Handles request for parsing data with llm.
 * @param {object} req - Express request with event ID in params.
 * @param {object} res - Express response used to send JSON.
 * @param {Function} next - Error handler middleware.
 */
const llmParse = async (req, res, next) => {
  try {

    res.status(200).json({ success: true, message: 'Ticket purchased successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { llmParse }; 
