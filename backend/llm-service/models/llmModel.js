

/**
 * Parses a natural-language booking request using an LLM.
 * @param {string} text - The user's message describing a ticket request.
 * @returns {Promise<Object>} A structured object with extracted booking details.
 */
const parseTextWithLLM = async (text) => {
    const mockResponse = {
      event: 'Jazz Night',
      tickets: 2,
    };
    return mockResponse;
}

module.exports = { parseTextWithLLM }; 