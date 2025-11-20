const { all, get, run } = require('../../shared-db/setup')
const { GoogleGenAI, Type } = require('@google/genai');

/**
 * Fetches all events from the database.
 * @returns {Promise<Array>} A list of event objects with name
 */
const getEvents = async () => {
  let sql = 'SELECT id, name FROM events;'
  const rows = await all(sql);
  return Array.isArray(rows) ? rows : [];
};


/**
 * Parses a natural-language booking request using an LLM.
 * @param {string} text - The user's message describing a ticket request.
 * @returns {Promise<Object>} A structured object with extracted booking details.
 */
const parseTextWithLLM = async (text, events) => {

  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Parse this booking request, determining the event id, event name, and number of tickets 
    the user would like and return them in a json. If no ticket number is specified, default to 1. 
    If the event cannot be found set the event to NOT_FOUND and the ticket number to 0. Provide the pure json, DO NOT worry about indenting, spacing or backslashes.
    REQUEST: [${text}]. EVENTS: [${events}]`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          event_id: {
            type: Type.STRING  //perhaps this should be a int?
          },
          event: {
            type: Type.STRING,
          },
          tickets: {
            type: Type.STRING,
          },
        },
      },
    },
  });
  
  const mockResponse = {
    event_id: 1,
    event: 'Football Game',
    tickets: '2',
  };
  console.log(`${response.text}`);
  const jsonData = JSON.parse(response.text);
  return jsonData;
}

module.exports = { parseTextWithLLM, getEvents }; 