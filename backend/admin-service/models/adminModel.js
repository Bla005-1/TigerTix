// Mock data for Clemson events 
const { all, get, run } = require('../../shared-db/setup')

const getEvents = async () => {
  let sql = 'SELECT id, name, date, tickets_available FROM events ORDER BY id ASC;'
  const rows = await all(sql);
  return Array.isArray(rows) ? rows : [];
};

const addEvent = async (event) => {
  let sql = `INSERT INTO events (name, date, tickets_available) VALUES(?,?,?)`;
  console.log(event);
  const post = await run(sql, [event.name, event.date, event.tickets_available])
  return post;
}

const updateEvent = async (event) => {
  let sql = `UPDATE events SET name = ?, date = ?, tickets_available = ? WHERE id = ?`;
  console.log(event);
  const put = await run(sql, [event.name, event.date, event.tickets_available, event.id])
  return put;
}

module.exports = { getEvents, addEvent, updateEvent };