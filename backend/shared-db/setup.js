const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const configPath = path.resolve(__dirname, '..', 'shared-db', 'database.sqlite');
const db = new sqlite3.Database(configPath,sqlite3.OPEN_READWRITE,(err) => {
  if (err) return console.error(err.message);
});

let tableStatement = 'CREATE TABLE IF NOT EXISTS events(id INTEGER, name, date DATE, ticketAmount INTEGER)';
db.run(tableStatement);
db.run('PRAGMA journal_mode=WAL')

module.exports = { db }