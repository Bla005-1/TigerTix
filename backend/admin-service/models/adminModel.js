// Mock data for Clemson events 
const { db } = require('../../shared-db/setup')

const getEvents = () => { 
  let sql = 'SELECT * FROM events';

  const events = db.all(sql, [], (err, rows) => {
    if (err) {
      return console.log('Could not pull from database', err);
    }
    else {
      return rows;
    }
  });
  return events;
}; 

const addEvent = (event) => {
  let sql = `INSERT INTO events (id, name, date, ticketAmount) VALUES(?,?,?,?)`;
  console.log(event);
  const post = db.run(sql, [event.id, event.name, event.date, event.ticketAmount], (err) => {
    if (err) {
      return console.log('Could not insert into database', err);
    }
    else {
      return console.log('Inserted into database');
    }
  });
  return post;
}

const updateEvent = (event) => {
  let sql = `UPDATE events SET name = ${event.name}, date = ${event.date},
      ticketAmount = ${event.ticketAmount} WHERE id = ${event.id}`;
  const put = db.run(sql, [event.id, event.name, event.date, event.ticketAmount], (err) => {
    if (err) {
      return console.log(`Could not update event: ${event.id}`, err);
    }
    else {
      return console.log(`Updated event: ${event.id}`);
    }
  });
  return put;
}

module.exports = { getEvents, addEvent, updateEvent };