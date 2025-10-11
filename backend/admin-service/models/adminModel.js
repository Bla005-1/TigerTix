// Mock data for Clemson events 
const { db } = require('../../shared-db/setup')

const getEvents = () => { 
  let sql = 'SELECT * FROM events';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('Could not pull from database');
      return [];
    }
    else {
      console.log(rows)
      console.log('finish');
      return rows;
    }
  });
}; 

const addEvent = (event) => {
  let sql = `INSERT INTO events (id, name, date, ticketAmount) VALUES(?,?,?,?)`;
  console.log(event);
  db.run(sql, [event.id, event.name, event.date, event.ticketAmount], (err) => {
    if (err) {
      return console.log('Could not insert into database', err);
    }
    else {
      console.log('Inserted into database');
    }
  });
}

const updateEvent = (event) => {
  let sql = `UPDATE events SET name = ${event.name}, date = ${event.date},
      ticketAmount = ${event.ticketAmount} WHERE id = ${event.id}`;
  db.run(sql, event, (err) => {
    if (err) {
      return console.log(`Could not update event: ${event.id}`);
    }
    else {
      console.log(`Updated event: ${event.id}`);
    }
  });
}

module.exports = { getEvents, addEvent, updateEvent };