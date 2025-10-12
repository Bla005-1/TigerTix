const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const configPath = path.resolve(__dirname, '..', 'shared-db', 'database.sqlite');
const sqlInitPath = path.resolve(__dirname, '..', 'shared-db', 'init.sql');
const db = new sqlite3.Database(configPath,sqlite3.OPEN_READWRITE|sqlite3.OPEN_CREATE,(err) => {
  if (err) return console.error(err.message);
});

const initSQL = fs.readFileSync(sqlInitPath, 'utf-8')
db.exec(initSQL, (err) => {
  if (err) console.error('Init failed', err);
  else console.log('Init done!');
});
db.run('PRAGMA journal_mode=WAL')

// promise helper functions
const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });

module.exports = { db, all, get, run }