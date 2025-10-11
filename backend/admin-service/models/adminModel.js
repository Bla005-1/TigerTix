// Mock data for Clemson events 

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('backend/shared-db/database.sqlite',sqlite3.OPEN_READWRITE,(err) => {
  if (err) return console.error(err.message);
});

let tableStatement = 'CREATE TABLE IF NOT EXISTS events(id INTEGER, name, date DATE, ticketAmount INTEGER)';
db.run(tableStatement);


const getEvents = () => { 
  /*return [ 
    { id: 1, name: 'Clemson Football Game', date: '2025-09-01' }, 
    { id: 2, name: 'Campus Concert', date: '2025-09-10' }, 
    { id: 3, name: 'Career Fair', date: '2025-09-15' } 
  ]; */
  let sql = 'SELECT * FROM events';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('Could not pull from database');
      return [];
    }
    else {
      console.log('Successfully pulled from database');
      return rows;
    }
  });
}; 

const addEvent = (event) => {
  let sql = `INSERT INTO events (id, name, date, ticketAmount)
      VALUES(?,?,?,?)`;
  db.run(sql, event, (err) => {
    if (err) {
      return console.log('Could not insert into database');
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