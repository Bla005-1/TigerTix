const { all, run } = require('../../shared-db/setup')

/**
 * Fetches all events from the database.
 * @returns {Promise<Array>} A list of event objects with id, name, date, and tickets_available.
 */
const getEvents = async () => {
  let sql = 'SELECT id, name, date, tickets_available FROM events ORDER BY id ASC;'
  const rows = await all(sql);
  return Array.isArray(rows) ? rows : [];
};

/**
 * Inserts a new event into the database.
 * @param {object} event - The event data containing name, date, and tickets_available.
 * @returns {Promise<object>} The result of the insert operation.
 */
const addEvent = async (event) => {
  let sql = `INSERT INTO events (name, date, tickets_available) VALUES(?,?,?)`;
  console.log(event);
  const post = await run(sql, [event.name, event.date, event.tickets_available])
  return post;
}

/**
 * Updates an existing event in the database.
 * @param {object} event - The event data containing name, date, and tickets_available.
 * @returns {Promise<object>} The result of the update operation.
 */
const updateEvent = async (event) => {
  let sql = `UPDATE events SET name = ?, date = ?, tickets_available = ? WHERE id = ?`;
  console.log(event);
  const put = await run(sql, [event.name, event.date, event.tickets_available, event.id])
  return put;
}

module.exports = { getEvents, addEvent, updateEvent };