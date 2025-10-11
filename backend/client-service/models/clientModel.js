const { db } = require('../../shared-db/setup')

/*const getEvents = () => { 
  return [ 
    { id: 1, name: 'Clemson Football Game', date: '2025-09-01', tickets_available: 1 }, 
    { id: 2, name: 'Campus Concert', date: '2025-09-10', tickets_available: 1 }, 
    { id: 3, name: 'Career Fair', date: '2025-09-15', tickets_available: 1 } 
  ]; 
};*/

const getEvents = () => {
  let sql = 'SELECT * FROM events';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('Could not pull from database');
      return [];
    }
    else {
      console.log(rows);
      return rows;
    }
  });
}; 

const purchaseOneTicket = (id) => {
  if (id == 1) { return id };  // for testing until db is alive
  return 'NOT_FOUND';
}; 

module.exports = { getEvents, purchaseOneTicket }; 
