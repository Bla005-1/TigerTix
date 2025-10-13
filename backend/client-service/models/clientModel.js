const { all, get, run } = require('../../shared-db/setup')

/**
 * Fetches all events from the database.
 * @returns {Promise<Array>} A list of event objects with id, name, date, and tickets_available.
 */
const getEvents = async () => {
  const rows = await all('SELECT id, name, date, tickets_available FROM events ORDER BY date ASC;');
  return Array.isArray(rows) ? rows : [];
};

/**
 * Attempts to purchase one ticket for the given event ID.
 * @param {number} id - The event ID to purchase a ticket for.
 * @returns {Promise<number|string>} The event ID if successful, or NOT_FOUND or SOLD_OUT on failure.
 */
const purchaseOneTicket = async (id) => {
  const result = await run(
    'UPDATE events SET tickets_available = tickets_available - 1 WHERE id = ? AND tickets_available > 0;',
    [id]
  );

  if (result.changes === 1) return id;
  // determine if ticket exists or is sold out
  const row = await get('SELECT tickets_available FROM events WHERE id = ?;', [id,]);
  if (!row) return 'NOT_FOUND';
  return 'SOLD_OUT';
};

module.exports = { getEvents, purchaseOneTicket }; 
